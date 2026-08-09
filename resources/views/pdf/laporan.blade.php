<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>{{ $filename ?? 'Laporan_Operasional.pdf' }}</title>
    <style>
        @page {
            margin: 25pt 30pt;
        }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 10pt;
            color: #1e293b;
            line-height: 1.3;
        }
        .page-break {
            page-break-after: always;
            break-after: page;
        }
        .kop-container {
            border-bottom: 3px solid #0f172a;
            padding-bottom: 8px;
            margin-bottom: 12px;
        }
        .kop-table {
            width: 100%;
            border-collapse: collapse;
        }
        .kop-logo-cell {
            width: 60px;
            vertical-align: middle;
        }
        .kop-logo-box {
            width: 50px;
            height: 50px;
            background-color: #FFC627;
            border-radius: 8px;
            text-align: center;
            line-height: 50px;
            font-weight: bold;
            color: #003B70;
            font-size: 20pt;
            border: 1px solid #0f172a;
        }
        .kop-text-cell {
            vertical-align: middle;
            padding-left: 10px;
        }
        .kop-title-1 {
            font-size: 13pt;
            font-weight: 900;
            color: #0f172a;
            text-transform: uppercase;
            margin: 0;
            line-height: 1.1;
        }
        .kop-title-2 {
            font-size: 10pt;
            font-weight: 800;
            color: #003B70;
            margin: 2px 0 0 0;
            letter-spacing: 0.5px;
        }
        .kop-subtitle {
            font-size: 8pt;
            color: #64748b;
            margin: 2px 0 0 0;
        }
        .doc-title {
            text-align: center;
            margin-bottom: 12px;
        }
        .doc-title h2 {
            font-size: 12pt;
            font-weight: 800;
            text-transform: uppercase;
            color: #0f172a;
            margin: 0;
        }
        .doc-title p {
            font-size: 8.5pt;
            font-weight: bold;
            color: #334155;
            margin: 2px 0 0 0;
        }
        .summary-box {
            background-color: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            padding: 6px;
            margin-bottom: 12px;
        }
        .summary-table {
            width: 100%;
            border-collapse: collapse;
            text-align: center;
        }
        .summary-table td {
            padding: 3px 4px;
        }
        .summary-label {
            font-size: 7pt;
            text-transform: uppercase;
            color: #64748b;
            font-weight: bold;
            display: block;
        }
        .summary-value {
            font-size: 10pt;
            font-weight: bold;
            color: #0f172a;
            font-family: monospace;
        }
        .report-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 8pt;
            margin-bottom: 15px;
        }
        .report-table th, .report-table td {
            border: 1px solid #cbd5e1;
            padding: 4px 5px;
        }
        .report-table th {
            background-color: #f1f5f9;
            color: #0f172a;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 7.5pt;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-left { text-align: left; }
        .font-mono { font-family: monospace; }
        .font-bold { font-weight: bold; }

        .footer-section {
            width: 100%;
            margin-top: 15px;
            page-break-inside: avoid;
        }
        .footer-table {
            width: 100%;
            border-collapse: collapse;
        }
        .notes-cell {
            vertical-align: top;
            width: 60%;
        }
        .notes-title {
            font-size: 8pt;
            font-weight: bold;
            color: #475569;
        }
        .notes-text {
            font-size: 7.5pt;
            color: #64748b;
            font-style: italic;
            margin-top: 2px;
            max-width: 250px;
        }
        .signature-cell {
            vertical-align: top;
            width: 40%;
            text-align: center;
        }
        .signature-date {
            font-size: 8.5pt;
            color: #334155;
            margin-bottom: 2px;
        }
        .signature-role {
            font-size: 8.5pt;
            font-weight: bold;
            color: #0f172a;
            margin-bottom: 45px;
        }
        .signature-name {
            font-size: 9pt;
            font-weight: bold;
            color: #0f172a;
            text-decoration: underline;
            margin-bottom: 1px;
        }
        .signature-nip {
            font-size: 7.5pt;
            color: #64748b;
            font-family: monospace;
        }
    </style>
</head>
<body>

@if ($mode === 'bulanan' && $formatBulanan === 'separate')
    {{-- Mode Bulanan — Pisahkan berdasarkan hari (Setiap tanggal = 1 laporan lengkap) --}}
    @foreach ($groupedByDate as $group)
        <div class="daily-report-wrapper">
            <!-- Kop Surat -->
            <div class="kop-container">
                <table class="kop-table">
                    <tr>
                        <td class="kop-logo-cell">
                            <div class="kop-logo-box">BUS</div>
                        </td>
                        <td class="kop-text-cell">
                            <h1 class="kop-title-1">DINAS PERHUBUNGAN KOTA PAREPARE</h1>
                            <h2 class="kop-title-2">SISTEM INFORMASI TERMINAL INDUK PAREPARE</h2>
                            <p class="kop-subtitle">Jl. Nusantara No. 01, Kota Parepare, Sulawesi Selatan &bull; Telp: (0421) 22100</p>
                        </td>
                    </tr>
                </table>
            </div>

            <!-- Judul Laporan -->
            <div class="doc-title">
                <h2>LAPORAN HARIAN OPERASIONAL PERJALANAN BUS</h2>
                <p>Tanggal: {{ $group['formattedDate'] }}</p>
            </div>

            <!-- Ringkasan Statistik Harian -->
            <div class="summary-box">
                <table class="summary-table">
                    <tr>
                        <td>
                            <span class="summary-label">Perjalanan</span>
                            <span class="summary-value">{{ count($group['items']) }}</span>
                        </td>
                        <td>
                            <span class="summary-label">Seat</span>
                            <span class="summary-value">{{ number_format($group['total_seat'], 0, ',', '.') }}</span>
                        </td>
                        <td>
                            <span class="summary-label">PNP</span>
                            <span class="summary-value" style="color: #b45309;">{{ number_format($group['total_pnp'], 0, ',', '.') }}</span>
                        </td>
                        <td>
                            <span class="summary-label">Naik</span>
                            <span class="summary-value" style="color: #047857;">{{ number_format($group['total_naik'], 0, ',', '.') }}</span>
                        </td>
                        <td>
                            <span class="summary-label">Turun</span>
                            <span class="summary-value" style="color: #be123c;">{{ number_format($group['total_turun'], 0, ',', '.') }}</span>
                        </td>
                        <td>
                            <span class="summary-label">AKAP</span>
                            <span class="summary-value" style="color: #0e7490;">{{ $group['total_akap'] }}</span>
                        </td>
                        <td>
                            <span class="summary-label">AKDP</span>
                            <span class="summary-value" style="color: #b45309;">{{ $group['total_akdp'] }}</span>
                        </td>
                    </tr>
                </table>
            </div>

            <!-- Tabel Data Harian -->
            <table class="report-table">
                <thead>
                    <tr>
                        <th rowspan="2" class="text-center" style="width: 25px;">No</th>
                        <th rowspan="2" class="text-center" style="width: 45px;">Waktu</th>
                        <th rowspan="2" class="text-left">Nama PO</th>
                        <th rowspan="2" class="text-left" style="width: 70px;">No. Plat</th>
                        <th rowspan="2" class="text-left">Asal</th>
                        <th rowspan="2" class="text-left">Tujuan</th>
                        <th colspan="2" class="text-center">Lintas</th>
                        <th colspan="2" class="text-center">Penumpang</th>
                        <th rowspan="2" class="text-left">Nama Supir</th>
                        <th rowspan="2" class="text-center" style="width: 40px;">Trayek</th>
                    </tr>
                    <tr>
                        <th class="text-center" style="width: 30px;">Seat</th>
                        <th class="text-center" style="width: 30px;">PNP</th>
                        <th class="text-center" style="width: 30px;">Naik</th>
                        <th class="text-center" style="width: 30px;">Turun</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($group['items'] as $idx => $r)
                        @php
                            $dispTime = is_array($r) ? ($r['display_time'] ?? '-') : ($r->display_time ?? '-');
                        @endphp
                        <tr>
                            <td class="text-center font-mono">{{ $idx + 1 }}</td>
                            <td class="text-center font-mono font-bold">{{ $dispTime }}</td>
                            <td class="font-bold">{{ $r->nama_po }}</td>
                            <td class="font-mono">{{ $r->nomor_polisi }}</td>
                            <td>{{ $r->asal }}</td>
                            <td>{{ $r->tujuan }}</td>
                            <td class="text-center font-mono">{{ $r->seat }}</td>
                            <td class="text-center font-mono font-bold">{{ $r->pnp }}</td>
                            <td class="text-center font-mono">{{ $r->naik }}</td>
                            <td class="text-center font-mono">{{ $r->turun }}</td>
                            <td>{{ $r->nama_supir }}</td>
                            <td class="text-center font-bold">{{ $r->akap_akdp }}</td>
                        </tr>
                    @endforeach
                </tbody>
                <tfoot>
                    <tr style="background-color: #f8fafc; font-weight: bold;">
                        <td colspan="6" class="text-right" style="font-size: 7.5pt; text-transform: uppercase;">TOTAL {{ $group['formattedDate'] }}</td>
                        <td class="text-center font-mono">{{ number_format($group['total_seat'], 0, ',', '.') }}</td>
                        <td class="text-center font-mono">{{ number_format($group['total_pnp'], 0, ',', '.') }}</td>
                        <td class="text-center font-mono">{{ number_format($group['total_naik'], 0, ',', '.') }}</td>
                        <td class="text-center font-mono">{{ number_format($group['total_turun'], 0, ',', '.') }}</td>
                        <td colspan="2" style="font-size: 7pt;">
                            AKAP: {{ $group['total_akap'] }} | AKDP: {{ $group['total_akdp'] }}
                        </td>
                    </tr>
                </tfoot>
            </table>

            <!-- Tanda Tangan & Catatan Spesifik Tanggal -->
            <div class="footer-section">
                <table class="footer-table">
                    <tr>
                        <td class="notes-cell">
                            <span class="notes-title">Catatan:</span>
                            <p class="notes-text">
                                Dokumen ini diterbitkan secara resmi oleh Sistem Informasi Terminal Induk Parepare dan sah digunakan sebagai laporan operasional harian.
                            </p>
                        </td>
                        <td class="signature-cell">
                            <div class="signature-date">Parepare, {{ $documentDate }}</div>
                            <div class="signature-role">{{ $jabatanKepala ?? 'Kepala Terminal Induk Parepare' }}</div>
                            <div class="signature-name">{{ $namaKepala ?? 'Syamsuddin, S.STP' }}</div>
                            @if (!empty($nipKepala))
                                <div class="signature-nip">NIP. {{ $nipKepala }}</div>
                            @endif
                        </td>
                    </tr>
                </table>
            </div>
        </div>

        @if (!$loop->last)
            <div class="page-break"></div>
        @endif
    @endforeach

@else
    {{-- Mode Harian ATAU Bulanan (Gabungkan Semua Laporan) --}}
    <div class="single-report-wrapper">
        <!-- Kop Surat -->
        <div class="kop-container">
            <table class="kop-table">
                <tr>
                    <td class="kop-logo-cell">
                        <div class="kop-logo-box">BUS</div>
                    </td>
                    <td class="kop-text-cell">
                        <h1 class="kop-title-1">DINAS PERHUBUNGAN KOTA PAREPARE</h1>
                        <h2 class="kop-title-2">SISTEM INFORMASI TERMINAL INDUK PAREPARE</h2>
                        <p class="kop-subtitle">Jl. Nusantara No. 01, Kota Parepare, Sulawesi Selatan &bull; Telp: (0421) 22100</p>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Judul Laporan -->
        <div class="doc-title">
            <h2>LAPORAN {{ $mode === 'harian' ? 'HARIAN' : 'BULANAN' }} OPERASIONAL PERJALANAN BUS</h2>
            <p>Periode: {{ $formattedPeriode }}</p>
        </div>

        <!-- Ringkasan Statistik -->
        <div class="summary-box">
            <table class="summary-table">
                <tr>
                    <td>
                        <span class="summary-label">Perjalanan</span>
                        <span class="summary-value">{{ $summary['total_perjalanan'] }}</span>
                    </td>
                    <td>
                        <span class="summary-label">Seat</span>
                        <span class="summary-value">{{ number_format($summary['total_seat'], 0, ',', '.') }}</span>
                    </td>
                    <td>
                        <span class="summary-label">PNP</span>
                        <span class="summary-value" style="color: #b45309;">{{ number_format($summary['total_pnp'], 0, ',', '.') }}</span>
                    </td>
                    <td>
                        <span class="summary-label">Naik</span>
                        <span class="summary-value" style="color: #047857;">{{ number_format($summary['total_naik'], 0, ',', '.') }}</span>
                    </td>
                    <td>
                        <span class="summary-label">Turun</span>
                        <span class="summary-value" style="color: #be123c;">{{ number_format($summary['total_turun'], 0, ',', '.') }}</span>
                    </td>
                    <td>
                        <span class="summary-label">AKAP</span>
                        <span class="summary-value" style="color: #0e7490;">{{ $summary['total_akap'] }}</span>
                    </td>
                    <td>
                        <span class="summary-label">AKDP</span>
                        <span class="summary-value" style="color: #b45309;">{{ $summary['total_akdp'] }}</span>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Tabel Data -->
        <table class="report-table">
            <thead>
                <tr>
                    <th rowspan="2" class="text-center" style="width: 25px;">No</th>
                    <th rowspan="2" class="text-center" style="width: 45px;">Waktu</th>
                    <th rowspan="2" class="text-left">Nama PO</th>
                    <th rowspan="2" class="text-left" style="width: 70px;">No. Plat</th>
                    <th rowspan="2" class="text-left">Asal</th>
                    <th rowspan="2" class="text-left">Tujuan</th>
                    <th colspan="2" class="text-center">Lintas</th>
                    <th colspan="2" class="text-center">Penumpang</th>
                    <th rowspan="2" class="text-left">Nama Supir</th>
                    <th rowspan="2" class="text-center" style="width: 40px;">Trayek</th>
                </tr>
                <tr>
                    <th class="text-center" style="width: 30px;">Seat</th>
                    <th class="text-center" style="width: 30px;">PNP</th>
                    <th class="text-center" style="width: 30px;">Naik</th>
                    <th class="text-center" style="width: 30px;">Turun</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($laporans as $idx => $r)
                    @php
                        $dispTime = is_array($r) ? ($r['display_time'] ?? '-') : ($r->display_time ?? '-');
                    @endphp
                    <tr>
                        <td class="text-center font-mono">{{ $idx + 1 }}</td>
                        <td class="text-center font-mono font-bold">{{ $dispTime }}</td>
                        <td class="font-bold">{{ $r->nama_po }}</td>
                        <td class="font-mono">{{ $r->nomor_polisi }}</td>
                        <td>{{ $r->asal }}</td>
                        <td>{{ $r->tujuan }}</td>
                        <td class="text-center font-mono">{{ $r->seat }}</td>
                        <td class="text-center font-mono font-bold">{{ $r->pnp }}</td>
                        <td class="text-center font-mono">{{ $r->naik }}</td>
                        <td class="text-center font-mono">{{ $r->turun }}</td>
                        <td>{{ $r->nama_supir }}</td>
                        <td class="text-center font-bold">{{ $r->akap_akdp }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="12" class="text-center" style="padding: 15px; color: #64748b;">Tidak ada record laporan pada periode ini.</td>
                    </tr>
                @endforelse
            </tbody>
            <tfoot>
                <tr style="background-color: #f8fafc; font-weight: bold;">
                    <td colspan="6" class="text-right" style="font-size: 7.5pt; text-transform: uppercase;">TOTAL KESELURUHAN</td>
                    <td class="text-center font-mono">{{ number_format($summary['total_seat'], 0, ',', '.') }}</td>
                    <td class="text-center font-mono">{{ number_format($summary['total_pnp'], 0, ',', '.') }}</td>
                    <td class="text-center font-mono">{{ number_format($summary['total_naik'], 0, ',', '.') }}</td>
                    <td class="text-center font-mono">{{ number_format($summary['total_turun'], 0, ',', '.') }}</td>
                    <td colspan="2" style="font-size: 7pt;">
                        AKAP: {{ $summary['total_akap'] }} | AKDP: {{ $summary['total_akdp'] }}
                    </td>
                </tr>
            </tfoot>
        </table>

        <!-- Tanda Tangan & Catatan -->
        <div class="footer-section">
            <table class="footer-table">
                <tr>
                    <td class="notes-cell">
                        <span class="notes-title">Catatan:</span>
                        <p class="notes-text">
                            Dokumen ini diterbitkan secara resmi oleh Sistem Informasi Terminal Induk Parepare dan sah digunakan sebagai laporan operasional resmi.
                        </p>
                    </td>
                    <td class="signature-cell">
                        <div class="signature-date">Parepare, {{ $documentDate }}</div>
                        <div class="signature-role">{{ $jabatanKepala ?? 'Kepala Terminal Induk Parepare' }}</div>
                        <div class="signature-name">{{ $namaKepala ?? 'Syamsuddin, S.STP' }}</div>
                        @if (!empty($nipKepala))
                            <div class="signature-nip">NIP. {{ $nipKepala }}</div>
                        @endif
                    </td>
                </tr>
            </table>
        </div>
    </div>
@endif

</body>
</html>
