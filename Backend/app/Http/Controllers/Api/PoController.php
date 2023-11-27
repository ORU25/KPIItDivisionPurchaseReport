<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PO;
use Illuminate\Http\Request;

class PoController extends Controller
{
    public function index(){
        $po = PO::all();
        return response()->json($po);
    }

    public function po_line($po_no){
        $po = PO::where('po_no', $po_no)->first();

        if (!$po) {
            return response()->json(['message' => 'PO tidak ditemukan'], 404);
        }
    
        $poLines = $po->po_line;

        $totalPriceIDR = 0;

        foreach ($poLines as $poLine) {
            if ($poLine->total_price_currency === 'USD') {
                $totalPriceIDR += $poLine->total_price * 15000;
            } else {
                $totalPriceIDR += $poLine->total_price;
            }
        }
        

        $formattedTotalPriceIDR = number_format($totalPriceIDR, 0, ',', '.');
    
        $data = [
            'id' => $po->id,
            'po_no' => $po->po_no,
            'po_desc' => $po->po_desc,
            'po_created'=> $po->po_created,
            'po_last_changed'=> $po->po_last_changed,
            'po_approve'=> $po->po_approve,
            'po_confirmation'=> $po->po_confirmation,
            'po_received'=> $po->po_received,
            'po_closed'=> $po->po_closed,
            'po_cancel'=> $po->po_cancel,
            'vendor' => $po->vendor,
            'vendor_type' => $po->vendor_type,
            'total_price_idr' =>  $formattedTotalPriceIDR,
            'pr' => $po->pr->map(function($pr){
                $firstPrLine = $pr->pr_line()->first();
                $pr->pr_created = $firstPrLine ? $firstPrLine->pr_created : null;
                $pr->pr_approve_date = $firstPrLine ? $firstPrLine->pr_approve_date : null;
                $pr->pr_cancel = $pr->po()->count() > 0 ? '0000-00-00' : ($firstPrLine ? $firstPrLine->pr_cancel : null);
                // Hapus relasi prLines untuk menghindari penampilan data yang tidak diinginkan
                unset($pr->prLines);

                return [
                    'pr_no' => $pr->pr_no,
                    'pr_created' => $pr->pr_created,
                    'pr_approve_date' => $pr->pr_approve_date,
                    'pr_cancel' => $pr->pr_cancel,
                ];
            }),
            'po_lines' => $poLines->map(function ($line) {
            return $line;
        })];
    
        return response()->json($data);
    }
}
