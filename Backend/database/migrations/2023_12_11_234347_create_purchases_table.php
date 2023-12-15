<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('purchases', function (Blueprint $table) {
            $table->id();
            $table->integer('pr_no');
            $table->integer('pr_line');
            $table->string('pr_type');
            $table->string('pci_no');
            $table->string('pr_desc');
            $table->string('pr_line_desc',750);
            $table->date('pr_created');
            $table->date('pr_last_changed')->nullable();
            $table->date('pr_approve_date')->nullable();
            $table->date('pr_cancel')->nullable();
            $table->integer('po_no')->nullable();
            $table->string('po_desc')->nullable();
            $table->integer('po_line')->nullable();
            $table->string('po_line_desc',750)->nullable();
            $table->integer('qty_order')->nullable();
            $table->string('unit_price_currency')->nullable();
            $table->integer('unit_price_po')->nullable();
            $table->integer('est_qty')->nullable();
            $table->string('est_currency')->nullable();
            $table->integer('est_price')->nullable();
            $table->string('total_price_currency')->nullable();
            $table->integer('total_price')->nullable();
            $table->date('po_created')->nullable();
            $table->date('po_last_changed')->nullable();
            $table->date('po_approve')->nullable();
            $table->date('po_confirmation')->nullable();
            $table->date('po_received')->nullable();
            $table->date('po_closed')->nullable();
            $table->date('po_closed_line')->nullable();
            $table->date('po_cancel')->nullable();
            $table->date('po_cancel_line')->nullable();
            $table->string('po_cancel_comments')->nullable();
            $table->date('eta_gmt8')->nullable();
            $table->string('vendor')->nullable();
            $table->string('vendor_type')->nullable();
            $table->string('buyer');
            $table->string('departement');
            $table->string('requested_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchases');
    }
};
