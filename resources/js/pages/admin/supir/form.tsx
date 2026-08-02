import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { FormEventHandler } from 'react';

interface SupirItem {
    id_supir?: number;
    nama_supir?: string;
    no_telp?: string;
    username?: string;
}

interface FormProps {
    supir: SupirItem | null;
}

export default function SupirForm({ supir }: FormProps) {
    const isEdit = !!supir?.id_supir;

    const { data, setData, post, put, processing, errors } = useForm<{
        nama_supir: string;
        no_telp: string;
        username: string;
        password: string;
        [key: string]: any;
    }>({
        nama_supir: supir?.nama_supir || '',
        no_telp: supir?.no_telp || '',
        username: supir?.username || '',
        password: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Data Supir', href: '/admin/supir' },
        { title: isEdit ? 'Edit Supir' : 'Tambah Supir', href: '#' },
    ];

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.supir.update', supir.id_supir));
        } else {
            post(route('admin.supir.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${isEdit ? 'Edit' : 'Tambah'} Supir — Terminal Parepare`} />

            <div className="flex flex-col gap-6 p-6" style={{ backgroundColor: '#f9f7f3' }}>
                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.supir.index')}
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
                            {isEdit ? 'Edit Data Supir' : 'Tambah Supir Baru'}
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
                                Nama Lengkap Supir *
                            </label>
                            <input
                                type="text"
                                value={data.nama_supir}
                                onChange={(e) => setData('nama_supir', e.target.value)}
                                placeholder="Contoh: Ahmad Supardi"
                                className="input-damri"
                                required
                            />
                            <InputError message={errors.nama_supir} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold" style={{ color: '#001A33' }}>
                                Nomor Telepon *
                            </label>
                            <input
                                type="text"
                                value={data.no_telp}
                                onChange={(e) => setData('no_telp', e.target.value)}
                                placeholder="Contoh: 081234567890"
                                className="input-damri"
                                required
                            />
                            <InputError message={errors.no_telp} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold" style={{ color: '#001A33' }}>
                                Username *
                            </label>
                            <input
                                type="text"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                placeholder="Contoh: supir_ahmad"
                                className="input-damri"
                                required
                            />
                            <InputError message={errors.username} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold" style={{ color: '#001A33' }}>
                                Password {isEdit ? '(Kosongkan jika tidak diubah)' : '*'}
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder={isEdit ? 'Biarkan kosong jika tidak diubah' : 'Minimal 6 karakter'}
                                className="input-damri"
                                required={!isEdit}
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="mt-4 flex items-center justify-end gap-3">
                            <Link
                                href={route('admin.supir.index')}
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
