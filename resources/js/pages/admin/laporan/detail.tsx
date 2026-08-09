import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Bus,
    Calendar,
    Filter,
    Pencil,
    Plus,
    RotateCcw,
    Trash2,
    Users,
    UserCheck,
    UserMinus,
    UserPlus,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

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

interface DetailProps {
    tanggal: string;
    formattedTanggal: string;
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
    filters: {
        nama_po: string;
        nomor_polisi: string;
        asal: string;
        tujuan: string;
        akap_akdp: string;
    };
    options: {
        poList: string[];
        platList: string[];
        asalList: string[];
        tujuanList: string[];
    };
}

export default function LaporanDetail({
    tanggal,
    formattedTanggal,
    summary,
    laporans,
    filters,
    options,
}: DetailProps) {
    const { delete: destroy } = useForm();

    const [opFilters, setOpFilters] = useState({
        nama_po: filters?.nama_po || '',
        nomor_polisi: filters?.nomor_polisi || '',
        asal: filters?.asal || '',
        tujuan: filters?.tujuan || '',
        akap_akdp: filters?.akap_akdp || '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Laporan Harian Operasional', href: '/admin/laporan' },
        { title: `Detail ${formattedTanggal}`, href: '#' },
    ];

    const handleFilterSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        router.get(route('admin.laporan.detail', tanggal), opFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        const resetValues = {
            nama_po: '',
            nomor_polisi: '',
            asal: '',
            tujuan: '',
            akap_akdp: '',
        };
        setOpFilters(resetValues);
        router.get(route('admin.laporan.detail', tanggal), resetValues);
    };

    const handleDelete = (id: number, namaPo: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus record laporan "${namaPo}"?`)) {
            destroy(route('admin.laporan.destroy', id));
        }
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Laporan Harian ${formattedTanggal} — Terminal Parepare`} />

            <div className="flex flex-col gap-6 p-6" style={{ backgroundColor: '#f9f7f3' }}>
                {/* Header Action Bar (PDF button REMOVED from detail view) */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.laporan.index')}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-105"
                            style={{ backgroundColor: '#ffffff', border: '1px solid #d4cfc6', color: '#001A33' }}
                            title="Kembali ke Laporan Harian"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1
                                className="text-3xl font-extrabold tracking-tight"
                                style={{
                                    fontFamily: "'Bricolage Grotesque', sans-serif",
                                    color: '#001A33',
                                    lineHeight: 1.0,
                                }}
                            >
                                LAPORAN HARIAN
                            </h1>
                            <p className="mt-1 text-sm font-semibold flex items-center gap-1.5 text-blue-900">
                                <Calendar size={15} color="#003B70" />
                                {formattedTanggal}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={route('admin.laporan.create')}
                            className="btn-damri-primary inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-full font-bold shadow-sm"
                        >
                            <Plus size={15} />
                            Tambah Record
                        </Link>
                    </div>
                </div>

                {/* Filter Operasional Data Laporan (Section 6.1) */}
                <div
                    className="p-5"
                    style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #d4cfc6',
                        borderRadius: '16px',
                    }}
                >
                    <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-800">
                        <Filter size={15} color="#003B70" />
                        <span>FILTER DATA LAPORAN ({formattedTanggal})</span>
                    </div>

                    <form onSubmit={handleFilterSubmit} className="flex flex-wrap items-end gap-3">
                        {/* Filter Nama PO */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-700">Nama PO</label>
                            <select
                                value={opFilters.nama_po}
                                onChange={(e) => setOpFilters({ ...opFilters, nama_po: e.target.value })}
                                className="input-damri text-xs py-1.5 px-3 w-40"
                            >
                                <option value="">Semua PO ▼</option>
                                {options.poList.map((po) => (
                                    <option key={po} value={po}>
                                        {po}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filter No. Plat */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-700">No. Plat</label>
                            <select
                                value={opFilters.nomor_polisi}
                                onChange={(e) => setOpFilters({ ...opFilters, nomor_polisi: e.target.value })}
                                className="input-damri text-xs py-1.5 px-3 w-36"
                            >
                                <option value="">Semua Plat ▼</option>
                                {options.platList.map((plat) => (
                                    <option key={plat} value={plat}>
                                        {plat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filter Asal */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-700">Asal</label>
                            <select
                                value={opFilters.asal}
                                onChange={(e) => setOpFilters({ ...opFilters, asal: e.target.value })}
                                className="input-damri text-xs py-1.5 px-3 w-36"
                            >
                                <option value="">Semua Asal ▼</option>
                                {options.asalList.map((asal) => (
                                    <option key={asal} value={asal}>
                                        {asal}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filter Tujuan */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-700">Tujuan</label>
                            <select
                                value={opFilters.tujuan}
                                onChange={(e) => setOpFilters({ ...opFilters, tujuan: e.target.value })}
                                className="input-damri text-xs py-1.5 px-3 w-36"
                            >
                                <option value="">Semua Tujuan ▼</option>
                                {options.tujuanList.map((tujuan) => (
                                    <option key={tujuan} value={tujuan}>
                                        {tujuan}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filter AKAP/AKDP */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-700">AKAP/AKDP</label>
                            <select
                                value={opFilters.akap_akdp}
                                onChange={(e) => setOpFilters({ ...opFilters, akap_akdp: e.target.value })}
                                className="input-damri text-xs py-1.5 px-3 w-32"
                            >
                                <option value="">Semua ▼</option>
                                <option value="AKAP">AKAP</option>
                                <option value="AKDP">AKDP</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 ml-auto">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border border-gray-300 text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                <RotateCcw size={13} />
                                Reset
                            </button>
                            <button
                                type="submit"
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-sm"
                                style={{ backgroundColor: '#003B70' }}
                            >
                                <Filter size={13} />
                                Terapkan Filter
                            </button>
                        </div>
                    </form>
                </div>

                {/* Ringkasan Detail Laporan Harian (Dynamic based on filter results) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Perjalanan</span>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-black text-slate-900 font-mono">{summary.total_perjalanan}</span>
                            <Bus size={20} className="text-blue-700 opacity-80" />
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Seat</span>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-black text-slate-900 font-mono">{summary.total_seat.toLocaleString('id-ID')}</span>
                            <UserCheck size={20} className="text-indigo-600 opacity-80" />
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total PNP</span>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-black text-slate-900 font-mono">{summary.total_pnp.toLocaleString('id-ID')}</span>
                            <Users size={20} className="text-amber-600 opacity-80" />
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Naik</span>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-black text-emerald-700 font-mono">{summary.total_naik.toLocaleString('id-ID')}</span>
                            <UserPlus size={20} className="text-emerald-600 opacity-80" />
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Turun</span>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-black text-rose-700 font-mono">{summary.total_turun.toLocaleString('id-ID')}</span>
                            <UserMinus size={20} className="text-rose-600 opacity-80" />
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total AKAP</span>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-black text-cyan-800 font-mono">{summary.total_akap}</span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800">AKAP</span>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total AKDP</span>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-black text-amber-800 font-mono">{summary.total_akdp}</span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">AKDP</span>
                        </div>
                    </div>
                </div>

                {/* Tabel Detail Seluruh Laporan */}
                <div
                    className="overflow-hidden"
                    style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #d4cfc6',
                        borderRadius: '16px',
                    }}
                >
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between" style={{ backgroundColor: '#f9f7f3' }}>
                        <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: '#001A33' }}>
                            DETAIL SELURUH LAPORAN PERJALANAN ({laporans.length} RECORD)
                        </h2>
                    </div>

                    {laporans && laporans.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left border-collapse">
                                <thead>
                                    <tr style={{ backgroundColor: '#f9f7f3', borderBottom: '1px solid #d4cfc6' }}>
                                        <th rowSpan={2} className="px-3 py-2.5 text-center font-bold uppercase border-r border-slate-300 w-10 text-slate-700">
                                            No.
                                        </th>
                                        <th rowSpan={2} className="px-3 py-2.5 text-center font-bold uppercase border-r border-slate-300 text-slate-700">
                                            Waktu
                                        </th>
                                        <th rowSpan={2} className="px-3 py-2.5 font-bold uppercase border-r border-slate-300 text-slate-700">
                                            Nama PO
                                        </th>
                                        <th rowSpan={2} className="px-3 py-2.5 font-bold uppercase border-r border-slate-300 text-slate-700">
                                            No. Plat
                                        </th>
                                        <th rowSpan={2} className="px-3 py-2.5 font-bold uppercase border-r border-slate-300 text-slate-700">
                                            Asal
                                        </th>
                                        <th rowSpan={2} className="px-3 py-2.5 font-bold uppercase border-r border-slate-300 text-slate-700">
                                            Tujuan
                                        </th>
                                        <th colSpan={2} className="px-3 py-1.5 text-center font-bold uppercase border-r border-b border-slate-300 text-slate-800 bg-slate-100">
                                            Lintas
                                        </th>
                                        <th colSpan={2} className="px-3 py-1.5 text-center font-bold uppercase border-r border-b border-slate-300 text-slate-800 bg-slate-100">
                                            Penumpang
                                        </th>
                                        <th rowSpan={2} className="px-3 py-2.5 font-bold uppercase border-r border-slate-300 text-slate-700">
                                            Nama Supir
                                        </th>
                                        <th rowSpan={2} className="px-3 py-2.5 text-center font-bold uppercase border-r border-slate-300 text-slate-700">
                                            AKAP/AKDP
                                        </th>
                                        <th rowSpan={2} className="px-3 py-2.5 text-center font-bold uppercase text-slate-700 w-24">
                                            Aksi
                                        </th>
                                    </tr>
                                    <tr style={{ backgroundColor: '#f9f7f3', borderBottom: '1px solid #d4cfc6' }}>
                                        <th className="px-2 py-1.5 text-center font-bold border-r border-slate-300 text-slate-600">Seat</th>
                                        <th className="px-2 py-1.5 text-center font-bold border-r border-slate-300 text-slate-600">PNP</th>
                                        <th className="px-2 py-1.5 text-center font-bold border-r border-slate-300 text-slate-600">Naik</th>
                                        <th className="px-2 py-1.5 text-center font-bold border-r border-slate-300 text-slate-600">Turun</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {laporans.map((r, idx) => (
                                        <tr
                                            key={r.id_laporan}
                                            className="hover:bg-slate-50 transition-colors border-b border-slate-200"
                                        >
                                            <td className="px-3 py-2.5 text-center font-mono text-slate-500 border-r border-slate-200">
                                                {idx + 1}
                                            </td>
                                            <td className="px-3 py-2.5 text-center font-mono font-bold text-slate-800 border-r border-slate-200">
                                                {formatTimeOnly(r.submitted_at)}
                                            </td>
                                            <td className="px-3 py-2.5 font-bold text-slate-900 border-r border-slate-200">
                                                {r.nama_po}
                                            </td>
                                            <td className="px-3 py-2.5 font-mono font-bold text-blue-900 border-r border-slate-200">
                                                {r.nomor_polisi}
                                            </td>
                                            <td className="px-3 py-2.5 text-slate-800 border-r border-slate-200">
                                                {r.asal}
                                            </td>
                                            <td className="px-3 py-2.5 text-slate-800 border-r border-slate-200">
                                                {r.tujuan}
                                            </td>
                                            <td className="px-2 py-2.5 text-center font-mono font-medium text-slate-700 border-r border-slate-200">
                                                {r.seat}
                                            </td>
                                            <td className="px-2 py-2.5 text-center font-mono font-bold text-amber-800 border-r border-slate-200">
                                                {r.pnp}
                                            </td>
                                            <td className="px-2 py-2.5 text-center font-mono font-semibold text-emerald-700 border-r border-slate-200">
                                                {r.naik}
                                            </td>
                                            <td className="px-2 py-2.5 text-center font-mono font-semibold text-rose-700 border-r border-slate-200">
                                                {r.turun}
                                            </td>
                                            <td className="px-3 py-2.5 text-slate-900 border-r border-slate-200 font-medium">
                                                {r.nama_supir}
                                            </td>
                                            <td className="px-3 py-2.5 text-center border-r border-slate-200">
                                                <span
                                                    className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                                                        r.akap_akdp === 'AKAP'
                                                            ? 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                                                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                                                    }`}
                                                >
                                                    {r.akap_akdp}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2.5 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <Link
                                                        href={route('admin.laporan.edit', r.id_laporan)}
                                                        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={13} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(r.id_laporan, r.nama_po)}
                                                        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                {/* Total Row */}
                                <tfoot>
                                    <tr className="bg-slate-100 font-extrabold text-slate-900 border-t-2 border-slate-400">
                                        <td colSpan={6} className="px-4 py-3 text-right uppercase tracking-wider text-xs border-r border-slate-300">
                                            TOTAL
                                        </td>
                                        <td className="px-2 py-3 text-center font-mono text-sm border-r border-slate-300 text-indigo-900">
                                            {summary.total_seat.toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-2 py-3 text-center font-mono text-sm border-r border-slate-300 text-amber-900">
                                            {summary.total_pnp.toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-2 py-3 text-center font-mono text-sm border-r border-slate-300 text-emerald-900">
                                            {summary.total_naik.toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-2 py-3 text-center font-mono text-sm border-r border-slate-300 text-rose-900">
                                            {summary.total_turun.toLocaleString('id-ID')}
                                        </td>
                                        <td colSpan={3} className="px-4 py-3 text-xs border-slate-300 text-slate-700">
                                            Total AKAP = <strong className="text-cyan-800 font-mono">{summary.total_akap}</strong> | Total AKDP = <strong className="text-amber-800 font-mono">{summary.total_akdp}</strong>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <Bus size={36} color="#d4cfc6" className="mx-auto mb-3" />
                            <p className="text-sm font-medium" style={{ color: '#4a5568' }}>
                                Belum ada record laporan operasional yang sesuai filter pada tanggal ini.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
