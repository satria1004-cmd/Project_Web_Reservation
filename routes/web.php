<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\BookingController;

// Jalur utama untuk membuka halaman login/dashboard Admin Portal Lomoto Studio
Route::get('/admin', function () {
    return view('dashboard'); // Ini akan otomatis memanggil file dashboard.blade.php di folder resources/views
});

Route::post('/reservations/{id}/status', [ReservationController::class, 'updateStatus']);

Route::post('/reservations/{id}/status', [ReservationController::class, 'updateStatus']);
Route::post('/reservations/{id}/update', [ReservationController::class, 'updateBooking']);
Route::post('/reservations/{id}/status', [ReservationController::class, 'updateStatus'])->name('reservation.updateStatus');

Route::get('/', function () {
    return view('index'); // Laravel otomatis mencari file index.blade.php di resources/views
});

Route::post('/booking/submit', [BookingController::class, 'store'])->name('booking.submit');

