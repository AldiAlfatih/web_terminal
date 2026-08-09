import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Bus, Save, ShieldAlert, Users } from 'lucide-react';
import { FormEventHandler, useEffect } from 'react';

interface OngoingTrip {
    id_jadwal: number;
    label: string;
    nama_po: string;
    nomor_polisi: string;
    asal: string;
    tujuan: string;
    nama_supir: string;
    jam_keberangkatan: string;
}

interface LaporanEditItem {
    id_laporan?: number;
    source_type?: string;
    source_trip_id?: number | null;
    submitted_at?: string;
    nama_po?: string;
    nomor_polisi?: string;
    asal?: string;
    tujuan?: string;
    nama_supir?: string;
    seat?: number;
    pnp?: number;
    naik?: number;
    turun?: number;
    akap_akdp?: string;
}

interface FormProps {
    laporan: LaporanEditItem | null;
    ongoingTrips: OngoingTrip[];
    poList: string[];
    platList: string[];
    asalList: string[];
    tujuanList: string[];
}

export default function LaporanForm({
    laporan,
    ongoingTrips = [],
    poList = [],
    platList = [],
    asalList = [],
    tujuanList = [],
}: FormProps) {
    const isEdit = !!laporan?.id_laporan;

    const { data, setData, post, put, processing, errors } = useForm({
        source_type: laporan?.source_type || 'trip',
        source_trip_id: laporan?.source_trip_id || (ongoingTrips.length > 0 ? ongoingTrips[0].id_jadwal : ''),
        nama_po: laporan?.nama_po || '',
        nomor_polisi: laporan?.nomor_polisi || '',
        asal: laporan?.asal || '',
        tujuan: laporan?.tujuan || '',
        nama_supir: laporan?.nama_supir || '',
        seat: laporan?.seat ?? 0,
        pnp: laporan?.pnp ?? 0,
        naik: laporan?.naik ?? 0,
        turun: laporan?.turun ?? 0,
        akap_akdp: laporan?.akap_akdp || 'AKDP',
    });

    // Auto-fill when selecting an ongoing trip
    const handleTripSelect = (tripIdStr: string) => {
        const tripId = Number(tripIdStr);
        setData('source_trip_id', tripIdStr);

        const selectedTrip = ongoingTrips.find((t) => t.id_jadwal === tripId);
        if (selectedTrip) {
            setData((prevData) => ({
                ...prevData,
                source_trip_id: tripIdStr,
                nama_po: selectedTrip.nama_po,
                nomor_polisi: selectedTrip.nomor_polisi,
                asal: selectedTrip.asal,
                tujuan: selectedTrip.tujuan,
                nama_supir: selectedTrip.nama_supir || prevData.nama_supir,
            }));
        }
    };

    // On initial mount in create mode with 'trip' selected, auto fill first trip if available
    useEffect(() => {
        if (!isEdit && data.source_type === 'trip' && ongoingTrips.length > 0 && !data.nama_po) {
            const firstTrip = ongoingTrips[0];
            setData((prev) => ({
                ...prev,
                source_trip_id: firstTrip.id_jadwal,
                nama_po: firstTrip.nama_po,
                nomor_polisi: firstTrip.nomor_polisi,
                asal: firstTrip.asal,
                tujuan: firstTrip.tujuan,
                nama_supir: firstTrip.nama_supir || '',
            }));
        }
    }, [data.source_type]);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Laporan Harian Operasional', href: '/admin/laporan' },
        { title: isEdit ? 'Edit Laporan' : 'Buat Laporan Baru', href: '#' },
    ];

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isEdit && laporan?.id_laporan) {
            put(route('admin.laporan.update', laporan.id_laporan));
        } else {
            post(route('admin.laporan.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${isEdit ? 'Edit' : 'Buat'} Laporan Operasional Bus — Terminal Parepare`} />

            <div className="flex flex-col gap-6 p-6" style={{ backgroundColor: '#f9f7f3' }}>
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
                            {isEdit ? 'Edit Laporan Operasional' : 'Buat Laporan Operasional Baru'}
                        </h1>
                        <p className="mt-1 text-xs text-slate-600">
                            Pencatatan data perjalanan dan operasional bus Terminal Induk Parepare.
                        </p>
                    </div>
                </div>

                <div
                    className="max-w-3xl p-6 md:p-8"
                    style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #d4cfc6',
                        borderRadius: '16px',
                    }}
                >
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {/* Section 1: Choice of Data Source */}
                        {!isEdit && (
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                                    <Bus size={16} className="text-blue-900" />
                                    SUMBER DATA PERJALANAN *
                                </label>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm font-semibold">
                                    <label className="inline-flex items-center gap-2 cursor-pointer text-slate-900">
                                        <input
                                            type="radio"
                                            name="source_type"
                                            value="trip"
                                            checked={data.source_type === 'trip'}
                                            onChange={() => setData('source_type', 'trip')}
                                            className="h-4 w-4 text-blue-900 focus:ring-blue-800 border-gray-300"
                                        />
                                        <span>Pilih dari Perjalanan Berjalan</span>
                                    </label>
                                    <label className="inline-flex items-center gap-2 cursor-pointer text-slate-900">
                                        <input
                                            type="radio"
                                            name="source_type"
                                            value="manual"
                                            checked={data.source_type === 'manual'}
                                            onChange={() => setData('source_type', 'manual')}
                                            className="h-4 w-4 text-blue-900 focus:ring-blue-800 border-gray-300"
                                        />
                                        <span>Input Perjalanan Manual</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Mode A: Select from Ongoing Trips */}
                        {!isEdit && data.source_type === 'trip' && (
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-900">
                                    Pilih Perjalanan Berjalan (STATUS = BERANGKAT) *
                                </label>
                                {ongoingTrips.length > 0 ? (
                                    <select
                                        value={data.source_trip_id}
                                        onChange={(e) => handleTripSelect(e.target.value)}
                                        className="input-damri font-medium text-sm py-2 px-3"
                                        required
                                    >
                                        <option value="" disabled>
                                            -- Pilih Perjalanan Berjalan --
                                        </option>
                                        {ongoingTrips.map((trip) => (
                                            <option key={trip.id_jadwal} value={trip.id_jadwal}>
                                                {trip.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2 font-medium">
                                        <ShieldAlert size={16} />
                                        Tidak ada perjalanan yang sedang berjalan saat ini. Silakan gunakan opsi Input Perjalanan Manual.
                                    </div>
                                )}
                                <InputError message={errors.source_trip_id} />
                            </div>
                        )}

                        {/* Section 2: Trip Detail Snapshot Fields */}
                        <div className="p-4 rounded-2xl border border-slate-200 bg-gray-50 flex flex-col gap-4">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                INFORMASI PERJALANAN BUS
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Nama PO */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-800">
                                        Nama PO *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nama_po}
                                        onChange={(e) => setData('nama_po', e.target.value)}
                                        placeholder="Contoh: PO DAMRI / Bintang Prima"
                                        className="input-damri text-sm"
                                        readOnly={!isEdit && data.source_type === 'trip'}
                                        required
                                    />
                                    <InputError message={errors.nama_po} />
                                </div>

                                {/* No. Plat */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-800">
                                        No. Plat (Nomor Polisi) *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nomor_polisi}
                                        onChange={(e) => setData('nomor_polisi', e.target.value)}
                                        placeholder="Contoh: DD 1234 AB"
                                        className="input-damri font-mono text-sm uppercase"
                                        readOnly={!isEdit && data.source_type === 'trip'}
                                        required
                                    />
                                    <InputError message={errors.nomor_polisi} />
                                </div>

                                {/* Asal */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-800">
                                        Asal *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.asal}
                                        onChange={(e) => setData('asal', e.target.value)}
                                        placeholder="Contoh: Parepare"
                                        className="input-damri text-sm"
                                        readOnly={!isEdit && data.source_type === 'trip'}
                                        required
                                    />
                                    <InputError message={errors.asal} />
                                </div>

                                {/* Tujuan */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-800">
                                        Tujuan *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.tujuan}
                                        onChange={(e) => setData('tujuan', e.target.value)}
                                        placeholder="Contoh: Makassar"
                                        className="input-damri text-sm"
                                        readOnly={!isEdit && data.source_type === 'trip'}
                                        required
                                    />
                                    <InputError message={errors.tujuan} />
                                </div>
                            </div>

                            {/* Nama Supir — Editable by Admin */}
                            <div className="flex flex-col gap-1.5 pt-1">
                                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                                    <span>Nama Supir (Pengemudi) *</span>
                                    <span className="text-[11px] font-normal text-blue-700 italic">
                                        Dapat diubah bila pengemudi aktual berbeda
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={data.nama_supir}
                                    onChange={(e) => setData('nama_supir', e.target.value)}
                                    placeholder="Isi nama supir pengemudi..."
                                    className="input-damri font-medium text-sm border-blue-300 focus:border-blue-700"
                                    required
                                />
                                <InputError message={errors.nama_supir} />
                            </div>
                        </div>

                        {/* Section 3: Operational Fields (Seat, PNP, Naik, Turun, AKAP/AKDP) */}
                        <div className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col gap-4">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                <Users size={16} className="text-blue-900" />
                                DATA OPERASIONAL & PENUMPANG
                            </h2>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {/* LINTAS - Seat */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-800">
                                        Seat (Kapasitas Kursi) *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.seat}
                                        onChange={(e) => setData('seat', e.target.value === '' ? '' : Number(e.target.value))}
                                        className="input-damri font-mono text-sm font-bold"
                                        required
                                    />
                                    <InputError message={errors.seat} />
                                </div>

                                {/* LINTAS - PNP */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-800">
                                        PNP (Total Penumpang) *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.pnp}
                                        onChange={(e) => setData('pnp', e.target.value === '' ? '' : Number(e.target.value))}
                                        className="input-damri font-mono text-sm font-bold text-amber-800"
                                        required
                                    />
                                    <InputError message={errors.pnp} />
                                </div>

                                {/* PENUMPANG - Naik */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-800">
                                        Penumpang Naik *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.naik}
                                        onChange={(e) => setData('naik', e.target.value === '' ? '' : Number(e.target.value))}
                                        className="input-damri font-mono text-sm font-bold text-emerald-800"
                                        required
                                    />
                                    <InputError message={errors.naik} />
                                </div>

                                {/* PENUMPANG - Turun */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-800">
                                        Penumpang Turun *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.turun}
                                        onChange={(e) => setData('turun', e.target.value === '' ? '' : Number(e.target.value))}
                                        className="input-damri font-mono text-sm font-bold text-rose-800"
                                        required
                                    />
                                    <InputError message={errors.turun} />
                                </div>
                            </div>

                            {/* JENIS PERJALANAN - AKAP / AKDP */}
                            <div className="flex flex-col gap-1.5 pt-2">
                                <label className="text-xs font-semibold text-slate-800">
                                    Jenis Perjalanan (Trayek) *
                                </label>
                                <div className="flex items-center gap-6">
                                    <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-900">
                                        <input
                                            type="radio"
                                            name="akap_akdp"
                                            value="AKAP"
                                            checked={data.akap_akdp === 'AKAP'}
                                            onChange={() => setData('akap_akdp', 'AKAP')}
                                            className="h-4 w-4 text-cyan-700 border-gray-300"
                                        />
                                        <span className="px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 border border-cyan-300">
                                            AKAP (Antar Kota Antar Provinsi)
                                        </span>
                                    </label>

                                    <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-900">
                                        <input
                                            type="radio"
                                            name="akap_akdp"
                                            value="AKDP"
                                            checked={data.akap_akdp === 'AKDP'}
                                            onChange={() => setData('akap_akdp', 'AKDP')}
                                            className="h-4 w-4 text-amber-700 border-gray-300"
                                        />
                                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                                            AKDP (Antar Kota Dalam Provinsi)
                                        </span>
                                    </label>
                                </div>
                                <InputError message={errors.akap_akdp} />
                            </div>
                        </div>

                        {/* Waktu Notice (Section 11) */}
                        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs">
                            <strong>Informasi Waktu:</strong> Waktu pencatatan laporan (<code>submitted_at</code>) akan dibuat otomatis oleh server saat menekan tombol Submit.
                        </div>

                        {/* Submit Action Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <Link
                                href={route('admin.laporan.index')}
                                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn-damri-primary text-xs font-bold px-6 py-2.5 rounded-full inline-flex items-center gap-2 shadow-sm"
                            >
                                <Save size={16} />
                                {processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Submit Laporan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
