<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PRLine extends Model
{
    use HasFactory;

    protected $fillable = [
        "pr_id",
        "pr_line",
        "pci_no",
        "pr_line_desc",
        "pr_created",
        "pr_approve_date",
        "pr_last_changed",
        "pr_cancel",
        "est_qty",
        "est_currency",
        "est_price",
    ];

    public function pr(){
        return $this->belongsTo(PR::class);
    }

    public function po_line(){
        return $this->hasOne(POLine::class, 'pr_line_id', 'id');
    }
}
