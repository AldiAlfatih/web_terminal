<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bus;
use App\Models\Jadwal;
use App\Models\Laporan;
use App\Models\PoBus;
use App\Models\Rute;
use App\Models\Supir;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $today = now()->toDateString();

        return Inertia::render('dashboard', [
            'stats' => [
                'total_bus' => Bus::count(),
                'total_po' => PoBus::count(),
                'total_supir' => Supir::count(),
                'total_rute' => Rute::count(),
                'total_jadwal' => Jadwal::count(),
                'total_laporan' => Laporan::count(),
                'jadwal_hari_ini' => Jadwal::whereDate('tanggal', $today)->count(),
                'sedang_berangkat' => Jadwal::where('status_bus', 'berangkat')->count(),
                'menunggu' => Jadwal::where('status_bus', 'menunggu')->whereDate('tanggal', $today)->count(),
                'selesai_hari_ini' => Jadwal::where('status_bus', 'selesai')->whereDate('tanggal', $today)->count(),
            ],
            'jadwal_terbaru' => Jadwal::with(['bus', 'rute'])
                ->whereDate('tanggal', $today)
                ->orderBy('jam_keberangkatan')
                ->limit(5)
                ->get(),
        ]);
    }
}
