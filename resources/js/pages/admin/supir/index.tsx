import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Pencil, Phone, Plus, Trash2, UserCheck } from 'lucide-react';

interface SupirItem {
    id_supir: number;
    nama_supir: string;
    no_telp: string;
    username: string;
}

interface IndexProps {
    supirs: SupirItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Data Supir', href: '/admin/supir' },
];

export default function SupirIndex({ supirs }: IndexProps) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number, nama: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus supir "${nama}"?`)) {
            destroy(route('admin.supir.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Supir — Terminal Parepare" />

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
                            Data Supir
                        </h1>
                        <p className="mt-1 text-sm" style={{ color: '#4a5568' }}>
                            Daftar seluruh supir yang terdaftar di Terminal Parepare
                        </p>
                    </div>

                    <Link
                        href={route('admin.supir.create')}
                        className="btn-damri-primary inline-flex items-center gap-2 text-sm"
                    >
                        <Plus size={16} />
                        Tambah Supir
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
                    {supirs && supirs.length > 0 ? (
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: '1px solid #d4cfc6', backgroundColor: '#f9f7f3' }}>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#4a5568' }}>
                                        Nama Supir
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#4a5568' }}>
                                        No. Telepon
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#4a5568' }}>
                                        Username
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: '#4a5568' }}>
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {supirs.map((s, idx) => (
                                    <tr
                                        key={s.id_supir}
                                        style={{
                                            borderBottom: idx < supirs.length - 1 ? '1px solid #f0ede6' : 'none',
                                        }}
                                    >
                                        <td className="px-4 py-3 font-semibold" style={{ color: '#001A33' }}>
                                            {s.nama_supir}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            <span className="inline-flex items-center gap-1">
                                                <Phone size={12} className="text-gray-400" />
                                                {s.no_telp}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
                                                style={{ backgroundColor: '#f0ede6', color: '#003B70' }}
                                            >
                                                {s.username}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={route('admin.supir.edit', s.id_supir)}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full"
                                                    style={{ backgroundColor: '#f0ede6', color: '#003B70' }}
                                                    title="Edit"
                                                >
                                                    <Pencil size={14} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(s.id_supir, s.nama_supir)}
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
                            <UserCheck size={36} color="#d4cfc6" className="mx-auto mb-3" />
                            <p className="text-sm font-medium" style={{ color: '#4a5568' }}>
                                Belum ada supir terdaftar.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
