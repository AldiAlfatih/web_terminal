<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Jadwal extends Model
{
    protected $table = 'jadwal';

    protected $primaryKey = 'id_jadwal';

    protected $fillable = [
        'id_bus',
        'id_rute',
        'id_admin',
        'id_supir',
        'tanggal',
        'jam_keberangkatan',
        'jam_kedatangan',
        'status_bus',
        'keterangan',
        'current_lat',
        'current_lng',
        'current_heading',
        'current_speed',
        'last_loc_updated_at',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'status_bus' => 'string',
        'current_lat' => 'float',
        'current_lng' => 'float',
        'current_heading' => 'float',
        'current_speed' => 'float',
        'last_loc_updated_at' => 'datetime',
    ];

    public function bus(): BelongsTo
    {
        return $this->belongsTo(Bus::class, 'id_bus', 'id_bus');
    }

    public function rute(): BelongsTo
    {
        return $this->belongsTo(Rute::class, 'id_rute', 'id_rute');
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'id_admin', 'id_admin');
    }

    public function supir(): BelongsTo
    {
        return $this->belongsTo(Supir::class, 'id_supir', 'id_supir');
    }
}
