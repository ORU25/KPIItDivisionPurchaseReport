<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PO;
use Illuminate\Http\Request;

class PoController extends Controller
{
    public function index(){
        $po = PO::paginate(10);
        return response()->json($po);
    }
}
