<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Rute extends Model
{
    protected $table = 'rute';

    protected $primaryKey = 'id_rute';

    protected $fillable = [
        'asal',
        'tujuan',
        'keterangan_rute',
    ];

    public function jadwals(): HasMany
    {
        return $this->hasMany(Jadwal::class, 'id_rute', 'id_rute');
    }
}
