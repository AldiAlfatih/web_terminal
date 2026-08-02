import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Bus, Download, Printer } from 'lucide-react';

interface LaporanItem {
    id_laporan: number;
    tanggal_laporan: string;
    periode_awal: string;
    jenis_laporan: string;
    file_pdf: string | null;
    admin?: {
        nama_admin: string;
    };
}

interface ShowProps {
    laporan: LaporanItem;
    reportData: {
        jadwals?: any[];
        buses?: any[];
        supirs?: any[];
        poBuses?: any[];
    };
}

export default function LaporanShow({ laporan, reportData }: ShowProps) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Head title={`Laporan ${laporan.jenis_laporan} — Terminal Induk Parepare`} />

            {/* Top Action Bar (hidden when printing) */}
            <div className="print:hidden bg-slate-900 text-white px-6 py-3 flex items-center justify-between shadow-md">
                <Link
                    href={route('admin.laporan.index')}
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white"
                >
                    <ArrowLeft size={16} />
                    Kembali ke Daftar Laporan
                </Link>

                <div className="flex items-center gap-3">
                    {laporan.file_pdf && (
                        <a
                            href={laporan.file_pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300"
                        >
                            <Download size={14} />
                            Download PDF Terunggah
                        </a>
                    )}
                    <button
                        onClick={handlePrint}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-blue-600 text-white hover:bg-blue-500"
                    >
                        <Printer size={14} />
                        Cetak / Simpan PDF
                    </button>
                </div>
            </div>

            {/* Printable Document Canvas */}
            <div className="min-h-screen bg-slate-100 p-4 md:p-8 print:p-0 print:bg-white flex justify-center">
                <div
                    className="bg-white w-full max-w-4xl p-8 md:p-12 shadow-lg print:shadow-none print:w-full print:max-w-none rounded-2xl print:rounded-none"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                >
                    {/* Kop Surat / Header Resmi Terminal Induk Parepare */}
                    <div className="flex items-center justify-between border-b-4 border-slate-900 pb-4 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 bg-[#FFC627] rounded-2xl flex items-center justify-center shrink-0 border border-slate-900">
                                <Bus size={36} color="#003B70" />
                            </div>
                            <div>
                                <h1
                                    className="text-2xl font-black uppercase tracking-tight text-slate-900 leading-tight"
                                    style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                >
                                    DINAS PERHUBUNGAN KOTA PAREPARE
                                </h1>
                                <h2 className="text-base font-bold text-[#003B70] tracking-wide">
                                    SISTEM INFORMASI TERMINAL INDUK PAREPARE
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Jl. Nusantara No. 01, Kota Parepare, Sulawesi Selatan • Telp: (0421) 22100
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Judul Laporan */}
                    <div className="text-center mb-6">
                        <h3
                            className="text-xl font-extrabold uppercase tracking-wide text-slate-900"
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                        >
                            LAPORAN {laporan.jenis_laporan}
                        </h3>
                        <p className="text-xs font-mono text-slate-600 mt-1">
                            Periode: {laporan.periode_awal?.slice(0, 10)} s/d {laporan.tanggal_laporan?.slice(0, 10)}
                        </p>
                    </div>

                    {/* Metadata Laporan */}
                    <div className="grid grid-cols-2 text-xs mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div>
                            <span className="text-slate-500">Nomor Dokumen: </span>
                            <span className="font-mono font-bold text-slate-800">REP-{laporan.id_laporan.toString().padStart(4, '0')}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-slate-500">Dibuat Oleh Admin: </span>
                            <span className="font-bold text-slate-800">{laporan.admin?.nama_admin || 'System'}</span>
                        </div>
                    </div>

                    {/* Table Data Content based on Report Type */}
                    <div className="mb-8">
                        {laporan.jenis_laporan === 'Jadwal Keberangkatan Bus' && (
                            <table className="w-full text-xs border-collapse border border-slate-300">
                                <thead>
                                    <tr className="bg-slate-100 text-slate-900 border-b border-slate-300">
                                        <th className="border border-slate-300 px-2 py-2 text-left">Tanggal</th>
                                        <th className="border border-slate-300 px-2 py-2 text-left">Armada Bus</th>
                                        <th className="border border-slate-300 px-2 py-2 text-left">PO Bus</th>
                                        <th className="border border-slate-300 px-2 py-2 text-left">Rute Trayek</th>
                                        <th className="border border-slate-300 px-2 py-2 text-left">Supir</th>
                                        <th className="border border-slate-300 px-2 py-2 text-center">Keberangkatan</th>
                                        <th className="border border-slate-300 px-2 py-2 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.jadwals && reportData.jadwals.length > 0 ? (
                                        reportData.jadwals.map((j) => (
                                            <tr key={j.id_jadwal} className="border-b border-slate-200">
                                                <td className="border border-slate-300 px-2 py-1.5 font-mono">{j.tanggal?.slice(0, 10)}</td>
                                                <td className="border border-slate-300 px-2 py-1.5 font-bold">{j.bus?.nama_bus} ({j.bus?.nomor_polisi})</td>
                                                <td className="border border-slate-300 px-2 py-1.5">{j.bus?.po_bus?.nama_po}</td>
                                                <td className="border border-slate-300 px-2 py-1.5">{j.rute?.asal} → {j.rute?.tujuan}</td>
                                                <td className="border border-slate-300 px-2 py-1.5">{j.supir?.nama_supir || '-'}</td>
                                                <td className="border border-slate-300 px-2 py-1.5 text-center font-mono">{j.jam_keberangkatan?.slice(0, 5)} WITA</td>
                                                <td className="border border-slate-300 px-2 py-1.5 text-center font-bold capitalize">{j.status_bus}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="text-center py-4 text-slate-500">Tidak ada data jadwal pada periode ini.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}

                        {laporan.jenis_laporan === 'Daftar Armada Bus' && (
                            <table className="w-full text-xs border-collapse border border-slate-300">
                                <thead>
                                    <tr className="bg-slate-100 text-slate-900 border-b border-slate-300">
                                        <th className="border border-slate-300 px-3 py-2 text-left">Nama Armada</th>
                                        <th className="border border-slate-300 px-3 py-2 text-left">Nomor Polisi (Plat)</th>
                                        <th className="border border-slate-300 px-3 py-2 text-left">Perusahaan Otobus (PO)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.buses && reportData.buses.length > 0 ? (
                                        reportData.buses.map((b) => (
                                            <tr key={b.id_bus} className="border-b border-slate-200">
                                                <td className="border border-slate-300 px-3 py-2 font-bold">{b.nama_bus}</td>
                                                <td className="border border-slate-300 px-3 py-2 font-mono font-semibold">{b.nomor_polisi}</td>
                                                <td className="border border-slate-300 px-3 py-2">{b.po_bus?.nama_po || '-'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="text-center py-4 text-slate-500">Tidak ada data armada bus.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}

                        {laporan.jenis_laporan === 'Aktivitas & Data Supir' && (
                            <table className="w-full text-xs border-collapse border border-slate-300">
                                <thead>
                                    <tr className="bg-slate-100 text-slate-900 border-b border-slate-300">
                                        <th className="border border-slate-300 px-3 py-2 text-left">Nama Supir</th>
                                        <th className="border border-slate-300 px-3 py-2 text-left">Nomor Telepon</th>
                                        <th className="border border-slate-300 px-3 py-2 text-left">Username</th>
                                        <th className="border border-slate-300 px-3 py-2 text-center">Total Penugasan Jadwal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.supirs && reportData.supirs.length > 0 ? (
                                        reportData.supirs.map((s) => (
                                            <tr key={s.id_supir} className="border-b border-slate-200">
                                                <td className="border border-slate-300 px-3 py-2 font-bold">{s.nama_supir}</td>
                                                <td className="border border-slate-300 px-3 py-2 font-mono">{s.no_telp}</td>
                                                <td className="border border-slate-300 px-3 py-2">{s.username}</td>
                                                <td className="border border-slate-300 px-3 py-2 text-center font-bold">{s.jadwals_count ?? 0} Kali</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center py-4 text-slate-500">Tidak ada data supir.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}

                        {laporan.jenis_laporan === 'Data Perusahaan Otobus (PO)' && (
                            <table className="w-full text-xs border-collapse border border-slate-300">
                                <thead>
                                    <tr className="bg-slate-100 text-slate-900 border-b border-slate-300">
                                        <th className="border border-slate-300 px-3 py-2 text-left">Nama PO Bus</th>
                                        <th className="border border-slate-300 px-3 py-2 text-left">Alamat Perusahaan</th>
                                        <th className="border border-slate-300 px-3 py-2 text-left">No. Telepon</th>
                                        <th className="border border-slate-300 px-3 py-2 text-center">Jumlah Bus</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.poBuses && reportData.poBuses.length > 0 ? (
                                        reportData.poBuses.map((po) => (
                                            <tr key={po.id_po} className="border-b border-slate-200">
                                                <td className="border border-slate-300 px-3 py-2 font-bold">{po.nama_po}</td>
                                                <td className="border border-slate-300 px-3 py-2">{po.alamat_po}</td>
                                                <td className="border border-slate-300 px-3 py-2 font-mono">{po.no_telp_po}</td>
                                                <td className="border border-slate-300 px-3 py-2 text-center font-bold">{po.buses_count ?? 0} Armada</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center py-4 text-slate-500">Tidak ada data PO bus.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Signature / Pengesahan Block */}
                    <div className="flex justify-between items-end mt-12 text-xs pt-8 border-t border-slate-200">
                        <div>
                            <p className="text-slate-500">Catatan:</p>
                            <p className="text-[11px] text-slate-400 italic max-w-xs">
                                Dokumen ini diterbitkan secara resmi oleh Sistem Informasi Terminal Induk Parepare dan sah digunakan sebagai laporan operasional.
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-slate-600 mb-1">Parepare, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            <p className="font-bold text-slate-900 mb-12">Kepala Terminal Induk Parepare</p>
                            <p className="font-bold text-slate-900 border-b border-slate-800 pb-0.5 inline-block">
                                {laporan.admin?.nama_admin || 'Super Admin'}
                            </p>
                            <p className="text-[10px] text-slate-500 font-mono">NIP. 19850412 201012 1 004</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
