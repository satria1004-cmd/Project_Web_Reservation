<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            // Menambahkan kolom yang kurang
            $table->string('booking_time', 20)->after('booking_date');
            $table->string('status', 20)->default('pending')->after('branch');
            $table->bigInteger('total_price')->default(0)->after('status');
            
            // Memastikan tipe teks panjang untuk array JSON data dari JS
            $table->text('add_ons')->nullable()->change();
            $table->text('background')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn(['booking_time', 'status', 'total_price']);
        });
    }
};