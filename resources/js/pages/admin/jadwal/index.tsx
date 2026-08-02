import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Calendar, Plus, Pencil, Trash2, ArrowRight } from 'lucide-react';

interface JadwalItem {
    id_jadwal: number;
    tanggal: string;
    jam_keberangkatan: string;
    jam_kedatangan: string;
    status_bus: 'menunggu' | 'berangkat' | 'selesai';
    keterangan: string | null;
    bus?: {
        nama_bus: string;
        nomor_polisi: string;
        po_bus?: {
            nama_po: string;
        };
    };
    rute?: {
        asal: string;
        tujuan: string;
    };
    supir?: {
        nama_supir: string;
    } | null;
}

interface IndexProps {
    jadwals: JadwalItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Jadwal Bus', href: '/admin/jadwal' },
];

const StatusBadge = ({ status }: { status: 'menunggu' | 'berangkat' | 'selesai' }) => {
    const map = {
        menunggu: { label: 'Menunggu', cls: 'badge-menunggu' },
        berangkat: { label: 'Berangkat', cls: 'badge-berangkat' },
        selesai: { label: 'Selesai', cls: 'badge-selesai' },
    };
    const { label, cls } = map[status] || map.menunggu;
    return <span className={cls}>{label}</span>;
};

export default function JadwalIndex({ jadwals }: IndexProps) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
            destroy(route('admin.jadwal.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Jadwal Bus — Terminal Parepare" />

            <div className="flex flex-col gap-6 p-6" style={{ backgroundColor: '#f9f7f3' }}>
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
                            Jadwal Keberangkatan & Kedatangan
                        </h1>
                        <p className="mt-1 text-sm" style={{ color: '#4a5568' }}>
                            Manajemen operasional jadwal bus Terminal Induk Parepare
                        </p>
                    </div>

                    <Link
                        href={route('admin.jadwal.create')}
                        className="btn-damri-primary inline-flex items-center gap-2 text-sm"
                    >
                        <Plus size={16} />
                        Tambah Jadwal
                    </Link>
                </div>

                <div
                    className="overflow-hidden"
                    style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #d4cfc6',
                        borderRadius: '16px',
                    }}
                >
                    {jadwals && jadwals.length > 0 ? (
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: '1px solid #d4cfc6', backgroundColor: '#f9f7f3' }}>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#4a5568' }}>
                                        Tanggal
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#4a5568' }}>
                                        Armada Bus & PO
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#4a5568' }}>
                                        Rute Trayek
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#4a5568' }}>
                                        Jam Berangkat / Tiba
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#4a5568' }}>
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#4a5568' }}>
                                        Supir
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: '#4a5568' }}>
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {jadwals.map((j, idx) => (
                                    <tr
                                        key={j.id_jadwal}
                                        style={{
                                            borderBottom: idx < jadwals.length - 1 ? '1px solid #f0ede6' : 'none',
                                        }}
                                    >
                                        <td className="px-4 py-3 font-mono text-xs font-semibold" style={{ color: '#001A33' }}>
                                            {j.tanggal}
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-semibold" style={{ color: '#001A33' }}>
                                                {j.bus?.nama_bus || '-'}
                                            </p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span
                                                    className="inline-block rounded px-1.5 py-0.5 text-[10px] font-bold"
                                                    style={{
                                                        backgroundColor: '#001A33',
                                                        color: '#FFC627',
                                                        fontFamily: "'JetBrains Mono', monospace",
                                                    }}
                                                >
                                                    {j.bus?.nomor_polisi}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {j.bus?.po_bus?.nama_po}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-medium" style={{ color: '#001A33' }}>
                                            <span className="inline-flex items-center gap-1">
                                                {j.rute?.asal} <ArrowRight size={13} color="#FFC627" /> {j.rute?.tujuan}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-mono text-xs">
                                                <span className="font-bold text-blue-900">{j.jam_keberangkatan?.slice(0, 5)}</span>
                                                <span className="text-gray-400 mx-1">→</span>
                                                <span className="text-gray-600">{j.jam_kedatangan?.slice(0, 5)}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={j.status_bus} />
                                        </td>
                                        <td className="px-4 py-3 text-sm" style={{ color: '#001A33' }}>
                                            {j.supir?.nama_supir || (
                                                <span className="text-xs text-gray-400 italic">Belum ditugaskan</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={route('admin.jadwal.edit', j.id_jadwal)}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full"
                                                    style={{ backgroundColor: '#f0ede6', color: '#003B70' }}
                                                    title="Edit"
                                                >
                                                    <Pencil size={14} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(j.id_jadwal)}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full"
                                                    style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="py-12 text-center">
                            <Calendar size={36} color="#d4cfc6" className="mx-auto mb-3" />
                            <p className="text-sm font-medium" style={{ color: '#4a5568' }}>
                                Belum ada data jadwal bus.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
