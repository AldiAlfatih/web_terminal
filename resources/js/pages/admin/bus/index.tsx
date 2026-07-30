import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Bus as BusIcon, Plus, Pencil, Trash2 } from 'lucide-react';

interface BusItem {
    id_bus: number;
    id_po: number;
    nama_bus: string;
    nomor_polisi: string;
    po_bus?: {
        nama_po: string;
    };
}

interface IndexProps {
    buses: BusItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Data Bus', href: '/admin/bus' },
];

export default function BusIndex({ buses }: IndexProps) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number, nama: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus armada bus "${nama}"?`)) {
            destroy(route('admin.bus.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Bus — Terminal Parepare" />

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
                            Armada Bus
                        </h1>
                        <p className="mt-1 text-sm" style={{ color: '#4a5568' }}>
                            Daftar seluruh bus terdaftar yang beroperasi di Terminal Parepare
                        </p>
                    </div>

                    <Link
                        href={route('admin.bus.create')}
                        className="btn-damri-primary inline-flex items-center gap-2 text-sm"
                    >
                        <Plus size={16} />
                        Tambah Bus
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
                    {buses && buses.length > 0 ? (
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: '1px solid #d4cfc6', backgroundColor: '#f9f7f3' }}>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#4a5568' }}>
                                        Nama Bus
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#4a5568' }}>
                                        PO Bus
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#4a5568' }}>
                                        Nomor Polisi (Plat)
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: '#4a5568' }}>
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {buses.map((b, idx) => (
                                    <tr
                                        key={b.id_bus}
                                        style={{
                                            borderBottom: idx < buses.length - 1 ? '1px solid #f0ede6' : 'none',
                                        }}
                                    >
                                        <td className="px-4 py-3 font-semibold" style={{ color: '#001A33' }}>
                                            {b.nama_bus}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {b.po_bus?.nama_po || '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className="inline-block rounded-md px-2.5 py-1 text-xs font-bold tracking-wider"
                                                style={{
                                                    backgroundColor: '#001A33',
                                                    color: '#FFC627',
                                                    fontFamily: "'JetBrains Mono', monospace",
                                                }}
                                            >
                                                {b.nomor_polisi}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={route('admin.bus.edit', b.id_bus)}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full"
                                                    style={{ backgroundColor: '#f0ede6', color: '#003B70' }}
                                                    title="Edit"
                                                >
                                                    <Pencil size={14} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(b.id_bus, b.nama_bus)}
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
                            <BusIcon size={36} color="#d4cfc6" className="mx-auto mb-3" />
                            <p className="text-sm font-medium" style={{ color: '#4a5568' }}>
                                Belum ada armada bus terdaftar.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
