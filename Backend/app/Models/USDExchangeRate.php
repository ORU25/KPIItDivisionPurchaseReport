<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class USDExchangeRate extends Model
{
    use HasFactory;

    protected $table = 'u_s_d_exchange_rates';

    protected $fillable = [
        "year", "exchange_rate"
    ];
}
