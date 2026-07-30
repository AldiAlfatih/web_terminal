import { echo } from '@/echo';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Bus, Clock, Compass, MapPin, Navigation, Radio } from 'lucide-react';
import { useEffect, useState } from 'react';

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

interface TrackingMapPageProps {
    jadwal: JadwalProps;
}

export default function PassengerTrackingMap({ jadwal }: TrackingMapPageProps) {
    // Default coordinates: Parepare Terminal (-4.0153, 119.6247)
    const [busLocation, setBusLocation] = useState<{
        lat: number;
        lng: number;
        heading: number | null;
        speed: number | null;
        updatedAt: string | null;
    }>({
        lat: -4.0153,
        lng: 119.6247,
        heading: null,
        speed: null,
        updatedAt: null,
    });

    const [statusBus, setStatusBus] = useState<'menunggu' | 'berangkat' | 'selesai'>(jadwal.status_bus);
    const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);
    const [leafletLoaded, setLeafletLoaded] = useState<boolean>(false);

    // Dynamic Leaflet components loaded client-side to avoid SSR issues
    const [LeafletComponents, setLeafletComponents] = useState<any>(null);

    useEffect(() => {
        // Dynamically import Leaflet and react-leaflet on client
        Promise.all([
            // @ts-ignore
            import('leaflet'),
            // @ts-ignore
            import('react-leaflet'),
            // @ts-ignore
            import('leaflet/dist/leaflet.css'),
        ]).then(([L, ReactLeaflet]) => {
            setLeafletComponents({
                L: L.default || L,
                MapContainer: ReactLeaflet.MapContainer,
                TileLayer: ReactLeaflet.TileLayer,
                Marker: ReactLeaflet.Marker,
                Popup: ReactLeaflet.Popup,
                useMap: ReactLeaflet.useMap,
            });
            setLeafletLoaded(true);
        });
    }, []);

    // Helper component to smoothly center map on bus location update
    const MapRecenter = ({ lat, lng }: { lat: number; lng: number }) => {
        const map = LeafletComponents?.useMap();
        useEffect(() => {
            if (map && lat && lng) {
                map.flyTo([lat, lng], map.getZoom(), { animate: true, duration: 1 });
            }
        }, [lat, lng, map]);
        return null;
    };

    // ─── Listen to Real-Time Reverb WebSocket Channel ───
    useEffect(() => {
        const channelName = `tracking.jadwal.${jadwal.id_jadwal}`;
        const channel = echo.channel(channelName);

        setIsLiveConnected(true);

        channel.listen('.BusLocationUpdated', (data: any) => {
            if (data.lat && data.lng) {
                setBusLocation({
                    lat: Number(data.lat),
                    lng: Number(data.lng),
                    heading: data.heading ? Number(data.heading) : null,
                    speed: data.speed ? Number(data.speed) : null,
                    updatedAt: new Date().toLocaleTimeString('id-ID'),
                });
            }

            if (data.status_bus) {
                setStatusBus(data.status_bus);
            }
        });

        return () => {
            echo.leaveChannel(channelName);
            setIsLiveConnected(false);
        };
    }, [jadwal.id_jadwal]);

    // Create custom DAMRI Bus Vector Graphic Marker icon for Leaflet
    const createDamriMarkerIcon = () => {
        if (!LeafletComponents?.L) return null;

        const L = LeafletComponents.L;
        const rotateDeg = busLocation.heading ? Math.round(busLocation.heading) : 0;

        // Custom detailed DAMRI Bus Vector Illustration SVG (No browser emoji!)
        const busSvgGraphic = `
            <svg width="44" height="44" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Bus Body Background Shield -->
                <rect x="8" y="10" width="48" height="44" rx="10" fill="#FFC627" stroke="#003B70" stroke-width="3"/>
                <!-- Front Windshield -->
                <rect x="13" y="15" width="38" height="18" rx="4" fill="#003B70"/>
                <!-- Destination Display Strip -->
                <rect x="18" y="12" width="28" height="3" rx="1.5" fill="#FFC627"/>
                <!-- Driver & Passenger Window Glass Glow -->
                <rect x="16" y="17" width="15" height="14" rx="2" fill="#4A90E2" opacity="0.6"/>
                <rect x="33" y="17" width="15" height="14" rx="2" fill="#4A90E2" opacity="0.6"/>
                <!-- Headlights -->
                <circle cx="16" cy="42" r="4.5" fill="#FFFFFF" stroke="#003B70" stroke-width="2"/>
                <circle cx="48" cy="42" r="4.5" fill="#FFFFFF" stroke="#003B70" stroke-width="2"/>
                <circle cx="16" cy="42" r="2" fill="#FFC627"/>
                <circle cx="48" cy="42" r="2" fill="#FFC627"/>
                <!-- Front Grille -->
                <rect x="24" y="40" width="16" height="5" rx="2.5" fill="#003B70"/>
                <!-- Bumper -->
                <rect x="10" y="48" width="44" height="4" rx="2" fill="#001A33"/>
                <!-- Side Mirrors -->
                <rect x="3" y="20" width="4" height="8" rx="2" fill="#003B70"/>
                <rect x="57" y="20" width="4" height="8" rx="2" fill="#003B70"/>
            </svg>
        `;

        const htmlIcon = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                transform: translate(-50%, -100%);
                cursor: pointer;
            ">
                <!-- Outer Animated Pulse Ring -->
                <div style="
                    position: relative;
                    width: 58px;
                    height: 58px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <!-- Beacon Radar Pulse -->
                    <div style="
                        position: absolute;
                        inset: -4px;
                        border-radius: 9999px;
                        background-color: rgba(255, 198, 39, 0.45);
                        border: 2px solid #FFC627;
                        animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
                    "></div>

                    <!-- Bus Graphic Pin Badge -->
                    <div style="
                        position: relative;
                        width: 54px;
                        height: 54px;
                        border-radius: 9999px;
                        background-color: #003B70;
                        border: 3px solid #FFC627;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 8px 20px rgba(0, 26, 51, 0.5);
                        transform: rotate(${rotateDeg}deg);
                        transition: transform 0.4s ease;
                    ">
                        ${busSvgGraphic}
                    </div>
                </div>

                <!-- License Plate Tag below the Bus Graphic -->
                <div style="
                    margin-top: 4px;
                    background-color: #001A33;
                    color: #FFC627;
                    border: 1px solid #FFC627;
                    border-radius: 9999px;
                    padding: 3px 10px;
                    font-family: 'JetBrains Mono', monospace;
                    font-weight: 800;
                    font-size: 10px;
                    letter-spacing: 0.05em;
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
                    white-space: nowrap;
                ">
                    ${jadwal.bus?.nomor_polisi || 'BUS DAMRI'}
                </div>
            </div>
        `;

        return L.divIcon({
            html: htmlIcon,
            className: 'damri-bus-graphic-marker',
            iconSize: [60, 90],
            iconAnchor: [30, 85],
        });
    };

    return (
        <>
            <Head title={`Lacak Bus Live — ${jadwal.bus?.nama_bus || 'DAMRI'}`} />

            {/* Page layout on Cream Canvas background */}
            <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f9f7f3', fontFamily: "'Inter', sans-serif" }}>

                {/* ─── Top Bar ─── */}
                <header className="border-b px-4 py-3 sm:px-8" style={{ backgroundColor: '#ffffff', borderColor: '#d4cfc6' }}>
                    <div className="mx-auto flex max-w-6xl items-center justify-between">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-black"
                        >
                            <ArrowLeft size={18} />
                            Kembali ke Jadwal
                        </Link>

                        <div className="flex items-center gap-2">
                            <span
                                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                                style={{
                                    backgroundColor: isLiveConnected ? '#d1fae5' : '#fee2e2',
                                    color: isLiveConnected ? '#065f46' : '#991b1b',
                                }}
                            >
                                <Radio size={12} className={isLiveConnected ? 'animate-pulse' : ''} />
                                {isLiveConnected ? 'WebSocket Terhubung' : 'Terputus'}
                            </span>
                        </div>
                    </div>
                </header>

                {/* ─── Main Content ─── */}
                <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 sm:p-6">

                    {/* Schedule Header Card */}
                    <div
                        className="p-5 sm:p-6"
                        style={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #d4cfc6',
                            borderRadius: '16px',
                        }}
                    >
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Peta Pelacakan Real-Time
                                </span>
                                <h1
                                    className="text-2xl font-extrabold sm:text-3xl"
                                    style={{
                                        fontFamily: "'Bricolage Grotesque', sans-serif",
                                        color: '#001A33',
                                        lineHeight: 1.1,
                                    }}
                                >
                                    {jadwal.bus?.nama_bus}
                                </h1>
                                <p className="mt-1 text-sm text-gray-600">
                                    {jadwal.bus?.po_bus?.nama_po} • Rute: <strong className="text-blue-900">{jadwal.rute?.asal}</strong> → <strong className="text-blue-900">{jadwal.rute?.tujuan}</strong>
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* License plate badge */}
                                <span
                                    className="rounded-md px-3 py-1.5 text-sm font-bold tracking-wider"
                                    style={{
                                        backgroundColor: '#001A33',
                                        color: '#FFC627',
                                        fontFamily: "'JetBrains Mono', monospace",
                                    }}
                                >
                                    {jadwal.bus?.nomor_polisi}
                                </span>

                                {/* Status pill */}
                                <span
                                    className="rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider"
                                    style={{
                                        backgroundColor:
                                            statusBus === 'berangkat'
                                                ? '#003B70'
                                                : statusBus === 'selesai'
                                                ? '#22c55e'
                                                : '#e8e4dc',
                                        color: statusBus === 'berangkat' || statusBus === 'selesai' ? '#ffffff' : '#4a5568',
                                    }}
                                >
                                    {statusBus === 'berangkat' ? '● Di Jalan' : statusBus === 'selesai' ? '✓ Selesai' : 'Menunggu'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Telemetry Summary Bar */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div
                            className="p-3.5 text-center"
                            style={{ backgroundColor: '#ffffff', border: '1px solid #d4cfc6', borderRadius: '12px' }}
                        >
                            <p className="text-[10px] font-semibold uppercase text-gray-500">Jam Keberangkatan</p>
                            <p className="font-mono text-sm font-bold text-blue-950 mt-0.5">{jadwal.jam_keberangkatan?.slice(0, 5)} WITA</p>
                        </div>

                        <div
                            className="p-3.5 text-center"
                            style={{ backgroundColor: '#ffffff', border: '1px solid #d4cfc6', borderRadius: '12px' }}
                        >
                            <p className="text-[10px] font-semibold uppercase text-gray-500">Kecepatan Bus</p>
                            <p className="font-mono text-sm font-bold text-amber-600 mt-0.5">
                                {busLocation.speed !== null ? `${busLocation.speed} km/jam` : '0 km/jam'}
                            </p>
                        </div>

                        <div
                            className="p-3.5 text-center"
                            style={{ backgroundColor: '#ffffff', border: '1px solid #d4cfc6', borderRadius: '12px' }}
                        >
                            <p className="text-[10px] font-semibold uppercase text-gray-500">Update Terakhir</p>
                            <p className="font-mono text-sm font-bold text-emerald-700 mt-0.5">
                                {busLocation.updatedAt || 'Menunggu sinyal...'}
                            </p>
                        </div>

                        <div
                            className="p-3.5 text-center"
                            style={{ backgroundColor: '#ffffff', border: '1px solid #d4cfc6', borderRadius: '12px' }}
                        >
                            <p className="text-[10px] font-semibold uppercase text-gray-500">Status Lacak</p>
                            <p className="font-mono text-sm font-bold text-blue-900 mt-0.5">
                                {statusBus === 'berangkat' ? 'Live GPS' : 'Standby'}
                            </p>
                        </div>
                    </div>

                    {/* ─── Map Container ─── */}
                    <div
                        className="relative min-h-[450px] flex-1 overflow-hidden"
                        style={{
                            backgroundColor: '#e5e3df',
                            border: '1px solid #d4cfc6',
                            borderRadius: '16px',
                        }}
                    >
                        {leafletLoaded && LeafletComponents ? (
                            <LeafletComponents.MapContainer
                                center={[busLocation.lat, busLocation.lng]}
                                zoom={14}
                                scrollWheelZoom={true}
                                style={{ width: '100%', height: '100%', minHeight: '450px', zIndex: 1 }}
                            >
                                {/* Smooth recenter on new coordinate broadcast */}
                                <MapRecenter lat={busLocation.lat} lng={busLocation.lng} />

                                {/* 100% Free OpenStreetMap Tiles */}
                                <LeafletComponents.TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                {/* Custom DAMRI Bus Marker */}
                                {createDamriMarkerIcon() && (
                                    <LeafletComponents.Marker
                                        position={[busLocation.lat, busLocation.lng]}
                                        icon={createDamriMarkerIcon()}
                                    >
                                        <LeafletComponents.Popup>
                                            <div className="p-1 text-center font-sans text-xs">
                                                <strong className="block text-sm text-blue-950">{jadwal.bus?.nama_bus}</strong>
                                                <span className="font-mono text-amber-600 font-bold">{jadwal.bus?.nomor_polisi}</span>
                                                <p className="mt-1 text-gray-600">{jadwal.rute?.asal} → {jadwal.rute?.tujuan}</p>
                                            </div>
                                        </LeafletComponents.Popup>
                                    </LeafletComponents.Marker>
                                )}
                            </LeafletComponents.MapContainer>
                        ) : (
                            <div className="flex h-full min-h-[450px] items-center justify-center text-gray-500 text-sm">
                                Memuat peta OpenStreetMap...
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
