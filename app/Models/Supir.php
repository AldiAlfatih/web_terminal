<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Supir extends Authenticatable
{
    protected $table = 'supir';

    protected $primaryKey = 'id_supir';

    /**
     * Appends virtual attributes to JSON / Array representation.
     */
    protected $appends = ['name', 'email'];

    /**
     * Tell Laravel Auth to use 'id_supir' as the identifier.
     */
    public function getAuthIdentifierName(): string
    {
        return 'id_supir';
    }

    protected $fillable = [
        'nama_supir',
        'no_telp',
        'username',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Virtual 'name' accessor — maps nama_supir to 'name'
     * so shared UI components work without modification.
     */
    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->nama_supir,
        );
    }

    /**
     * Virtual 'email' accessor — Supir table has no email column.
     * Returns username@supir.local as a placeholder for display components.
     */
    protected function email(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->username.'@supir.local',
        );
    }

    public function jadwals(): HasMany
    {
        return $this->hasMany(Jadwal::class, 'id_supir', 'id_supir');
    }
}
