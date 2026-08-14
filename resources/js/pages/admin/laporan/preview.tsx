import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Bus, Download } from 'lucide-react';
import { useState } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';

interface LaporanRecord {
    id_laporan: number;
    source_type: string;
    source_trip_id: number | null;
    submitted_at: string;
    nama_po: string;
    nomor_polisi: string;
    asal: string;
    tujuan: string;
    nama_supir: string;
    seat: number;
    pnp: number;
    naik: number;
    turun: number;
    akap_akdp: string;
    admin?: {
        nama_admin: string;
    };
}

interface DateGroupItem {
    date: string;
    formattedDate: string;
    items: LaporanRecord[];
    total_seat: number;
    total_pnp: number;
    total_naik: number;
    total_turun: number;
    total_akap: number;
    total_akdp: number;
}

interface PreviewProps {
    mode: 'harian' | 'bulanan';
    tanggal: string;
    bulan: number;
    tahun: number;
    formatBulanan: 'separate' | 'merged';
    formattedPeriode: string;
    documentDate: string;
    filename: string;
    summary: {
        total_perjalanan: number;
        total_seat: number;
        total_pnp: number;
        total_naik: number;
        total_turun: number;
        total_akap: number;
        total_akdp: number;
    };
    laporans: LaporanRecord[];
    groupedByDate: DateGroupItem[];
    namaKepala?: string;
    nipKepala?: string;
    jabatanKepala?: string;
}

export default function LaporanPreview({
    mode,
    tanggal,
    bulan,
    tahun,
    formatBulanan,
    formattedPeriode,
    documentDate,
    filename,
    summary,
    laporans,
    groupedByDate,
    namaKepala,
    nipKepala,
    jabatanKepala,
}: PreviewProps) {
    const [namaKepalaState, setNamaKepalaState] = useState(namaKepala || 'Syamsuddin, S.STP');
    const [nipKepalaState, setNipKepalaState] = useState(nipKepala || '19850412 201012 1 004');
    const [jabatanKepalaState, setJabatanKepalaState] = useState(jabatanKepala || 'Kepala Terminal Induk Parepare');

    const handleSavePdf = () => {
        const downloadUrl = route('admin.laporan.download-pdf', {
            mode,
            tanggal: mode === 'harian' ? tanggal : '',
            bulan: mode === 'bulanan' ? bulan : '',
            tahun: mode === 'bulanan' ? tahun : '',
            format_bulanan: mode === 'bulanan' ? formatBulanan : '',
            nama_kepala: namaKepalaState,
            nip_kepala: nipKepalaState,
            jabatan_kepala: jabatanKepalaState,
        });
        window.location.href = downloadUrl;
    };

    const formatTimeOnly = (dateTimeStr: string) => {
        if (!dateTimeStr) return '-';
        try {
            let val = String(dateTimeStr).trim();
            if (val.length === 19 && !val.endsWith('Z') && !val.includes('+')) {
                val = val.replace(' ', 'T') + 'Z';
            }
            const dateObj = new Date(val);
            if (isNaN(dateObj.getTime())) {
                return dateTimeStr.slice(11, 16);
            }
            const parts = new Intl.DateTimeFormat('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: 'Asia/Makassar',
            }).formatToParts(dateObj);

            const hours = parts.find((p) => p.type === 'hour')?.value.padStart(2, '0') || '00';
            const minutes = parts.find((p) => p.type === 'minute')?.value.padStart(2, '0') || '00';
            return `${hours}:${minutes}`;
        } catch {
            return '-';
        }
    };

    return (
        <>
            <Head title={`Preview ${filename}`} />

            {/* Top Action Bar */}
            <div className="print:hidden bg-slate-900 text-white px-6 py-3 flex items-center justify-between shadow-md sticky top-0 z-50">
                <Link
                    href={route('admin.laporan.pdf-form')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors"
                >
                    <ArrowLeft size={16} />
                    Kembali / Ubah Periode
                </Link>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSavePdf}
                        className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-md transition-colors"
                    >
                        <Download size={15} />
                        Simpan PDF
                    </button>
                </div>
            </div>

            {/* Document Preview Canvas */}
            <div className="min-h-screen bg-slate-100 p-4 md:p-8 print:p-0 print:bg-white flex justify-center">
                <div
                    className="bg-white w-full max-w-5xl p-8 md:p-12 shadow-lg print:shadow-none print:w-full print:max-w-none rounded-2xl print:rounded-none"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                >
                    {mode === 'bulanan' && formatBulanan === 'separate' ? (
                        /* Mode Bulanan — Pisahkan berdasarkan hari (Setiap hari merupakan satu laporan harian utuh lengkap) */
                        <div className="flex flex-col gap-12">
                            {groupedByDate && groupedByDate.length > 0 ? (
                                groupedByDate.map((group, idx) => (
                                    <div
                                        key={group.date}
                                        style={{
                                            pageBreakBefore: idx > 0 ? 'always' : 'auto',
                                            breakBefore: idx > 0 ? 'page' : 'auto',
                                        }}
                                        className={idx > 0 ? 'pt-8 border-t-4 border-dashed border-slate-300 print:border-none' : ''}
                                    >
                                        {/* Kop Surat Resmi */}
                                        <div className="flex items-center justify-between border-b-4 border-slate-900 pb-4 mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 border border-slate-900 print:border-black p-1.5 bg-white overflow-hidden">
                                                    <AppLogoIcon className="h-full w-full object-contain" />
                                                </div>
                                                <div>
                                                    <h1
                                                        className="text-xl md:text-2xl font-black uppercase tracking-tight text-slate-900 leading-tight"
                                                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                                    >
                                                        DINAS PERHUBUNGAN KOTA PAREPARE
                                                    </h1>
                                                    <h2 className="text-sm md:text-base font-bold text-[#003B70] tracking-wide">
                                                        SISTEM INFORMASI TERMINAL INDUK PAREPARE
                                                    </h2>
                                                    <p className="text-xs text-slate-500">
                                                        Jl. Nusantara No. 01, Kota Parepare, Sulawesi Selatan • Telp: (0421) 22100
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Judul Laporan Harian */}
                                        <div className="text-center mb-6">
                                            <h3
                                                className="text-lg md:text-xl font-extrabold uppercase tracking-wide text-slate-900"
                                                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                            >
                                                LAPORAN HARIAN OPERASIONAL PERJALANAN BUS
                                            </h3>
                                            <p className="text-xs font-bold text-slate-700 mt-1">
                                                Tanggal: {group.formattedDate}
                                            </p>
                                        </div>

                                        {/* Ringkasan Statistik Harian */}
                                        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 text-center text-xs mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono">
                                            <div>
                                                <span className="text-[10px] text-slate-500 block uppercase">Perjalanan</span>
                                                <strong className="text-slate-900">{group.items.length}</strong>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-500 block uppercase">Seat</span>
                                                <strong className="text-slate-900">{group.total_seat.toLocaleString('id-ID')}</strong>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-500 block uppercase">PNP</span>
                                                <strong className="text-amber-800">{group.total_pnp.toLocaleString('id-ID')}</strong>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-500 block uppercase">Naik</span>
                                                <strong className="text-emerald-800">{group.total_naik.toLocaleString('id-ID')}</strong>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-500 block uppercase">Turun</span>
                                                <strong className="text-rose-800">{group.total_turun.toLocaleString('id-ID')}</strong>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-500 block uppercase">AKAP</span>
                                                <strong className="text-cyan-800">{group.total_akap}</strong>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-500 block uppercase">AKDP</span>
                                                <strong className="text-amber-800">{group.total_akdp}</strong>
                                            </div>
                                        </div>

                                        {/* Tabel Data Harian */}
                                        <div className="mb-6 overflow-x-auto">
                                            <table className="w-full text-xs border-collapse border border-slate-300">
                                                <thead>
                                                    <tr className="bg-slate-100 text-slate-900 border-b border-slate-300">
                                                        <th rowSpan={2} className="border border-slate-300 px-2 py-2 text-center w-8">No</th>
                                                        <th rowSpan={2} className="border border-slate-300 px-2 py-2 text-center">Waktu</th>
                                                        <th rowSpan={2} className="border border-slate-300 px-2 py-2 text-left">Nama PO</th>
                                                        <th rowSpan={2} className="border border-slate-300 px-2 py-2 text-left">No. Plat</th>
                                                        <th rowSpan={2} className="border border-slate-300 px-2 py-2 text-left">Asal</th>
                                                        <th rowSpan={2} className="border border-slate-300 px-2 py-2 text-left">Tujuan</th>
                                                        <th colSpan={2} className="border border-slate-300 px-2 py-1 text-center bg-slate-200">Lintas</th>
                                                        <th colSpan={2} className="border border-slate-300 px-2 py-1 text-center bg-slate-200">Penumpang</th>
                                                        <th rowSpan={2} className="border border-slate-300 px-2 py-2 text-left">Nama Supir</th>
                                                        <th rowSpan={2} className="border border-slate-300 px-2 py-2 text-center">Trayek</th>
                                                    </tr>
                                                    <tr className="bg-slate-100 text-slate-900 border-b border-slate-300">
                                                        <th className="border border-slate-300 px-1 py-1 text-center">Seat</th>
                                                        <th className="border border-slate-300 px-1 py-1 text-center">PNP</th>
                                                        <th className="border border-slate-300 px-1 py-1 text-center">Naik</th>
                                                        <th className="border border-slate-300 px-1 py-1 text-center">Turun</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {group.items.map((r, rIdx) => (
                                                        <tr key={r.id_laporan} className="border-b border-slate-200">
                                                            <td className="border border-slate-300 px-2 py-1.5 text-center font-mono">{rIdx + 1}</td>
                                                            <td className="border border-slate-300 px-2 py-1.5 text-center font-mono font-bold">{formatTimeOnly(r.submitted_at)}</td>
                                                            <td className="border border-slate-300 px-2 py-1.5 font-bold">{r.nama_po}</td>
                                                            <td className="border border-slate-300 px-2 py-1.5 font-mono">{r.nomor_polisi}</td>
                                                            <td className="border border-slate-300 px-2 py-1.5">{r.asal}</td>
                                                            <td className="border border-slate-300 px-2 py-1.5">{r.tujuan}</td>
                                                            <td className="border border-slate-300 px-1 py-1.5 text-center font-mono">{r.seat}</td>
                                                            <td className="border border-slate-300 px-1 py-1.5 text-center font-mono font-bold">{r.pnp}</td>
                                                            <td className="border border-slate-300 px-1 py-1.5 text-center font-mono">{r.naik}</td>
                                                            <td className="border border-slate-300 px-1 py-1.5 text-center font-mono">{r.turun}</td>
                                                            <td className="border border-slate-300 px-2 py-1.5">{r.nama_supir}</td>
                                                            <td className="border border-slate-300 px-2 py-1.5 text-center font-bold">{r.akap_akdp}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot>
                                                    <tr className="bg-slate-100 font-bold border-t-2 border-slate-400 text-slate-900">
                                                        <td colSpan={6} className="border border-slate-300 px-2 py-2 text-right uppercase">TOTAL {group.formattedDate}</td>
                                                        <td className="border border-slate-300 px-1 py-2 text-center font-mono">{group.total_seat}</td>
                                                        <td className="border border-slate-300 px-1 py-2 text-center font-mono">{group.total_pnp}</td>
                                                        <td className="border border-slate-300 px-1 py-2 text-center font-mono">{group.total_naik}</td>
                                                        <td className="border border-slate-300 px-1 py-2 text-center font-mono">{group.total_turun}</td>
                                                        <td colSpan={2} className="border border-slate-300 px-2 py-2 text-xs">
                                                            AKAP: {group.total_akap} | AKDP: {group.total_akdp}
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>

                                        {/* Tanda Tangan & Catatan Spesifik Tanggal */}
                                        <div className="flex justify-between items-end text-xs pt-4 border-t border-slate-200 print:break-inside-avoid">
                                            <div>
                                                <p className="text-slate-500 font-bold">Catatan:</p>
                                                <p className="text-[11px] text-slate-500 italic max-w-xs mt-0.5">
                                                    Dokumen ini diterbitkan secara resmi oleh Sistem Informasi Terminal Induk Parepare dan sah digunakan sebagai laporan operasional harian.
                                                </p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-slate-600 mb-1">Parepare, {documentDate}</p>
                                                <p className="font-bold text-slate-900 mb-12">{jabatanKepalaState}</p>
                                                <p className="font-bold text-slate-900 border-b border-slate-800 pb-0.5 inline-block">
                                                    {namaKepalaState}
                                                </p>
                                                {nipKepalaState && <p className="text-[10px] text-slate-500 font-mono">NIP. {nipKepalaState}</p>}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-8 text-slate-500">Tidak ada record laporan pada periode bulanan ini.</p>
                            )}
                        </div>
                    ) : (
                        /* Mode Harian ATAU Bulanan (Gabungkan Semua Laporan) */
                        <div>
                            {/* Kop Surat Resmi */}
                            <div className="flex items-center justify-between border-b-4 border-slate-900 pb-4 mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 border border-slate-900 print:border-black p-1.5 bg-white overflow-hidden">
                                        <AppLogoIcon className="h-full w-full object-contain" />
                                    </div>
                                    <div>
                                        <h1
                                            className="text-xl md:text-2xl font-black uppercase tracking-tight text-slate-900 leading-tight"
                                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                        >
                                            DINAS PERHUBUNGAN KOTA PAREPARE
                                        </h1>
                                        <h2 className="text-sm md:text-base font-bold text-[#003B70] tracking-wide">
                                            SISTEM INFORMASI TERMINAL INDUK PAREPARE
                                        </h2>
                                        <p className="text-xs text-slate-500">
                                            Jl. Nusantara No. 01, Kota Parepare, Sulawesi Selatan • Telp: (0421) 22100
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Judul Laporan */}
                            <div className="text-center mb-6">
                                <h3
                                    className="text-lg md:text-xl font-extrabold uppercase tracking-wide text-slate-900"
                                    style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                >
                                    LAPORAN {mode === 'harian' ? 'HARIAN' : 'BULANAN'} OPERASIONAL PERJALANAN BUS
                                </h3>
                                <p className="text-xs font-bold text-slate-700 mt-1">
                                    Periode: {formattedPeriode}
                                </p>
                            </div>

                            {/* Ringkasan Metadata / Stat Bar */}
                            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 text-center text-xs mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono">
                                <div>
                                    <span className="text-[10px] text-slate-500 block uppercase">Perjalanan</span>
                                    <strong className="text-slate-900">{summary.total_perjalanan}</strong>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-500 block uppercase">Seat</span>
                                    <strong className="text-slate-900">{summary.total_seat.toLocaleString('id-ID')}</strong>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-500 block uppercase">PNP</span>
                                    <strong className="text-amber-800">{summary.total_pnp.toLocaleString('id-ID')}</strong>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-500 block uppercase">Naik</span>
                                    <strong className="text-emerald-800">{summary.total_naik.toLocaleString('id-ID')}</strong>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-500 block uppercase">Turun</span>
                                    <strong className="text-rose-800">{summary.total_turun.toLocaleString('id-ID')}</strong>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-500 block uppercase">AKAP</span>
                                    <strong className="text-cyan-800">{summary.total_akap}</strong>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-500 block uppercase">AKDP</span>
                                    <strong className="text-amber-800">{summary.total_akdp}</strong>
                                </div>
                            </div>

                            {/* Tabel Data */}
                            <div className="mb-8 overflow-x-auto">
                                <table className="w-full text-xs border-collapse border border-slate-300">
                                    <thead>
                                        <tr className="bg-slate-100 text-slate-900 border-b border-slate-300">
                                            <th rowSpan={2} className="border border-slate-300 px-2 py-2 text-center w-8">No</th>
                                            <th rowSpan={2} className="border border-slate-300 px-2 py-2 text-center">Waktu</th>
                                            <th rowSpan={2} className="border border-slate-300 px-2 py-2 text-left">Nama PO</th>
                                            <th rowSpan={2} className="border border-slate-300 px-2 py-2 text-left">No. Plat</th>
                                            <th rowSpan={2} className="border border-slate-300 px-2 py-2 text-left">Asal</th>
                                            <th rowSpan={2} className="border border-slate-300 px-2 py-2 text-left">Tujuan</th>
                                            <th colSpan={2} className="border border-slate-300 px-2 py-1 text-center bg-slate-200">Lintas</th>
                                            <th colSpan={2} className="border border-slate-300 px-2 py-1 text-center bg-slate-200">Penumpang</th>
                                            <th rowSpan={2} className="border border-slate-300 px-2 py-2 text-left">Nama Supir</th>
                                            <th rowSpan={2} className="border border-slate-300 px-2 py-2 text-center">Trayek</th>
                                        </tr>
                                        <tr className="bg-slate-100 text-slate-900 border-b border-slate-300">
                                            <th className="border border-slate-300 px-1 py-1 text-center">Seat</th>
                                            <th className="border border-slate-300 px-1 py-1 text-center">PNP</th>
                                            <th className="border border-slate-300 px-1 py-1 text-center">Naik</th>
                                            <th className="border border-slate-300 px-1 py-1 text-center">Turun</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {laporans && laporans.length > 0 ? (
                                            laporans.map((r, idx) => (
                                                <tr key={r.id_laporan} className="border-b border-slate-200">
                                                    <td className="border border-slate-300 px-2 py-1.5 text-center font-mono">{idx + 1}</td>
                                                    <td className="border border-slate-300 px-2 py-1.5 text-center font-mono font-bold">{formatTimeOnly(r.submitted_at)}</td>
                                                    <td className="border border-slate-300 px-2 py-1.5 font-bold">{r.nama_po}</td>
                                                    <td className="border border-slate-300 px-2 py-1.5 font-mono">{r.nomor_polisi}</td>
                                                    <td className="border border-slate-300 px-2 py-1.5">{r.asal}</td>
                                                    <td className="border border-slate-300 px-2 py-1.5">{r.tujuan}</td>
                                                    <td className="border border-slate-300 px-1 py-1.5 text-center font-mono">{r.seat}</td>
                                                    <td className="border border-slate-300 px-1 py-1.5 text-center font-mono font-bold">{r.pnp}</td>
                                                    <td className="border border-slate-300 px-1 py-1.5 text-center font-mono">{r.naik}</td>
                                                    <td className="border border-slate-300 px-1 py-1.5 text-center font-mono">{r.turun}</td>
                                                    <td className="border border-slate-300 px-2 py-1.5">{r.nama_supir}</td>
                                                    <td className="border border-slate-300 px-2 py-1.5 text-center font-bold">{r.akap_akdp}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={12} className="text-center py-4 text-slate-500">Tidak ada record laporan pada periode ini.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-slate-100 font-bold border-t-2 border-slate-400 text-slate-900">
                                            <td colSpan={6} className="border border-slate-300 px-2 py-2 text-right uppercase">TOTAL KESELURUHAN</td>
                                            <td className="border border-slate-300 px-1 py-2 text-center font-mono">{summary.total_seat}</td>
                                            <td className="border border-slate-300 px-1 py-2 text-center font-mono">{summary.total_pnp}</td>
                                            <td className="border border-slate-300 px-1 py-2 text-center font-mono">{summary.total_naik}</td>
                                            <td className="border border-slate-300 px-1 py-2 text-center font-mono">{summary.total_turun}</td>
                                            <td colSpan={2} className="border border-slate-300 px-2 py-2 text-xs">
                                                AKAP: {summary.total_akap} | AKDP: {summary.total_akdp}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            {/* Tanda Tangan & Catatan */}
                            <div className="flex justify-between items-end text-xs pt-4 border-t border-slate-200 print:break-inside-avoid">
                                <div>
                                    <p className="text-slate-500 font-bold">Catatan:</p>
                                    <p className="text-[11px] text-slate-500 italic max-w-xs mt-0.5">
                                        Dokumen ini diterbitkan secara resmi oleh Sistem Informasi Terminal Induk Parepare dan sah digunakan sebagai laporan operasional resmi.
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-slate-600 mb-1">Parepare, {documentDate}</p>
                                    <p className="font-bold text-slate-900 mb-12">{jabatanKepalaState}</p>
                                    <p className="font-bold text-slate-900 border-b border-slate-800 pb-0.5 inline-block">
                                        {namaKepalaState}
                                    </p>
                                    {nipKepalaState && <p className="text-[10px] text-slate-500 font-mono">NIP. {nipKepalaState}</p>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
