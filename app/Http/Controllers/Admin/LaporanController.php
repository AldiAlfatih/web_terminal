<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bus;
use App\Models\Jadwal;
use App\Models\Laporan;
use App\Models\PoBus;
use App\Models\Rute;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class LaporanController extends Controller
{
    /**
     * Halaman 1: "Semua Laporan Harian"
     * Rekapitulasi kelompok laporan harian dengan Filter Periode (Tanggal, Bulan, Tahun).
     */
    public function index(Request $request): Response
    {
        $query = Laporan::query();

        // Period Filters
        if ($request->filled('tanggal')) {
            $query->whereDate(DB::raw('COALESCE(submitted_at, tanggal_laporan, created_at)'), $request->tanggal);
        }
        if ($request->filled('bulan')) {
            $query->whereMonth(DB::raw('COALESCE(submitted_at, tanggal_laporan, created_at)'), (int) $request->bulan);
        }
        if ($request->filled('tahun')) {
            $query->whereYear(DB::raw('COALESCE(submitted_at, tanggal_laporan, created_at)'), (int) $request->tahun);
        }

        // Group by Date query
        $groupedQuery = (clone $query)
            ->select([
                DB::raw('DATE(COALESCE(submitted_at, tanggal_laporan, created_at)) as date_group'),
                DB::raw('COUNT(*) as total_laporan'),
                DB::raw('SUM(COALESCE(pnp, 0)) as total_pnp'),
                DB::raw('SUM(COALESCE(seat, 0)) as total_seat'),
                DB::raw('SUM(COALESCE(naik, 0)) as total_naik'),
                DB::raw('SUM(COALESCE(turun, 0)) as total_turun'),
                DB::raw("SUM(CASE WHEN akap_akdp = 'AKAP' THEN 1 ELSE 0 END) as total_akap"),
                DB::raw("SUM(CASE WHEN akap_akdp = 'AKDP' THEN 1 ELSE 0 END) as total_akdp"),
            ])
            ->groupBy(DB::raw('DATE(COALESCE(submitted_at, tanggal_laporan, created_at))'))
            ->orderBy(DB::raw('DATE(COALESCE(submitted_at, tanggal_laporan, created_at))'), 'desc');

        $groupedLaporans = $groupedQuery->paginate(15)->withQueryString();

        // Available years option
        $years = range(now()->year + 1, 2024);

        return Inertia::render('admin/laporan/index', [
            'groupedLaporans' => $groupedLaporans,
            'filters' => [
                'tanggal' => $request->input('tanggal', ''),
                'bulan' => $request->input('bulan', ''),
                'tahun' => $request->input('tahun', ''),
            ],
            'options' => [
                'years' => $years,
                'months' => [
                    1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
                    5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
                    9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember',
                ],
            ],
        ]);
    }

    /**
     * Halaman 2: "Detail Laporan Harian"
     * Menampilkan SELURUH record laporan pada tanggal tertentu + Filter Operasional.
     */
    public function detailDate(string $tanggal, Request $request): Response
    {
        $query = Laporan::with('admin')
            ->whereDate(DB::raw('COALESCE(submitted_at, tanggal_laporan, created_at)'), $tanggal);

        // Operational Filters for this date
        if ($request->filled('nama_po')) {
            $query->where('nama_po', 'LIKE', '%'.$request->nama_po.'%');
        }
        if ($request->filled('nomor_polisi')) {
            $query->where('nomor_polisi', 'LIKE', '%'.$request->nomor_polisi.'%');
        }
        if ($request->filled('asal')) {
            $query->where('asal', 'LIKE', '%'.$request->asal.'%');
        }
        if ($request->filled('tujuan')) {
            $query->where('tujuan', 'LIKE', '%'.$request->tujuan.'%');
        }
        if ($request->filled('akap_akdp')) {
            $query->where('akap_akdp', $request->akap_akdp);
        }

        $laporans = $query->orderBy('submitted_at', 'asc')->orderBy('id_laporan', 'asc')->get();

        // Calculate total summary statistics dynamically from filtered collection
        $summary = [
            'total_perjalanan' => $laporans->count(),
            'total_seat' => (int) $laporans->sum('seat'),
            'total_pnp' => (int) $laporans->sum('pnp'),
            'total_naik' => (int) $laporans->sum('naik'),
            'total_turun' => (int) $laporans->sum('turun'),
            'total_akap' => (int) $laporans->where('akap_akdp', 'AKAP')->count(),
            'total_akdp' => (int) $laporans->where('akap_akdp', 'AKDP')->count(),
        ];

        $formattedTanggal = Carbon::parse($tanggal)->locale('id')->translatedFormat('d F Y');

        // Master data options for operational filters
        $poOptions = PoBus::orderBy('nama_po')->pluck('nama_po')->unique()->values();
        $platOptions = Bus::orderBy('nomor_polisi')->pluck('nomor_polisi')->unique()->values();
        $asalOptions = Rute::orderBy('asal')->pluck('asal')->unique()->values();
        $tujuanOptions = Rute::orderBy('tujuan')->pluck('tujuan')->unique()->values();

        return Inertia::render('admin/laporan/detail', [
            'tanggal' => $tanggal,
            'formattedTanggal' => $formattedTanggal,
            'summary' => $summary,
            'laporans' => $laporans,
            'filters' => [
                'nama_po' => $request->input('nama_po', ''),
                'nomor_polisi' => $request->input('nomor_polisi', ''),
                'asal' => $request->input('asal', ''),
                'tujuan' => $request->input('tujuan', ''),
                'akap_akdp' => $request->input('akap_akdp', ''),
            ],
            'options' => [
                'poList' => $poOptions,
                'platList' => $platOptions,
                'asalList' => $asalOptions,
                'tujuanList' => $tujuanOptions,
            ],
        ]);
    }

    /**
     * Form Pembuatan PDF (Menentukan Periode Harian vs Bulanan & Format)
     */
    public function pdfForm(): Response
    {
        $years = range(now()->year + 1, 2024);

        return Inertia::render('admin/laporan/pdf-form', [
            'defaultDate' => now()->toDateString(),
            'defaultMonth' => (int) now()->month,
            'defaultYear' => (int) now()->year,
            'years' => $years,
            'months' => [
                1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
                5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
                9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember',
            ],
        ]);
    }

    /**
     * Preview PDF sebelum diunduh / disimpan
     */
    public function previewPdf(Request $request): Response
    {
        $mode = $request->input('mode', 'harian');
        $tanggal = $request->input('tanggal', now()->toDateString());
        $bulan = (int) $request->input('bulan', now()->month);
        $tahun = (int) $request->input('tahun', now()->year);
        $formatBulanan = $request->input('format_bulanan', 'separate'); // 'separate' or 'merged'

        $monthNames = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember',
        ];

        $query = Laporan::with('admin');

        if ($mode === 'harian') {
            $query->whereDate(DB::raw('COALESCE(submitted_at, tanggal_laporan, created_at)'), $tanggal);
            $formattedPeriode = Carbon::parse($tanggal)->locale('id')->translatedFormat('d F Y');
            $filename = 'Laporan_Harian_Operasional_'.Carbon::parse($tanggal)->format('d-m-Y').'.pdf';
        } else {
            $query->whereYear(DB::raw('COALESCE(submitted_at, tanggal_laporan, created_at)'), $tahun)
                ->whereMonth(DB::raw('COALESCE(submitted_at, tanggal_laporan, created_at)'), $bulan);

            $monthName = $monthNames[$bulan] ?? 'Bulan';
            $formattedPeriode = "Agustus {$tahun}";
            if (isset($monthNames[$bulan])) {
                $startOfMonth = Carbon::createFromDate($tahun, $bulan, 1)->locale('id')->translatedFormat('d F Y');
                $endOfMonth = Carbon::createFromDate($tahun, $bulan, 1)->endOfMonth()->locale('id')->translatedFormat('d F Y');
                $formattedPeriode = "{$startOfMonth} – {$endOfMonth}";
            }
            $filename = "Laporan_Bulanan_Operasional_{$monthName}-{$tahun}.pdf";
        }

        $laporans = $query->orderBy('submitted_at', 'asc')->orderBy('id_laporan', 'asc')->get();

        $summary = [
            'total_perjalanan' => $laporans->count(),
            'total_seat' => (int) $laporans->sum('seat'),
            'total_pnp' => (int) $laporans->sum('pnp'),
            'total_naik' => (int) $laporans->sum('naik'),
            'total_turun' => (int) $laporans->sum('turun'),
            'total_akap' => (int) $laporans->where('akap_akdp', 'AKAP')->count(),
            'total_akdp' => (int) $laporans->where('akap_akdp', 'AKDP')->count(),
        ];

        // Grouping for monthly 'separate' format
        $groupedByDate = [];
        if ($mode === 'bulanan' && $formatBulanan === 'separate') {
            $groupedByDate = $laporans->groupBy(function ($item) {
                if ($item->submitted_at) {
                    return $item->submitted_at->toDateString();
                }
                if ($item->tanggal_laporan) {
                    return $item->tanggal_laporan->toDateString();
                }

                return $item->created_at->toDateString();
            })->map(function ($items, $dateKey) {
                return [
                    'date' => $dateKey,
                    'formattedDate' => Carbon::parse($dateKey)->locale('id')->translatedFormat('d F Y'),
                    'items' => $items->values(),
                    'total_seat' => (int) $items->sum('seat'),
                    'total_pnp' => (int) $items->sum('pnp'),
                    'total_naik' => (int) $items->sum('naik'),
                    'total_turun' => (int) $items->sum('turun'),
                    'total_akap' => (int) $items->where('akap_akdp', 'AKAP')->count(),
                    'total_akdp' => (int) $items->where('akap_akdp', 'AKDP')->count(),
                ];
            })->values()->toArray();
        }

        $documentDate = Carbon::now()->locale('id')->translatedFormat('d F Y');

        return Inertia::render('admin/laporan/preview', [
            'mode' => $mode,
            'tanggal' => $tanggal,
            'bulan' => $bulan,
            'tahun' => $tahun,
            'formatBulanan' => $formatBulanan,
            'formattedPeriode' => $formattedPeriode,
            'documentDate' => $documentDate,
            'filename' => $filename,
            'summary' => $summary,
            'laporans' => $laporans,
            'groupedByDate' => $groupedByDate,
        ]);
    }

    /**
     * Download file PDF langsung (Direct PDF Binary Stream).
     */
    public function downloadPdf(Request $request)
    {
        $mode = $request->input('mode', 'harian');
        $tanggal = $request->input('tanggal', now()->toDateString());
        $bulan = (int) $request->input('bulan', now()->month);
        $tahun = (int) $request->input('tahun', now()->year);
        $formatBulanan = $request->input('format_bulanan', 'separate');

        $monthNames = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember',
        ];

        $query = Laporan::with('admin');

        if ($mode === 'harian') {
            $query->whereDate(DB::raw('COALESCE(submitted_at, tanggal_laporan, created_at)'), $tanggal);
            $formattedPeriode = Carbon::parse($tanggal)->locale('id')->translatedFormat('d F Y');
            $filename = 'Laporan_Harian_Operasional_'.Carbon::parse($tanggal)->format('d-m-Y').'.pdf';
        } else {
            $query->whereYear(DB::raw('COALESCE(submitted_at, tanggal_laporan, created_at)'), $tahun)
                ->whereMonth(DB::raw('COALESCE(submitted_at, tanggal_laporan, created_at)'), $bulan);

            $monthName = $monthNames[$bulan] ?? 'Bulan';
            $formattedPeriode = "Agustus {$tahun}";
            if (isset($monthNames[$bulan])) {
                $startOfMonth = Carbon::createFromDate($tahun, $bulan, 1)->locale('id')->translatedFormat('d F Y');
                $endOfMonth = Carbon::createFromDate($tahun, $bulan, 1)->endOfMonth()->locale('id')->translatedFormat('d F Y');
                $formattedPeriode = "{$startOfMonth} – {$endOfMonth}";
            }
            $filename = "Laporan_Bulanan_Operasional_{$monthName}-{$tahun}.pdf";
        }

        $laporans = $query->orderBy('submitted_at', 'asc')->orderBy('id_laporan', 'asc')->get();

        $summary = [
            'total_perjalanan' => $laporans->count(),
            'total_seat' => (int) $laporans->sum('seat'),
            'total_pnp' => (int) $laporans->sum('pnp'),
            'total_naik' => (int) $laporans->sum('naik'),
            'total_turun' => (int) $laporans->sum('turun'),
            'total_akap' => (int) $laporans->where('akap_akdp', 'AKAP')->count(),
            'total_akdp' => (int) $laporans->where('akap_akdp', 'AKDP')->count(),
        ];

        $groupedByDate = [];
        if ($mode === 'bulanan' && $formatBulanan === 'separate') {
            $groupedByDate = $laporans->groupBy(function ($item) {
                if ($item->submitted_at) {
                    return $item->submitted_at->toDateString();
                }
                if ($item->tanggal_laporan) {
                    return $item->tanggal_laporan->toDateString();
                }

                return $item->created_at->toDateString();
            })->map(function ($items, $dateKey) {
                return [
                    'date' => $dateKey,
                    'formattedDate' => Carbon::parse($dateKey)->locale('id')->translatedFormat('d F Y'),
                    'items' => $items->values(),
                    'total_seat' => (int) $items->sum('seat'),
                    'total_pnp' => (int) $items->sum('pnp'),
                    'total_naik' => (int) $items->sum('naik'),
                    'total_turun' => (int) $items->sum('turun'),
                    'total_akap' => (int) $items->where('akap_akdp', 'AKAP')->count(),
                    'total_akdp' => (int) $items->where('akap_akdp', 'AKDP')->count(),
                ];
            })->values()->toArray();
        }

        $documentDate = Carbon::now()->locale('id')->translatedFormat('d F Y');

        $pdf = Pdf::loadView('pdf.laporan', [
            'mode' => $mode,
            'tanggal' => $tanggal,
            'bulan' => $bulan,
            'tahun' => $tahun,
            'formatBulanan' => $formatBulanan,
            'formattedPeriode' => $formattedPeriode,
            'documentDate' => $documentDate,
            'filename' => $filename,
            'summary' => $summary,
            'laporans' => $laporans,
            'groupedByDate' => $groupedByDate,
        ])->setPaper('a4', 'landscape');

        return $pdf->download($filename);
    }

    /**
     * Form Buat Laporan Baru (+ Buat Laporan)
     */
    public function create(): Response
    {
        $ongoingTrips = $this->getOngoingTrips();

        return Inertia::render('admin/laporan/form', [
            'laporan' => null,
            'ongoingTrips' => $ongoingTrips,
            'poList' => PoBus::orderBy('nama_po')->pluck('nama_po'),
            'platList' => Bus::orderBy('nomor_polisi')->pluck('nomor_polisi'),
            'asalList' => Rute::orderBy('asal')->pluck('asal')->unique()->values(),
            'tujuanList' => Rute::orderBy('tujuan')->pluck('tujuan')->unique()->values(),
        ]);
    }

    /**
     * Submit Form Laporan Baru (1 Submit = 1 Record Laporan)
     */
    public function store(Request $request): RedirectResponse
    {
        $sourceType = $request->input('source_type', 'trip');

        if ($sourceType === 'trip') {
            $request->validate([
                'source_type' => 'required|in:trip,manual',
                'source_trip_id' => 'required|exists:jadwal,id_jadwal',
                'nama_supir' => 'required|string|max:255',
                'seat' => 'required|integer|min:0',
                'pnp' => 'required|integer|min:0',
                'naik' => 'required|integer|min:0',
                'turun' => 'required|integer|min:0',
                'akap_akdp' => 'required|in:AKAP,AKDP',
            ]);

            $trip = Jadwal::with(['bus.poBus', 'rute', 'supir'])->findOrFail($request->source_trip_id);

            $namaPo = $trip->bus->poBus->nama_po ?? ($request->nama_po ?? '-');
            $nomorPolisi = $trip->bus->nomor_polisi ?? ($request->nomor_polisi ?? '-');
            $asal = $trip->rute->asal ?? ($request->asal ?? '-');
            $tujuan = $trip->rute->tujuan ?? ($request->tujuan ?? '-');
        } else {
            $validatedManual = $request->validate([
                'source_type' => 'required|in:trip,manual',
                'nama_po' => 'required|string|max:255',
                'nomor_polisi' => 'required|string|max:255',
                'asal' => 'required|string|max:255',
                'tujuan' => 'required|string|max:255',
                'nama_supir' => 'required|string|max:255',
                'seat' => 'required|integer|min:0',
                'pnp' => 'required|integer|min:0',
                'naik' => 'required|integer|min:0',
                'turun' => 'required|integer|min:0',
                'akap_akdp' => 'required|in:AKAP,AKDP',
            ]);

            $namaPo = $validatedManual['nama_po'];
            $nomorPolisi = $validatedManual['nomor_polisi'];
            $asal = $validatedManual['asal'];
            $tujuan = $validatedManual['tujuan'];
        }

        $now = now();

        Laporan::create([
            'id_admin' => Auth::id(),
            'source_type' => $sourceType,
            'source_trip_id' => $sourceType === 'trip' ? $request->source_trip_id : null,
            'submitted_at' => $now,
            'tanggal_laporan' => $now->toDateString(),
            'periode_awal' => $now->toDateString(),
            'jenis_laporan' => 'Laporan Operasional Bus ('.$request->akap_akdp.')',
            'nama_po' => $namaPo,
            'nomor_polisi' => $nomorPolisi,
            'asal' => $asal,
            'tujuan' => $tujuan,
            'nama_supir' => $request->nama_supir,
            'seat' => (int) $request->seat,
            'pnp' => (int) $request->pnp,
            'naik' => (int) $request->naik,
            'turun' => (int) $request->turun,
            'akap_akdp' => $request->akap_akdp,
        ]);

        return redirect()->route('admin.laporan.detail', $now->toDateString())
            ->with('success', 'Laporan operasional perjalanan berhasil ditambahkan.');
    }

    /**
     * Form Edit Laporan
     */
    public function edit(Laporan $laporan): Response
    {
        $ongoingTrips = $this->getOngoingTrips();

        return Inertia::render('admin/laporan/form', [
            'laporan' => $laporan,
            'ongoingTrips' => $ongoingTrips,
            'poList' => PoBus::orderBy('nama_po')->pluck('nama_po'),
            'platList' => Bus::orderBy('nomor_polisi')->pluck('nomor_polisi'),
            'asalList' => Rute::orderBy('asal')->pluck('asal')->unique()->values(),
            'tujuanList' => Rute::orderBy('tujuan')->pluck('tujuan')->unique()->values(),
        ]);
    }

    /**
     * Update Record Laporan
     */
    public function update(Request $request, Laporan $laporan): RedirectResponse
    {
        $validated = $request->validate([
            'nama_po' => 'required|string|max:255',
            'nomor_polisi' => 'required|string|max:255',
            'asal' => 'required|string|max:255',
            'tujuan' => 'required|string|max:255',
            'nama_supir' => 'required|string|max:255',
            'seat' => 'required|integer|min:0',
            'pnp' => 'required|integer|min:0',
            'naik' => 'required|integer|min:0',
            'turun' => 'required|integer|min:0',
            'akap_akdp' => 'required|in:AKAP,AKDP',
        ]);

        $laporan->update($validated);

        $targetDate = $laporan->submitted_at ? $laporan->submitted_at->toDateString() : ($laporan->tanggal_laporan ? $laporan->tanggal_laporan->toDateString() : now()->toDateString());

        return redirect()->route('admin.laporan.detail', $targetDate)
            ->with('success', 'Laporan operasional berhasil diperbarui.');
    }

    /**
     * Show single record (or redirect to date detail)
     */
    public function show(Laporan $laporan): Response|RedirectResponse
    {
        $targetDate = $laporan->submitted_at ? $laporan->submitted_at->toDateString() : ($laporan->tanggal_laporan ? $laporan->tanggal_laporan->toDateString() : now()->toDateString());

        return redirect()->route('admin.laporan.detail', $targetDate);
    }

    /**
     * Hapus Record Laporan
     * TIDAK MENGHAPUS data Perjalanan, Bus, Supir, PO, Rute.
     */
    public function destroy(Laporan $laporan): RedirectResponse
    {
        $targetDate = $laporan->submitted_at ? $laporan->submitted_at->toDateString() : ($laporan->tanggal_laporan ? $laporan->tanggal_laporan->toDateString() : now()->toDateString());

        $laporan->delete();

        return redirect()->route('admin.laporan.detail', $targetDate)
            ->with('success', 'Record laporan berhasil dihapus.');
    }

    /**
     * Helper: Fetch list of active/ongoing trips from "Mulai Perjalanan" feature.
     */
    private function getOngoingTrips(): array
    {
        $trips = Jadwal::with(['bus.poBus', 'rute', 'supir'])
            ->where('status_bus', 'berangkat')
            ->orderBy('tanggal', 'desc')
            ->orderBy('jam_keberangkatan', 'asc')
            ->get();

        return $trips->map(function ($t) {
            $poName = $t->bus->poBus->nama_po ?? 'PO-Unknown';
            $plat = $t->bus->nomor_polisi ?? '-';
            $asal = $t->rute->asal ?? '-';
            $tujuan = $t->rute->tujuan ?? '-';
            $supirName = $t->supir->nama_supir ?? '';

            return [
                'id_jadwal' => $t->id_jadwal,
                'label' => "{$poName} — {$plat} — {$asal} → {$tujuan}",
                'nama_po' => $poName,
                'nomor_polisi' => $plat,
                'asal' => $asal,
                'tujuan' => $tujuan,
                'nama_supir' => $supirName,
                'jam_keberangkatan' => $t->jam_keberangkatan,
            ];
        })->toArray();
    }
}
