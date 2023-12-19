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
        $limitChart = 10;
        $limitYear = range(date('Y') - 9, date('Y'));

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
        ->orderBy(DB::raw('YEAR(pr_created)'), 'desc') // Urutkan data berdasarkan kolom yang diinginkan (misalnya 'created_at')
        ->take($limitChart)
        ->get();

        $prLineYearResult = [];

        // Inisialisasi hasil dengan nilai 0 untuk setiap tahun
        foreach ($limitYear as $year) {
            $prLineYearResult[] = [
                'year' => $year,
                'pr_line_year_count' => 0,
            ];
        }

        // Update data yang sesuai dari hasil kueri
        foreach ($prLineYear as $item) {
            $index = array_search($item->year, array_column($prLineYearResult, 'year'));

            if ($index !== false) {
                $prLineYearResult[$index]['pr_line_year_count'] = $item->pr_line_year_count;
            }
        }

        // Hanya tampilkan data 10 tahun terakhir
        // $prLineYearsData = array_slice($prLineYearResult, -10);


        

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

        //    $uniqueYears = $vendorTypePoCount->sortByDesc('year')->pluck('year')->unique()->take($limitChart);

            // Organize the data by vendor_type and year
            $result = [
                // 'years' => $uniqueYears->reverse()->values()->toArray(),
                'years' => $limitYear,
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
        ->orderBy(DB::raw('YEAR(po_created)'), 'desc') 
        ->take($limitChart)
        ->get();

        $poYearResult = [];

        // Inisialisasi hasil dengan nilai 0 untuk setiap tahun
        foreach ($limitYear as $year) {
            $poYearResult[] = [
                'year' => $year,
                'po_year_count' => 0,
            ];
        }

        // Update data yang sesuai dari hasil kueri
        foreach ($poYear as $item) {
            $index = array_search($item->year, array_column($poYearResult, 'year'));

            if ($index !== false) {
                $poYearResult[$index]['po_year_count'] = $item->po_year_count;
            }
        }

        // Hanya tampilkan data 10 tahun terakhir
        // $poYearsData = array_slice($poYearResult, -10);
        
        
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
            })->sortByDesc('year') 
            ->take($limitChart)->values();

            $poYearTotalPriceResult = [];

            // Iterasi melalui tahun-tahun
            foreach ($limitYear as $year) {
                // Cari data untuk tahun tersebut
                $dataForYear = $poYearPricePerYear->firstWhere('year', $year);

                // Jika tidak ada data, set total harga menjadi 0
                $totalPrice = $dataForYear ? $dataForYear['total_price_per_year'] : 0;

                // Tambahkan data ke hasil
                $poYearTotalPriceResult[] = [
                    'year' => $year,
                    'total_price_per_year' => $totalPrice,
                ];
            }


        
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
            })->sortByDesc('year') 
            ->take($limitChart)->values();

            $prYearEstPriceResult = [];

            // Iterasi melalui tahun-tahun
            foreach ($limitYear as $year) {
                // Cari data untuk tahun tersebut
                $dataForYear = $prYearEstPricePerYear->firstWhere('year', $year);

                // Jika tidak ada data, set total harga menjadi 0
                $totalEstPrice = $dataForYear ? $dataForYear['total_est_price'] : 0;

                // Tambahkan data ke hasil
                $prYearEstPriceResult[] = [
                    'year' => $year,
                    'total_est_price' => $totalEstPrice,
                ];
            }

        
        $yearPo= Purchase::where('departement', $department)
        ->where('po_created', '!=', null)
        ->select(DB::raw('YEAR(po_created) as year'))
        ->distinct('year')
        ->get();

        $yearPr= Purchase::where('departement', $department)
        ->where('po_created', '!=', null)
        ->select(DB::raw('YEAR(po_created) as year'))
        ->distinct('year')
        ->get();

        $department = Purchase::select('departement')->distinct()->get();

        // $reversedPrLineYear = $prLineYear->reverse();

        if ($totalPr == 0) {
            return response()->json("Data Not Found",404);
        }
        
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

            'prLineYear' => $prLineYearResult,
            'prLineYearSuccess' => $prLineYearSuccess,
            'prLineYearCancel' => $prLineYearCancel,

            'vendorTypePoCount' => $result,

            'poYear' =>  $poYearResult,
            'poYearSuccess' => $poYearSuccess,
            'poYearCancel' => $poYearCancel,

            'poYearPrice' => $poYearTotalPriceResult,
            'prYearEstPrice' =>  $prYearEstPriceResult,

            'departments' => $department,
            'yearsPo' =>$yearPo,
            'yearsPr' =>$yearPr
        ],200);
    }

    public function prYear($department, $year){
        $allMonths = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        
        $prLineYear = Purchase::where('departement', $department)->whereYear('pr_created', $year)
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

        $prLineYearSuccess = Purchase::where('departement', $department)->whereYear('pr_created', $year)->where('pr_cancel', null)
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


        $prLineYearCancel = Purchase::where('departement', $department)->whereYear('pr_created', $year)->where('pr_cancel','!=',null)
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
        
          
        return response()->json($data,200);
    }

    public function poYear($department, $year){
        $allMonths = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        
        $poYear = Purchase::where('departement', $department)
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
        
        $poYearSuccess = Purchase::where('departement', $department)->whereYear('po_created', $year)
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
        
        
        $poYearCancel = Purchase::where('departement', $department)->whereYear('po_created', $year)
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

        

        return response()->json($data,200);
    }


    public function poYearPrice($department, $year){
        $allMonths = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        $po= Purchase::where('departement', $department)->whereYear('po_created', $year)
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

        return response()->json($resultPoYearPrice,200);
        
    }

    public function prYearPrice($department, $year){
        $allMonths = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        $pr = Purchase::where('departement', $department)->whereYear('pr_created', $year)
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

        return response()->json($resultPrYearEstPrice,200);
    }

    public function vendorTypeByYear($department, $year){
        // Array bulan tetap
        $allMonths = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
    
        // Query untuk mengambil data yang ada
        $vendorTypePoCount = Purchase::where('departement', $department)
            ->where('vendor_type', '!=', null)
            ->whereYear('po_created', $year)
            ->select(
                'vendor_type',
                DB::raw("DATE_FORMAT(po_created,'%b') as month"),
                DB::raw('COUNT(DISTINCT po_no) as po_count')
            )
            ->groupBy('vendor_type', 'month')
            ->get();
    
        // Membuat array kosong untuk hasil akhir
        $result = [
            'months' => $allMonths,
        ];
    
        // Inisialisasi array untuk setiap tipe vendor
        foreach ($vendorTypePoCount as $vendor) {
            $vendorType = $vendor->vendor_type;
            $month = $vendor->month;
            $poCount = $vendor->po_count;
    
            // Buat tipe vendor jika belum ada
            if (!isset($result[$vendorType])) {
                $result[$vendorType] = [];
            }
    
            // Tambahkan data ke tipe vendor sesuai bulan
            $result[$vendorType][] = [
                'month' => $month,
                'count' => $poCount,
            ];
        }
    
        // Isi bulan yang tidak memiliki data dengan count 0
        foreach ($result as $vendorType => $data) {
            if ($vendorType != 'months') {
                foreach ($allMonths as $month) {
                    $found = false;
                    foreach ($data as $item) {
                        if ($item['month'] == $month) {
                            $found = true;
                            break;
                        }
                    }
    
                    // Tambahkan data dengan count 0 jika tidak ditemukan
                    if (!$found) {
                        $result[$vendorType][] = [
                            'month' => $month,
                            'count' => 0,
                        ];
                    }
                }
    
                // Urutkan data berdasarkan bulan
                usort($result[$vendorType], function ($a, $b) use ($allMonths) {
                    return array_search($a['month'], $allMonths) - array_search($b['month'], $allMonths);
                });
            }
        }
    
        $data = [
            'vendorTypePoCount' => $result
        ];
    
        return response()->json($data, 200);
    }
}
