import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { FormEventHandler } from 'react';

interface BusOption {
    id_bus: number;
    nama_bus: string;
    nomor_polisi: string;
    po_bus?: {
        nama_po: string;
    };
}

interface RuteOption {
    id_rute: number;
    asal: string;
    tujuan: string;
}

interface JadwalItem {
    id_jadwal?: number;
    id_bus?: number;
    id_rute?: number;
    tanggal?: string;
    jam_keberangkatan?: string;
    jam_kedatangan?: string;
    status_bus?: 'menunggu' | 'berangkat' | 'selesai';
    keterangan?: string;
}

interface FormProps {
    jadwal: JadwalItem | null;
    buses: BusOption[];
    rutes: RuteOption[];
}

export default function JadwalForm({ jadwal, buses, rutes }: FormProps) {
    const isEdit = !!jadwal?.id_jadwal;

    const todayStr = new Date().toISOString().split('T')[0];

    const { data, setData, post, put, processing, errors } = useForm<{
        id_bus: string | number;
        id_rute: string | number;
        tanggal: string;
        jam_keberangkatan: string;
        jam_kedatangan: string;
        status_bus: 'menunggu' | 'berangkat' | 'selesai';
        keterangan: string;
        [key: string]: any;
    }>({
        id_bus: jadwal?.id_bus || '',
        id_rute: jadwal?.id_rute || '',
        tanggal: jadwal?.tanggal || todayStr,
        jam_keberangkatan: jadwal?.jam_keberangkatan ? jadwal.jam_keberangkatan.slice(0, 5) : '08:00',
        jam_kedatangan: jadwal?.jam_kedatangan ? jadwal.jam_kedatangan.slice(0, 5) : '12:00',
        status_bus: jadwal?.status_bus || 'menunggu',
        keterangan: jadwal?.keterangan || '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Jadwal Bus', href: '/admin/jadwal' },
        { title: isEdit ? 'Edit Jadwal' : 'Tambah Jadwal', href: '#' },
    ];

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.jadwal.update', jadwal.id_jadwal));
        } else {
            post(route('admin.jadwal.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${isEdit ? 'Edit' : 'Tambah'} Jadwal — Terminal Parepare`} />

            <div className="flex flex-col gap-6 p-6" style={{ backgroundColor: '#f9f7f3' }}>
                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.jadwal.index')}
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
                            {isEdit ? 'Edit Jadwal Keberangkatan' : 'Tambah Jadwal Keberangkatan'}
                        </h1>
                    </div>
                </div>

                <div
                    className="max-w-2xl p-8"
                    style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #d4cfc6',
                        borderRadius: '16px',
                    }}
                >
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold" style={{ color: '#001A33' }}>
                                    Pilih Armada Bus *
                                </label>
                                <select
                                    value={data.id_bus}
                                    onChange={(e) => setData('id_bus', e.target.value)}
                                    className="input-damri"
                                    required
                                >
                                    <option value="">-- Pilih Bus --</option>
                                    {buses.map((b) => (
                                        <option key={b.id_bus} value={b.id_bus}>
                                            {b.nama_bus} ({b.nomor_polisi}) - {b.po_bus?.nama_po}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.id_bus} />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold" style={{ color: '#001A33' }}>
                                    Pilih Rute Trayek *
                                </label>
                                <select
                                    value={data.id_rute}
                                    onChange={(e) => setData('id_rute', e.target.value)}
                                    className="input-damri"
                                    required
                                >
                                    <option value="">-- Pilih Rute --</option>
                                    {rutes.map((r) => (
                                        <option key={r.id_rute} value={r.id_rute}>
                                            {r.asal} → {r.tujuan}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.id_rute} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold" style={{ color: '#001A33' }}>
                                    Tanggal *
                                </label>
                                <input
                                    type="date"
                                    value={data.tanggal}
                                    onChange={(e) => setData('tanggal', e.target.value)}
                                    className="input-damri font-mono text-sm"
                                    required
                                />
                                <InputError message={errors.tanggal} />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold" style={{ color: '#001A33' }}>
                                    Jam Keberangkatan *
                                </label>
                                <input
                                    type="time"
                                    value={data.jam_keberangkatan}
                                    onChange={(e) => setData('jam_keberangkatan', e.target.value)}
                                    className="input-damri font-mono text-sm"
                                    required
                                />
                                <InputError message={errors.jam_keberangkatan} />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold" style={{ color: '#001A33' }}>
                                    Estimasi Jam Tiba *
                                </label>
                                <input
                                    type="time"
                                    value={data.jam_kedatangan}
                                    onChange={(e) => setData('jam_kedatangan', e.target.value)}
                                    className="input-damri font-mono text-sm"
                                    required
                                />
                                <InputError message={errors.jam_kedatangan} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold" style={{ color: '#001A33' }}>
                                Status Bus *
                            </label>
                            <select
                                value={data.status_bus}
                                onChange={(e) => setData('status_bus', e.target.value as any)}
                                className="input-damri"
                                required
                            >
                                <option value="menunggu">Menunggu Keberangkatan</option>
                                <option value="berangkat">Sedang Berangkat (Di Jalan)</option>
                                <option value="selesai">Selesai / Tiba di Tujuan</option>
                            </select>
                            <InputError message={errors.status_bus} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold" style={{ color: '#001A33' }}>
                                Catatan / Keterangan (Opsional)
                            </label>
                            <textarea
                                value={data.keterangan}
                                onChange={(e) => setData('keterangan', e.target.value)}
                                placeholder="Contoh: Bus mengalami keterlambatan 15 menit karena cuaca"
                                className="input-damri"
                                style={{ borderRadius: '16px', minHeight: '80px' }}
                            />
                            <InputError message={errors.keterangan} />
                        </div>

                        <div className="mt-4 flex items-center justify-end gap-3">
                            <Link
                                href={route('admin.jadwal.index')}
                                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold"
                                style={{ backgroundColor: '#f0ede6', color: '#4a5568' }}
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn-damri-primary text-sm"
                            >
                                <Save size={16} />
                                {processing ? 'Menyimpan...' : 'Simpan Jadwal'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
