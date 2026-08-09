import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Eye, FileText, Filter, Plus, RotateCcw } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface GroupedLaporan {
    date_group: string;
    total_laporan: number;
    total_pnp: number;
    total_seat: number;
    total_naik: number;
    total_turun: number;
    total_akap: number;
    total_akdp: number;
}

interface IndexProps {
    groupedLaporans: {
        data: GroupedLaporan[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        tanggal: string;
        bulan: string;
        tahun: string;
    };
    options: {
        years: number[];
        months: Record<number, string>;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Laporan Harian Operasional', href: '/admin/laporan' },
];

export default function LaporanIndex({ groupedLaporans, filters, options }: IndexProps) {
    const [formFilters, setFormFilters] = useState({
        tanggal: filters.tanggal || '',
        bulan: filters.bulan || '',
        tahun: filters.tahun || '',
    });

    const handleFilterSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        router.get(route('admin.laporan.index'), formFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        const resetValues = {
            tanggal: '',
            bulan: '',
            tahun: '',
        };
        setFormFilters(resetValues);
        router.get(route('admin.laporan.index'), resetValues);
    };

    const formatDateIndo = (dateStr: string) => {
        if (!dateStr) return '-';
        try {
            const parts = dateStr.split('-');
            if (parts.length === 3) {
                return `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
            return dateStr;
        } catch {
            return dateStr;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Harian Operasional Bus — Terminal Parepare" />

            <div className="flex flex-col gap-6 p-6" style={{ backgroundColor: '#f9f7f3' }}>
                {/* Header Page */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                        <p className="mt-1 text-sm" style={{ color: '#4a5568' }}>
                            Rekap dan pengelolaan laporan operasional perjalanan bus.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.laporan.pdf-form')}
                            className="inline-flex items-center gap-2 text-xs px-4 py-2.5 rounded-full font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-sm transition-colors"
                        >
                            <FileText size={16} />
                            Cetak Laporan/PDF
                        </Link>
                        <Link
                            href={route('admin.laporan.create')}
                            className="btn-damri-primary inline-flex items-center gap-2 text-xs px-4 py-2.5 rounded-full font-bold shadow-sm"
                        >
                            <Plus size={16} />
                            Buat Laporan
                        </Link>
                    </div>
                </div>

                {/* Filter Periode Halaman Awal */}
                <div
                    className="px-5 py-3.5"
                    style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #d4cfc6',
                        borderRadius: '14px',
                    }}
                >
                    <div className="flex items-center gap-1.5 mb-2 text-xs font-bold uppercase tracking-wider" style={{ color: '#001A33' }}>
                        <Filter size={14} color="#003B70" />
                        <span>FILTER PERIODE</span>
                    </div>

                    <form onSubmit={handleFilterSubmit} className="flex flex-wrap items-end gap-3">
                        {/* Filter Tanggal */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-700">Tanggal</label>
                            <input
                                type="date"
                                value={formFilters.tanggal}
                                onChange={(e) => setFormFilters({ ...formFilters, tanggal: e.target.value })}
                                className="input-damri font-mono text-xs h-9 px-3 w-40 sm:w-44"
                            />
                        </div>

                        {/* Filter Bulan */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-700">Bulan</label>
                            <select
                                value={formFilters.bulan}
                                onChange={(e) => setFormFilters({ ...formFilters, bulan: e.target.value })}
                                className="input-damri text-xs h-9 px-3 w-44 sm:w-48"
                            >
                                <option value="">Semua Bulan ▼</option>
                                {Object.entries(options.months).map(([num, name]) => (
                                    <option key={num} value={num}>
                                        {name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filter Tahun */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-700">Tahun</label>
                            <select
                                value={formFilters.tahun}
                                onChange={(e) => setFormFilters({ ...formFilters, tahun: e.target.value })}
                                className="input-damri text-xs h-9 px-3 w-36 sm:w-40"
                            >
                                <option value="">Semua Tahun ▼</option>
                                {options.years.map((y) => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2.5 ml-auto">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="inline-flex items-center gap-1.5 px-4 h-9 rounded-full text-xs font-semibold border border-gray-300 text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                <RotateCcw size={13} />
                                Reset
                            </button>
                            <button
                                type="submit"
                                className="inline-flex items-center gap-1.5 px-5 h-9 rounded-full text-xs font-bold text-white shadow-sm"
                                style={{ backgroundColor: '#003B70' }}
                            >
                                <Filter size={13} />
                                Terapkan Filter
                            </button>
                        </div>
                    </form>
                </div>

                {/* Table Grouped Daily Reports */}
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
                            DAFTAR LAPORAN HARIAN
                        </h2>
                        <span className="text-xs text-gray-500 font-medium">
                            Total {groupedLaporans.total} Kelompok Hari
                        </span>
                    </div>

                    {groupedLaporans.data && groupedLaporans.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #d4cfc6', backgroundColor: '#f9f7f3' }}>
                                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider w-12 text-gray-700">
                                            No
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                                            Tanggal
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-700">
                                            Jumlah Laporan
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-700">
                                            Total PNP
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-700">
                                            AKAP
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-700">
                                            AKDP
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider w-28 text-gray-700">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedLaporans.data.map((item, idx) => {
                                        const rowNum = (groupedLaporans.current_page - 1) * groupedLaporans.per_page + idx + 1;
                                        return (
                                            <tr
                                                key={item.date_group}
                                                className="hover:bg-slate-50 transition-colors"
                                                style={{
                                                    borderBottom: idx < groupedLaporans.data.length - 1 ? '1px solid #f0ede6' : 'none',
                                                }}
                                            >
                                                <td className="px-4 py-3.5 text-center font-mono text-xs text-gray-500">
                                                    {rowNum}
                                                </td>
                                                <td className="px-4 py-3.5 font-bold" style={{ color: '#001A33' }}>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={16} color="#003B70" />
                                                        <span className="font-mono text-sm">{formatDateIndo(item.date_group)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3.5 text-center">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                                                        {item.total_laporan} Perjalanan
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5 text-center font-mono font-bold text-slate-800">
                                                    {item.total_pnp?.toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-4 py-3.5 text-center font-mono text-xs font-semibold text-emerald-700">
                                                    {item.total_akap}
                                                </td>
                                                <td className="px-4 py-3.5 text-center font-mono text-xs font-semibold text-amber-700">
                                                    {item.total_akdp}
                                                </td>
                                                <td className="px-4 py-3.5 text-center">
                                                    <Link
                                                        href={route('admin.laporan.detail', item.date_group)}
                                                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 transition-colors shadow-sm"
                                                    >
                                                        <Eye size={13} />
                                                        Detail
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <Calendar size={36} color="#d4cfc6" className="mx-auto mb-3" />
                            <p className="text-sm font-medium" style={{ color: '#4a5568' }}>
                                Belum ada data laporan harian yang sesuai filter.
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {groupedLaporans.last_page > 1 && (
                        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                                Halaman {groupedLaporans.current_page} dari {groupedLaporans.last_page}
                            </span>
                            <div className="flex gap-1">
                                {groupedLaporans.links.map((link, key) => {
                                    if (link.url === null) {
                                        return (
                                            <span
                                                key={key}
                                                className="px-3 py-1 text-xs text-gray-400 border border-gray-200 rounded-md"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    }
                                    return (
                                        <Link
                                            key={key}
                                            href={link.url}
                                            className={`px-3 py-1 text-xs border rounded-md font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-[#003B70] text-white border-[#003B70]'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
