import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Building2, Plus, Pencil, Trash2 } from 'lucide-react';

interface PoBus {
    id_po: number;
    nama_po: string;
    alamat_po: string;
    no_telp_po: string;
}

interface IndexProps {
    poBuses: PoBus[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Perusahaan Otobus', href: '/admin/po-bus' },
];

export default function PoBusIndex({ poBuses }: IndexProps) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number, nama: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus PO "${nama}"?`)) {
            destroy(route('admin.po-bus.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Perusahaan Otobus — Terminal Parepare" />

            <div className="flex flex-col gap-6 p-6" style={{ backgroundColor: '#f9f7f3' }}>
                {/* Header */}
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
                            Perusahaan Otobus (PO)
                        </h1>
                        <p className="mt-1 text-sm" style={{ color: '#4a5568' }}>
                            Kelola data perusahaan otobus penerima/pengirim bus di Terminal Parepare
                        </p>
                    </div>

                    <Link
                        href={route('admin.po-bus.create')}
                        className="btn-damri-primary inline-flex items-center gap-2 text-sm"
                    >
                        <Plus size={16} />
                        Tambah PO Bus
                    </Link>
                </div>

                {/* Table Card */}
                <div
                    className="overflow-hidden"
                    style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #d4cfc6',
                        borderRadius: '16px',
                    }}
                >
                    {poBuses && poBuses.length > 0 ? (
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: '1px solid #d4cfc6', backgroundColor: '#f9f7f3' }}>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#4a5568' }}>
                                        Nama PO
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#4a5568' }}>
                                        Alamat
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#4a5568' }}>
                                        No. Telepon
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: '#4a5568' }}>
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {poBuses.map((po, idx) => (
                                    <tr
                                        key={po.id_po}
                                        style={{
                                            borderBottom: idx < poBuses.length - 1 ? '1px solid #f0ede6' : 'none',
                                        }}
                                    >
                                        <td className="px-4 py-3 font-semibold" style={{ color: '#001A33' }}>
                                            {po.nama_po}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {po.alamat_po}
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs font-medium" style={{ color: '#003B70' }}>
                                            {po.no_telp_po}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={route('admin.po-bus.edit', po.id_po)}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full"
                                                    style={{ backgroundColor: '#f0ede6', color: '#003B70' }}
                                                    title="Edit"
                                                >
                                                    <Pencil size={14} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(po.id_po, po.nama_po)}
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
                            <Building2 size={36} color="#d4cfc6" className="mx-auto mb-3" />
                            <p className="text-sm font-medium" style={{ color: '#4a5568' }}>
                                Belum ada data Perusahaan Otobus.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
