<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Bus;
use App\Models\Jadwal;
use App\Models\PoBus;
use App\Models\Rute;
use Illuminate\Database\Seeder;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure Admin exists
        $admin = Admin::firstOrCreate(
            ['username' => 'admin'],
            [
                'nama_admin' => 'Super Admin',
                'username'   => 'admin',
                'password'   => bcrypt('admin123'),
                'level'      => 'superadmin',
            ]
        );

        // 2. Sample PO Bus
        $poDamri = PoBus::firstOrCreate(
            ['nama_po' => 'PO DAMRI'],
            [
                'alamat_po'  => 'Jl. Nusantara No. 45, Parepare',
                'no_telp_po' => '081144556677',
            ]
        );

        $poBintang = PoBus::firstOrCreate(
            ['nama_po' => 'PO Bintang Prima'],
            [
                'alamat_po'  => 'Jl. Bau Massepe No. 12, Parepare',
                'no_telp_po' => '085299887766',
            ]
        );

        // 3. Sample Bus
        $bus1 = Bus::firstOrCreate(
            ['nomor_polisi' => 'DD 7788 AB'],
            [
                'id_po'        => $poDamri->id_po,
                'nama_bus'     => 'DAMRI Royal Executive 01',
                'nomor_polisi' => 'DD 7788 AB',
            ]
        );

        $bus2 = Bus::firstOrCreate(
            ['nomor_polisi' => 'DD 8899 BP'],
            [
                'id_po'        => $poBintang->id_po,
                'nama_bus'     => 'Bintang Prima Sleeper 02',
                'nomor_polisi' => 'DD 8899 BP',
            ]
        );

        // 4. Sample Rute
        $rute1 = Rute::firstOrCreate(
            ['asal' => 'Parepare', 'tujuan' => 'Makassar (Terminal Daya)'],
            [
                'keterangan_rute' => 'Via Jalur Poros Barru - Pangkep - Maros',
            ]
        );

        $rute2 = Rute::firstOrCreate(
            ['asal' => 'Parepare', 'tujuan' => 'Toraja (Rantepao)'],
            [
                'keterangan_rute' => 'Via Enrekang - Bambapuang',
            ]
        );

        // 5. Sample Jadwal
        Jadwal::firstOrCreate(
            ['id_jadwal' => 1],
            [
                'id_bus'            => $bus1->id_bus,
                'id_rute'           => $rute1->id_rute,
                'id_admin'          => $admin->id_admin,
                'tanggal'           => now()->toDateString(),
                'jam_keberangkatan' => '08:00',
                'jam_kedatangan'    => '11:30',
                'status_bus'        => 'menunggu',
                'keterangan'        => 'Keberangkatan Pagi Reguler DAMRI',
            ]
        );

        Jadwal::firstOrCreate(
            ['id_jadwal' => 2],
            [
                'id_bus'            => $bus2->id_bus,
                'id_rute'           => $rute2->id_rute,
                'id_admin'          => $admin->id_admin,
                'tanggal'           => now()->toDateString(),
                'jam_keberangkatan' => '10:00',
                'jam_kedatangan'    => '16:00',
                'status_bus'        => 'menunggu',
                'keterangan'        => 'Keberangkatan Siang Bintang Prima',
            ]
        );
    }
}
