<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->string('client_name');
            $table->string('client_whatsapp');
            $table->string('email');
            $table->date('booking_date');
            $table->string('category');
            $table->string('tier');
            $table->string('branch');
            $table->string('add_ons')->nullable();
            $table->string('background')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};