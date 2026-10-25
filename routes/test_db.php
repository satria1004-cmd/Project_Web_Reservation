<?php
// Mengambil file autoload Laravel agar kita bisa menggunakan fungsi-fungsi Laravel
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';

use App\Models\Reservation;

try {
    $reservation = Reservation::create([
        'client_name' => 'Satria Tes',
        'client_whatsapp' => '0812345678',
        'email' => 'test@email.com',
        'booking_date' => '2026-06-05',
        'category' => 'Pre-wedding',
        'tier' => 'Silver',
        'branch' => 'Jakarta',
        'add_ons' => 'None',
        'background' => 'White'
    ]);
    echo "Koneksi Database BERHASIL! Data telah tersimpan dengan ID: " . $reservation->id;
} catch (\Exception $e) {
    echo "Koneksi Database GAGAL. Error: " . $e->getMessage();
}