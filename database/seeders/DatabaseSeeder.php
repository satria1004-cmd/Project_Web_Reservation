<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Membuat atau memperbarui akun Admin Lomoto Studio
        User::updateOrCreate(
            ['email' => 'admin@lomoto.com'], // Dicari berdasarkan email ini
            [
                'name' => 'Admin Lomoto',
                'password' => Hash::make('admin123'), // Password di-enkripsi demi keamanan
                // Jika di tabel user kamu ada kolom 'role', kamu bisa tambahkan di bawah:
                // 'role' => 'admin', 
            ]
        );
    }
}