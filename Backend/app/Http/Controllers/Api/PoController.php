<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Purchase;
use Illuminate\Http\Request;
use AshAllenDesign\LaravelExchangeRates\Classes\ExchangeRate;
use Carbon\Carbon;

class PoController extends Controller
{
    public function index(){
        $po = Purchase::where('po_no', '!=', null)
        ->select(
            'po_no',
            'po_desc',
            'po_created',
            'po_last_changed',
            'po_approve',
            'po_confirmation',
            'po_received',
            'po_closed',
            'po_cancel',
            'vendor',
            'vendor_type',
            'total_price',
            'total_price_currency',
        )->get();
        
        $po->each(function($po){
            $totalPriceIDR = 0;
                if($po->total_price_currency === 'USD'){
                    $exchangeRates = app(ExchangeRate::class);
                    $totalPriceIDR += $po->total_price * $exchangeRates->exchangeRate( 'USD', 'IDR', Carbon::create($po->po_created));
                } else {
                    $totalPriceIDR += $po->total_price ;
                }
                $po->total_price_idr = $totalPriceIDR;
        });
        $data = $po->groupBy('po_no')->map(function ($groupedItems) {
            return [
                'po_no' => $groupedItems[0]->po_no,
                'po_desc' => $groupedItems[0]->po_desc,
                'po_created' => $groupedItems[0]->po_created,
                'po_last_changed' => $groupedItems[0]->po_last_changed == null ? "0000-00-00": $groupedItems[0]->po_last_changed,
                'po_approve' => $groupedItems[0]->po_approve == null ? "0000-00-00": $groupedItems[0]->po_approve,
                'po_confirmation' => $groupedItems[0]->po_confirmation == null ? "0000-00-00": $groupedItems[0]->po_confirmation,
                'po_received' => $groupedItems[0]->po_received == null ? "0000-00-00": $groupedItems[0]->po_received,
                'po_closed' => $groupedItems[0]->po_closed == null ? "0000-00-00": $groupedItems[0]->po_closed,
                'po_cancel' => $groupedItems[0]->po_cancel == null ? "0000-00-00": $groupedItems[0]->po_cancel,
                'vendor' => $groupedItems[0]->vendor,
                'vendor_type' => $groupedItems[0]->vendor_type,
                'total_price_idr' => round($groupedItems->sum('total_price_idr')),
            ];
        })->values()->toArray();    

        return response()->json($data);
    }

    public function po_line($po_no){
        $po = Purchase::where('po_no', $po_no)
        ->select(
            'po_no',
            'po_desc',
            'po_created',
            'po_last_changed',
            'po_approve',
            'po_confirmation',
            'po_received',
            'po_closed',
            'po_cancel',
            'vendor',
            'vendor_type',
        )->distinct('po_no')->first();

        if (!$po) {
            return response()->json(['error' => 'PO not found'], 404);
        }  

        $prs = Purchase::where('po_no', $po_no)->where('pr_no', '!=', null)
        ->select(
            'pr_no',
            'pr_created',
            'pr_approve_date',
            'pr_cancel',
        )
        ->distinct('pr_no') 
        ->get();

        $pr_po_lines = Purchase::where('po_no', $po_no)->select('pr_no','po_line')->get();

        $pr_merged = [];

        foreach ($prs as $pr) {
            
            $prExists = false;

            foreach ($pr_merged as $existingPr) {
                if ($existingPr['pr_no'] === $pr->pr_no) {
                    $prExists = true;
                    break;
                }
            }
            if (!$prExists) {
                $pr_no = $pr->pr_no;
                $merged_item = [
                    'pr_no' => $pr->pr_no,
                    'pr_created' => $pr->pr_created,
                    'pr_approve_date' => $pr->pr_approve_date,
                    'po_lines' => [],
                ];
            
            
                // Find and merge 'po_line' from $pr_po_lines
                foreach ($pr_po_lines as $pr_line_item) {
                    if ($pr_line_item->pr_no == $pr_no) {
                        $merged_item['po_lines'][] = ['po_line' => $pr_line_item->po_line];
                    }
                }
            
                $pr_merged[] = $merged_item;
            }
        }
                
        

        $po_lines = Purchase::where('po_no', $po_no)
        ->select(
            'po_line',
            'pr_no',
            'po_line_desc',
            'qty_order',
            'unit_price_currency',
            'unit_price_po',
            'total_price_currency',
            'total_price',
            'po_closed_line',
            'po_cancel_line',
            'po_cancel_comments',
            'eta_gmt8',
            'po_created'
        )->orderBy('po_line')->get();




        $totalPriceIDR = 0;

        foreach ($po_lines as $po_line) {
            if ($po_line->total_price_currency === 'USD') {
                // Fetch the exchange rate for the corresponding year
               
                    $exchangeRates = app(ExchangeRate::class);
                    // Calculate the total price in IDR based on the exchange rate
                    $totalPriceIDR += $po_line->total_price  * $exchangeRates->exchangeRate('USD', 'IDR', Carbon::create($po_line->po_created));
            } else {
                $totalPriceIDR += $po_line->total_price ;
            }
        }

        $formattedTotalPriceIDR = number_format($totalPriceIDR, 0, ',', '.');

        foreach ($po_lines as $po_line) {
            $po_lines_data[] = [
                'po_line' => $po_line->po_line,
                'pr_no' => $po_line->pr_no,
                'po_line_desc' => $po_line->po_line_desc,
                'qty_order' => $po_line->qty_order,
                'unit_price_currency' => $po_line->unit_price_currency,
                'unit_price_po' => $po_line->unit_price_po,
                'total_price_currency' => $po_line->total_price_currency,
                'total_price' => $po_line->total_price,
                'po_closed_line' => $po_line->po_closed_line,
                'po_cancel_line' => $po_line->po_cancel_line,
                'po_cancel_comments' => $po_line->po_cancel_comments,
                'eta_gmt8' => $po_line->eta_gmt8,
            ];
        }
        
        $po->total_price_idr = $formattedTotalPriceIDR;
        $po->pr = $pr_merged;
        $po->po_lines = $po_lines_data;

        return response()->json($po);
    }
}
