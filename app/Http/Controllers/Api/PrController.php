<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PR;
use App\Models\PRLine;
use Illuminate\Http\Request;

class PrController extends Controller
{
    public function index(){
        $pr = PR::all();
        return response()->json($pr);
    }
    
    public function pr_line($pr_no){
        $pr = PR::where('pr_no', $pr_no)->first();

        if (!$pr) {
            return response()->json(['message' => 'PR tidak ditemukan'], 404);
        }
    
        $prLines = $pr->pr_line;
    
        $data =[
            'id' => $pr->id,
            'pr_no' => $pr->pr_no,
            'pr_desc' => $pr->pr_desc,
            'buyer' => $pr->buyer,
            'requested_by' => $pr->requested_by,
            'pr_lines' => $prLines->map(function ($line) {
            return $line;
        })];
    
        return response()->json($data);
    }
}
