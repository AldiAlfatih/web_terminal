<?php

namespace App\Http\Controllers;

use App\Models\Jadwal;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicController extends Controller
{
    /**
     * Public Homepage: Schedule board for passengers.
     */
    public function home(Request $request): Response
    {
        $search = $request->input('search');
        $today = now()->toDateString();

        $query = Jadwal::with(['bus.poBus', 'rute'])
            ->orderBy('tanggal', 'desc')
            ->orderBy('jam_keberangkatan', 'asc');

        if ($search) {
            $query->whereHas('bus', function ($q) use ($search) {
                $q->where('nama_bus', 'like', "%{$search}%")
                  ->orWhere('nomor_polisi', 'like', "%{$search}%");
            })->orWhereHas('rute', function ($q) use ($search) {
                $q->where('asal', 'like', "%{$search}%")
                  ->orWhere('tujuan', 'like', "%{$search}%");
            });
        }

        return Inertia::render('welcome', [
            'jadwals' => $query->get(),
            'search'  => $search ?? '',
        ]);
    }

    /**
     * Passenger Live Map Tracking View.
     */
    public function trackMap(int $id_jadwal): Response
    {
        $jadwal = Jadwal::with(['bus.poBus', 'rute'])
            ->findOrFail($id_jadwal);

        return Inertia::render('penumpang/tracking-map', [
            'jadwal' => $jadwal,
        ]);
    }
}
