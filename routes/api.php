<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReservationController;

// =======================================================
// JALUR SINKRONISASI UTAMALOMOTO STUDIO (PORT 8000/API)
// =======================================================

// 1. Simpan booking baru dari website customer
Route::post('/reservations', [ReservationController::class, 'store']);

// 2. Ambil semua data untuk ditampilkan di tabel admin
Route::get('/reservations', [ReservationController::class, 'index']);

// 3. Update status (POST — sinkron dengan app.js)
Route::post('/reservations/{id}/status', [ReservationController::class, 'updateStatus']);

// 4. Update data lengkap booking dari form edit admin (POST — sinkron dengan app.js)
Route::post('/reservations/{id}/update', [ReservationController::class, 'updateBooking']);

// 5. Hapus data booking dari database MySQL
Route::delete('/reservations/{id}', [ReservationController::class, 'destroy']);

// Rute API untuk Login Manual Admin Lomoto
Route::post('/login', [AuthController::class, 'login']);