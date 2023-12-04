<?php

namespace App\Http\Controllers\Api;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', RegisterController::class)->name('register');
Route::post('/login', LoginController::class)->name('login');
Route::post('/logout', LogoutController::class)->name('logout');

Route::get('/dashboard', [DashboardController::class,'index'])->middleware('auth:api');
Route::get('/dashboard/prYear/{year}', [DashboardController::class, 'prYear'])->middleware('auth:api');
Route::get('/dashboard/poYear/{year}', [DashboardController::class, 'poYear'])->middleware('auth:api');

Route::get('/pr', [PrController::class,'index'])->middleware('auth:api');
Route::get('/pr/{pr_no}', [PrController::class,'pr_line'])->middleware('auth:api');



Route::get('/po', [PoController::class,'index'])->middleware('auth:api');
Route::get('/po/{po_no}', [PoController::class,'po_line'])->middleware('auth:api');


Route::get('/users', [UserController::class, 'index'])->middleware('auth:api','role:admin');
Route::get('/user/{id}', [UserController::class, 'show'])->middleware('auth:api','role:admin');
Route::post('/user/edit/{id}', [UserController::class, 'update'])->middleware('auth:api','role:admin');
Route::delete('/user/{id}', [UserController::class, 'destroy'])->middleware('auth:api','role:admin');
