import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Eye, FileText, Layers, UserCheck } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface PdfFormProps {
    defaultDate: string;
    defaultMonth: number;
    defaultYear: number;
    years: number[];
    months: Record<number, string>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Laporan Harian Operasional', href: '/admin/laporan' },
    { title: 'Form Pembuatan PDF', href: '#' },
];

export default function LaporanPdfForm({
    defaultDate,
    defaultMonth,
    defaultYear,
    years,
    months,
}: PdfFormProps) {
    const [mode, setMode] = useState<'harian' | 'bulanan'>('harian');
    const [tanggal, setTanggal] = useState(defaultDate);
    const [bulan, setBulan] = useState(defaultMonth);
    const [tahun, setTahun] = useState(defaultYear);
    const [formatBulanan, setFormatBulanan] = useState<'separate' | 'merged'>('separate');
    const [namaKepala, setNamaKepala] = useState('Syamsuddin, S.STP');
    const [nipKepala, setNipKepala] = useState('19850412 201012 1 004');
    const [jabatanKepala, setJabatanKepala] = useState('Kepala Terminal Induk Parepare');

    const handlePreviewSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        router.get(
            route('admin.laporan.preview'),
            {
                mode,
                tanggal: mode === 'harian' ? tanggal : '',
                bulan: mode === 'bulanan' ? bulan : '',
                tahun: mode === 'bulanan' ? tahun : '',
                format_bulanan: mode === 'bulanan' ? formatBulanan : '',
                nama_kepala: namaKepala,
                nip_kepala: nipKepala,
                jabatan_kepala: jabatanKepala,
            },
            {
                preserveState: false,
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Form Pembuatan PDF Laporan Operasional — Terminal Parepare" />

            <div className="flex flex-col gap-6 p-6" style={{ backgroundColor: '#f9f7f3' }}>
                {/* Header Page */}
                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.laporan.index')}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full"
                        style={{ backgroundColor: '#ffffff', border: '1px solid #d4cfc6', color: '#001A33' }}
                    >
                        <ArrowLeft size={18} />
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
                            BUAT LAPORAN PDF
                        </h1>
                        <p className="mt-1 text-xs text-slate-600">
                            Tentukan periode dan format laporan resmi yang akan digenerate ke format PDF.
                        </p>
                    </div>
                </div>

                {/* Form Section */}
                <div
                    className="max-w-2xl p-6 md:p-8"
                    style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #d4cfc6',
                        borderRadius: '16px',
                    }}
                >
                    <form onSubmit={handlePreviewSubmit} className="flex flex-col gap-6">
                        {/* Section 1: Selection of Period Type */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                                <Calendar size={16} className="text-blue-900" />
                                JENIS PERIODE *
                            </label>
                            <div className="flex items-center gap-6 text-sm font-semibold">
                                <label className="inline-flex items-center gap-2 cursor-pointer text-slate-900">
                                    <input
                                        type="radio"
                                        name="mode"
                                        value="harian"
                                        checked={mode === 'harian'}
                                        onChange={() => setMode('harian')}
                                        className="h-4 w-4 text-blue-900 focus:ring-blue-800 border-gray-300"
                                    />
                                    <span>Harian</span>
                                </label>
                                <label className="inline-flex items-center gap-2 cursor-pointer text-slate-900">
                                    <input
                                        type="radio"
                                        name="mode"
                                        value="bulanan"
                                        checked={mode === 'bulanan'}
                                        onChange={() => setMode('bulanan')}
                                        className="h-4 w-4 text-blue-900 focus:ring-blue-800 border-gray-300"
                                    />
                                    <span>Bulanan</span>
                                </label>
                            </div>
                        </div>

                        {/* Mode Harian Options */}
                        {mode === 'harian' && (
                            <div className="flex flex-col gap-2 p-4 rounded-2xl border border-slate-200 bg-white">
                                <label className="text-xs font-semibold text-slate-800">
                                    Pilih Tanggal Laporan *
                                </label>
                                <input
                                    type="date"
                                    value={tanggal}
                                    onChange={(e) => setTanggal(e.target.value)}
                                    className="input-damri font-mono text-sm py-2 px-3 max-w-xs"
                                    required
                                />
                                <p className="text-[11px] text-slate-500 mt-1">
                                    PDF akan memuat seluruh laporan operasional perjalanan pada tanggal yang dipilih.
                                </p>
                            </div>
                        )}

                        {/* Mode Bulanan Options */}
                        {mode === 'bulanan' && (
                            <div className="flex flex-col gap-5 p-4 rounded-2xl border border-slate-200 bg-white">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Select Bulan */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-slate-800">
                                            Bulan *
                                        </label>
                                        <select
                                            value={bulan}
                                            onChange={(e) => setBulan(Number(e.target.value))}
                                            className="input-damri text-sm py-2 px-3"
                                            required
                                        >
                                            {Object.entries(months).map(([num, name]) => (
                                                <option key={num} value={num}>
                                                    {name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Select Tahun */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-slate-800">
                                            Tahun *
                                        </label>
                                        <select
                                            value={tahun}
                                            onChange={(e) => setTahun(Number(e.target.value))}
                                            className="input-damri text-sm py-2 px-3"
                                            required
                                        >
                                            {years.map((y) => (
                                                <option key={y} value={y}>
                                                    {y}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Format Laporan Bulanan Choice */}
                                <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                                        <Layers size={15} className="text-blue-900" />
                                        FORMAT LAPORAN BULANAN *
                                    </label>
                                    <div className="flex flex-col gap-3.5 pt-1">
                                        <label className="inline-flex items-start gap-2.5 cursor-pointer text-slate-900">
                                            <input
                                                type="radio"
                                                name="format_bulanan"
                                                value="separate"
                                                checked={formatBulanan === 'separate'}
                                                onChange={() => setFormatBulanan('separate')}
                                                className="h-4 w-4 mt-0.5 text-blue-900 focus:ring-blue-800 border-gray-300"
                                            />
                                            <div className="flex flex-col">
                                                <span className="font-bold text-xs">Pisahkan berdasarkan hari</span>
                                                <span className="text-[11px] text-slate-500">
                                                    Setiap tanggal dimulai pada halaman baru (Page Break otomatis antar-hari).
                                                </span>
                                            </div>
                                        </label>

                                        <label className="inline-flex items-start gap-2.5 cursor-pointer text-slate-900">
                                            <input
                                                type="radio"
                                                name="format_bulanan"
                                                value="merged"
                                                checked={formatBulanan === 'merged'}
                                                onChange={() => setFormatBulanan('merged')}
                                                className="h-4 w-4 mt-0.5 text-blue-900 focus:ring-blue-800 border-gray-300"
                                            />
                                            <div className="flex flex-col">
                                                <span className="font-bold text-xs">Gabungkan semua laporan</span>
                                                <span className="text-[11px] text-slate-500">
                                                    Seluruh laporan bulan tersebut ditampilkan sebagai satu rangkaian berlanjut.
                                                </span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Section: Penandatangan Laporan */}
                        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col gap-3">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                                <UserCheck size={16} className="text-blue-900" />
                                PENANDATANGAN LAPORAN (KEPALA TERMINAL)
                            </label>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-slate-700">Nama Kepala Terminal</label>
                                    <input
                                        type="text"
                                        value={namaKepala}
                                        onChange={(e) => setNamaKepala(e.target.value)}
                                        className="input-damri text-xs py-2 px-3"
                                        placeholder="Syamsuddin, S.STP"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-slate-700">NIP Kepala Terminal</label>
                                    <input
                                        type="text"
                                        value={nipKepala}
                                        onChange={(e) => setNipKepala(e.target.value)}
                                        className="input-damri text-xs py-2 px-3 font-mono"
                                        placeholder="19850412 201012 1 004"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-slate-700">Jabatan Penandatangan</label>
                                <input
                                    type="text"
                                    value={jabatanKepala}
                                    onChange={(e) => setJabatanKepala(e.target.value)}
                                    className="input-damri text-xs py-2 px-3"
                                    placeholder="Kepala Terminal Induk Parepare"
                                    required
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <Link
                                href={route('admin.laporan.index')}
                                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                className="btn-damri-primary text-xs font-bold px-6 py-2.5 rounded-full inline-flex items-center gap-2 shadow-sm"
                            >
                                <Eye size={16} />
                                Preview Laporan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
