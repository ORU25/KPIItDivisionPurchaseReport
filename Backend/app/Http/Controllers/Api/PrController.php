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
        $pr->po = $po;
        $pr->pr_lines = $pr_lines;
        
        return response()->json($pr);
    }
}
