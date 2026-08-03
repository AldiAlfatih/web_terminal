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

        $jadwalHariIniCount = Jadwal::whereDate('tanggal', $today)->count();
        $totalJadwal = Jadwal::count();

        // Fetch today's schedules, or fallback to latest schedules if no schedules specific to today's date
        $jadwalTerbaru = Jadwal::with(['bus.poBus', 'rute', 'supir'])
            ->whereDate('tanggal', $today)
            ->orderBy('jam_keberangkatan')
            ->get();

        if ($jadwalTerbaru->isEmpty()) {
            $jadwalTerbaru = Jadwal::with(['bus.poBus', 'rute', 'supir'])
                ->orderBy('tanggal', 'desc')
                ->orderBy('jam_keberangkatan')
                ->limit(5)
                ->get();
        }

        return Inertia::render('dashboard', [
            'stats' => [
                'total_bus' => Bus::count(),
                'total_po' => PoBus::count(),
                'total_supir' => Supir::count(),
                'total_rute' => Rute::count(),
                'total_jadwal' => $totalJadwal,
                'total_laporan' => Laporan::count(),
                'jadwal_hari_ini' => $jadwalHariIniCount > 0 ? $jadwalHariIniCount : $totalJadwal,
                'sedang_berangkat' => Jadwal::where('status_bus', 'berangkat')->count(),
                'menunggu' => Jadwal::where('status_bus', 'menunggu')->count(),
                'selesai_hari_ini' => Jadwal::where('status_bus', 'selesai')->count(),
            ],
            'jadwal_terbaru' => $jadwalTerbaru,
        ]);
    }
}
