<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Supir;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class SupirController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/supir/index', [
            'supirs' => Supir::orderBy('nama_supir')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/supir/form', [
            'supir' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_supir' => 'required|string|max:255',
            'no_telp' => 'required|string|max:20',
            'username' => 'required|string|max:100|unique:supir,username',
            'password' => 'required|string|min:6',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        Supir::create($validated);

        return redirect()->route('admin.supir.index')
            ->with('success', 'Supir berhasil ditambahkan.');
    }

    public function edit(Supir $supir): Response
    {
        return Inertia::render('admin/supir/form', [
            'supir' => $supir,
        ]);
    }

    public function update(Request $request, Supir $supir): RedirectResponse
    {
        $validated = $request->validate([
            'nama_supir' => 'required|string|max:255',
            'no_telp' => 'required|string|max:20',
            'username' => 'required|string|max:100|unique:supir,username,'.$supir->id_supir.',id_supir',
            'password' => 'nullable|string|min:6',
        ]);

        if (empty($validated['password'])) {
            unset($validated['password']);
        } else {
            $validated['password'] = Hash::make($validated['password']);
        }

        $supir->update($validated);

        return redirect()->route('admin.supir.index')
            ->with('success', 'Data supir berhasil diperbarui.');
    }

    public function destroy(Supir $supir): RedirectResponse
    {
        $supir->delete();

        return redirect()->route('admin.supir.index')
            ->with('success', 'Supir berhasil dihapus.');
    }
}
