import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { FormEventHandler } from 'react';

interface RuteItem {
    id_rute?: number;
    asal?: string;
    tujuan?: string;
    keterangan_rute?: string;
}

interface FormProps {
    rute: RuteItem | null;
}

export default function RuteForm({ rute }: FormProps) {
    const isEdit = !!rute?.id_rute;

    const { data, setData, post, put, processing, errors } = useForm<{
        asal: string;
        tujuan: string;
        keterangan_rute: string;
        [key: string]: any;
    }>({
        asal: rute?.asal || '',
        tujuan: rute?.tujuan || '',
        keterangan_rute: rute?.keterangan_rute || '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Rute', href: '/admin/rute' },
        { title: isEdit ? 'Edit Rute' : 'Tambah Rute', href: '#' },
    ];

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.rute.update', rute.id_rute));
        } else {
            post(route('admin.rute.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${isEdit ? 'Edit' : 'Tambah'} Rute — Terminal Parepare`} />

            <div className="flex flex-col gap-6 p-6" style={{ backgroundColor: '#f9f7f3' }}>
                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.rute.index')}
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
                            {isEdit ? 'Edit Rute Trayek' : 'Tambah Rute Trayek Baru'}
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
                                Kota / Asal Keberangkatan *
                            </label>
                            <input
                                type="text"
                                value={data.asal}
                                onChange={(e) => setData('asal', e.target.value)}
                                placeholder="Contoh: Parepare"
                                className="input-damri"
                                required
                            />
                            <InputError message={errors.asal} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold" style={{ color: '#001A33' }}>
                                Kota / Tujuan Akhir *
                            </label>
                            <input
                                type="text"
                                value={data.tujuan}
                                onChange={(e) => setData('tujuan', e.target.value)}
                                placeholder="Contoh: Makassar (Daya)"
                                className="input-damri"
                                required
                            />
                            <InputError message={errors.tujuan} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold" style={{ color: '#001A33' }}>
                                Keterangan Rute (Opsional)
                            </label>
                            <textarea
                                value={data.keterangan_rute}
                                onChange={(e) => setData('keterangan_rute', e.target.value)}
                                placeholder="Contoh: Via Jalur Poros Barru - Pangkep"
                                className="input-damri"
                                style={{ borderRadius: '16px', minHeight: '80px' }}
                            />
                            <InputError message={errors.keterangan_rute} />
                        </div>

                        <div className="mt-4 flex items-center justify-end gap-3">
                            <Link
                                href={route('admin.rute.index')}
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
