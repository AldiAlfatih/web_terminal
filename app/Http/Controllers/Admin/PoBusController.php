<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PoBus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PoBusController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/po-bus/index', [
            'poBuses' => PoBus::orderBy('nama_po')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/po-bus/form', [
            'poBus' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_po' => 'required|string|max:255',
            'alamat_po' => 'required|string',
            'no_telp_po' => 'required|string|max:20',
        ]);

        PoBus::create($validated);

        return redirect()->route('admin.po-bus.index')
            ->with('success', 'Perusahaan Otobus berhasil ditambahkan.');
    }

    public function edit(PoBus $poBus): Response
    {
        return Inertia::render('admin/po-bus/form', [
            'poBus' => $poBus,
        ]);
    }

    public function update(Request $request, PoBus $poBus): RedirectResponse
    {
        $validated = $request->validate([
            'nama_po' => 'required|string|max:255',
            'alamat_po' => 'required|string',
            'no_telp_po' => 'required|string|max:20',
        ]);

        $poBus->update($validated);

        return redirect()->route('admin.po-bus.index')
            ->with('success', 'Perusahaan Otobus berhasil diperbarui.');
    }

    public function destroy(PoBus $poBus): RedirectResponse
    {
        $poBus->delete();

        return redirect()->route('admin.po-bus.index')
            ->with('success', 'Perusahaan Otobus berhasil dihapus.');
    }
}
