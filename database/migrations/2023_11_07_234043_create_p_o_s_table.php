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
        Schema::create('p_o_s', function (Blueprint $table) {
            $table->id();
            $table->integer('po_no');
            $table->unsignedBigInteger('pr_id');
            $table->foreign('pr_id')->references('id')->on('p_r_s')->onDelete('cascade');
            $table->string('po_desc');
            $table->date('po_created');
            $table->date('po_last_changed')->nullable();
            $table->date('po_approve')->nullable();
            $table->date('po_confirmation')->nullable();
            $table->date('po_received')->nullable();
            $table->date('po_closed')->nullable();
            $table->date('po_cancel')->nullable();
            $table->string('vendor');
            $table->string('vendor_type');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('p_o_s');
    }
};
