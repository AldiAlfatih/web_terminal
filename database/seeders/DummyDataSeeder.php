<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Bus;
use App\Models\Jadwal;
use App\Models\Laporan;
use App\Models\PoBus;
use App\Models\Rute;
use App\Models\Supir;
use Illuminate\Database\Seeder;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure Admin exists
        $admin = Admin::updateOrCreate(
            ['username' => 'admin'],
            [
                'nama_admin' => 'Super Admin',
                'username' => 'admin',
                'password' => bcrypt('admin123'),
                'level' => 'superadmin',
            ]
        );

        // 2. Sample PO Bus
        $poDamri = PoBus::firstOrCreate(
            ['nama_po' => 'PO DAMRI'],
            [
                'alamat_po' => 'Jl. Nusantara No. 45, Parepare',
                'no_telp_po' => '081144556677',
            ]
        );

        $poBintang = PoBus::firstOrCreate(
            ['nama_po' => 'PO Bintang Prima'],
            [
                'alamat_po' => 'Jl. Bau Massepe No. 12, Parepare',
                'no_telp_po' => '085299887766',
            ]
        );

        // 3. Sample Bus
        $bus1 = Bus::firstOrCreate(
            ['nomor_polisi' => 'DD 7788 AB'],
            [
                'id_po' => $poDamri->id_po,
                'nama_bus' => 'DAMRI Royal Executive 01',
                'nomor_polisi' => 'DD 7788 AB',
            ]
        );

        $bus2 = Bus::firstOrCreate(
            ['nomor_polisi' => 'DD 8899 BP'],
            [
                'id_po' => $poBintang->id_po,
                'nama_bus' => 'Bintang Prima Sleeper 02',
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

        // 5. Sample Supir
        $supir1 = Supir::firstOrCreate(
            ['username' => 'supir1'],
            [
                'nama_supir' => 'Andi Mappangara',
                'no_telp' => '081234567890',
                'username' => 'supir1',
                'password' => bcrypt('supir123'),
            ]
        );

        $supir2 = Supir::firstOrCreate(
            ['username' => 'supir2'],
            [
                'nama_supir' => 'Baso Ridwan',
                'no_telp' => '085298765432',
                'username' => 'supir2',
                'password' => bcrypt('supir123'),
            ]
        );

        // 6. Sample Jadwal (assigned to supirs)
        Jadwal::updateOrCreate(
            ['id_jadwal' => 1],
            [
                'id_bus' => $bus1->id_bus,
                'id_rute' => $rute1->id_rute,
                'id_admin' => $admin->id_admin,
                'id_supir' => $supir1->id_supir,
                'tanggal' => now()->toDateString(),
                'jam_keberangkatan' => '08:00',
                'jam_kedatangan' => '11:30',
                'status_bus' => 'menunggu',
                'keterangan' => 'Keberangkatan Pagi Reguler DAMRI',
            ]
        );

        Jadwal::updateOrCreate(
            ['id_jadwal' => 2],
            [
                'id_bus' => $bus2->id_bus,
                'id_rute' => $rute2->id_rute,
                'id_admin' => $admin->id_admin,
                'id_supir' => $supir2->id_supir,
                'tanggal' => now()->toDateString(),
                'jam_keberangkatan' => '10:00',
                'jam_kedatangan' => '16:00',
                'status_bus' => 'menunggu',
                'keterangan' => 'Keberangkatan Siang Bintang Prima',
            ]
        );

        // 7. Sample Laporan
        Laporan::updateOrCreate(
            ['id_laporan' => 1],
            [
                'id_admin' => $admin->id_admin,
                'tanggal_laporan' => now()->toDateString(),
                'periode_awal' => now()->startOfMonth()->toDateString(),
                'jenis_laporan' => 'Jadwal Keberangkatan Bus',
                'file_pdf' => null,
                'nama_po' => 'PO DAMRI',
                'nomor_polisi' => 'DD 1234 AB',
                'asal' => 'Parepare',
                'tujuan' => 'Makassar',
                'nama_supir' => 'Budi Santoso',
                'seat' => 30,
                'pnp' => 25,
                'naik' => 5,
                'turun' => 0,
                'akap_akdp' => 'AKDP',
            ]
        );
    }
}
