import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, FileUp, Save } from 'lucide-react';
import { FormEventHandler } from 'react';

interface LaporanItem {
    id_laporan?: number;
    jenis_laporan?: string;
    periode_awal?: string;
    tanggal_laporan?: string;
    file_pdf?: string | null;
}

interface FormProps {
    laporan: LaporanItem | null;
    jenisOptions: string[];
    defaultDates?: {
        periode_awal: string;
        tanggal_laporan: string;
    };
}

export default function LaporanForm({ laporan, jenisOptions, defaultDates }: FormProps) {
    const isEdit = !!laporan?.id_laporan;

    const { data, setData, post, put, processing, errors } = useForm<{
        jenis_laporan: string;
        periode_awal: string;
        tanggal_laporan: string;
        file_pdf: File | null;
        [key: string]: any;
    }>({
        jenis_laporan: laporan?.jenis_laporan || jenisOptions[0] || '',
        periode_awal: laporan?.periode_awal || defaultDates?.periode_awal || '',
        tanggal_laporan: laporan?.tanggal_laporan || defaultDates?.tanggal_laporan || '',
        file_pdf: null,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Laporan PDF', href: '/admin/laporan' },
        { title: isEdit ? 'Edit Laporan' : 'Buat Laporan', href: '#' },
    ];

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isEdit) {
            // Use post with _method put when uploading files
            post(route('admin.laporan.update', laporan.id_laporan), {
                headers: {
                    'X-HTTP-Method-Override': 'PUT',
                },
            });
        } else {
            post(route('admin.laporan.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${isEdit ? 'Edit' : 'Buat'} Laporan — Terminal Parepare`} />

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
                            {isEdit ? 'Edit Laporan' : 'Buat Laporan Baru'}
                        </h1>
                    </div>
                </div>

                <div
                    className="max-w-xl p-8"
                    style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #d4cfc6',
                        borderRadius: '16px',
                    }}
                >
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5" encType="multipart/form-data">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold" style={{ color: '#001A33' }}>
                                Jenis Laporan *
                            </label>
                            <select
                                value={data.jenis_laporan}
                                onChange={(e) => setData('jenis_laporan', e.target.value)}
                                className="input-damri"
                                required
                            >
                                {jenisOptions.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.jenis_laporan} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold" style={{ color: '#001A33' }}>
                                    Periode Awal *
                                </label>
                                <input
                                    type="date"
                                    value={data.periode_awal}
                                    onChange={(e) => setData('periode_awal', e.target.value)}
                                    className="input-damri font-mono text-sm"
                                    required
                                />
                                <InputError message={errors.periode_awal} />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold" style={{ color: '#001A33' }}>
                                    Periode Akhir / Tanggal Laporan *
                                </label>
                                <input
                                    type="date"
                                    value={data.tanggal_laporan}
                                    onChange={(e) => setData('tanggal_laporan', e.target.value)}
                                    className="input-damri font-mono text-sm"
                                    required
                                />
                                <InputError message={errors.tanggal_laporan} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold" style={{ color: '#001A33' }}>
                                Upload Berkas PDF (Opsional)
                            </label>
                            <div className="flex items-center gap-3 border p-3 rounded-2xl bg-gray-50 border-dashed border-gray-300">
                                <FileUp size={24} className="text-gray-400 shrink-0" />
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(e) => setData('file_pdf', e.target.files ? e.target.files[0] : null)}
                                    className="text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-navy-900 file:text-amber-400"
                                />
                            </div>
                            <p className="text-[11px] text-gray-500">
                                Format .pdf, maksimal 10MB. Jika tidak mengunggah file, sistem akan membuat dokumen laporan cetak otomatis berdasarkan data database.
                            </p>
                            <InputError message={errors.file_pdf} />
                        </div>

                        <div className="mt-4 flex items-center justify-end gap-3">
                            <Link
                                href={route('admin.laporan.index')}
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
                                {processing ? 'Menyimpan...' : 'Simpan Laporan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
