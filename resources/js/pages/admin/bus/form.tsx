import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { FormEventHandler } from 'react';

interface PoOption {
    id_po: number;
    nama_po: string;
}

interface BusItem {
    id_bus?: number;
    id_po?: number;
    nama_bus?: string;
    nomor_polisi?: string;
}

interface FormProps {
    bus: BusItem | null;
    poBuses: PoOption[];
}

export default function BusForm({ bus, poBuses }: FormProps) {
    const isEdit = !!bus?.id_bus;

    const { data, setData, post, put, processing, errors } = useForm<{
        id_po: string | number;
        nama_bus: string;
        nomor_polisi: string;
        [key: string]: any;
    }>({
        id_po: bus?.id_po || '',
        nama_bus: bus?.nama_bus || '',
        nomor_polisi: bus?.nomor_polisi || '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Data Bus', href: '/admin/bus' },
        { title: isEdit ? 'Edit Bus' : 'Tambah Bus', href: '#' },
    ];

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.bus.update', bus.id_bus));
        } else {
            post(route('admin.bus.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${isEdit ? 'Edit' : 'Tambah'} Bus — Terminal Parepare`} />

            <div className="flex flex-col gap-6 p-6" style={{ backgroundColor: '#f9f7f3' }}>
                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.bus.index')}
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
                            {isEdit ? 'Edit Data Bus' : 'Tambah Bus Baru'}
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
                                Perusahaan Otobus (PO) *
                            </label>
                            <select
                                value={data.id_po}
                                onChange={(e) => setData('id_po', e.target.value)}
                                className="input-damri"
                                required
                            >
                                <option value="">-- Pilih PO Bus --</option>
                                {poBuses.map((po) => (
                                    <option key={po.id_po} value={po.id_po}>
                                        {po.nama_po}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.id_po} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold" style={{ color: '#001A33' }}>
                                Nama Bus / Kelas Armada *
                            </label>
                            <input
                                type="text"
                                value={data.nama_bus}
                                onChange={(e) => setData('nama_bus', e.target.value)}
                                placeholder="Contoh: DAMRI Royal Class DD 01"
                                className="input-damri"
                                required
                            />
                            <InputError message={errors.nama_bus} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold" style={{ color: '#001A33' }}>
                                Nomor Polisi (Plat Kendaraan) *
                            </label>
                            <input
                                type="text"
                                value={data.nomor_polisi}
                                onChange={(e) => setData('nomor_polisi', e.target.value.toUpperCase())}
                                placeholder="Contoh: DD 7890 AB"
                                className="input-damri font-mono font-bold uppercase tracking-wider"
                                required
                            />
                            <InputError message={errors.nomor_polisi} />
                        </div>

                        <div className="mt-4 flex items-center justify-end gap-3">
                            <Link
                                href={route('admin.bus.index')}
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
