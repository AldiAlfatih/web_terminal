import { Head, Link, usePage } from '@inertiajs/react';
import { Bus, LogOut, Navigation } from 'lucide-react';

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

    return (
        <>
            <Head title="Portal Supir — Terminal Induk Parepare" />

            <div
                className="min-h-screen flex flex-col justify-between p-4"
                style={{ backgroundColor: '#003B70', color: '#ffffff', fontFamily: "'Inter', sans-serif" }}
            >
                {/* ─── Header ─── */}
                <div className="flex items-center justify-between border-b pb-3 border-white/20">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: '#FFC627' }}>
                            <Bus size={18} color="#003B70" />
                        </div>
                        <span
                            className="text-base font-extrabold tracking-tight text-white"
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                        >
                            PORTAL SUPIR BUS
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span
                            className="rounded-full px-3 py-1 text-xs font-bold"
                            style={{ backgroundColor: 'rgba(255, 198, 39, 0.2)', color: '#FFC627' }}
                        >
                            Terminal Parepare
                        </span>
                    </div>
                </div>

                {/* ─── Supir Info & Logout ─── */}
                {supir && (
                    <div className="flex items-center justify-between mt-3 rounded-2xl p-3"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
                    >
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-white/60">Supir Login</p>
                            <p className="text-sm font-bold text-white">{supir.nama_supir}</p>
                        </div>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all active:scale-95"
                            style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                        >
                            <LogOut size={14} />
                            Keluar
                        </Link>
                    </div>
                )}

                {/* ─── Main Content ─── */}
                <div className="my-auto flex flex-col gap-5 py-6">
                    <div>
                        <p className="text-xs uppercase tracking-widest text-white/60">Operasional Hari Ini</p>
                        <h1
                            className="text-3xl font-extrabold text-white leading-tight"
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                        >
                            Jadwal Perjalanan Anda
                        </h1>
                        <p className="text-xs text-white/70 mt-1">
                            Berikut jadwal yang ditugaskan kepada Anda hari ini. Pilih jadwal untuk mengaktifkan pancaran GPS live.
                        </p>
                    </div>

                    {/* Schedule Cards List for Supir */}
                    <div className="flex flex-col gap-3">
                        {jadwals && jadwals.length > 0 ? (
                            jadwals.map((j) => (
                                <div
                                    key={j.id_jadwal}
                                    className="flex flex-col gap-3 rounded-2xl p-4 transition-all"
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                        border: '1px solid rgba(255, 255, 255, 0.15)',
                                    }}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs text-white/60">{j.bus?.po_bus?.nama_po}</p>
                                            <h2 className="text-lg font-bold text-white leading-snug">
                                                {j.bus?.nama_bus}
                                            </h2>
                                        </div>
                                        <span
                                            className="rounded-md px-2.5 py-1 text-xs font-bold"
                                            style={{
                                                backgroundColor: '#001A33',
                                                color: '#FFC627',
                                                fontFamily: "'JetBrains Mono', monospace",
                                            }}
                                        >
                                            {j.bus?.nomor_polisi}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-b border-white/10 py-2.5 text-xs">
                                        <span className="font-semibold text-white/90">
                                            {j.rute?.asal} → {j.rute?.tujuan}
                                        </span>
                                        <span className="font-mono text-amber-300 font-bold">
                                            {j.jam_keberangkatan?.slice(0, 5)} WITA
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between pt-1">
                                        <span
                                            className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                                            style={{
                                                backgroundColor:
                                                    j.status_bus === 'berangkat'
                                                        ? '#FFC627'
                                                        : j.status_bus === 'selesai'
                                                        ? '#22c55e'
                                                        : 'rgba(255,255,255,0.2)',
                                                color: j.status_bus === 'berangkat' ? '#001A33' : '#ffffff',
                                            }}
                                        >
                                            {j.status_bus === 'berangkat' ? '● Di Jalan' : j.status_bus === 'selesai' ? '✓ Selesai' : 'Menunggu'}
                                        </span>

                                        <Link
                                            href={route('supir.tracking', j.id_jadwal)}
                                            className="btn-damri-primary text-xs inline-flex items-center gap-1.5 py-2 px-4"
                                        >
                                            <Navigation size={14} />
                                            {j.status_bus === 'berangkat' ? 'Lanjutkan Pelacakan' : 'Buka Lacak GPS'}
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-2xl p-8 text-center bg-white/5 border border-white/10">
                                <Bus size={36} color="#FFC627" className="mx-auto mb-2" />
                                <p className="text-sm font-semibold text-white">Belum ada jadwal perjalanan yang ditugaskan untuk Anda hari ini.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ─── Footer ─── */}
                <div className="text-center text-[10px] text-white/40 border-t border-white/10 pt-3">
                    Sistem Informasi Terminal Induk Parepare • Web GPS Engine
                </div>
            </div>
        </>
    );
}
