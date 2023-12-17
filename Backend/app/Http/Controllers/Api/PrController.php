<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Purchase;
use Illuminate\Http\Request;
use AshAllenDesign\LaravelExchangeRates\Classes\ExchangeRate;
use Carbon\Carbon;


class PrController extends Controller
{   
    public function index(){

        $pr = Purchase::where('pr_created', '!=', null)
        ->select(
            'pr_no',
            'pr_type',
            'pr_desc',
            'buyer',
            'departement',
            'requested_by',
            'pr_created',
            'pr_approve_date',
            'pr_cancel',
            'est_qty', 
            'est_price', 
            'est_currency'    
        )->get();
        
            $pr->each(function($pr){
                $estPriceIDR = 0;
                    if($pr->est_currency === 'USD'){
                        $exchangeRates = app(ExchangeRate::class);
                        $estPriceIDR += $pr->est_price * $exchangeRates->exchangeRate( 'USD', 'IDR', Carbon::create($pr->pr_created)) * $pr->est_qty;
                    } else {
                        $estPriceIDR += $pr->est_price * $pr->est_qty;
                    }
                    $pr->est_price_idr = $estPriceIDR;
            });
            $data = $pr->groupBy('pr_no')->map(function ($groupedItems) {
                return [
                    'pr_no' => $groupedItems[0]->pr_no,
                    'pr_type' => $groupedItems[0]->pr_type,
                    'pr_desc' => $groupedItems[0]->pr_desc,
                    'buyer' => $groupedItems[0]->buyer,
                    'departement' => $groupedItems[0]->departement,
                    'requested_by' => $groupedItems[0]->requested_by,
                    'pr_created' => $groupedItems[0]->pr_created,
                    'pr_approve_date' => $groupedItems[0]->pr_approve_date == null ? "0000-00-00" : $groupedItems[0]->pr_approve_date,
                    'pr_cancel' => $groupedItems[0]->pr_cancel == null ? "0000-00-00" : $groupedItems[0]->pr_cancel,
                    'est_total_price_idr' => round($groupedItems->sum('est_price_idr')),
                ];
            })->values()->toArray();
    
        return response()->json(
            $data,
        );
    }

    public function pr_line($pr_no){
        $pr = Purchase:: where('pr_no', $pr_no)
        ->select(
            'pr_no',
            'pr_type',
            'pr_desc',
            'buyer',
            'requested_by',
            'departement',
            'pr_created',
            'pr_approve_date',
            'pr_cancel',
        )->distinct('pr_no')->first();

            
        if (!$pr) {
            return response()->json(['error' => 'PR not found'], 404);
        }
        
        
        $pr_lines = Purchase::where('pr_no', $pr_no)
        ->select(
            "pr_line",
            "pci_no",
            "pr_line_desc",
            "pr_created",
            "pr_approve_date",
            "pr_last_changed",
            "pr_cancel",
            "est_qty",
            "est_currency",
            "est_price",
            "po_no",
        )->get();

        $po = Purchase::where('pr_no', $pr_no)->where('po_no', '!=', null)
        ->select(
            'po_no',
            'po_created',
            'po_last_changed',
            'po_approve',
            'po_confirmation',
            'po_received',
            'po_closed',
            'po_cancel',
        )->distinct('po_no')->get();

        $po_pr_line = Purchase::where('pr_no', $pr_no)->where('po_no', '!=', null)
        ->select(
            'po_no',
            'pr_line'
        )->get();

        $po_merged = [];

        // Merging the two arrays based on 'po_no'
        foreach ($po as $po_item) {
            $po_no = $po_item->po_no;
        
            // Create a new array to store the merged data
            $merged_item = [
                'po_no' => $po_item->po_no,
                'po_created' => $po_item->po_created,
                'po_last_changed' => $po_item->po_last_changed,
                'po_approve' => $po_item->po_approve,
                'po_confirmation' => $po_item->po_confirmation,
                'po_received' => $po_item->po_received,
                'po_closed' => $po_item->po_closed,
                'po_cancel' => $po_item->po_cancel,
                'pr_lines' => [],
            ];
        
            // Find and merge 'pr_line' from $po_pr_line
            foreach ($po_pr_line as $pr_line_item) {
                if ($pr_line_item->po_no == $po_no) {
                    $merged_item['pr_lines'][] = ['pr_line' => $pr_line_item->pr_line];
                }
            }
        
            // Add the merged item to the final result array
            $po_merged[] = $merged_item;
        }
        
        // Convert the result to JSON      

        
        $totalPriceIDR = 0;

        foreach ($pr_lines as $prLine) {
            if ($prLine->est_currency === 'USD') {
                // Fetch the exchange rate for the corresponding year
               
                    $exchangeRates = app(ExchangeRate::class);
                    // Calculate the total price in IDR based on the exchange rate
                    $totalPriceIDR += $prLine->est_price * $prLine->est_qty * $exchangeRates->exchangeRate('USD', 'IDR', Carbon::create($prLine->pr_created));
            } else {
                $totalPriceIDR += $prLine->est_price * $prLine->est_qty;
            }
        }

        $formattedTotalPriceIDR = number_format($totalPriceIDR, 0, ',', '.');

        $pr->est_total_price_idr = $formattedTotalPriceIDR;
        $pr->po = $po_merged;
        $pr->pr_lines = $pr_lines;
        
        return response()->json($pr);
    }
}
