<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bus;
use App\Models\Jadwal;
use App\Models\Rute;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class JadwalController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/jadwal/index', [
            'jadwals' => Jadwal::with(['bus.poBus', 'rute'])
                ->orderBy('tanggal', 'desc')
                ->orderBy('jam_keberangkatan')
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/jadwal/form', [
            'jadwal' => null,
            'buses'  => Bus::with('poBus')->orderBy('nama_bus')->get(['id_bus', 'nama_bus', 'nomor_polisi', 'id_po']),
            'rutes'  => Rute::orderBy('asal')->get(['id_rute', 'asal', 'tujuan']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id_bus'           => 'required|exists:bus,id_bus',
            'id_rute'          => 'required|exists:rute,id_rute',
            'tanggal'          => 'required|date',
            'jam_keberangkatan'=> 'required|date_format:H:i',
            'jam_kedatangan'   => 'required|date_format:H:i',
            'status_bus'       => 'required|in:menunggu,berangkat,selesai',
            'keterangan'       => 'nullable|string',
        ]);

        // Automatically assign to the authenticated admin
        $validated['id_admin'] = Auth::id();

        Jadwal::create($validated);

        return redirect()->route('admin.jadwal.index')
            ->with('success', 'Jadwal berhasil ditambahkan.');
    }

    public function edit(Jadwal $jadwal): Response
    {
        return Inertia::render('admin/jadwal/form', [
            'jadwal' => $jadwal->load(['bus', 'rute']),
            'buses'  => Bus::with('poBus')->orderBy('nama_bus')->get(['id_bus', 'nama_bus', 'nomor_polisi', 'id_po']),
            'rutes'  => Rute::orderBy('asal')->get(['id_rute', 'asal', 'tujuan']),
        ]);
    }

    public function update(Request $request, Jadwal $jadwal): RedirectResponse
    {
        $validated = $request->validate([
            'id_bus'           => 'required|exists:bus,id_bus',
            'id_rute'          => 'required|exists:rute,id_rute',
            'tanggal'          => 'required|date',
            'jam_keberangkatan'=> 'required|date_format:H:i',
            'jam_kedatangan'   => 'required|date_format:H:i',
            'status_bus'       => 'required|in:menunggu,berangkat,selesai',
            'keterangan'       => 'nullable|string',
        ]);

        $jadwal->update($validated);

        return redirect()->route('admin.jadwal.index')
            ->with('success', 'Jadwal berhasil diperbarui.');
    }

    public function destroy(Jadwal $jadwal): RedirectResponse
    {
        $jadwal->delete();

        return redirect()->route('admin.jadwal.index')
            ->with('success', 'Jadwal berhasil dihapus.');
    }
}
