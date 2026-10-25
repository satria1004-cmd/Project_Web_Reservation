<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validasi Input dari Frontend Customer
        $validated = $request->validate([
            'branch' => 'required|string',
            'category' => 'required|string',
            'tier' => 'required|string',
            'background' => 'nullable|string',
            'date' => 'required|date',
            'time' => 'required|string', 
            'name' => 'required|string|max:255',
            'whatsapp' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'addons' => 'nullable|array',
            'totalPrice' => 'required|numeric',
        ]);

        // Bersihkan data string input untuk pencocokan logika PHP
        $branch = strtolower(trim($validated['branch']));
        $category = strtolower(trim($validated['category']));
        $tier = strtolower(trim($validated['tier']));
        
        // 2. Tentukan durasi menit baru berdasarkan kecocokan karakter (LIKE/Contains)
        $durationMinutes = 60; // Default jika tidak terpetakan

        if (Str::contains($branch, 'karawaci')) {
            if (Str::contains($category, 'rental')) {
                if (Str::contains($tier, 'wood')) $durationMinutes = 180;       // 3 Jam
                elseif (Str::contains($tier, 'silver')) $durationMinutes = 360;  // 6 Jam
                elseif (Str::contains($tier, 'gold')) $durationMinutes = 540;    // 9 Jam
                elseif (Str::contains($tier, 'platinum')) $durationMinutes = 720;// 12 Jam
            }
        }

        // Format jam input baru menjadi objek standard Datetime (Y-m-d H:i:00)
        $cleanTimeInput = date('H:i', strtotime(trim(str_replace('WIB', '', $validated['time']))));
        $newStartStr = $validated['date'] . ' ' . $cleanTimeInput;
        
        $newStart = date('Y-m-d H:i:s', strtotime($newStartStr));
        $newEnd = date('Y-m-d H:i:s', strtotime($newStartStr . " +{$durationMinutes} minutes"));

        // 3. KUNCI UTAMA DATABASE — LOGIKA ANTI-BENTROK JADWAL (MENGGUNAKAN <= DAN >=)
        $isBentrok = DB::table('reservations')
            ->where('booking_date', $validated['date'])
            ->where('status', '!=', 'cancelled') 
            ->where(function ($query) use ($branch) {
                // Pastikan mengecek cabang yang sama tanpa sensitif spasi/kata "Studio"
                if (Str::contains($branch, 'karawaci')) {
                    $query->where('branch', 'LIKE', '%Karawaci%');
                } else {
                    $query->where('branch', 'LIKE', '%Cideng%');
                }
            })
            ->where(function ($query) use ($newStart, $newEnd) {
                // STR_TO_DATE menyatukan format teks date & time di MySQL menjadi objek DATETIME murni
                $dbDatetime = "STR_TO_DATE(CONCAT(booking_date, ' ', booking_time), '%Y-%m-%d %H:%i')";

                // PERBAIKAN FORMULA: Menggunakan <= dan >= agar jam yang sama persis langsung terkunci!
                $query->where(DB::raw($dbDatetime), '<=', $newEnd)
                      ->where(DB::raw("
                            DATE_ADD(
                                $dbDatetime, 
                                INTERVAL CASE 
                                    /* Mapping Durasi Data Lama di Database (Satuan Menit) */
                                    WHEN LOWER(branch) LIKE '%karawaci%' AND LOWER(category) LIKE '%rental%' AND LOWER(tier) LIKE '%platinum%' THEN 720
                                    WHEN LOWER(branch) LIKE '%karawaci%' AND LOWER(category) LIKE '%rental%' AND LOWER(tier) LIKE '%gold%' THEN 540
                                    WHEN LOWER(branch) LIKE '%karawaci%' AND LOWER(category) LIKE '%rental%' AND LOWER(tier) LIKE '%silver%' THEN 360
                                    WHEN LOWER(branch) LIKE '%karawaci%' AND LOWER(category) LIKE '%rental%' AND LOWER(tier) LIKE '%wood%' THEN 180
                                    
                                    WHEN LOWER(branch) LIKE '%karawaci%' AND LOWER(category) LIKE '%yearbook%' AND LOWER(tier) LIKE '%gold%' THEN 180
                                    WHEN LOWER(branch) LIKE '%karawaci%' AND LOWER(category) LIKE '%yearbook%' AND LOWER(tier) LIKE '%silver%' THEN 120
                                    
                                    WHEN LOWER(branch) LIKE '%karawaci%' AND LOWER(category) LIKE '%couple%' AND LOWER(tier) LIKE '%gold%' THEN 120
                                    WHEN LOWER(branch) LIKE '%karawaci%' AND LOWER(category) LIKE '%product%' AND LOWER(tier) LIKE '%gold%' THEN 120
                                    
                                    WHEN LOWER(branch) LIKE '%karawaci%' AND LOWER(category) LIKE '%personal%' AND LOWER(tier) LIKE '%gold%' THEN 90
                                    WHEN LOWER(branch) LIKE '%karawaci%' AND LOWER(category) LIKE '%group%' AND LOWER(tier) LIKE '%gold%' THEN 90
                                    
                                    WHEN LOWER(branch) LIKE '%karawaci%' AND LOWER(category) LIKE '%personal%' AND LOWER(tier) LIKE '%wood%' THEN 30
                                    WHEN LOWER(branch) LIKE '%karawaci%' AND LOWER(category) LIKE '%couple%' AND LOWER(tier) LIKE '%wood%' THEN 30
                                    WHEN LOWER(branch) LIKE '%karawaci%' AND LOWER(category) LIKE '%group%' AND LOWER(tier) LIKE '%wood%' THEN 30
                                    WHEN LOWER(branch) LIKE '%karawaci%' AND LOWER(category) LIKE '%product%' AND LOWER(tier) LIKE '%wood%' THEN 30
                                    
                                    ELSE 60
                                END MINUTE
                            )
                        "), '>=', $newStart);
            })
            ->exists();

        // 4. JIKA BENTROK, LANGSUNG TENDANG DAN KIRIM RESPON ERROR 422
        if ($isBentrok) {
            return response()->json([
                'success' => false,
                'message' => 'Maaf, rentang waktu atau jam mulai yang Anda pilih sudah terisi penuh oleh booking klien lain di hari ini.'
            ], 422);
        }

        // 5. JIKA JALUR AMAN, SIMPAN DATA
        $insertedId = DB::table('reservations')->insertGetId([
            'client_name' => $validated['name'],
            'client_whatsapp' => $validated['whatsapp'],
            'email' => $validated['email'],
            'booking_date' => $validated['date'],
            'booking_time' => $cleanTimeInput, 
            'category' => $validated['category'],
            'tier' => $validated['tier'],
            'branch' => $validated['branch'],
            'add_ons' => (!empty($validated['addons'])) ? json_encode($validated['addons']) : null, 
            'background' => $validated['background'] ? $validated['background'] : 'Default',
            'status' => 'pending',
            'total_price' => $validated['totalPrice'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Reservasi berhasil dicatat!',
            'booking_id' => $insertedId
        ], 200);
    }
}