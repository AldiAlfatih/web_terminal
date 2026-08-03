import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, Bus, Calendar, Clock, MapPin, Navigation, Search, ShieldCheck } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface JadwalItem {
    id_jadwal: number;
    tanggal: string;
    jam_keberangkatan: string;
    jam_kedatangan: string;
    status_bus: 'menunggu' | 'berangkat' | 'selesai';
    keterangan: string | null;
    bus: {
        nama_bus: string;
        nomor_polisi: string;
        po_bus?: {
            nama_po: string;
        };
    };
    rute: {
        asal: string;
        tujuan: string;
    };
}

interface WelcomeProps {
    jadwals: JadwalItem[];
    search?: string;
}

const StatusBadge = ({ status }: { status: 'menunggu' | 'berangkat' | 'selesai' }) => {
    const map = {
        menunggu: { label: 'Menunggu', cls: 'badge-menunggu' },
        berangkat: { label: 'Di Jalan', cls: 'badge-berangkat' },
        selesai: { label: 'Selesai', cls: 'badge-selesai' },
    };
    const { label, cls } = map[status] || map.menunggu;
    return <span className={cls}>{label}</span>;
};

export default function Welcome({ jadwals, search = '' }: WelcomeProps) {
    const [searchQuery, setSearchQuery] = useState<string>(search);

    const handleSearch: FormEventHandler = (e) => {
        e.preventDefault();
        router.get('/', { search: searchQuery }, { preserveState: true });
    };

    return (
        <>
            <Head title="Terminal Induk Parepare — Papan Jadwal & Lacak Bus Live" />

            <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f9f7f3', fontFamily: "'Inter', sans-serif" }}>

                {/* ─── Public Navbar ─── */}
                <header className="border-b px-4 py-4 sm:px-8" style={{ backgroundColor: '#003B70', borderColor: '#00284d' }}>
                    <div className="mx-auto flex max-w-6xl items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className="flex h-10 w-10 items-center justify-center rounded-xl"
                                style={{ backgroundColor: '#FFC627' }}
                            >
                                <Bus size={22} color="#003B70" />
                            </div>
                            <div>
                                <h1
                                    className="text-lg font-black tracking-tight text-white leading-none"
                                    style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                >
                                    TERMINAL INDUK PAREPARE
                                </h1>
                                <p className="text-[11px] text-white/70 mt-0.5">Sistem Informasi Keberangkatan & Kedatangan Bus</p>
                            </div>
                        </div>

                        <Link
                            href="/login"
                            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
                            style={{ border: '1px solid rgba(255, 255, 255, 0.2)' }}
                        >
                            <ShieldCheck size={14} color="#FFC627" />
                            Login
                        </Link>
                    </div>
                </header>

                {/* ─── Hero Section ─── */}
                <section className="px-4 py-10 sm:px-8 text-center" style={{ backgroundColor: '#003B70' }}>
                    <div className="mx-auto max-w-3xl flex flex-col items-center">
                        <span
                            className="rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider mb-3"
                            style={{ backgroundColor: 'rgba(255, 198, 39, 0.2)', color: '#FFC627' }}
                        >
                            ● Live Real-Time Tracking
                        </span>
                        <h2
                            className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight"
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.03em' }}
                        >
                            Jadwal Bus & Pelacakan Live
                        </h2>
                        <p className="mt-2 text-sm sm:text-base text-white/80 max-w-xl">
                            Pantau jadwal keberangkatan dan posisi bus DAMRI & PO Bus lainnya secara langsung dari mana saja.
                        </p>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="mt-6 flex w-full max-w-md items-center gap-2">
                            <div className="relative flex-1">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari bus, plat nomor, atau kota tujuan..."
                                    className="input-damri pl-11 text-sm text-black"
                                    style={{ backgroundColor: '#ffffff' }}
                                />
                            </div>
                            <button type="submit" className="btn-damri-primary text-sm shrink-0">
                                Cari
                            </button>
                        </form>
                    </div>
                </section>

                {/* ─── Main Schedule Board ─── */}
                <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 sm:p-6 -mt-4">
                    <div
                        className="overflow-hidden p-1 sm:p-2"
                        style={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #d4cfc6',
                            borderRadius: '16px',
                            boxShadow: '0 10px 30px rgba(0, 59, 112, 0.05)',
                        }}
                    >
                        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3
                                    className="text-xl font-bold text-gray-900"
                                    style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                >
                                    Papan Jadwal Terkini
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">Daftar bus beroperasi di Terminal Induk Parepare</p>
                            </div>
                            <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                                Total: {jadwals ? jadwals.length : 0} Jadwal
                            </span>
                        </div>

                        {jadwals && jadwals.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #d4cfc6', backgroundColor: '#f9f7f3' }}>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Armada Bus
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Rute Trayek
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Jam Berangkat
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Lacak
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {jadwals.map((j, idx) => (
                                            <tr
                                                key={j.id_jadwal}
                                                className="hover:bg-amber-50/30 transition-colors"
                                                style={{
                                                    borderBottom: idx < jadwals.length - 1 ? '1px solid #f0ede6' : 'none',
                                                }}
                                            >
                                                <td className="px-4 py-4">
                                                    <p className="font-bold text-gray-900 text-base">
                                                        {j.bus?.nama_bus || 'Bus Express'}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span
                                                            className="inline-block rounded px-2 py-0.5 text-xs font-bold"
                                                            style={{
                                                                backgroundColor: '#001A33',
                                                                color: '#FFC627',
                                                                fontFamily: "'JetBrains Mono', monospace",
                                                            }}
                                                        >
                                                            {j.bus?.nomor_polisi}
                                                        </span>
                                                        <span className="text-xs text-gray-500 font-medium">
                                                            {j.bus?.po_bus?.nama_po}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2 font-medium text-gray-800">
                                                        <span className="font-semibold text-blue-950">{j.rute?.asal}</span>
                                                        <ArrowRight size={14} color="#FFC627" />
                                                        <span className="font-semibold text-blue-950">{j.rute?.tujuan}</span>
                                                    </div>
                                                    {j.keterangan && (
                                                        <p className="text-xs text-gray-400 mt-1">{j.keterangan}</p>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="font-mono text-sm">
                                                        <span className="font-bold text-blue-900">{j.jam_keberangkatan?.slice(0, 5)} WITA</span>
                                                        <p className="text-[11px] text-gray-400">Tiba ~ {j.jam_kedatangan?.slice(0, 5)}</p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <StatusBadge status={j.status_bus} />
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <Link
                                                        href={route('penumpang.track', j.id_jadwal)}
                                                        className="btn-damri-primary text-xs inline-flex items-center gap-1.5 py-2 px-4"
                                                    >
                                                        <Navigation size={14} />
                                                        Lacak Bus
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="py-16 text-center">
                                <Bus size={40} color="#d4cfc6" className="mx-auto mb-3" />
                                <p className="text-sm font-semibold text-gray-600">
                                    Tidak ada jadwal ditemukan untuk pencarian ini.
                                </p>
                            </div>
                        )}
                    </div>
                </main>

                {/* ─── Public Footer ─── */}
                <footer className="mt-auto border-t py-6 text-center text-xs text-white/70" style={{ backgroundColor: '#003B70', borderColor: '#00284d' }}>
                    <p>© {new Date().getFullYear()} Terminal Induk Parepare • Sistem Informasi Terpadu DAMRI</p>
                </footer>
            </div>
        </>
    );
}
