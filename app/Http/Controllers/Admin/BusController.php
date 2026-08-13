<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bus;
use App\Models\PoBus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BusController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/bus/index', [
            'buses' => Bus::with('poBus')->orderBy('nama_bus')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/bus/form', [
            'bus' => null,
            'poBuses' => PoBus::orderBy('nama_po')->get(['id_po', 'nama_po']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id_po' => 'required|exists:po_bus,id_po',
            'nama_bus' => 'required|string|max:255',
            'nomor_polisi' => 'required|string|max:20',
        ]);

        Bus::create($validated);

        return redirect()->route('admin.bus.index')
            ->with('success', 'Bus berhasil ditambahkan.');
    }

    public function edit(Bus $bus): Response
    {
        return Inertia::render('admin/bus/form', [
            'bus' => $bus->load('poBus'),
            'poBuses' => PoBus::orderBy('nama_po')->get(['id_po', 'nama_po']),
        ]);
    }

    public function update(Request $request, Bus $bus): RedirectResponse
    {
        $validated = $request->validate([
            'id_po' => 'required|exists:po_bus,id_po',
            'nama_bus' => 'required|string|max:255',
            'nomor_polisi' => 'required|string|max:20',
        ]);

        $bus->update($validated);

        return redirect()->route('admin.bus.index')
            ->with('success', 'Bus berhasil diperbarui.');
    }

    public function destroy(Bus $bus): RedirectResponse
    {
        $bus->delete();

        return redirect()->route('admin.bus.index')
            ->with('success', 'Bus berhasil dihapus.');
    }
}
