import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { ArrowLeft, ArrowRight, Bus, CheckCircle, Compass, LogOut, Navigation, NavigationOff, ShieldAlert, Zap } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface JadwalProps {
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

interface TrackingPageProps {
    jadwal: JadwalProps;
}

export default function SupirTracking({ jadwal }: TrackingPageProps) {
    const { auth } = usePage<{ auth: { supir: { nama_supir: string; username: string } | null } }>().props;
    const supir = auth?.supir;

    const [isTracking, setIsTracking] = useState<boolean>(jadwal.status_bus === 'berangkat');
    const [statusBus, setStatusBus] = useState<'menunggu' | 'berangkat' | 'selesai'>(jadwal.status_bus);
    const [wakeLockActive, setWakeLockActive] = useState<boolean>(false);
    const [gpsError, setGpsError] = useState<string | null>(null);
    const [lastPosition, setLastPosition] = useState<{
        lat: number;
        lng: number;
        heading: number | null;
        speed: number | null;
        accuracy: number | null;
        timestamp: string;
    } | null>(null);
    const [sentCount, setSentCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const watchIdRef = useRef<number | null>(null);
    const wakeLockRef = useRef<WakeLockSentinel | null>(null);

    // ─── Screen Wake Lock API ───
    const requestWakeLock = useCallback(async () => {
        if ('wakeLock' in navigator) {
            try {
                wakeLockRef.current = await navigator.wakeLock.request('screen');
                setWakeLockActive(true);

                wakeLockRef.current.addEventListener('release', () => {
                    setWakeLockActive(false);
                });
            } catch (err: any) {
                console.warn('Wake Lock error:', err.message);
                setWakeLockActive(false);
            }
        }
    }, []);

    const releaseWakeLock = useCallback(async () => {
        if (wakeLockRef.current) {
            try {
                await wakeLockRef.current.release();
                wakeLockRef.current = null;
                setWakeLockActive(false);
            } catch (err: any) {
                console.warn('Wake Lock release error:', err.message);
            }
        }
    }, []);

    // ─── Send GPS Location to Server ───
    const sendLocationToServer = useCallback(async (lat: number, lng: number, heading: number | null, speed: number | null) => {
        try {
            const response = await axios.post(`/api/jadwal/${jadwal.id_jadwal}/location`, {
                lat,
                lng,
                heading,
                speed,
            });

            if (response.data?.status === 'success') {
                setSentCount((prev) => prev + 1);
                if (response.data.status_bus) {
                    setStatusBus(response.data.status_bus);
                }
            }
        } catch (err: any) {
            console.error('Gagal mengirim koordinat GPS:', err);
        }
    }, [jadwal.id_jadwal]);

    // ─── HTML5 Geolocation API Watcher ───
    const startGeolocationTracking = useCallback(() => {
        if (!('geolocation' in navigator)) {
            setGpsError('Perangkat Anda tidak mendukung Geolocation API.');
            return;
        }

        setGpsError(null);

        watchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude, heading, speed, accuracy } = position.coords;

                const posData = {
                    lat: latitude,
                    lng: longitude,
                    heading: heading ?? null,
                    speed: speed ? Math.round(speed * 3.6) : null,
                    accuracy: Math.round(accuracy),
                    timestamp: new Date().toLocaleTimeString('id-ID'),
                };

                setLastPosition(posData);
                sendLocationToServer(latitude, longitude, heading ?? null, posData.speed);
            },
            (error) => {
                let errorMsg = 'Gagal mengakses sensor GPS.';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMsg = 'Izin lokasi ditolak! Harap aktifkan GPS di HP Anda.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMsg = 'Sinyal lokasi tidak tersedia saat ini.';
                        break;
                    case error.TIMEOUT:
                        errorMsg = 'Waktu permintaan lokasi habis (Timeout).';
                        break;
                }
                setGpsError(errorMsg);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 3000,
            }
        );
    }, [sendLocationToServer]);

    const stopGeolocationTracking = useCallback(() => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
    }, []);

    // ─── Toggle Journey (Mulai / Selesai) ───
    const handleStartJourney = async () => {
        setLoading(true);
        setIsTracking(true);
        setStatusBus('berangkat');
        await requestWakeLock();
        startGeolocationTracking();
        setLoading(false);
    };

    const handleFinishJourney = async () => {
        if (!confirm('Apakah Anda yakin ingin MENYELESAIKAN perjalanan bus ini?')) {
            return;
        }

        setLoading(true);
        stopGeolocationTracking();
        await releaseWakeLock();
        setIsTracking(false);

        try {
            await axios.post(`/api/jadwal/${jadwal.id_jadwal}/finish`, {
                lat: lastPosition?.lat || 0,
                lng: lastPosition?.lng || 0,
            });
            setStatusBus('selesai');
        } catch (err: any) {
            console.error('Gagal menyelesaikan perjalanan:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && isTracking) {
                requestWakeLock();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            stopGeolocationTracking();
            releaseWakeLock();
        };
    }, [isTracking, requestWakeLock, releaseWakeLock, stopGeolocationTracking]);

    return (
        <>
            <Head title={`Pelacak Supir — ${jadwal.bus?.nama_bus || 'Bus'}`} />

            <div className="min-h-screen flex flex-col justify-between p-4 bg-slate-950 text-white font-sans selection:bg-amber-400 select-none">
                {/* ─── Top Header Bar ─── */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <Link
                            href={route('supir.index')}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white transition-all active:scale-95"
                            title="Kembali ke Portal Supir"
                        >
                            <ArrowLeft size={18} />
                        </Link>

                        <div className="flex items-center gap-2">
                            <span
                                className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                                    statusBus === 'berangkat'
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                        : statusBus === 'selesai'
                                        ? 'bg-slate-800 text-slate-300 border border-slate-700'
                                        : 'bg-amber-400/10 text-amber-400 border border-amber-400/30'
                                }`}
                            >
                                {statusBus === 'berangkat' ? '● Sedang Berjalan' : statusBus === 'selesai' ? '✓ Selesai' : 'Siap Berangkat'}
                            </span>
                        </div>
                    </div>

                    {/* Compact Bus & Route Card */}
                    <div className="rounded-2xl bg-slate-900 p-4 border border-slate-800 flex flex-col gap-3 shadow-lg">
                        <div className="flex items-start justify-between">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    {jadwal.bus?.po_bus?.nama_po || 'PO BUS'}
                                </span>
                                <h1
                                    className="text-xl font-black text-white leading-tight"
                                    style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                >
                                    {jadwal.bus?.nama_bus || 'Bus Express'}
                                </h1>
                            </div>
                            <span className="rounded-lg bg-slate-950 px-2.5 py-1 text-xs font-mono font-extrabold text-amber-400 border border-slate-800">
                                {jadwal.bus?.nomor_polisi}
                            </span>
                        </div>

                        {/* Route Strip */}
                        <div className="rounded-xl bg-slate-950 p-3 border border-slate-800/80 flex items-center justify-between text-xs font-bold">
                            <span className="text-white">{jadwal.rute?.asal}</span>
                            <ArrowRight size={14} className="text-amber-400 shrink-0" />
                            <span className="text-white">{jadwal.rute?.tujuan}</span>
                            <span className="text-slate-400 font-mono text-[11px] ml-2">({jadwal.jam_keberangkatan?.slice(0, 5)} WITA)</span>
                        </div>
                    </div>
                </div>

                {/* ─── Center Action Area ─── */}
                <div className="my-auto flex flex-col items-center justify-center gap-6 py-6">
                    {gpsError && (
                        <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-3.5 text-center text-red-400 text-xs flex items-center gap-2 max-w-xs">
                            <ShieldAlert size={18} className="shrink-0" />
                            <span>{gpsError}</span>
                        </div>
                    )}

                    {statusBus === 'selesai' ? (
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border-2 border-emerald-500 text-emerald-400">
                                <CheckCircle size={40} />
                            </div>
                            <div>
                                <h2
                                    className="text-2xl font-black text-white"
                                    style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                >
                                    Perjalanan Selesai
                                </h2>
                                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                                    Terima kasih Pak Supir! Seluruh data perjalanan dan titik lokasi telah tersimpan di sistem.
                                </p>
                            </div>
                            <Link
                                href={route('supir.index')}
                                className="mt-2 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-xs font-bold text-slate-950 shadow-md shadow-amber-400/20 active:scale-95"
                            >
                                <ArrowLeft size={16} />
                                <span>Kembali ke Portal Supir</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-5 w-full max-w-xs">
                            {!isTracking ? (
                                <button
                                    onClick={handleStartJourney}
                                    disabled={loading}
                                    className="w-full py-5 rounded-2xl bg-amber-400 text-slate-950 font-black text-base uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl shadow-amber-400/20 hover:bg-amber-300 transition-all active:scale-95"
                                    style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                >
                                    <Navigation size={22} />
                                    <span>MULAI PERJALANAN</span>
                                </button>
                            ) : (
                                <button
                                    onClick={handleFinishJourney}
                                    disabled={loading}
                                    className="w-full py-5 rounded-2xl bg-red-600 text-white font-black text-base uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl shadow-red-600/30 hover:bg-red-500 transition-all active:scale-95 animate-pulse"
                                    style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                >
                                    <NavigationOff size={22} />
                                    <span>SELESAIKAN PERJALANAN</span>
                                </button>
                            )}

                            <p className="text-xs text-slate-400 text-center font-medium">
                                {!isTracking
                                    ? 'Tekan tombol di atas untuk mengaktifkan pancaran sinyal GPS live'
                                    : 'Sinyal GPS aktif terpancar • Tekan tombol jika telah sampai di tujuan'}
                            </p>
                        </div>
                    )}
                </div>

                {/* ─── Bottom Telemetry & Status ─── */}
                <div className="flex flex-col gap-3">
                    {isTracking && (
                        <div className="rounded-xl bg-slate-900 p-3 border border-slate-800 flex items-center justify-between text-xs font-mono">
                            <div className="flex items-center gap-2 text-emerald-400">
                                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                                <span>Pancar GPS ({sentCount}x)</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-400">
                                <Zap size={14} className={wakeLockActive ? 'text-amber-400' : 'text-slate-500'} />
                                <span>{wakeLockActive ? 'Layar Tetap Nyala' : 'Standby'}</span>
                            </div>
                        </div>
                    )}

                    {lastPosition && (
                        <div className="rounded-xl bg-slate-900 p-3 grid grid-cols-3 gap-2 text-center text-xs font-mono border border-slate-800">
                            <div>
                                <span className="text-[10px] uppercase text-slate-500 block font-sans">Kecepatan</span>
                                <span className="font-bold text-amber-400">{lastPosition.speed ?? 0} km/jam</span>
                            </div>
                            <div>
                                <span className="text-[10px] uppercase text-slate-500 block font-sans">Arah</span>
                                <span className="font-bold text-white flex items-center justify-center gap-1">
                                    <Compass size={12} className="text-amber-400" />
                                    {lastPosition.heading ? `${Math.round(lastPosition.heading)}°` : 'N/A'}
                                </span>
                            </div>
                            <div>
                                <span className="text-[10px] uppercase text-slate-500 block font-sans">Akurasi</span>
                                <span className="font-bold text-emerald-400">±{lastPosition.accuracy}m</span>
                            </div>
                        </div>
                    )}

                    <div className="text-center text-[10px] text-slate-500">
                        Terminal Induk Parepare • Web GPS Engine
                    </div>
                </div>
            </div>
        </>
    );
}
