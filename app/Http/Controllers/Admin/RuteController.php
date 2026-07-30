<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Rute;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RuteController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/rute/index', [
            'rutes' => Rute::orderBy('asal')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/rute/form', [
            'rute' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'asal'            => 'required|string|max:255',
            'tujuan'          => 'required|string|max:255',
            'keterangan_rute' => 'nullable|string',
        ]);

        Rute::create($validated);

        return redirect()->route('admin.rute.index')
            ->with('success', 'Rute berhasil ditambahkan.');
    }

    public function edit(Rute $rute): Response
    {
        return Inertia::render('admin/rute/form', [
            'rute' => $rute,
        ]);
    }

    public function update(Request $request, Rute $rute): RedirectResponse
    {
        $validated = $request->validate([
            'asal'            => 'required|string|max:255',
            'tujuan'          => 'required|string|max:255',
            'keterangan_rute' => 'nullable|string',
        ]);

        $rute->update($validated);

        return redirect()->route('admin.rute.index')
            ->with('success', 'Rute berhasil diperbarui.');
    }

    public function destroy(Rute $rute): RedirectResponse
    {
        $rute->delete();

        return redirect()->route('admin.rute.index')
            ->with('success', 'Rute berhasil dihapus.');
    }
}
