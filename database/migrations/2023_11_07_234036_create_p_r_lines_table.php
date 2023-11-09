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
        Schema::create('p_r_lines', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('pr_id');
            $table->foreign('pr_id')->references('id')->on('p_r_s')->onDelete('cascade');
            $table->integer('pr_line');
            $table->string('pci_no');
            $table->string('pr_line_desc');
            $table->date('pr_created');
            $table->date('pr_approve_date')->nullable();
            $table->date('pr_last_changed')->nullable();
            $table->date('pr_cancel')->nullable();
            $table->integer('est_qty');
            $table->string('est_currency');
            $table->float('est_price')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('p_r_lines');
    }
};
