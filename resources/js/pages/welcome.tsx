import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    Bus,
    Calendar,
    Clock,
    Compass,
    Filter,
    Grid,
    ListFilter,
    MapPin,
    Navigation,
    Radio,
    Search,
    ShieldCheck,
    Sparkles,
    X,
} from 'lucide-react';
import { FormEventHandler, useMemo, useState } from 'react';

interface JadwalItem {
    id_jadwal: number;
    tanggal: string;
    jam_keberangkatan: string;
    jam_kedatangan: string;
    status_bus: 'menunggu' | 'berangkat' | 'selesai';
    keterangan: string | null;
    current_lat?: number | null;
    current_lng?: number | null;
    current_speed?: number | null;
    last_loc_updated_at?: string | null;
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

export default function Welcome({ jadwals = [], search = '' }: WelcomeProps) {
    const [searchQuery, setSearchQuery] = useState<string>(search);
    const [statusFilter, setStatusFilter] = useState<'all' | 'berangkat' | 'menunggu' | 'selesai'>('all');
    const [selectedRoute, setSelectedRoute] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

    // Filter schedules locally based on status filter & selected route filter
    const filteredJadwals = useMemo(() => {
        return jadwals.filter((item) => {
            // Filter status
            if (statusFilter !== 'all' && item.status_bus !== statusFilter) {
                return false;
            }
            // Filter route
            if (selectedRoute !== 'all') {
                const routeName = `${item.rute?.asal} - ${item.rute?.tujuan}`;
                if (routeName !== selectedRoute) {
                    return false;
                }
            }
            return true;
        });
    }, [jadwals, statusFilter, selectedRoute]);

    // Calculate stats summary
    const stats = useMemo(() => {
        const total = jadwals.length;
        const enRoute = jadwals.filter((j) => j.status_bus === 'berangkat').length;
        const waiting = jadwals.filter((j) => j.status_bus === 'menunggu').length;
        const finished = jadwals.filter((j) => j.status_bus === 'selesai').length;
        return { total, enRoute, waiting, finished };
    }, [jadwals]);

    // Unique route options for quick chips
    const routeChips = useMemo(() => {
        const set = new Set<string>();
        jadwals.forEach((j) => {
            if (j.rute?.asal && j.rute?.tujuan) {
                set.add(`${j.rute.asal} - ${j.rute.tujuan}`);
            }
        });
        return Array.from(set);
    }, [jadwals]);

    const handleSearchSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        router.get('/', { search: searchQuery }, { preserveState: true });
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        router.get('/', {}, { preserveState: true });
    };

    return (
        <>
            <Head title="Terminal Induk Parepare — Live GPS & Jadwal Keberangkatan Bus" />

            <div
                className="min-h-screen flex flex-col font-sans selection:bg-amber-400 selection:text-slate-900"
                style={{ backgroundColor: '#F8FAFC', color: '#0F172A' }}
            >
                {/* ─── Top Brand Bar (Navigation) ─── */}
                <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-slate-800 shadow-lg transition-all">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
                        {/* Logo & Terminal Name */}
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400 shadow-md shadow-amber-400/20 ring-2 ring-amber-300/50 shrink-0">
                                <Bus className="h-6 w-6 text-slate-950" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1
                                        className="text-base sm:text-lg font-black tracking-tight text-white leading-none"
                                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                    >
                                        TERMINAL INDUK PAREPARE
                                    </h1>
                                    <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-extrabold text-emerald-400 border border-emerald-500/30">
                                        <Radio size={10} className="animate-pulse" />
                                        LIVE ONLINE
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                                    Sistem Informasi Terpadu Pelacakan & Jadwal Keberangkatan Bus
                                </p>
                            </div>
                        </div>

                        {/* Login Button */}
                        <div className="flex items-center gap-3">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-amber-400 hover:text-slate-950 hover:shadow-md hover:shadow-amber-400/20 border border-white/20 active:scale-95"
                            >
                                <ShieldCheck size={14} className="text-amber-400 group-hover:text-slate-950" />
                                <span>Portal Petugas</span>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* ─── Hero Section with Glassmorphic Card & Search ─── */}
                <section className="relative overflow-hidden bg-slate-950 text-white pt-12 pb-20 px-4 sm:px-6">
                    {/* Atmospheric background glow circles */}
                    <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none"></div>
                    <div className="absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-amber-400/15 blur-3xl pointer-events-none"></div>

                    <div className="relative mx-auto max-w-4xl text-center flex flex-col items-center">
                        {/* Live Status Badge */}


                        {/* Title */}
                        <h2
                            className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight max-w-3xl"
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                        >
                            Pantau Jadwal & Posisi Bus <span className="text-amber-400">Secara Langsung</span>
                        </h2>

                        <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                            Cek estimasi waktu keberangkatan, informasi armada, dan lacak titik lokasi GPS bus DAMRI & armada PO Bus di Parepare dalam satu layar interaktif.
                        </p>

                        {/* Dynamic Search Bar */}
                        <form onSubmit={handleSearchSubmit} className="mt-8 w-full max-w-2xl">
                            <div className="relative flex items-center rounded-2xl bg-white/10 p-2 backdrop-blur-xl border border-white/20 shadow-2xl focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-400/20 transition-all">
                                <Search size={20} className="ml-3 text-slate-400 shrink-0" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari nama bus, nomor plat (contoh: DD 7788 AB), atau kota tujuan..."
                                    className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={handleClearSearch}
                                        className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors mr-1"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="rounded-xl bg-amber-400 px-6 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-400/20 hover:bg-amber-300 transition-all active:scale-95 shrink-0"
                                >
                                    Cari Jadwal
                                </button>
                            </div>
                        </form>

                        {/* Live Quick Stats Pills */}
                        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 w-full max-w-3xl">
                            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                                <span className="text-xl font-extrabold text-white font-mono">{stats.total}</span>
                                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">Total Operasional</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
                                <span className="text-xl font-extrabold text-emerald-400 font-mono flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                                    {stats.enRoute}
                                </span>
                                <span className="text-[11px] font-medium text-emerald-300/80 uppercase tracking-wider mt-0.5">Sedang Di Jalan</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-400/10 border border-amber-400/20 backdrop-blur-md">
                                <span className="text-xl font-extrabold text-amber-400 font-mono">{stats.waiting}</span>
                                <span className="text-[11px] font-medium text-amber-300/80 uppercase tracking-wider mt-0.5">Menunggu Berangkat</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-md">
                                <span className="text-xl font-extrabold text-slate-300 font-mono">{stats.finished}</span>
                                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">Perjalanan Selesai</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── Main Schedule Board Section ─── */}
                <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 -mt-8 pb-16 z-10">
                    <div className="rounded-3xl bg-white p-5 sm:p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
                        {/* Section Header with Filters & View Switcher */}
                        <div className="flex flex-col gap-5 border-b border-slate-100 pb-6 md:flex-row md:items-center md:justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-amber-500" />
                                    <h3
                                        className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight"
                                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                    >
                                        Papan Jadwal Operasional Bus
                                    </h3>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    Menampilkan {filteredJadwals.length} jadwal keberangkatan & kedatangan bus hari ini.
                                </p>
                            </div>

                            {/* View Switcher & Status Filter Pills */}
                            <div className="flex flex-wrap items-center gap-3">
                                {/* Status Filter Tabs */}
                                <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold text-slate-600">
                                    <button
                                        onClick={() => setStatusFilter('all')}
                                        className={`px-3 py-1.5 rounded-lg transition-all ${statusFilter === 'all'
                                                ? 'bg-white text-slate-900 shadow-sm font-bold'
                                                : 'hover:text-slate-900'
                                            }`}
                                    >
                                        Semua ({stats.total})
                                    </button>
                                    <button
                                        onClick={() => setStatusFilter('berangkat')}
                                        className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${statusFilter === 'berangkat'
                                                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                                                : 'hover:text-emerald-700'
                                            }`}
                                    >
                                        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
                                        Di Jalan ({stats.enRoute})
                                    </button>
                                    <button
                                        onClick={() => setStatusFilter('menunggu')}
                                        className={`px-3 py-1.5 rounded-lg transition-all ${statusFilter === 'menunggu'
                                                ? 'bg-amber-400 text-slate-950 shadow-sm font-bold'
                                                : 'hover:text-amber-700'
                                            }`}
                                    >
                                        Menunggu ({stats.waiting})
                                    </button>
                                    <button
                                        onClick={() => setStatusFilter('selesai')}
                                        className={`px-3 py-1.5 rounded-lg transition-all ${statusFilter === 'selesai'
                                                ? 'bg-slate-800 text-white shadow-sm font-bold'
                                                : 'hover:text-slate-900'
                                            }`}
                                    >
                                        Selesai ({stats.finished})
                                    </button>
                                </div>

                                {/* Layout View Toggle (Grid vs Table) */}
                                <div className="hidden sm:flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-700'
                                            }`}
                                        title="Tampilan Kartu"
                                    >
                                        <Grid size={16} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('table')}
                                        className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-700'
                                            }`}
                                        title="Tampilan Tabel"
                                    >
                                        <ListFilter size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Route Filter Chips */}
                        {routeChips.length > 0 && (
                            <div className="flex items-center gap-2 overflow-x-auto py-4 text-xs no-scrollbar border-b border-slate-100">
                                <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1">
                                    <Filter size={12} /> Filter Rute:
                                </span>
                                <button
                                    onClick={() => setSelectedRoute('all')}
                                    className={`rounded-full px-3 py-1 font-semibold transition-all shrink-0 ${selectedRoute === 'all'
                                            ? 'bg-slate-900 text-white shadow-sm'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    Semua Rute
                                </button>
                                {routeChips.map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => setSelectedRoute(r)}
                                        className={`rounded-full px-3 py-1 font-semibold transition-all shrink-0 ${selectedRoute === r
                                                ? 'bg-slate-900 text-white shadow-sm'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* ─── Schedule Content Area ─── */}
                        <div className="mt-6">
                            {filteredJadwals.length > 0 ? (
                                viewMode === 'grid' ? (
                                    /* Grid Card View */
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {filteredJadwals.map((j) => (
                                            <div
                                                key={j.id_jadwal}
                                                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-xl hover:border-amber-300"
                                            >
                                                {/* Card Header: Bus & PO */}
                                                <div>
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div>
                                                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                                                {j.bus?.po_bus?.nama_po || 'PO Bus'}
                                                            </span>
                                                            <h4
                                                                className="text-lg font-black text-slate-900 group-hover:text-amber-600 transition-colors"
                                                                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                                            >
                                                                {j.bus?.nama_bus || 'Bus Express'}
                                                            </h4>
                                                        </div>

                                                        {/* Status Badge */}
                                                        <div>
                                                            {j.status_bus === 'berangkat' ? (
                                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                                                                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                                                                    Di Jalan
                                                                </span>
                                                            ) : j.status_bus === 'selesai' ? (
                                                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                                                    ✓ Selesai
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200">
                                                                    ⏳ Menunggu
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* License Plate Badge */}
                                                    <div className="mt-3 inline-block rounded-md bg-slate-950 px-2.5 py-1 text-xs font-extrabold tracking-wider text-amber-400 font-mono shadow-inner">
                                                        {j.bus?.nomor_polisi}
                                                    </div>

                                                    {/* Route Visualizer Bar */}
                                                    <div className="mt-5 rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                                                        <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                                                            <div className="flex items-center gap-1.5">
                                                                <MapPin size={14} className="text-amber-500 shrink-0" />
                                                                <span>{j.rute?.asal}</span>
                                                            </div>
                                                            <ArrowRight size={14} className="text-slate-400 shrink-0" />
                                                            <div className="flex items-center gap-1.5">
                                                                <MapPin size={14} className="text-emerald-500 shrink-0" />
                                                                <span>{j.rute?.tujuan}</span>
                                                            </div>
                                                        </div>

                                                        {/* Departure & Arrival Times */}
                                                        <div className="mt-3 flex items-center justify-between border-t border-slate-200/60 pt-2.5 text-xs">
                                                            <div>
                                                                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                                                                    Berangkat
                                                                </span>
                                                                <span className="font-mono font-extrabold text-slate-900">
                                                                    {j.jam_keberangkatan?.slice(0, 5)} WITA
                                                                </span>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                                                                    Estimasi Tiba
                                                                </span>
                                                                <span className="font-mono font-bold text-slate-600">
                                                                    ~ {j.jam_kedatangan?.slice(0, 5)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {j.keterangan && (
                                                        <p className="mt-3 text-xs text-slate-500 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                                                            {j.keterangan}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Action Button */}
                                                <div className="mt-5 pt-3 border-t border-slate-100">
                                                    <Link
                                                        href={route('penumpang.track', j.id_jadwal)}
                                                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-amber-400 hover:text-slate-950 active:scale-98"
                                                    >
                                                        <Compass size={16} className="text-amber-400 group-hover:text-slate-950" />
                                                        <span>Lacak Posisi Bus Live</span>
                                                        <ArrowRight size={14} className="ml-auto opacity-70" />
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    /* Table View */
                                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                                                <tr>
                                                    <th className="px-5 py-3.5">Armada Bus</th>
                                                    <th className="px-5 py-3.5">Rute Trayek</th>
                                                    <th className="px-5 py-3.5">Waktu Operasional</th>
                                                    <th className="px-5 py-3.5">Status</th>
                                                    <th className="px-5 py-3.5 text-right">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {filteredJadwals.map((j) => (
                                                    <tr key={j.id_jadwal} className="hover:bg-amber-50/20 transition-colors">
                                                        <td className="px-5 py-4">
                                                            <p className="font-bold text-slate-900 text-base">{j.bus?.nama_bus}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="rounded bg-slate-950 px-2 py-0.5 text-xs font-bold text-amber-400 font-mono">
                                                                    {j.bus?.nomor_polisi}
                                                                </span>
                                                                <span className="text-xs text-slate-500 font-medium">
                                                                    {j.bus?.po_bus?.nama_po}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-4 font-medium text-slate-800">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-slate-900">{j.rute?.asal}</span>
                                                                <ArrowRight size={14} className="text-amber-500" />
                                                                <span className="font-bold text-slate-900">{j.rute?.tujuan}</span>
                                                            </div>
                                                            {j.keterangan && (
                                                                <p className="text-xs text-slate-400 mt-1">{j.keterangan}</p>
                                                            )}
                                                        </td>
                                                        <td className="px-5 py-4 font-mono text-sm">
                                                            <span className="font-extrabold text-slate-900">
                                                                {j.jam_keberangkatan?.slice(0, 5)} WITA
                                                            </span>
                                                            <p className="text-xs text-slate-400">Tiba ~ {j.jam_kedatangan?.slice(0, 5)}</p>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            {j.status_bus === 'berangkat' ? (
                                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                                                                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                                                                    Di Jalan
                                                                </span>
                                                            ) : j.status_bus === 'selesai' ? (
                                                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                                                    ✓ Selesai
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200">
                                                                    ⏳ Menunggu
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-5 py-4 text-right">
                                                            <Link
                                                                href={route('penumpang.track', j.id_jadwal)}
                                                                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-400 hover:text-slate-950 transition-all"
                                                            >
                                                                <Navigation size={14} />
                                                                Lacak
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )
                            ) : (
                                /* Empty State */
                                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100/50 text-amber-600 mb-4">
                                        <Bus size={32} />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900">Tidak ada jadwal ditemukan</h4>
                                    <p className="mt-1 text-xs text-slate-500 max-w-sm">
                                        Cobalah mengubah kata kunci pencarian atau memilih filter status lain.
                                    </p>
                                    <button
                                        onClick={handleClearSearch}
                                        className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800"
                                    >
                                        Tampilkan Semua Jadwal
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* ─── Highlights & Features Section ─── */}
                <section className="bg-slate-900 py-16 px-4 sm:px-6 text-white border-t border-slate-800">
                    <div className="mx-auto max-w-7xl">
                        <div className="text-center max-w-2xl mx-auto mb-12">
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                                Keunggulan Sistem Informasi
                            </span>
                            <h3
                                className="text-2xl sm:text-4xl font-black tracking-tight text-white mt-3"
                                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                            >
                                Kemudahan Pelacakan Transportasi Darat
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Feature 1 */}
                            <div className="rounded-2xl bg-slate-800/50 p-6 border border-slate-700/60 backdrop-blur-sm flex flex-col justify-between hover:border-amber-400/50 transition-colors">
                                <div>
                                    <div className="h-12 w-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mb-4">
                                        <Compass size={24} />
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-2">Live GPS Real-Time</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Pantau koordinat lokasi fisik bus yang sedang dalam perjalanan secara presisi melalui peta interaktif tanpa hambatan.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="rounded-2xl bg-slate-800/50 p-6 border border-slate-700/60 backdrop-blur-sm flex flex-col justify-between hover:border-amber-400/50 transition-colors">
                                <div>
                                    <div className="h-12 w-12 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 mb-4">
                                        <Clock size={24} />
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-2">Jadwal Operasional Resmi</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Informasi jam keberangkatan dan kedatangan terintegrasi langsung dengan data pengelola Terminal Induk Parepare.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="rounded-2xl bg-slate-800/50 p-6 border border-slate-700/60 backdrop-blur-sm flex flex-col justify-between hover:border-amber-400/50 transition-colors">
                                <div>
                                    <div className="h-12 w-12 rounded-xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center text-blue-400 mb-4">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-2">Integrasi Laporan Digital</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Mendukung pelaporan harian & bulanan perjalanan bus secara otomatis bagi petugas terminal & instansi terkait.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── Footer ─── */}
                <footer className="bg-slate-950 text-slate-400 py-10 px-4 sm:px-6 border-t border-slate-800 text-xs">
                    <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-slate-950 font-bold">
                                <Bus size={18} />
                            </div>
                            <span className="font-bold text-white text-sm">Terminal Induk Parepare</span>
                        </div>

                        <p className="text-slate-500">
                            © {new Date().getFullYear()} Terminal Induk Parepare • Sistem Informasi Terpadu Pelacakan Bus
                        </p>

                        <div className="flex items-center gap-4 text-slate-400">
                            <Link href="/login" className="hover:text-amber-400 transition-colors">
                                Login Portal
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}