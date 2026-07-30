import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Building2, Save } from 'lucide-react';
import { FormEventHandler } from 'react';

interface PoBus {
    id_po?: number;
    nama_po?: string;
    alamat_po?: string;
    no_telp_po?: string;
}

interface FormProps {
    poBus: PoBus | null;
}

export default function PoBusForm({ poBus }: FormProps) {
    const isEdit = !!poBus?.id_po;

    const { data, setData, post, put, processing, errors } = useForm<{
        nama_po: string;
        alamat_po: string;
        no_telp_po: string;
        [key: string]: any;
    }>({
        nama_po: poBus?.nama_po || '',
        alamat_po: poBus?.alamat_po || '',
        no_telp_po: poBus?.no_telp_po || '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Perusahaan Otobus', href: '/admin/po-bus' },
        { title: isEdit ? 'Edit PO' : 'Tambah PO', href: '#' },
    ];

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.po-bus.update', poBus.id_po));
        } else {
            post(route('admin.po-bus.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${isEdit ? 'Edit' : 'Tambah'} PO Bus — Terminal Parepare`} />

            <div className="flex flex-col gap-6 p-6" style={{ backgroundColor: '#f9f7f3' }}>
                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.po-bus.index')}
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
                            {isEdit ? 'Edit PO Bus' : 'Tambah PO Bus Baru'}
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
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold" style={{ color: '#001A33' }}>
                                Nama PO Bus *
                            </label>
                            <input
                                type="text"
                                value={data.nama_po}
                                onChange={(e) => setData('nama_po', e.target.value)}
                                placeholder="Contoh: PO DAMRI"
                                className="input-damri"
                                required
                            />
                            <InputError message={errors.nama_po} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold" style={{ color: '#001A33' }}>
                                Alamat PO *
                            </label>
                            <textarea
                                value={data.alamat_po}
                                onChange={(e) => setData('alamat_po', e.target.value)}
                                placeholder="Masukkan alamat lengkap kantor / garasi PO"
                                className="input-damri"
                                style={{ borderRadius: '16px', minHeight: '90px' }}
                                required
                            />
                            <InputError message={errors.alamat_po} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold" style={{ color: '#001A33' }}>
                                No. Telepon PO *
                            </label>
                            <input
                                type="text"
                                value={data.no_telp_po}
                                onChange={(e) => setData('no_telp_po', e.target.value)}
                                placeholder="Contoh: 081234567890"
                                className="input-damri"
                                required
                            />
                            <InputError message={errors.no_telp_po} />
                        </div>

                        <div className="mt-4 flex items-center justify-end gap-3">
                            <Link
                                href={route('admin.po-bus.index')}
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
                                {processing ? 'Menyimpan...' : 'Simpan Data'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
