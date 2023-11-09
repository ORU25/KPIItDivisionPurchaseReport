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
        Schema::create('p_r_s', function (Blueprint $table) {
            $table->id();
            $table->integer('pr_no');
            $table->string('pr_type');
            $table->string('pr_desc');
            $table->string('buyer');
            $table->string('departement');
            $table->string('requested_by');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('p_r_s');
    }
};
