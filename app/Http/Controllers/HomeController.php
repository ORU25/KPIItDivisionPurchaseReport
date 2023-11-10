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

        $prType = PR::select('pr_type', DB::raw('COUNT(*) as pr_type_count'))
        ->groupBy('pr_type')->get();

        $prRequester = PR::select('requested_by', DB::raw('COUNT(*) as pr_request_count'))
        ->groupBy('requested_by')
        ->get();

        $prBuyer = PR::select('buyer', DB::raw('COUNT(*) as pr_buyer_count'))
        ->groupBy('buyer')->get();

        $prLineYear = PRLine::select(DB::raw('YEAR(pr_created) as year'), DB::raw('COUNT(*) as pr_line_year_count'))
        ->groupBy(DB::raw('YEAR(pr_created)'))->get();
         
        

        $totalPo = PO::all()->count();
        $poSuccess=PO::where('po_cancel', '=', '0000-00-00')->count();
        $poCancel = PO::where('po_cancel', '!=', '0000-00-00')->count();
        $totalPoLine = POLine::all()->count();
        $poLineSuccess = POLine::where('po_cancel_line', '0000-00-00')->count();
        $poLineCancel = POLine::where('po_cancel_line', '!=', '0000-00-00')->count();

        $vendorTypePoCount = PO::select('vendor_type', DB::raw('COUNT(*) as po_count'))
        ->groupBy('vendor_type')
        ->get();

        $poYear = PO::select(DB::raw('YEAR(po_created) as year'), DB::raw('COUNT(*) as po_year_count'))
        ->groupBy(DB::raw('YEAR(po_created)'))
        ->get();
        

        return view('home', compact(
            'totalPr',
            'totalPrLine',
            'prCancel',
            'prLineSuccess',
            'prLineCancel',
            'prSuccess',

            'prType',
            'prRequester',
            'prBuyer',
            'prLineYear',


            'totalPo',
            'poSuccess',
            'poCancel',
            'totalPoLine',
            'poLineSuccess',
            'poLineCancel',

            
            'vendorTypePoCount',
            'poYear',

        ));
    }
}
