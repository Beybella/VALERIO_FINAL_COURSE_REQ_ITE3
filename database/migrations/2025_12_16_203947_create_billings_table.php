<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('billings', function (Blueprint $table) {
            $table->id();
            $table->string('insurance_provider'); // Filter column
            $table->date('claim_billing_date');    // Line graph column
            $table->decimal('billed_amount', 10, 2); // Visualization column
            $table->decimal('paid_amount', 10, 2);   // Visualization column
            $table->string('claim_status');        // "Bad Debt" analysis column
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('billings');
    }
};
