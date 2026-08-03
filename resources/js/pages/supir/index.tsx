import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Bus, Calendar, CheckCircle2, Clock, LogOut, MapPin, Navigation, UserCheck } from 'lucide-react';

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

export default function SupirIndex({ jadwals }: SupirIndexProps) {
    const { auth } = usePage<{ auth: { supir: { nama_supir: string; username: string } | null } }>().props;
    const supir = auth?.supir;

    const totalTugas = jadwals?.length || 0;
    const tugasMenunggu = jadwals?.filter((j) => j.status_bus === 'menunggu').length || 0;
    const tugasBerangkat = jadwals?.filter((j) => j.status_bus === 'berangkat').length || 0;
    const tugasSelesai = jadwals?.filter((j) => j.status_bus === 'selesai').length || 0;

    return (
        <>
            <Head title="Portal Supir — Terminal Induk Parepare" />

            <div
                className="min-h-screen flex flex-col justify-between p-4 sm:p-6 select-none"
                style={{ backgroundColor: '#003B70', color: '#ffffff', fontFamily: "'Inter', sans-serif" }}
            >
                {/* ─── 1. Top Navbar Header ─── */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b pb-3.5 border-white/15">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl shadow-md" style={{ backgroundColor: '#FFC627' }}>
                                <Bus size={22} color="#003B70" />
                            </div>
                            <div>
                                <h1
                                    className="text-base font-extrabold tracking-tight text-white leading-tight"
                                    style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                >
                                    PORTAL SUPIR BUS
                                </h1>
                                <p className="text-[10px] text-white/60 font-medium">Terminal Induk Parepare</p>
                            </div>
                        </div>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all active:scale-95 shadow-sm"
                            style={{ backgroundColor: 'rgba(239, 68, 68, 0.25)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.4)' }}
                        >
                            <LogOut size={14} />
                            Keluar
                        </Link>
                    </div>

                    {/* ─── 2. Driver Welcome Card ─── */}
                    {supir && (
                        <div
                            className="rounded-2xl p-4 flex items-center justify-between shadow-lg"
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                backdropFilter: 'blur(8px)',
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFC627]/20 border border-[#FFC627]/40 text-[#FFC627] font-bold text-lg">
                                    <UserCheck size={24} />
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#FFC627]">
                                        Selamat Datang 👋
                                    </span>
                                    <h2
                                        className="text-lg font-extrabold text-white leading-tight"
                                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                    >
                                        Pak {supir.nama_supir}
                                    </h2>
                                    <p className="text-[11px] text-white/60 font-mono mt-0.5">ID: @{supir.username}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ─── 3. Quick Operasional Stats Counter ─── */}
                    <div className="grid grid-cols-3 gap-2">
                        <div
                            className="rounded-xl p-2.5 text-center"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                        >
                            <p className="text-[10px] uppercase text-white/60 font-medium">Total Tugas</p>
                            <p className="text-xl font-black text-white" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                                {totalTugas}
                            </p>
                        </div>
                        <div
                            className="rounded-xl p-2.5 text-center"
                            style={{ backgroundColor: 'rgba(255, 198, 39, 0.12)', border: '1px solid rgba(255, 198, 39, 0.25)' }}
                        >
                            <p className="text-[10px] uppercase text-[#FFC627] font-bold">Aktif / Menunggu</p>
                            <p className="text-xl font-black text-[#FFC627]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                                {tugasMenunggu + tugasBerangkat}
                            </p>
                        </div>
                        <div
                            className="rounded-xl p-2.5 text-center"
                            style={{ backgroundColor: 'rgba(34, 197, 94, 0.12)', border: '1px solid rgba(34, 197, 94, 0.25)' }}
                        >
                            <p className="text-[10px] uppercase text-green-400 font-bold">Selesai</p>
                            <p className="text-xl font-black text-green-400" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                                {tugasSelesai}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ─── 4. Main Assigned Schedules List ─── */}
                <div className="my-auto flex flex-col gap-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2
                                className="text-xl font-extrabold text-white leading-tight"
                                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                            >
                                Daftar Penugasan Bus
                            </h2>
                            <p className="text-xs text-white/70">
                                Pilih armada untuk mengaktifkan pancaran lokasi GPS live.
                            </p>
                        </div>
                    </div>

                    {/* Schedule Cards */}
                    <div className="flex flex-col gap-4">
                        {jadwals && jadwals.length > 0 ? (
                            jadwals.map((j) => {
                                const isBerangkat = j.status_bus === 'berangkat';
                                const isSelesai = j.status_bus === 'selesai';

                                return (
                                    <div
                                        key={j.id_jadwal}
                                        className="flex flex-col gap-3 rounded-2xl p-4.5 transition-all shadow-md relative overflow-hidden"
                                        style={{
                                            backgroundColor: isBerangkat
                                                ? 'rgba(255, 198, 39, 0.08)'
                                                : isSelesai
                                                ? 'rgba(255, 255, 255, 0.05)'
                                                : 'rgba(255, 255, 255, 0.1)',
                                            border: isBerangkat
                                                ? '2px solid #FFC627'
                                                : isSelesai
                                                ? '1px solid rgba(255, 255, 255, 0.1)'
                                                : '1px solid rgba(255, 255, 255, 0.2)',
                                        }}
                                    >
                                        {/* Status Badge Accent Bar */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold text-white/70">
                                                {j.bus?.po_bus?.nama_po || 'PO DAMRI'}
                                            </span>
                                            <span
                                                className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                                                style={{
                                                    backgroundColor: isBerangkat
                                                        ? '#FFC627'
                                                        : isSelesai
                                                        ? '#22c55e'
                                                        : '#ffffff',
                                                    color: '#001A33',
                                                }}
                                            >
                                                {isBerangkat && <span className="h-2 w-2 rounded-full bg-red-600 animate-ping"></span>}
                                                {isBerangkat ? '● Sedang Berjalan' : isSelesai ? '✓ Selesai' : 'Siap Berangkat'}
                                            </span>
                                        </div>

                                        {/* Bus Title & License Plate */}
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h3
                                                    className="text-xl font-extrabold text-white leading-snug"
                                                    style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                                >
                                                    {j.bus?.nama_bus}
                                                </h3>
                                            </div>
                                            <span
                                                className="rounded-lg px-2.5 py-1 text-xs font-mono font-bold tracking-wider shrink-0"
                                                style={{
                                                    backgroundColor: '#001A33',
                                                    color: '#FFC627',
                                                    border: '1px solid rgba(255, 198, 39, 0.3)',
                                                }}
                                            >
                                                {j.bus?.nomor_polisi}
                                            </span>
                                        </div>

                                        {/* Route details */}
                                        <div
                                            className="rounded-xl p-3 flex items-center justify-between text-xs"
                                            style={{ backgroundColor: 'rgba(0, 26, 51, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <MapPin size={14} className="text-[#FFC627]" />
                                                <span className="font-bold text-white">{j.rute?.asal}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-white/50">
                                                <ArrowRight size={14} color="#FFC627" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-white">{j.rute?.tujuan}</span>
                                            </div>
                                        </div>

                                        {/* Schedule Time & Date */}
                                        <div className="flex items-center justify-between text-xs font-mono text-white/80 pt-1">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={13} className="text-white/60" />
                                                <span>{j.tanggal?.slice(0, 10)}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[#FFC627] font-bold">
                                                <Clock size={13} />
                                                <span>{j.jam_keberangkatan?.slice(0, 5)} WITA</span>
                                            </div>
                                        </div>

                                        {/* BIG TOUCH ACTION BUTTON */}
                                        <div className="pt-2">
                                            <Link
                                                href={route('supir.tracking', j.id_jadwal)}
                                                className="w-full py-3.5 px-4 rounded-xl text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
                                                style={{
                                                    backgroundColor: isBerangkat
                                                        ? '#FFC627'
                                                        : isSelesai
                                                        ? 'rgba(255, 255, 255, 0.15)'
                                                        : '#FFC627',
                                                    color: isSelesai ? '#ffffff' : '#001A33',
                                                    fontFamily: "'Bricolage Grotesque', sans-serif",
                                                    boxShadow: isSelesai ? 'none' : '0 4px 20px rgba(255, 198, 39, 0.3)',
                                                }}
                                            >
                                                <Navigation size={18} />
                                                {isBerangkat
                                                    ? 'LANJUTKAN PELACAKAN GPS'
                                                    : isSelesai
                                                    ? 'LIHAT DETAIL PERJALANAN'
                                                    : 'BUKA & MULAI PELACAKAN GPS'}
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="rounded-2xl p-8 text-center bg-white/5 border border-white/10 flex flex-col items-center gap-3">
                                <div className="h-16 w-16 rounded-full bg-[#FFC627]/10 flex items-center justify-center text-[#FFC627]">
                                    <Bus size={32} />
                                </div>
                                <div>
                                    <p className="text-base font-bold text-white">Belum Ada Penugasan Jadwal</p>
                                    <p className="text-xs text-white/60 max-w-xs mt-1">
                                        Saat ini tidak ada penugasan bus aktif untuk Anda. Silakan hubungi Admin Terminal untuk update jadwal.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ─── 5. Footer Caption ─── */}
                <div className="text-center text-[10px] text-white/40 border-t border-white/10 pt-3">
                    © {new Date().getFullYear()} Sistem Informasi Terminal Induk Parepare • Web GPS Engine
                </div>
            </div>
        </>
    );
}
