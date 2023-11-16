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
}
