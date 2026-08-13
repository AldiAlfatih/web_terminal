<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bus extends Model
{
    protected $table = 'bus';

    protected $primaryKey = 'id_bus';

    protected $fillable = [
        'id_po',
        'nama_bus',
        'nomor_polisi',
    ];

    public function poBus(): BelongsTo
    {
        return $this->belongsTo(PoBus::class, 'id_po', 'id_po');
    }

    public function jadwals(): HasMany
    {
        return $this->hasMany(Jadwal::class, 'id_bus', 'id_bus');
    }
}
