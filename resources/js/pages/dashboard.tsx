import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Bus, Building2, Calendar, CheckCircle2, Clock, FileText, Map, Timer, UserCheck } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Stats {
    total_bus: number;
    total_po: number;
    total_supir: number;
    total_rute: number;
    total_jadwal: number;
    total_laporan: number;
    jadwal_hari_ini: number;
    sedang_berangkat: number;
    menunggu: number;
    selesai_hari_ini: number;
}

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
    };
    rute: {
        asal: string;
        tujuan: string;
    };
}

interface DashboardProps {
    stats: Stats;
    jadwal_terbaru: JadwalItem[];
}

const StatusBadge = ({ status }: { status: 'menunggu' | 'berangkat' | 'selesai' }) => {
    const map = {
        menunggu:  { label: 'Menunggu',  cls: 'badge-menunggu' },
        berangkat: { label: 'Berangkat', cls: 'badge-berangkat' },
        selesai:   { label: 'Selesai',   cls: 'badge-selesai' },
    };
    const { label, cls } = map[status];
    return <span className={cls}>{label}</span>;
};

export default function Dashboard({ stats, jadwal_terbaru }: DashboardProps) {
    const bentoCards = [
        {
            label: 'Total Bus',
            value: stats?.total_bus ?? 0,
            icon: Bus,
            bg: '#003B70',
            color: '#ffffff',
            iconColor: '#FFC627',
        },
        {
            label: 'Perusahaan Otobus',
            value: stats?.total_po ?? 0,
            icon: Building2,
            bg: '#ffffff',
            color: '#001A33',
            iconColor: '#003B70',
        },
        {
            label: 'Data Supir',
            value: stats?.total_supir ?? 0,
            icon: UserCheck,
            bg: '#ffffff',
            color: '#001A33',
            iconColor: '#003B70',
        },
        {
            label: 'Total Rute',
            value: stats?.total_rute ?? 0,
            icon: Map,
            bg: '#ffffff',
            color: '#001A33',
            iconColor: '#003B70',
        },
        {
            label: 'Total Jadwal',
            value: stats?.total_jadwal ?? 0,
            icon: Calendar,
            bg: '#ffffff',
            color: '#001A33',
            iconColor: '#003B70',
        },
        {
            label: 'Laporan PDF',
            value: stats?.total_laporan ?? 0,
            icon: FileText,
            bg: '#ffffff',
            color: '#001A33',
            iconColor: '#003B70',
        },
    ];

    const todayCards = [
        {
            label: 'Jadwal Hari Ini',
            value: stats?.jadwal_hari_ini ?? 0,
            icon: Calendar,
            accent: '#003B70',
        },
        {
            label: 'Sedang Berangkat',
            value: stats?.sedang_berangkat ?? 0,
            icon: Bus,
            accent: '#FFC627',
        },
        {
            label: 'Menunggu',
            value: stats?.menunggu ?? 0,
            icon: Timer,
            accent: '#4a5568',
        },
        {
            label: 'Selesai Hari Ini',
            value: stats?.selesai_hari_ini ?? 0,
            icon: CheckCircle2,
            accent: '#22c55e',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard — Terminal Parepare" />

            <div className="flex flex-col gap-6 p-6" style={{ backgroundColor: '#f9f7f3' }}>

                {/* ─── Page Header ─── */}
                <div>
                    <h1
                        className="text-3xl font-extrabold tracking-tight"
                        style={{
                            fontFamily: "'Bricolage Grotesque', sans-serif",
                            color: '#001A33',
                            lineHeight: 1.0,
                            letterSpacing: '-0.03em',
                        }}
                    >
                        Dashboard
                    </h1>
                    <p className="mt-1 text-sm" style={{ color: '#4a5568', fontFamily: "'Inter', sans-serif" }}>
                        Selamat datang di Sistem Informasi Terminal Induk Parepare
                    </p>
                </div>

                {/* ─── Bento Grid — Master Data Stats ─── */}
                <div>
                    <p
                        className="mb-3 text-xs font-semibold uppercase tracking-widest"
                        style={{ color: '#4a5568' }}
                    >
                        Master Data
                    </p>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
                        {bentoCards.map((card) => {
                            const Icon = card.icon;
                            return (
                                <div
                                    key={card.label}
                                    className="flex flex-col justify-between p-5"
                                    style={{
                                        backgroundColor: card.bg,
                                        border: card.bg === '#ffffff' ? '1px solid #d4cfc6' : 'none',
                                        borderRadius: '16px',
                                        minHeight: '120px',
                                    }}
                                >
                                    <div
                                        className="flex h-9 w-9 items-center justify-center rounded-full"
                                        style={{ backgroundColor: card.bg === '#003B70' ? 'rgba(255,198,39,0.2)' : '#f0ede6' }}
                                    >
                                        <Icon size={18} color={card.iconColor} />
                                    </div>
                                    <div>
                                        <p
                                            className="text-3xl font-extrabold"
                                            style={{
                                                fontFamily: "'Bricolage Grotesque', sans-serif",
                                                color: card.color,
                                                lineHeight: 1,
                                            }}
                                        >
                                            {card.value}
                                        </p>
                                        <p
                                            className="mt-0.5 text-xs font-medium"
                                            style={{ color: card.bg === '#003B70' ? 'rgba(255,255,255,0.6)' : '#4a5568' }}
                                        >
                                            {card.label}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ─── Today's Stats ─── */}
                <div>
                    <p
                        className="mb-3 text-xs font-semibold uppercase tracking-widest"
                        style={{ color: '#4a5568' }}
                    >
                        Operasional Hari Ini
                    </p>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {todayCards.map((card) => {
                            const Icon = card.icon;
                            return (
                                <div
                                    key={card.label}
                                    className="flex items-center gap-4 p-4"
                                    style={{
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #d4cfc6',
                                        borderRadius: '16px',
                                    }}
                                >
                                    <div
                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                                        style={{ backgroundColor: `${card.accent}18` }}
                                    >
                                        <Icon size={18} color={card.accent} />
                                    </div>
                                    <div>
                                        <p
                                            className="text-2xl font-extrabold"
                                            style={{
                                                fontFamily: "'Bricolage Grotesque', sans-serif",
                                                color: '#001A33',
                                                lineHeight: 1,
                                            }}
                                        >
                                            {card.value}
                                        </p>
                                        <p className="text-xs" style={{ color: '#4a5568' }}>
                                            {card.label}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ─── Latest Today's Schedule ─── */}
                <div>
                    <p
                        className="mb-3 text-xs font-semibold uppercase tracking-widest"
                        style={{ color: '#4a5568' }}
                    >
                        Jadwal Keberangkatan Hari Ini
                    </p>
                    <div
                        className="overflow-hidden"
                        style={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #d4cfc6',
                            borderRadius: '16px',
                        }}
                    >
                        {jadwal_terbaru && jadwal_terbaru.length > 0 ? (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #d4cfc6' }}>
                                        {['Bus', 'Rute', 'Berangkat', 'Tiba', 'Status'].map((h) => (
                                            <th
                                                key={h}
                                                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                                                style={{ color: '#4a5568' }}
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {jadwal_terbaru.map((j, idx) => (
                                        <tr
                                            key={j.id_jadwal}
                                            style={{
                                                borderBottom: idx < jadwal_terbaru.length - 1 ? '1px solid #f0ede6' : 'none',
                                            }}
                                        >
                                            <td className="px-4 py-3">
                                                <p className="font-semibold" style={{ color: '#001A33' }}>
                                                    {j.bus?.nama_bus}
                                                </p>
                                                <p
                                                    className="plate text-xs"
                                                    style={{ color: '#4a5568' }}
                                                >
                                                    {j.bus?.nomor_polisi}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3" style={{ color: '#001A33' }}>
                                                {j.rute?.asal} → {j.rute?.tujuan}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="time-display" style={{ color: '#003B70', fontWeight: 600 }}>
                                                    {j.jam_keberangkatan}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="time-display" style={{ color: '#4a5568' }}>
                                                    {j.jam_kedatangan}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <StatusBadge status={j.status_bus} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="py-12 text-center">
                                <Clock size={32} color="#d4cfc6" className="mx-auto mb-3" />
                                <p className="text-sm font-medium" style={{ color: '#4a5568' }}>
                                    Belum ada jadwal untuk hari ini
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
