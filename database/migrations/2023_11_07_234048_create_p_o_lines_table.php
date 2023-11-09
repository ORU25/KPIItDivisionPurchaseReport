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
        Schema::create('p_o_lines', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('po_id');
            $table->foreign('po_id')->references('id')->on('p_o_s')->onDelete('cascade');
            $table->unsignedBigInteger('pr_line_id');
            $table->foreign('pr_line_id')->references('id')->on('p_r_lines')->onDelete('cascade');
            $table->integer('po_line');
            $table->string('po_line_desc');
            $table->integer('qty_order');
            $table->string('unit_price_currency');
            $table->float('unit_price_po');
            $table->string('total_price_currency');
            $table->float('total_price');
            $table->date('po_closed_line')->nullable();
            $table->date('po_cancel_line')->nullable();
            $table->string('po_cancel_comments')->nullable();
            $table->date('eta_gmt8');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('p_o_lines');
    }
};
