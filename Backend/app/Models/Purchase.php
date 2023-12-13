<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    use HasFactory;

    protected $fillable = [
        "pr_no",
        "pr_desc",
        "pr_type",
        "buyer",
        "departement",
        "requested_by",
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
        "po_no",
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

}
