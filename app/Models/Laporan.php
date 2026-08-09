<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Laporan extends Model
{
    protected $table = 'laporan';

    protected $primaryKey = 'id_laporan';

    protected $fillable = [
        'id_admin',
        'source_type',
        'source_trip_id',
        'submitted_at',
        'nama_po',
        'nomor_polisi',
        'asal',
        'tujuan',
        'nama_supir',
        'seat',
        'pnp',
        'naik',
        'turun',
        'akap_akdp',
        'tanggal_laporan',
        'periode_awal',
        'jenis_laporan',
        'file_pdf',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'seat' => 'integer',
        'pnp' => 'integer',
        'naik' => 'integer',
        'turun' => 'integer',
        'tanggal_laporan' => 'date',
        'periode_awal' => 'date',
    ];

    protected $appends = [
        'display_time',
    ];

    public function getDisplayTimeAttribute(): string
    {
        $raw = $this->getRawOriginal('submitted_at') ?? $this->attributes['submitted_at'] ?? null;
        if (! $raw) {
            return '-';
        }

        $rawClean = substr(str_replace(['T', 'Z'], [' ', ''], (string) $raw), 0, 19);

        try {
            return Carbon::createFromFormat('Y-m-d H:i:s', $rawClean, 'UTC')
                ->setTimezone('Asia/Makassar')
                ->format('H:i');
        } catch (\Throwable $e) {
            return '-';
        }
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'id_admin', 'id_admin');
    }

    public function sourceTrip(): BelongsTo
    {
        return $this->belongsTo(Jadwal::class, 'source_trip_id', 'id_jadwal');
    }
}
