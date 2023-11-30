<?php

namespace App\Http\Controllers\Api;

use App\Models\PO;
use App\Models\PR;
use App\Models\POLine;
use App\Models\PRLine;
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

        $prLineYearSuccess = PRLine::select(DB::raw('YEAR(pr_created) as year'), DB::raw('COUNT(*) as pr_line_year_success_count'))
        ->where('pr_cancel', '=', '0000-00-00')
        ->groupBy(DB::raw('YEAR(pr_created)'))->get();
        $prLineYearCancel = PRLine::select(DB::raw('YEAR(pr_created) as year'), DB::raw('COUNT(*) as pr_line_year_cancel_count'))
        ->where('pr_cancel', '!=', '0000-00-00')
        ->groupBy(DB::raw('YEAR(pr_created)'))->get();


         
        

        $totalPo = PO::all()->count();
        $poSuccess=PO::where('po_cancel', '=', '0000-00-00')->count();
        $poCancel = PO::where('po_cancel', '!=', '0000-00-00')->count();
        $totalPoLine = POLine::all()->count();
        $poLineSuccess = POLine::where('po_cancel_line', '0000-00-00')->count();
        $poLineCancel = POLine::where('po_cancel_line', '!=', '0000-00-00')->count();

        $vendorTypePoCount = PO::select(
                'vendor_type',
                DB::raw('YEAR(po_created) as year'),
                DB::raw('COUNT(*) as po_count')
            )
                ->groupBy('vendor_type', 'year')
                ->get();
            
            // Collect all unique years
            $uniqueYears = $vendorTypePoCount->pluck('year')->unique()->sort();
            
            // Organize the data by vendor_type and year
            $result = [
                'years' => $uniqueYears->values()->toArray(),
            ];
            
            foreach ($vendorTypePoCount as $vendor) {
                $vendorType = $vendor->vendor_type;
                $year = $vendor->year;
                $poCount = $vendor->po_count;
            
                // Organize the data by vendor_type and year
                if (!isset($result[$vendorType])) {
                    $result[$vendorType] = [];
                }
            
                // Add the data for the current vendor and year
                $result[$vendorType][] = [
                    'year' => $year,
                    'count' => $poCount,
                ];
            }


        // $vendorTypePoCount = PO::select('vendor_type', DB::raw('YEAR(po_created) as year'), DB::raw('COUNT(*) as po_count'))
        // ->groupBy('vendor_type', 'year')
        // ->get();

        $poYear = PO::select(
            DB::raw('YEAR(po_created) as year'), 
            DB::raw('COUNT(*) as po_year_count')
        )
            ->groupBy(DB::raw('YEAR(po_created)'))
            ->get();
        

        $poYearSuccess = PO::select(
            DB::raw('YEAR(po_created) as year'),
            DB::raw('COUNT(*) as po_year_success_count')
        )
            ->where('po_cancel', '=', '0000-00-00')
            ->groupBy(DB::raw('YEAR(po_created)'))
            ->get();
        $poYearCancel = PO::select(
            DB::raw('YEAR(po_created) as year'),
            DB::raw('COUNT(*) as po_year_cancel_count')
        )
            ->where('po_cancel', '!=', '0000-00-00')
            ->groupBy(DB::raw('YEAR(po_created)'))
            ->get();

        $poYearPrice = Po::select(
                DB::raw('YEAR(p_o_s.po_created) as year'),
                DB::raw('SUM(
                    CASE 
                        WHEN p_o_lines.total_price_currency = "USD" 
                        THEN p_o_lines.total_price * u_s_d_exchange_rates.exchange_rate
                        ELSE p_o_lines.total_price 
                    END
                ) as total_price_per_year')
            )
            ->leftJoin('p_o_lines', 'p_o_s.id', '=', 'p_o_lines.po_id')
            ->leftJoin('u_s_d_exchange_rates', function($join) {
                $join->on(DB::raw('YEAR(p_o_s.po_created)'), '=', 'u_s_d_exchange_rates.year')
                    ->where('p_o_lines.total_price_currency', '=', 'USD');
            })
            ->groupBy(DB::raw('YEAR(p_o_s.po_created)'))
            ->get();

        $prYearEstPrice = PRLine::select(
                DB::raw('YEAR(pr_created) as year'),
                DB::raw('SUM(
                    CASE 
                        WHEN est_currency = "USD" 
                        THEN est_price * est_qty * u_s_d_exchange_rates.exchange_rate
                        ELSE est_price * est_qty 
                    END
                ) as total_est_price')
            )
            ->leftJoin('u_s_d_exchange_rates', function($join) {
                $join->on(DB::raw('YEAR(p_r_lines.pr_created)'), '=', 'u_s_d_exchange_rates.year')
                    ->where('est_currency', '=', 'USD');
            })
            ->groupBy(DB::raw('YEAR(p_r_lines.pr_created)'))
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
            'prLineYearSuccess' => $prLineYearSuccess,
            'prLineYearCancel' => $prLineYearCancel,

            'totalPo' => $totalPo,
            'poSuccess' => $poSuccess,
            'poCancel' => $poCancel,
            'totalPoLine' => $totalPoLine,
            'poLineSuccess' => $poLineSuccess,
            'poLineCancel' => $poLineCancel,

 
            'vendorTypePoCount' => $result,

            'poYear' => $poYear,
            'poYearSuccess' => $poYearSuccess,
            'poYearCancel' => $poYearCancel,
            'poYearPrice'=> $poYearPrice,
            'prYearEstPrice' => $prYearEstPrice,

        ]);
    }

    public function prYear($year){

        $prLineYear = PRLine::select(
            DB::raw("DATE_FORMAT(pr_created, '%b') as month"),
            DB::raw('COUNT(*) as pr_month_count'))
            ->whereYear('pr_created', $year)
            ->groupBy(DB::raw('MONTH(pr_created)'), DB::raw("DATE_FORMAT(pr_created, '%b')"))
            ->get();
        $prLineYearSuccess = PRLine::select(
            DB::raw("DATE_FORMAT(pr_created, '%b') as month"),
            DB::raw('COUNT(*) as pr_month_count'))
            ->whereYear('pr_created', $year)
            ->where('pr_cancel', '=', '0000-00-00')
            ->groupBy(DB::raw('MONTH(pr_created)'), DB::raw("DATE_FORMAT(pr_created, '%b')"))
            ->get();
        $prLineYearCancel = PRLine::select(
            DB::raw("DATE_FORMAT(pr_created, '%b') as month"),
            DB::raw('COUNT(*) as pr_month_count'))
            ->whereYear('pr_created', $year)
            ->where('pr_cancel', '!=', '0000-00-00')
            ->groupBy(DB::raw('MONTH(pr_created)'), DB::raw("DATE_FORMAT(pr_created, '%b')"))
            ->get();

         $data = [
            'prLineYear' => $prLineYear,
            'prLineYearSuccess' => $prLineYearSuccess,
            'prLineYearCancel' => $prLineYearCancel,
        ];
    
      
        return response()->json($data);

    }

    public function poYear($year){

        $poYear = PO::select(
            DB::raw("DATE_FORMAT(po_created, '%b') as month"),
            DB::raw('COUNT(*) as po_month_count'))
            ->whereYear('po_created', $year)
            ->groupBy(DB::raw('MONTH(po_created)'), DB::raw("DATE_FORMAT(po_created, '%b')"))
            ->get();
        $poYearSuccess = PO::select(
            DB::raw("DATE_FORMAT(po_created, '%b') as month"),
            DB::raw('COUNT(*) as po_month_count'))
            ->whereYear('po_created', $year)
            ->where('po_cancel', '=', '0000-00-00')
            ->groupBy(DB::raw('MONTH(po_created)'), DB::raw("DATE_FORMAT(po_created, '%b')"))
            ->get();
        $poYearCancel = PO::select(
            DB::raw("DATE_FORMAT(po_created, '%b') as month"),
            DB::raw('COUNT(*) as po_month_count'))
            ->whereYear('po_created', $year)
            ->where('po_cancel', '!=', '0000-00-00')
            ->groupBy(DB::raw('MONTH(po_created)'), DB::raw("DATE_FORMAT(po_created, '%b')"))
            ->get();
        
        $data = [
            'poYear' => $poYear,
            'poYearSuccess' => $poYearSuccess,
            'poYearCancel' => $poYearCancel,
        ];

        return response()->json($data);

    }
}
