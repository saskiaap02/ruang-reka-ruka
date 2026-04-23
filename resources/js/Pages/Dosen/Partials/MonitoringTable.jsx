import { Link } from '@inertiajs/react';

export default function MonitoringTable({ daftarKelompok }) {
    return (
        <div className="bg-slate-900/40 backdrop-blur-xl overflow-hidden rounded-[2.5rem] border border-slate-800 shadow-2xl">
            {/* Header Tabel - Versi Dark */}
            <div className="p-8 border-b border-slate-800 bg-slate-900/20 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-black text-white tracking-tight">Monitoring & Audit Log Kelompok</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold italic">Real-time Intelligence System</p>
                </div>
                <span className="bg-emerald-500/10 text-[10px] font-black px-4 py-2 rounded-xl border border-emerald-500/20 text-emerald-400 flex items-center gap-2 shadow-sm uppercase tracking-tighter">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Audit System Active
                </span>
            </div>

            {/* Konten Tabel */}
            <div className="p-0 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-800/30 border-b border-slate-800 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                            <th className="p-6">Identitas Tim</th>
                            <th className="p-6">Status AI</th>
                            <th className="p-6 text-center">Progress</th>
                            <th className="p-6">Update Terakhir</th>
                            <th className="p-6 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {daftarKelompok?.length > 0 ? (
                            daftarKelompok.map((kelompok) => (
                                <tr key={kelompok.id} className="hover:bg-blue-600/5 transition-all duration-300 group">
                                    <td className="p-6">
                                        <p className="font-black text-white text-sm group-hover:text-blue-400 transition-colors">{kelompok.nama}</p>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight truncate max-w-[250px] mt-1">
                                            {kelompok.proyek || 'Belum ada judul proyek'}
                                        </p>
                                    </td>
                                    <td className="p-6">
                                        {/* Badge Status Dinamis - Versi Dark */}
                                        <span className={`px-3 py-1.5 text-[10px] font-black rounded-lg uppercase tracking-widest border ${kelompok.status === 'Aman'
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                : 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse'
                                            }`}>
                                            {kelompok.status}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] font-black text-slate-400 mb-2 tracking-tighter">
                                                {kelompok.progress}%
                                            </span>
                                            <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                                <div
                                                    className={`h-full transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.5)] ${parseInt(kelompok.progress) > 70 ? 'bg-emerald-500' :
                                                            parseInt(kelompok.progress) > 30 ? 'bg-blue-500' : 'bg-orange-600'
                                                        }`}
                                                    style={{ width: `${kelompok.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 text-[11px] italic text-slate-500 font-medium">
                                        <span className="text-slate-700">“</span>{kelompok.log_terakhir || 'Belum ada aktivitas'}<span className="text-slate-700">”</span>
                                    </td>
                                    <td className="p-6 text-center">
                                        {/* Kolom Aksi dengan Flexbox agar tombol sejajar */}
                                        <div className="flex justify-center items-center gap-2">
                                            <Link
                                                href={route('dosen.kelompok.show', { id: kelompok.id })}
                                                className="inline-block text-[10px] font-black uppercase tracking-[0.15em] text-blue-400 border border-blue-500/30 px-4 py-2.5 rounded-2xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                                            >
                                                Detail Audit
                                            </Link>

                                            {/* Tombol Peer Review yang sudah digabungkan & disesuaikan stylingnya */}
                                            <Link
                                                href={route('dosen.peer-review.open', kelompok.id)}
                                                method="post"
                                                as="button"
                                                className="inline-block text-[10px] font-black uppercase tracking-[0.15em] text-purple-400 border border-purple-500/30 px-4 py-2.5 rounded-2xl hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all shadow-lg shadow-purple-900/20 active:scale-95"
                                            >
                                                Buka Peer Review
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-20 text-center text-slate-600 text-xs font-bold italic tracking-widest">
                                    [ SISTEM KOSONG: BELUM ADA KELOMPOK TERDETEKSI ]
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}