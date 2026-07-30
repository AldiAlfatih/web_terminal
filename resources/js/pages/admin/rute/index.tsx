import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Map, Plus, Pencil, Trash2, ArrowRight } from 'lucide-react';

interface RuteItem {
    id_rute: number;
    asal: string;
    tujuan: string;
    keterangan_rute: string | null;
}

interface IndexProps {
    rutes: RuteItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Rute', href: '/admin/rute' },
];

export default function RuteIndex({ rutes }: IndexProps) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number, asal: string, tujuan: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus rute "${asal} - ${tujuan}"?`)) {
            destroy(route('admin.rute.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rute Keberangkatan — Terminal Parepare" />

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
                            Rute Keberangkatan
                        </h1>
                        <p className="mt-1 text-sm" style={{ color: '#4a5568' }}>
                            Daftar rute trayek bus dari dan menuju Terminal Induk Parepare
                        </p>
                    </div>

                    <Link
                        href={route('admin.rute.create')}
                        className="btn-damri-primary inline-flex items-center gap-2 text-sm"
                    >
                        <Plus size={16} />
                        Tambah Rute
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
                    {rutes && rutes.length > 0 ? (
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: '1px solid #d4cfc6', backgroundColor: '#f9f7f3' }}>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#4a5568' }}>
                                        Kota Asal
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#4a5568' }}>
                                        Kota Tujuan
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#4a5568' }}>
                                        Keterangan
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: '#4a5568' }}>
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {rutes.map((r, idx) => (
                                    <tr
                                        key={r.id_rute}
                                        style={{
                                            borderBottom: idx < rutes.length - 1 ? '1px solid #f0ede6' : 'none',
                                        }}
                                    >
                                        <td className="px-4 py-3 font-semibold" style={{ color: '#001A33' }}>
                                            {r.asal}
                                        </td>
                                        <td className="px-4 py-3 font-semibold" style={{ color: '#003B70' }}>
                                            <span className="inline-flex items-center gap-1.5">
                                                <ArrowRight size={14} color="#FFC627" />
                                                {r.tujuan}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {r.keterangan_rute || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={route('admin.rute.edit', r.id_rute)}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full"
                                                    style={{ backgroundColor: '#f0ede6', color: '#003B70' }}
                                                    title="Edit"
                                                >
                                                    <Pencil size={14} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(r.id_rute, r.asal, r.tujuan)}
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
                            <Map size={36} color="#d4cfc6" className="mx-auto mb-3" />
                            <p className="text-sm font-medium" style={{ color: '#4a5568' }}>
                                Belum ada data rute trayek.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
