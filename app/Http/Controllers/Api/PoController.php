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
            'po_lines' => $poLines->map(function ($line) {
            return $line;
        })];
    
        return response()->json($data);
    }
}
