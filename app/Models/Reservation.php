<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $table = 'reservations';

    // 1. Tentukan Primary Key-nya
    protected $primaryKey = 'id';

    // 2. SANGAT PENTING: Beritahu Laravel kalau ID berupa string/teks
    protected $keyType = 'string';

    // 3. Matikan fitur auto-increment angka
    public $incrementing = false;

    // 4. Daftarkan kolom yang boleh diisi (Mass Assignment)
    protected $fillable = [
        'id',
        'client_name',
        'client_whatsapp',
        'email',
        'booking_date',
        'booking_time',
        'category',
        'tier',
        'branch',
        'status',
        'total_price',
        'add_ons',
        'background'
    ];
}