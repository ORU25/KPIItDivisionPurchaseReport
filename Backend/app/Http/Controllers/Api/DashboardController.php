<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use AshAllenDesign\LaravelExchangeRates\Classes\ExchangeRate;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index($department){

        $totalPr = Purchase::where('departement', $department)->distinct('pr_no')->count();
        $prSuccess = Purchase::where('departement', $department)->distinct('pr_no')->where('po_no', '!=', null)->count();
        $prCancel = Purchase::where('departement', $department)->distinct('pr_no')->where('po_no', '=', null )->count();
        $totalPrLine = Purchase::where('departement', $department)->select('pr_line')->count();

        $totalPo = Purchase::where('departement', $department)->distinct('po_no')->count();
        $poSuccess = Purchase::where('departement', $department)->distinct('po_no')->where('po_cancel', '=', null)->count();
        $poCancel = Purchase::where('departement', $department)->distinct('po_no')->where('po_cancel', '!=', null)->count();
        $totalPoLine = Purchase::where('departement', $department)->where('po_line', '!=', null)->select('po_line')->count();

        $prType = Purchase::where('departement', $department)
        ->select('pr_type', DB::raw('COUNT(DISTINCT pr_no) as pr_type_count'))
        ->groupBy('pr_type')
        ->get();

        $prRequester = Purchase::where('departement', $department)
        ->select('requested_by', DB::raw('COUNT(DISTINCT pr_no) as pr_request_count'))
        ->groupBy('requested_by')
        ->get();

        $prBuyer = Purchase::where('departement', $department)
        ->select('buyer', DB::raw('COUNT(DISTINCT pr_no) as pr_buyer_count'))
        ->groupBy('buyer')
        ->get();

        $prLineYear = Purchase::where('departement', $department)
        ->select( DB::raw('YEAR(pr_created) as year'), DB::raw('COUNT(*) as pr_line_year_count'))
        ->groupBy(DB::raw('YEAR(pr_created)'))
        ->get();

        $prLineYearSuccess = Purchase::where('departement', $department)->where('pr_cancel', null )
        ->select( DB::raw('YEAR(pr_created) as year'), DB::raw('COUNT(*) as pr_line_year_success_count'))
        ->groupBy(DB::raw('YEAR(pr_created)'))
        ->get();

        $prLineYearCancel = Purchase::where('departement', $department)->where('pr_cancel','!=', null )
        ->select( DB::raw('YEAR(pr_created) as year'), DB::raw('COUNT(*) as pr_line_year_cancel_count'))
        ->groupBy(DB::raw('YEAR(pr_created)'))
        ->get();

        $vendorTypePoCount = Purchase::where('departement', $department)->where('vendor_type', '!=', null)->select(
            'vendor_type',
            DB::raw('YEAR(po_created) as year'),
            DB::raw('COUNT(DISTINCT po_no) as po_count')
        )
        ->groupBy( 'vendor_type','year')
        ->get();

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

        $poYear = Purchase::where('departement', $department)
        ->where('po_no', '!=', null)
        ->select(
            DB::raw('YEAR(po_created) as year'), 
            DB::raw('COUNT(DISTINCT po_no) as po_year_count')
        )
        ->groupBy(DB::raw('YEAR(po_created)'))
        ->get();
        
        
        $poYearSuccess = Purchase::where('departement', $department)
        ->where('po_no', '!=', null)
        ->select(
            DB::raw('YEAR(po_created) as year'), 
            DB::raw('COUNT(DISTINCT po_no) as po_year_success_count')
        )
        ->where('po_cancel', null)
        ->groupBy(DB::raw('YEAR(po_created)'))
        ->get();

        $poYearCancel = Purchase::where('departement', $department)
        ->where('po_no', '!=', null)
        ->select(
            DB::raw('YEAR(po_created) as year'), 
            DB::raw('COUNT(DISTINCT po_no) as po_year_cancel_count')
        )
        ->where('po_cancel','!=', null)
        ->groupBy(DB::raw('YEAR(po_created)'))
        ->get();

        
       

        $poYearPrice = Purchase::where('departement', $department)
        ->where('po_created', '!=', null)
        ->select('po_created', 'total_price', 'total_price_currency')
        ->get();

            $poYearPrice->each(function($po){
                $totalPriceIDR = 0;
                if($po->total_price_currency === 'USD'){
                    $exchangeRates = app(ExchangeRate::class);
                    $totalPriceIDR += $po->total_price * $exchangeRates->exchangeRate( 'USD', 'IDR', Carbon::create($po->po_created));
                } else {
                    $totalPriceIDR += $po->total_price;
                }
                $po->total_price_idr = $totalPriceIDR;
            });

            $poYearPricePerYear = $poYearPrice->groupBy(function ($item) {
                return Carbon::parse($item->po_created)->format('Y');
            })->map(function ($groupedItems) {
                return [
                    'year' => Carbon::parse($groupedItems[0]->po_created)->format('Y'),
                    'total_price_per_year' => round($groupedItems->sum('total_price_idr')),
                ];
            })->values()->toArray();
        
        $prYearEstPrice = Purchase::where('departement', $department)
        ->where('pr_created', '!=', null)
        ->select('pr_created','est_qty', 'est_price', 'est_currency')
        ->get();
            
            $prYearEstPrice->each(function($pr){
                $estPriceIDR = 0;
                if($pr->est_currency === 'USD'){
                    $exchangeRates = app(ExchangeRate::class);
                    $estPriceIDR += $pr->est_price * $exchangeRates->exchangeRate( 'USD', 'IDR', Carbon::create($pr->pr_created)) * $pr->est_qty;
                } else {
                    $estPriceIDR += $pr->est_price * $pr->est_qty;
                }
                $pr->est_price_idr = $estPriceIDR;
            });

            $prYearEstPricePerYear = $prYearEstPrice->groupBy(function ($item) {
                return Carbon::parse($item->pr_created)->format('Y');
            })->map(function ($groupedItems) {
                return [
                    'year' => Carbon::parse($groupedItems[0]->pr_created)->format('Y'),
                    'total_est_price' => round($groupedItems->sum('est_price_idr')),
                ];
            })->values()->toArray();



        return response()->json([
            'totalPr' => $totalPr,
            'prSuccess' => $prSuccess,
            'prCancel' => $totalPr-$prSuccess,

            'totalPo' => $totalPo,
            'poSuccess' => $poSuccess,
            'poCancel' => $poCancel,

            'totalPrLine' => $totalPrLine,
            'totalPoLine' => $totalPoLine,

            'prType' => $prType,
            'prRequester' => $prRequester,
            'prBuyer' => $prBuyer,

            'prLineYear' => $prLineYear,
            'prLineYearSuccess' => $prLineYearSuccess,
            'prLineYearCancel' => $prLineYearCancel,

            'vendorTypePoCount' => $result,

            'poYear' => $poYear,
            'poYearSuccess' => $poYearSuccess,
            'poYearCancel' => $poYearCancel,

            'poYearPrice' => $poYearPricePerYear,
            'prYearEstPrice' => $prYearEstPricePerYear,
        ]);
    }

    public function prYear($departement, $year){
        $allMonths = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        
        $prLineYear = Purchase::where('departement', $departement)->whereYear('pr_created', $year)
        ->select(
            DB::raw("DATE_FORMAT(pr_created, '%b') as month"),
            DB::raw('COUNT(*) as pr_month_count'))
        ->groupBy(DB::raw('MONTH(pr_created)'), DB::raw("DATE_FORMAT(pr_created, '%b')"))
        ->get();
        
        $prLineArray = $prLineYear->pluck('pr_month_count', 'month')->toArray();
        
        // Merge with allMonths array to fill in missing months with zero values
        $resultPrLineYear = collect($allMonths)->map(function ($month) use ($prLineArray) {
            return [
                'month' => $month,
                'pr_month_count' => $prLineArray[$month] ?? 0
            ];
        });

        $prLineYearSuccess = Purchase::where('departement', $departement)->whereYear('pr_created', $year)->where('pr_cancel', null)
        ->select(
            DB::raw("DATE_FORMAT(pr_created, '%b') as month"),
            DB::raw('COUNT(*) as pr_month_count'))
        ->groupBy(DB::raw('MONTH(pr_created)'), DB::raw("DATE_FORMAT(pr_created, '%b')"))
        ->get();

        $prLineSuccessArray = $prLineYearSuccess->pluck('pr_month_count', 'month')->toArray();
        
        // Merge with allMonths array to fill in missing months with zero values
        $resultPrLineYearSuccess = collect($allMonths)->map(function ($month) use ($prLineSuccessArray) {
            return [
                'month' => $month,
                'pr_month_count' => $prLineSuccessArray[$month] ?? 0
            ];
        });


        $prLineYearCancel = Purchase::where('departement', $departement)->whereYear('pr_created', $year)->where('pr_cancel','!=',null)
        ->select(
            DB::raw("DATE_FORMAT(pr_created, '%b') as month"),
            DB::raw('COUNT(*) as pr_month_count'))
        ->groupBy(DB::raw('MONTH(pr_created)'), DB::raw("DATE_FORMAT(pr_created, '%b')"))
        ->get();

        $prLineCancelsArray = $prLineYearCancel->pluck('pr_month_count', 'month')->toArray();
        
        // Merge with allMonths array to fill in missing months with zero values
        $resultPrLineYearCancel = collect($allMonths)->map(function ($month) use ($prLineCancelsArray) {
            return [
                'month' => $month,
                'pr_month_count' => $prLineCancelsArray[$month] ?? 0
            ];
        });
    
        $data = [
            'prLineYear' => $resultPrLineYear,
            'prLineYearSuccess' => $resultPrLineYearSuccess,
            'prLineYearCancel' => $resultPrLineYearCancel,
        ];
        
          
        return response()->json($data);
    }

    public function poYear($departement, $year){
        $allMonths = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        
        $poYear = Purchase::where('departement', $departement)
            ->whereYear('po_created', $year)
            ->where('po_no', '!=', null)
            ->select(
                DB::raw("DATE_FORMAT(po_created, '%b') as month"),
                DB::raw('COUNT(DISTINCT(po_no)) as po_month_count')
            )
            ->groupBy(DB::raw('MONTH(po_created)'), DB::raw("DATE_FORMAT(po_created, '%b')"))
            ->get();
        
        // Convert the result to associative array for easy lookup
        $poYearArray = $poYear->pluck('po_month_count', 'month')->toArray();
        
        // Merge with allMonths array to fill in missing months with zero values
        $resultPoYear = collect($allMonths)->map(function ($month) use ($poYearArray) {
            return [
                'month' => $month,
                'po_month_count' => $poYearArray[$month] ?? 0
            ];
        });
        
        $poYearSuccess = Purchase::where('departement', $departement)->whereYear('po_created', $year)
        ->where('po_no','!=',null)
        ->where('po_cancel', null)
        ->select(
            DB::raw("DATE_FORMAT(po_created, '%b') as month"),
            DB::raw('COUNT(DISTINCT(po_no)) as po_month_count'))
        ->groupBy(DB::raw('MONTH(po_created)'), DB::raw("DATE_FORMAT(po_created, '%b')"))
        ->get();

        $poYearSuccessArray = $poYearSuccess->pluck('po_month_count', 'month')->toArray();
        
        // Merge with allMonths array to fill in missing months with zero values
        $resultPoYearSuccess = collect($allMonths)->map(function ($month) use ($poYearSuccessArray) {
            return [
                'month' => $month,
                'po_month_count' => $poYearSuccessArray[$month] ?? 0
            ];
        });
        
        
        $poYearCancel = Purchase::where('departement', $departement)->whereYear('po_created', $year)
        ->where('po_no','!=',null)
        ->where('po_cancel','!=', null)
        ->select(
            DB::raw("DATE_FORMAT(po_created, '%b') as month"),
            DB::raw('COUNT(DISTINCT(po_no)) as po_month_count'))
        ->groupBy(DB::raw('MONTH(po_created)'), DB::raw("DATE_FORMAT(po_created, '%b')"))
        ->get();

        $poYearCancelArray = $poYearCancel->pluck('po_month_count', 'month')->toArray();
        
        // Merge with allMonths array to fill in missing months with zero values
        $resultPoYearCancel = collect($allMonths)->map(function ($month) use ($poYearCancelArray) {
            return [
                'month' => $month,
                'po_month_count' => $poYearCancelArray[$month] ?? 0
            ];
        });

        $data = [
            'poYear' => $resultPoYear,
            'poYearSuccess' => $resultPoYearSuccess,
            'poYearCancel' => $resultPoYearCancel,
        ];

        return response()->json($data);
    }


    public function poYearPrice($departement, $year){
        $allMonths = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        $po= Purchase::where('departement', $departement)->whereYear('po_created', $year)
        ->select(
            'po_created',
            'total_price', 
            'total_price_currency'
        )->get();

        $po->each(function($po){
            $totalPriceIDR = 0;
            if($po->total_price_currency === 'USD'){
                $exchangeRates = app(ExchangeRate::class);
                $totalPriceIDR += $po->total_price * $exchangeRates->exchangeRate( 'USD', 'IDR', Carbon::create($po->po_created));
            } else {
                $totalPriceIDR += $po->total_price;
            }
            $po->total_price_idr = $totalPriceIDR;
        });

        $poYearPrice = $po->groupBy(function ($item) {
            return Carbon::parse($item->po_created)->format('M');
        })->map(function ($groupedItems) {
            return [
                'month' => Carbon::parse($groupedItems[0]->po_created)->format('M'),
                'total_price_per_year' => round($groupedItems->sum('total_price_idr')),
            ];
        })->values();

        $poYear = $poYearPrice->pluck('total_price_per_year', 'month')->toArray();
        
        // Merge with allMonths array to fill in missing months with zero values
        $resultPoYearPrice = collect($allMonths)->map(function ($month) use ($poYear) {
            return [
                'month' => $month,
                'total_price_per_year' => $poYear[$month] ?? 0
            ];
        });

        return response()->json($resultPoYearPrice);
        
    }

    public function prYearPrice($departement, $year){
        $allMonths = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        $pr = Purchase::where('departement', $departement)->whereYear('pr_created', $year)
        ->select(
            'pr_created',
            'est_qty', 
            'est_price', 
            'est_currency'
        )->get();

        $pr->each(function($pr){
            $estPriceIDR = 0;
            if($pr->est_currency === 'USD'){
                $exchangeRates = app(ExchangeRate::class);
                $estPriceIDR += $pr->est_price * $exchangeRates->exchangeRate( 'USD', 'IDR', Carbon::create($pr->pr_created)) * $pr->est_qty;
            } else {
                $estPriceIDR += $pr->est_price * $pr->est_qty;
            }
            $pr->est_price_idr = $estPriceIDR;
        });

        $prYearEstPrice= $pr->groupBy(function ($item) {
            return Carbon::parse($item->pr_created)->format('M');
        })->map(function ($groupedItems) {
            return [
                'month' => Carbon::parse($groupedItems[0]->pr_created)->format('M'),
                'total_est_price' => round($groupedItems->sum('est_price_idr')),
            ];
        })->values();

        $prYear = $prYearEstPrice->pluck('total_est_price', 'month')->toArray();
        
        // Merge with allMonths array to fill in missing months with zero values
        $resultPrYearEstPrice = collect($allMonths)->map(function ($month) use ($prYear) {
            return [
                'month' => $month,
                'total_est_price' => $prYear[$month] ?? 0
            ];
        });

        return response()->json($resultPrYearEstPrice);
    }
}
