import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { ArrowLeft, ArrowRight, Bus, CheckCircle, Compass, LogOut, NavigationOff, Navigation, ShieldAlert, Zap } from 'lucide-react';
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
                    speed: speed ? Math.round(speed * 3.6) : null, // convert m/s to km/h
                    accuracy: Math.round(accuracy),
                    timestamp: new Date().toLocaleTimeString('id-ID'),
                };

                setLastPosition(posData);
                sendLocationToServer(latitude, longitude, heading ?? null, speed ?? null);
            },
            (error) => {
                let errorMsg = 'Gagal mengakses sensor GPS.';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMsg = 'Izin lokasi ditolak! Harap aktifkan GPS & izinkan lokasi di browser HP Anda.';
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

    // Re-acquire wake lock if page visibility changes while tracking is active
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

            {/* Mobile-first High-Contrast Outdoor View (DAMRI Navy #003B70) */}
            <div
                className="min-h-screen flex flex-col justify-between p-4 text-white select-none"
                style={{ backgroundColor: '#003B70', fontFamily: "'Inter', sans-serif" }}
            >
                {/* ─── Top Header: Bus & Route Info ─── */}
                <div className="flex flex-col gap-3">
                    {/* Header bar with Back & Logout Buttons */}
                    <div className="flex items-center justify-between border-b pb-3 border-white/20">
                        <div className="flex items-center gap-2">
                            <Link
                                href={route('supir.index')}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all shrink-0"
                                title="Kembali ke Portal Supir"
                            >
                                <ArrowLeft size={16} />
                            </Link>
                            <div className="flex items-center gap-1.5">
                                <Bus size={20} color="#FFC627" />
                                <span
                                    className="text-sm font-bold tracking-tight text-white"
                                    style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                >
                                    TERMINAL PAREPARE
                                </span>
                            </div>
                        </div>

                        {/* Status Badge & Logout Button */}
                        <div className="flex items-center gap-2">
                            <span
                                className="rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider"
                                style={{
                                    backgroundColor:
                                        statusBus === 'berangkat'
                                            ? '#FFC627'
                                            : statusBus === 'selesai'
                                            ? '#22c55e'
                                            : '#ffffff',
                                    color: '#001A33',
                                }}
                            >
                                {statusBus === 'berangkat' ? '● Di Jalan' : statusBus === 'selesai' ? '✓ Selesai' : 'Menunggu'}
                            </span>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-all active:scale-95"
                                style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                            >
                                <LogOut size={13} />
                                Keluar
                            </Link>
                        </div>
                    </div>

                    {/* Supir Info */}
                    {supir && (
                        <div
                            className="rounded-2xl px-4 py-2.5 flex items-center justify-between"
                            style={{ backgroundColor: 'rgba(255, 198, 39, 0.1)', border: '1px solid rgba(255, 198, 39, 0.2)' }}
                        >
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-white/50">Supir</p>
                                <p className="text-sm font-bold text-white">{supir.nama_supir}</p>
                            </div>
                        </div>
                    )}

                    {/* Bus & License Plate Card */}
                    <div
                        className="rounded-2xl p-4 flex flex-col gap-2"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
                    >
                        <p className="text-xs uppercase tracking-widest text-white/70">Armada Supir</p>
                        <h1
                            className="text-2xl font-extrabold text-white leading-tight"
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                        >
                            {jadwal.bus?.nama_bus || 'Bus Express'}
                        </h1>
                        <div className="flex items-center gap-3">
                            <span
                                className="rounded-md px-3 py-1 text-sm font-bold tracking-wider"
                                style={{
                                    backgroundColor: '#001A33',
                                    color: '#FFC627',
                                    fontFamily: "'JetBrains Mono', monospace",
                                }}
                            >
                                {jadwal.bus?.nomor_polisi || 'PLATE'}
                            </span>
                            <span className="text-xs text-white/80">
                                {jadwal.bus?.po_bus?.nama_po || 'PO DAMRI'}
                            </span>
                        </div>
                    </div>

                    {/* Route Info */}
                    <div
                        className="rounded-2xl p-4 flex items-center justify-between"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
                    >
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-white/60">Asal</p>
                            <p className="text-base font-bold text-white">{jadwal.rute?.asal}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <ArrowRight size={20} color="#FFC627" />
                            <span className="text-[10px] font-mono text-white/60">{jadwal.jam_keberangkatan?.slice(0, 5)} WITA</span>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] uppercase tracking-wider text-white/60">Tujuan</p>
                            <p className="text-base font-bold text-white">{jadwal.rute?.tujuan}</p>
                        </div>
                    </div>
                </div>

                {/* ─── Center: MASSIVE Start/Stop Journey Button ─── */}
                <div className="my-auto flex flex-col items-center justify-center gap-6 py-6">
                    {/* Error Notice */}
                    {gpsError && (
                        <div className="rounded-2xl bg-red-500/20 border border-red-500/50 p-4 text-center text-red-200 text-xs flex items-center gap-2 max-w-xs">
                            <ShieldAlert size={20} className="shrink-0 text-red-400" />
                            <span>{gpsError}</span>
                        </div>
                    )}

                    {statusBus === 'selesai' ? (
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-500/20 border-2 border-green-500">
                                <CheckCircle size={48} className="text-green-400" />
                            </div>
                            <div>
                                <h2
                                    className="text-2xl font-bold text-white"
                                    style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                >
                                    Perjalanan Selesai
                                </h2>
                                <p className="text-xs text-white/70 max-w-xs mt-1">
                                    Terima kasih Pak Supir! Seluruh data perjalanan dan titik lokasi telah tersimpan.
                                </p>
                            </div>

                            {/* Action Buttons when Finished */}
                            <div className="flex items-center gap-3 mt-2">
                                <Link
                                    href={route('supir.index')}
                                    className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all active:scale-95"
                                    style={{ backgroundColor: '#ffffff', color: '#001A33' }}
                                >
                                    <ArrowLeft size={14} />
                                    Kembali ke Portal
                                </Link>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all active:scale-95"
                                    style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
                                >
                                    <LogOut size={14} />
                                    Keluar / Logout
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            {/* MASSIVE Screen-Centered Pill Button */}
                            {!isTracking ? (
                                <button
                                    onClick={handleStartJourney}
                                    disabled={loading}
                                    className="group relative flex h-48 w-48 flex-col items-center justify-center rounded-full shadow-2xl transition-all active:scale-95"
                                    style={{
                                        backgroundColor: '#FFC627',
                                        color: '#001A33',
                                        boxShadow: '0 0 50px rgba(255, 198, 39, 0.4)',
                                    }}
                                >
                                    <Navigation size={44} className="mb-1 transition-transform group-hover:scale-110" />
                                    <span
                                        className="text-center text-lg font-black uppercase tracking-tight leading-tight px-3"
                                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                    >
                                        MULAI<br />PERJALANAN
                                    </span>
                                </button>
                            ) : (
                                <button
                                    onClick={handleFinishJourney}
                                    disabled={loading}
                                    className="group relative flex h-48 w-48 flex-col items-center justify-center rounded-full shadow-2xl transition-all active:scale-95 bg-red-600 text-white"
                                    style={{
                                        boxShadow: '0 0 50px rgba(239, 68, 68, 0.5)',
                                    }}
                                >
                                    <NavigationOff size={44} className="mb-1 animate-pulse" />
                                    <span
                                        className="text-center text-lg font-black uppercase tracking-tight leading-tight px-3"
                                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                    >
                                        SELESAI<br />PERJALANAN
                                    </span>
                                </button>
                            )}

                            <p className="text-xs text-white/70 font-medium text-center">
                                {!isTracking
                                    ? 'Tekan tombol kuning di atas untuk mengaktifkan lacak GPS live'
                                    : 'Lacak GPS aktif • Tekan merah jika bus telah tiba di tujuan'}
                            </p>
                        </div>
                    )}
                </div>

                {/* ─── Bottom Status Bar: GPS & Wake Lock Diagnostics ─── */}
                <div className="flex flex-col gap-2">
                    {isTracking && (
                        <div
                            className="rounded-2xl p-3 flex items-center justify-between text-xs"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
                        >
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                </span>
                                <span>Pancar GPS ({sentCount}x)</span>
                            </div>

                            {/* Wake lock indicator */}
                            <div className="flex items-center gap-1.5 text-white/80">
                                <Zap size={14} color={wakeLockActive ? '#FFC627' : '#ffffff'} />
                                <span>{wakeLockActive ? 'Layar Nyala (Wake Lock)' : 'Standby'}</span>
                            </div>
                        </div>
                    )}

                    {/* Coordinates & telemetry readout */}
                    {lastPosition && (
                        <div
                            className="rounded-2xl p-3 grid grid-cols-3 gap-2 text-center text-[11px] font-mono"
                            style={{ backgroundColor: 'rgba(0, 26, 51, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                        >
                            <div>
                                <p className="text-[9px] uppercase text-white/50 font-sans">Kecepatan</p>
                                <p className="font-bold text-yellow-400">{lastPosition.speed ?? 0} km/j</p>
                            </div>
                            <div>
                                <p className="text-[9px] uppercase text-white/50 font-sans">Arah</p>
                                <p className="font-bold text-white flex items-center justify-center gap-1">
                                    <Compass size={12} color="#FFC627" />
                                    {lastPosition.heading ? `${Math.round(lastPosition.heading)}°` : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-[9px] uppercase text-white/50 font-sans">Akurasi</p>
                                <p className="font-bold text-green-400">±{lastPosition.accuracy}m</p>
                            </div>
                        </div>
                    )}

                    <div className="text-center text-[10px] text-white/40 pt-1">
                        Sistem Informasi Terminal Induk Parepare • Web Geolocation Engine
                    </div>
                </div>
            </div>
        </>
    );
}
