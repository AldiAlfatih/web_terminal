<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Seed the admin table with a default superadmin account.
     * Run with: php artisan db:seed --class=AdminSeeder
     */
    public function run(): void
    {
        Admin::updateOrCreate(
            ['username' => 'admin'],
            [
                'nama_admin' => 'Super Admin',
                'username' => 'admin',
                'password' => Hash::make('admin123'),
                'level' => 'superadmin',
            ]
        );

        Admin::updateOrCreate(
            ['username' => 'petugas1'],
            [
                'nama_admin' => 'Petugas Terminal',
                'username' => 'petugas1',
                'password' => Hash::make('petugas123'),
                'level' => 'petugas',
            ]
        );
    }
}
