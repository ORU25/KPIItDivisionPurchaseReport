<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PR;
use Illuminate\Http\Request;

class PrController extends Controller
{
    public function index(){
        $pr = PR::all();
        return response()->json($pr);
    }
}
