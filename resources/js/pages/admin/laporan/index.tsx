import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Calendar, Download, Eye, FileCheck, FileText, Pencil, Plus, Printer, Trash2 } from 'lucide-react';

interface LaporanItem {
    id_laporan: number;
    tanggal_laporan: string;
    periode_awal: string;
    jenis_laporan: string;
    file_pdf: string | null;
    admin?: {
        nama_admin: string;
    };
}

interface IndexProps {
    laporans: LaporanItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Laporan PDF', href: '/admin/laporan' },
];

export default function LaporanIndex({ laporans }: IndexProps) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number, jenis: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus laporan "${jenis}"?`)) {
            destroy(route('admin.laporan.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan PDF — Terminal Parepare" />

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
                            Laporan PDF & Operasional
                        </h1>
                        <p className="mt-1 text-sm" style={{ color: '#4a5568' }}>
                            Manajemen dan pembuatan rekapitulasi laporan resmi Terminal Induk Parepare
                        </p>
                    </div>

                    <Link
                        href={route('admin.laporan.create')}
                        className="btn-damri-primary inline-flex items-center gap-2 text-sm"
                    >
                        <Plus size={16} />
                        Buat / Upload Laporan
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
                    {laporans && laporans.length > 0 ? (
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: '1px solid #d4cfc6', backgroundColor: '#f9f7f3' }}>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#4a5568' }}>
                                        Jenis Laporan
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#4a5568' }}>
                                        Periode Laporan
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#4a5568' }}>
                                        Tanggal Dibuat
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#4a5568' }}>
                                        Pembuat (Admin)
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#4a5568' }}>
                                        File PDF
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: '#4a5568' }}>
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {laporans.map((l, idx) => (
                                    <tr
                                        key={l.id_laporan}
                                        style={{
                                            borderBottom: idx < laporans.length - 1 ? '1px solid #f0ede6' : 'none',
                                        }}
                                    >
                                        <td className="px-4 py-3 font-semibold" style={{ color: '#001A33' }}>
                                            <div className="flex items-center gap-2">
                                                <FileText size={16} color="#003B70" />
                                                <span>{l.jenis_laporan}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs text-gray-700">
                                            {l.periode_awal?.slice(0, 10)} s.d. {l.tanggal_laporan?.slice(0, 10)}
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs text-gray-600">
                                            {l.tanggal_laporan?.slice(0, 10)}
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">
                                            {l.admin?.nama_admin || '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {l.file_pdf ? (
                                                <a
                                                    href={l.file_pdf}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs font-bold hover:underline"
                                                    style={{ color: '#003B70' }}
                                                >
                                                    <Download size={13} />
                                                    Download PDF
                                                </a>
                                            ) : (
                                                <span className="text-xs text-amber-600 font-medium">
                                                    Generasi Sistem
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={route('admin.laporan.show', l.id_laporan)}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full"
                                                    style={{ backgroundColor: '#003B70', color: '#FFC627' }}
                                                    title="Lihat / Cetak Laporan"
                                                >
                                                    <Printer size={14} />
                                                </Link>
                                                <Link
                                                    href={route('admin.laporan.edit', l.id_laporan)}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full"
                                                    style={{ backgroundColor: '#f0ede6', color: '#003B70' }}
                                                    title="Edit"
                                                >
                                                    <Pencil size={14} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(l.id_laporan, l.jenis_laporan)}
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
                            <FileCheck size={36} color="#d4cfc6" className="mx-auto mb-3" />
                            <p className="text-sm font-medium" style={{ color: '#4a5568' }}>
                                Belum ada dokumen laporan yang dibuat.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
