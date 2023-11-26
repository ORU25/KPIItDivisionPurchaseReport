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
        Schema::create('pr_po', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('pr_id');
            $table->foreign('pr_id')->references('id')->on('p_r_s')->onDelete('cascade');
            $table->unsignedBigInteger('po_id');
            $table->foreign('po_id')->references('id')->on('p_o_s')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
