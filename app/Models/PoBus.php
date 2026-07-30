<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PoBus extends Model
{
    protected $table = 'po_bus';
    protected $primaryKey = 'id_po';

    protected $fillable = [
        'nama_po',
        'alamat_po',
        'no_telp_po',
    ];

    public function buses(): HasMany
    {
        return $this->hasMany(Bus::class, 'id_po', 'id_po');
    }
}
