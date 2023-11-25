<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class POLine extends Model
{
    use HasFactory;

    protected $fillable = [
        "po_id",
        "pr_line_id",
        "po_line",
        "po_line_desc",
        "qty_order",
        "unit_price_currency",
        "unit_price_po",
        "total_price_currency",
        "total_price",
        "po_closed_line",
        "po_cancel_line",
        "po_cancel_comments",
        "eta_gmt8",
    ];


    public function po(){
        return $this->belongsTo(PO::class);
    }

    public function pr_line(){
        return $this->belongsTo(PRLine::class);
    }
}
