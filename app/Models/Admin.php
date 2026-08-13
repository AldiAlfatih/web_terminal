<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable
{
    protected $table = 'admin';

    protected $primaryKey = 'id_admin';

    /**
     * Appends virtual attributes to JSON / Array representation.
     */
    protected $appends = ['name', 'email'];

    /**
     * Tell Laravel Auth to use 'username' instead of 'email' for credential lookup.
     * This is required because our admin table has 'username', not 'email'.
     */
    public function getAuthIdentifierName(): string
    {
        return 'id_admin';
    }

    protected $fillable = [
        'nama_admin',
        'username',
        'password',
        'level',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'level' => 'string',
    ];

    /**
     * Virtual 'name' accessor — maps nama_admin to 'name'
     * so the starter kit's UserInfo/NavUser components work without modification.
     */
    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->nama_admin,
        );
    }

    /**
     * Virtual 'email' accessor — Admin table has no email column.
     * Returns username@terminal.local as a placeholder for avatar/display components.
     */
    protected function email(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->username.'@terminal.local',
        );
    }

    public function jadwals(): HasMany
    {
        return $this->hasMany(Jadwal::class, 'id_admin', 'id_admin');
    }

    public function laporans(): HasMany
    {
        return $this->hasMany(Laporan::class, 'id_admin', 'id_admin');
    }
}
