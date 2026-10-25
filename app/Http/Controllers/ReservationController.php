<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReservationController extends Controller
{
    // =======================================================
    // GET /api/reservations
    // Ambil semua data reservasi untuk tabel admin.
    // Response: array JSON flat agar cocok dengan:
    //   if (Array.isArray(data) && data.length > 0) di app.js
    // =======================================================
    public function index()
    {
        $reservations = DB::table('reservations')
            ->orderBy('booking_date', 'asc')
            ->orderBy('booking_time', 'asc')
            ->get();

        return response()->json($reservations, 200);
    }

    // =======================================================
    // POST /api/reservations
    // Simpan booking baru. ID TIDAK dikirim — biarkan MySQL
    // AUTO_INCREMENT yang mengisi kolom id secara otomatis.
    //
    // Payload dari app.js (apiPayload):
    //   client_name, client_whatsapp, email, booking_date,
    //   booking_time, category, tier, branch,
    //   add_ons, background, total_price
    // =======================================================
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_name'     => 'required|string|max:255',
            'client_whatsapp' => 'required|string|max:20',
            'email'           => 'nullable|email|max:255',
            'booking_date'    => 'required|date',
            'booking_time'    => 'required|string|max:20',
            'category'        => 'required|string|max:100',
            'tier'            => 'required|string|max:50',
            'branch'          => 'required|string|max:100',
            'add_ons'         => 'nullable|string',
            'background'      => 'nullable|string',
            'total_price'     => 'required|integer|min:0',
        ]);

        // TIDAK ada kolom 'id' di sini — MySQL AUTO_INCREMENT yang mengisi
        $id = DB::table('reservations')->insertGetId([
            'client_name'     => $validated['client_name'],
            'client_whatsapp' => $validated['client_whatsapp'],
            'email'           => $validated['email'] ?? null,
            'booking_date'    => $validated['booking_date'],
            'booking_time'    => $validated['booking_time'],
            'category'        => $validated['category'],
            'tier'            => $validated['tier'],
            'branch'          => $validated['branch'],
            'add_ons'         => $validated['add_ons'] ?? null,
            'background'      => $validated['background'] ?? null,
            'total_price'     => $validated['total_price'],
            'status'          => 'pending',
            'created_at'      => now(),
            'updated_at'      => now(),
        ]);

        return response()->json([
            'message' => 'Reservasi berhasil disimpan.',
            'data'    => ['id' => $id],
        ], 201);
    }

    // =======================================================
    // POST /api/reservations/{id}/status
    // Update status saja. Payload dari app.js:
    //   { status: "confirmed" | "cancelled" | "pending" | "done" }
    // =======================================================
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,confirmed,cancelled,done',
        ]);

        $affected = DB::table('reservations')
            ->where('id', $id)
            ->update([
                'status'     => $validated['status'],
                'updated_at' => now(),
            ]);

        if ($affected === 0) {
            return response()->json([
                'message' => 'Reservasi tidak ditemukan atau status tidak berubah.',
            ], 404);
        }

        return response()->json([
            'message' => "Status reservasi #{$id} berhasil diubah menjadi {$validated['status']}.",
        ], 200);
    }

    // =======================================================
    // POST /api/reservations/{id}/update
    // Update SEMUA field booking dari form edit admin.
    //
    // Payload dari app.js (updatePayload):
    //   client_name, client_whatsapp, email,
    //   booking_date, booking_time, category, branch, status
    //
    // Field tier, add_ons, background, total_price diambil dari
    // state lokal app.js dan dikirim sebagai bagian payload juga.
    // Controller menerima semuanya dan update kolom yang tersedia.
    // =======================================================
    public function updateBooking(Request $request, $id)
    {
        $validated = $request->validate([
            'client_name'     => 'required|string|max:255',
            'client_whatsapp' => 'required|string|max:20',
            'email'           => 'nullable|email|max:255',
            'booking_date'    => 'required|date',
            'booking_time'    => 'required|string|max:20',
            'category'        => 'required|string|max:100',
            'tier'            => 'nullable|string|max:50',
            'branch'          => 'required|string|max:100',
            'add_ons'         => 'nullable|string',
            'background'      => 'nullable|string',
            'total_price'     => 'nullable|integer|min:0',
            'status'          => 'required|string|in:pending,confirmed,cancelled,done',
        ]);

        // Bangun array update — hanya kolom yang dikirim dari app.js
        $updateData = [
            'client_name'     => $validated['client_name'],
            'client_whatsapp' => $validated['client_whatsapp'],
            'email'           => $validated['email'] ?? null,
            'booking_date'    => $validated['booking_date'],
            'booking_time'    => $validated['booking_time'],
            'category'        => $validated['category'],
            'branch'          => $validated['branch'],
            'status'          => $validated['status'],
            'updated_at'      => now(),
        ];

        // Field opsional: hanya di-update jika dikirim dari app.js
        if (isset($validated['tier']))        $updateData['tier']        = $validated['tier'];
        if (isset($validated['add_ons']))     $updateData['add_ons']     = $validated['add_ons'];
        if (isset($validated['background']))  $updateData['background']  = $validated['background'];
        if (isset($validated['total_price'])) $updateData['total_price'] = $validated['total_price'];

        $affected = DB::table('reservations')
            ->where('id', $id)
            ->update($updateData);

        if ($affected === 0) {
            return response()->json([
                'message' => 'Reservasi tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'message' => "Data reservasi #{$id} berhasil diperbarui.",
        ], 200);
    }

    // =======================================================
    // DELETE /api/reservations/{id}
    // Hapus satu baris reservasi dari database.
    // =======================================================
    public function destroy($id)
    {
        $affected = DB::table('reservations')->where('id', $id)->delete();

        if ($affected === 0) {
            return response()->json([
                'message' => 'Reservasi tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'message' => "Reservasi #{$id} berhasil dihapus dari database.",
        ], 200);
    }
}