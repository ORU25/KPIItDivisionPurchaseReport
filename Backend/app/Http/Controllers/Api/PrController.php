<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PR;
use App\Models\PRLine;
use App\Models\USDExchangeRate;
use Illuminate\Http\Request;

class PrController extends Controller
{
    public function index(){
        $pr = PR::all();

        $pr->each(function ($pr){

           

            $firstPrLine = $pr->pr_line()->first();

            $pr->pr_created = $firstPrLine ? $firstPrLine->pr_created : null;
            $pr->pr_approve_date = $firstPrLine ? $firstPrLine->pr_approve_date : null;
            $pr->pr_cancel = $pr->po()->count() > 0 ? '0000-00-00' : ($firstPrLine ? $firstPrLine->pr_cancel : null);
           
            $totalPriceIDR = 0;
            $prLines = $pr->pr_line()->get();
            foreach ($prLines as $prLine) {
                if ($prLine->est_currency === 'USD') {
                    // Fetch the exchange rate for the corresponding year
                    $exchangeRate = USDExchangeRate::whereYear('year', date('Y', strtotime($pr->pr_created)))
                        ->first(['exchange_rate'])->exchange_rate;
        
                    // Calculate the total price in IDR based on the exchange rate
                    $totalPriceIDR += $prLine->est_price * $prLine->est_qty * $exchangeRate;
                } else {
                    $totalPriceIDR += $prLine->est_price * $prLine->est_qty;
                }
            }
            $pr->est_total_price_idr = $totalPriceIDR;


        });

        return response()->json($pr);
    }
    
    public function pr_line($pr_no){
        $pr = PR::where('pr_no', $pr_no)->first();

        
            $firstPrLine = $pr->pr_line()->first();

            $pr->pr_created = $firstPrLine ? $firstPrLine->pr_created : null;
            $pr->pr_approve_date = $firstPrLine ? $firstPrLine->pr_approve_date : null;
            $pr->pr_cancel = $pr->po()->count() > 0 ? '0000-00-00' : ($firstPrLine ? $firstPrLine->pr_cancel : null);

            // Hapus relasi prLines untuk menghindari penampilan data yang tidak diinginkan
            unset($pr->prLines);
       



        if (!$pr) {
            return response()->json(['message' => 'PR tidak ditemukan'], 404);
        }
    
        $prLines = $pr->pr_line;

        $totalPriceIDR = 0;

        foreach ($prLines as $prLine) {
            if ($prLine->est_currency === 'USD') {
                // Fetch the exchange rate for the corresponding year
                $exchangeRate = USDExchangeRate::whereYear('year', date('Y', strtotime($pr->pr_created)))
                    ->first(['exchange_rate'])->exchange_rate;
    
                // Calculate the total price in IDR based on the exchange rate
                $totalPriceIDR += $prLine->est_price * $prLine->est_qty * $exchangeRate;
            } else {
                $totalPriceIDR += $prLine->est_price * $prLine->est_qty;
            }
        }

        $formattedTotalPriceIDR = number_format($totalPriceIDR, 0, ',', '.');
    
    
        $data =[
            'id' => $pr->id,
            'pr_no' => $pr->pr_no,
            'pr_desc' => $pr->pr_desc,
            'buyer' => $pr->buyer,
            'requested_by' => $pr->requested_by,
            'departement' => $pr->departement,
            'est_total_price_idr' => $formattedTotalPriceIDR,
            'pr_created' => $pr->pr_created,
            'pr_approve_date' => $pr->pr_approve_date,
            'pr_cancel' => $pr->pr_cancel,
            'po' => $pr->po->map(function($po){
                return  [
                    'po_no'=>$po->po_no,
                    'po_created' => $po->po_created,
                    'po_last_changed'=> $po->po_last_changed,
                    'po_approve'=> $po->po_approve,
                    'po_confirmation'=> $po->po_confirmation,
                    'po_received'=> $po->po_received,
                    'po_closed'=> $po->po_closed,
                    'po_cancel'=> $po->po_cancel,
                ];
            }),
            'pr_lines' => $prLines->map(function ($line) {
            return $line;
        })];
    
        return response()->json($data);
    }
}
