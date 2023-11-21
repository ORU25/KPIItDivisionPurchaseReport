<?php

namespace App\Http\Controllers\Api;

use App\Models\PO;
use App\Models\PR;
use App\Models\POLine;
use App\Models\PRLine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class DashboardController extends Controller
{

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
        
        $poYearPrice = Po::select(
            DB::raw('YEAR(po_created) as year'),
            DB::raw('SUM(CASE WHEN p_o_lines.total_price_currency = "USD" THEN p_o_lines.total_price * 15000 ELSE p_o_lines.total_price END) as total_price_per_year')
        )
            ->leftJoin('p_o_lines', 'p_o_s.id', '=', 'p_o_lines.po_id') // Hubungkan po dengan po_lines
            ->groupBy(DB::raw('YEAR(po_created)'))
            ->get();

        

        return response()->json([
            'totalPr' => $totalPr,
            'prCancel' => $prCancel,
            'prSuccess' => $prSuccess,
            'totalPrLine' => $totalPrLine,
            'prLineSuccess' => $prLineSuccess,
            'prLineCancel' => $prLineCancel,


            'prType' => $prType,
            'prRequester' => $prRequester,
            'prBuyer' => $prBuyer,
            'prLineYear' => $prLineYear,

             'totalPo' => $totalPo,
             'poSuccess' => $poSuccess,
             'poCancel' => $poCancel,
             'totalPoLine' => $totalPoLine,
             'poLineSuccess' => $poLineSuccess,
             'poLineCancel' => $poLineCancel,

             

            
             'vendorTypePoCount' => $vendorTypePoCount,
             'poYear' => $poYear,
             'poYearPrice'=> $poYearPrice,

        ]);
    }
}
