<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1. Validasi input yang dikirim dari frontend
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2. Cari user di database berdasarkan email
        $user = User::where('email', $request->email)->first();

        // 3. Cek apakah user ditemukan DAN password-nya cocok dengan versi enkripsi
        if ($user && Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => true,
                'message' => 'Login sukses! Selamat datang kembali.',
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email
                ]
            ], 200);
        }

        // 4. Jika salah, kirim respon error (401 Unauthorized)
        return response()->json([
            'success' => false,
            'message' => 'Email atau password yang Anda masukkan salah.'
        ], 401);
    }
}