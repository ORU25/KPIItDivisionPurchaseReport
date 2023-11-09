<?php

namespace App\Http\Controllers;

use App\Models\PO;
use App\Models\PR;
use App\Models\POLine;
use App\Models\PRLine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {   
        $totalPr = PR::all()->count();
        $prSuccess = PR::whereHas('po')->get()->count();
        $prCancel = PR::whereDoesntHave('po')->get()->count();
        $totalPrLine = PRLine::all()->count();
        $prLineSuccess = PRLine::where('pr_cancel','0000-00-00')->count();
        $prLineCancel = PRLine::where('pr_cancel', '!=', '0000-00-00')->count();


        $totalPo = PO::all()->count();
        $poSuccess=PO::where('po_cancel', '=', '0000-00-00')->count();
        $poCancel = PO::where('po_cancel', '!=', '0000-00-00')->count();
        $totalPoLine = POLine::all()->count();
        $poLineCancel = POLine::where('po_cancel_line', '!=', '0000-00-00')->count();
        

        return view('home', compact(
            'totalPr',
            'totalPrLine',
            'prCancel',
            'prLineSuccess',
            'prLineCancel',
            'prSuccess',
            'totalPo',
            'poSuccess',
            'poCancel',
            'totalPoLine',
            'poLineCancel',
        ));
    }
}
