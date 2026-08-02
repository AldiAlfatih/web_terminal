<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bus;
use App\Models\Jadwal;
use App\Models\Laporan;
use App\Models\PoBus;
use App\Models\Supir;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class LaporanController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/laporan/index', [
            'laporans' => Laporan::with('admin')
                ->orderBy('tanggal_laporan', 'desc')
                ->orderBy('id_laporan', 'desc')
                ->get(),
        ]);
    }

    public function create(): Response
    {
        $todayStr = now()->toDateString();
        $firstDayOfMonth = now()->startOfMonth()->toDateString();

        return Inertia::render('admin/laporan/form', [
            'laporan' => null,
            'defaultDates' => [
                'periode_awal' => $firstDayOfMonth,
                'tanggal_laporan' => $todayStr,
            ],
            'jenisOptions' => [
                'Jadwal Keberangkatan Bus',
                'Daftar Armada Bus',
                'Aktivitas & Data Supir',
                'Data Perusahaan Otobus (PO)',
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'jenis_laporan' => 'required|string|max:255',
            'periode_awal' => 'required|date',
            'tanggal_laporan' => 'required|date|after_or_equal:periode_awal',
            'file_pdf' => 'nullable|file|mimes:pdf|max:10240',
        ]);

        $validated['id_admin'] = Auth::id();

        if ($request->hasFile('file_pdf')) {
            $path = $request->file('file_pdf')->store('laporan', 'public');
            $validated['file_pdf'] = '/storage/'.$path;
        }

        Laporan::create($validated);

        return redirect()->route('admin.laporan.index')
            ->with('success', 'Laporan PDF berhasil ditambahkan.');
    }

    public function show(Laporan $laporan): Response
    {
        $laporan->load('admin');

        // Fetch contextual data based on report type & date range for printable report view
        $reportData = $this->getReportData($laporan);

        return Inertia::render('admin/laporan/show', [
            'laporan' => $laporan,
            'reportData' => $reportData,
        ]);
    }

    public function edit(Laporan $laporan): Response
    {
        return Inertia::render('admin/laporan/form', [
            'laporan' => $laporan->load('admin'),
            'jenisOptions' => [
                'Jadwal Keberangkatan Bus',
                'Daftar Armada Bus',
                'Aktivitas & Data Supir',
                'Data Perusahaan Otobus (PO)',
            ],
        ]);
    }

    public function update(Request $request, Laporan $laporan): RedirectResponse
    {
        $validated = $request->validate([
            'jenis_laporan' => 'required|string|max:255',
            'periode_awal' => 'required|date',
            'tanggal_laporan' => 'required|date|after_or_equal:periode_awal',
            'file_pdf' => 'nullable|file|mimes:pdf|max:10240',
        ]);

        if ($request->hasFile('file_pdf')) {
            // Delete old file if exists
            if ($laporan->file_pdf && str_contains($laporan->file_pdf, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $laporan->file_pdf);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('file_pdf')->store('laporan', 'public');
            $validated['file_pdf'] = '/storage/'.$path;
        }

        $laporan->update($validated);

        return redirect()->route('admin.laporan.index')
            ->with('success', 'Laporan PDF berhasil diperbarui.');
    }

    public function destroy(Laporan $laporan): RedirectResponse
    {
        if ($laporan->file_pdf && str_contains($laporan->file_pdf, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $laporan->file_pdf);
            Storage::disk('public')->delete($oldPath);
        }

        $laporan->delete();

        return redirect()->route('admin.laporan.index')
            ->with('success', 'Laporan berhasil dihapus.');
    }

    /**
     * Helper to gather contextual data for report rendering.
     */
    private function getReportData(Laporan $laporan): array
    {
        $start = $laporan->periode_awal;
        $end = $laporan->tanggal_laporan;

        switch ($laporan->jenis_laporan) {
            case 'Jadwal Keberangkatan Bus':
                return [
                    'jadwals' => Jadwal::with(['bus.poBus', 'rute', 'supir'])
                        ->whereBetween('tanggal', [$start, $end])
                        ->orderBy('tanggal', 'desc')
                        ->orderBy('jam_keberangkatan')
                        ->get(),
                ];

            case 'Daftar Armada Bus':
                return [
                    'buses' => Bus::with('poBus')->orderBy('nama_bus')->get(),
                ];

            case 'Aktivitas & Data Supir':
                return [
                    'supirs' => Supir::withCount('jadwals')->orderBy('nama_supir')->get(),
                ];

            case 'Data Perusahaan Otobus (PO)':
                return [
                    'poBuses' => PoBus::withCount('buses')->orderBy('nama_po')->get(),
                ];

            default:
                return [];
        }
    }
}
