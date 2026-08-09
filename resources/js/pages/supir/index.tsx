import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Bus, Calendar, Clock, LogOut, MapPin, Navigation, UserCheck } from 'lucide-react';
import { useMemo, useState } from 'react';

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

interface SupirIndexProps {
    jadwals: JadwalItem[];
}

export default function SupirIndex({ jadwals = [] }: SupirIndexProps) {
    const { auth } = usePage<{ auth: { supir: { nama_supir: string; username: string } | null } }>().props;
    const supir = auth?.supir;
    const [filter, setFilter] = useState<'all' | 'aktif' | 'selesai'>('all');

    const filteredJadwals = useMemo(() => {
        if (filter === 'aktif') {
            return jadwals.filter((j) => j.status_bus === 'menunggu' || j.status_bus === 'berangkat');
        }
        if (filter === 'selesai') {
            return jadwals.filter((j) => j.status_bus === 'selesai');
        }
        return jadwals;
    }, [jadwals, filter]);

    const activeCount = useMemo(() => {
        return jadwals.filter((j) => j.status_bus === 'menunggu' || j.status_bus === 'berangkat').length;
    }, [jadwals]);

    return (
        <>
            <Head title="Portal Supir — Terminal Parepare" />

            <div className="min-h-screen flex flex-col bg-slate-950 text-white font-sans selection:bg-amber-400 selection:text-slate-950">
                {/* ─── Top Bar ─── */}
                <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 sm:px-6">
                    <div className="mx-auto flex max-w-lg items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20">
                                <Bus size={22} />
                            </div>
                            <div>
                                <h1
                                    className="text-base font-black tracking-tight text-white leading-none"
                                    style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                >
                                    PORTAL SUPIR
                                </h1>
                                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Terminal Induk Parepare</p>
                            </div>
                        </div>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3.5 py-1.5 text-xs font-bold text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                        >
                            <LogOut size={14} />
                            <span>Keluar</span>
                        </Link>
                    </div>
                </header>

                {/* ─── Main Content ─── */}
                <main className="mx-auto w-full max-w-lg flex-1 px-4 py-5 flex flex-col gap-5">
                    {/* Driver Greeting Card */}
                    {supir && (
                        <div className="rounded-2xl bg-slate-900 p-4 border border-slate-800 flex items-center justify-between shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30">
                                    <UserCheck size={22} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block">
                                        Selamat Datang
                                    </span>
                                    <h2
                                        className="text-lg font-black text-white leading-tight"
                                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                    >
                                        Pak {supir.nama_supir}
                                    </h2>
                                </div>
                            </div>
                            <span className="text-xs font-mono font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                                @{supir.username}
                            </span>
                        </div>
                    )}

                    {/* Simple Filter Tabs */}
                    <div className="flex items-center rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-semibold">
                        <button
                            onClick={() => setFilter('all')}
                            className={`flex-1 py-2 rounded-lg text-center transition-all ${
                                filter === 'all' ? 'bg-amber-400 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            Semua ({jadwals.length})
                        </button>
                        <button
                            onClick={() => setFilter('aktif')}
                            className={`flex-1 py-2 rounded-lg text-center transition-all ${
                                filter === 'aktif' ? 'bg-amber-400 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            Tugas Aktif ({activeCount})
                        </button>
                        <button
                            onClick={() => setFilter('selesai')}
                            className={`flex-1 py-2 rounded-lg text-center transition-all ${
                                filter === 'selesai' ? 'bg-amber-400 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            Selesai ({jadwals.length - activeCount})
                        </button>
                    </div>

                    {/* Schedule Cards List */}
                    <div className="flex flex-col gap-4">
                        {filteredJadwals.length > 0 ? (
                            filteredJadwals.map((j) => {
                                const isBerangkat = j.status_bus === 'berangkat';
                                const isSelesai = j.status_bus === 'selesai';

                                return (
                                    <div
                                        key={j.id_jadwal}
                                        className={`rounded-2xl p-5 border flex flex-col gap-4 transition-all shadow-lg ${
                                            isBerangkat
                                                ? 'bg-slate-900 border-amber-400 ring-2 ring-amber-400/20'
                                                : isSelesai
                                                ? 'bg-slate-900/60 border-slate-800 opacity-80'
                                                : 'bg-slate-900 border-slate-800'
                                        }`}
                                    >
                                        {/* Status & PO Bar */}
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-bold text-slate-400 uppercase tracking-wider">
                                                {j.bus?.po_bus?.nama_po || 'PO BUS'}
                                            </span>
                                            {isBerangkat ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                                                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                                                    Sedang Berjalan
                                                </span>
                                            ) : isSelesai ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-400 border border-slate-700">
                                                    ✓ Selesai
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-400/30">
                                                    ⏳ Siap Berangkat
                                                </span>
                                            )}
                                        </div>

                                        {/* Bus Name & Plate */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h3
                                                    className="text-xl font-black text-white leading-tight"
                                                    style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                                >
                                                    {j.bus?.nama_bus}
                                                </h3>
                                            </div>
                                            <span className="rounded-lg bg-slate-950 px-2.5 py-1 text-xs font-mono font-extrabold text-amber-400 border border-slate-800 shrink-0">
                                                {j.bus?.nomor_polisi}
                                            </span>
                                        </div>

                                        {/* Route Indicator */}
                                        <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 flex items-center justify-between text-xs font-bold">
                                            <div className="flex items-center gap-1.5 text-white">
                                                <MapPin size={14} className="text-amber-400" />
                                                <span>{j.rute?.asal}</span>
                                            </div>
                                            <ArrowRight size={14} className="text-slate-500" />
                                            <div className="flex items-center gap-1.5 text-white">
                                                <MapPin size={14} className="text-emerald-400" />
                                                <span>{j.rute?.tujuan}</span>
                                            </div>
                                        </div>

                                        {/* Time Info */}
                                        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={13} />
                                                <span>{j.tanggal?.slice(0, 10)}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                                                <Clock size={13} />
                                                <span>{j.jam_keberangkatan?.slice(0, 5)} WITA</span>
                                            </div>
                                        </div>

                                        {/* Prominent Action Touch Button */}
                                        <Link
                                            href={route('supir.tracking', j.id_jadwal)}
                                            className={`w-full py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-98 shadow-md ${
                                                isBerangkat
                                                    ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-amber-400/20'
                                                    : isSelesai
                                                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                                    : 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-amber-400/20'
                                            }`}
                                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                        >
                                            <Navigation size={16} />
                                            <span>
                                                {isBerangkat
                                                    ? 'Lanjutkan Pelacakan GPS'
                                                    : isSelesai
                                                    ? 'Lihat Detail Perjalanan'
                                                    : 'Buka & Pancarkan GPS'}
                                            </span>
                                        </Link>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="rounded-2xl p-8 text-center bg-slate-900 border border-slate-800 flex flex-col items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center">
                                    <Bus size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Tidak ada penugasan bus</p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Silakan hubungi Admin Terminal untuk memperbarui jadwal penugasan Anda.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-slate-900 py-4 text-center text-[11px] text-slate-500">
                    © {new Date().getFullYear()} Terminal Induk Parepare • Web GPS Engine
                </footer>
            </div>
        </>
    );
}
