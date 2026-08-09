<?php

use App\Models\Admin;
use App\Models\Laporan;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('laporan can be created with default fields', function () {
    $admin = Admin::create([
        'nama_admin' => 'Test Admin',
        'username' => 'testadmin_'.rand(1000, 9999),
        'password' => bcrypt('password'),
        'level' => 'superadmin',
    ]);

    $laporan = Laporan::create([
        'id_admin' => $admin->id_admin,
        'tanggal_laporan' => now()->toDateString(),
        'periode_awal' => now()->startOfMonth()->toDateString(),
        'jenis_laporan' => 'Jadwal Keberangkatan Bus',
    ]);

    $laporan->refresh();
    expect($laporan)->toBeInstanceOf(Laporan::class);
    expect($laporan->nama_po)->toBe('-');
    expect($laporan->nomor_polisi)->toBe('-');
});

test('laporan can be created with custom operational fields', function () {
    $admin = Admin::create([
        'nama_admin' => 'Test Admin',
        'username' => 'testadmin_'.rand(1000, 9999),
        'password' => bcrypt('password'),
        'level' => 'superadmin',
    ]);

    $laporan = Laporan::create([
        'id_admin' => $admin->id_admin,
        'nama_po' => 'PO Bintang Prima',
        'nomor_polisi' => 'DD 5678 XY',
        'asal' => 'Parepare',
        'tujuan' => 'Toraja',
        'nama_supir' => 'Andi',
        'seat' => 40,
        'pnp' => 30,
        'naik' => 10,
        'turun' => 5,
        'akap_akdp' => 'AKAP',
    ]);

    expect($laporan->nama_po)->toBe('PO Bintang Prima');
    expect($laporan->nomor_polisi)->toBe('DD 5678 XY');
    expect($laporan->akap_akdp)->toBe('AKAP');
});
