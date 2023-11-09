<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PO extends Model
{
    use HasFactory;

    protected $fillable = [
        "po_no",
        "pr_id",
        "po_desc",
        "po_created",
        "po_last_changed",
        "po_approve",
        "po_confirmation",
        "po_received",
        "po_closed",
        "po_cancel",
        "vendor",
        "vendor_type",
    ] ;

    public function pr(){
        return $this->belongsTo(PR::class);
    }

    public function po_line(){
        return $this->hasMany(POLine::class);
    }
}
