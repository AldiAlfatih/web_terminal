<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Laporan extends Model
{
    protected $table = 'laporan';
    protected $primaryKey = 'id_laporan';

    protected $fillable = [
        'id_admin',
        'tanggal_laporan',
        'periode_awal',
        'jenis_laporan',
        'file_pdf',
    ];

    protected $casts = [
        'tanggal_laporan' => 'date',
        'periode_awal' => 'date',
    ];

    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'id_admin', 'id_admin');
    }
}
