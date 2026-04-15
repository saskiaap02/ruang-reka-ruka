import { Link } from '@inertiajs/react';

export default function MonitoringTable({ daftarKelompok }) {
    return (
        <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm sm:rounded-2xl border border-slate-200 dark:border-slate-700">
            {/* Header Tabel */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Monitoring & Audit Log Kelompok</h3>
                <span className="bg-white dark:bg-slate-700 text-[10px] font-bold px-3 py-1 rounded-full border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 flex items-center gap-2 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Audit System Active
                </span>
            </div>

            {/* Konten Tabel */}
            <div className="p-0 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            <th className="p-4">Nama Kelompok</th>
                            <th className="p-4">Status AI</th>
                            <th className="p-4 text-center">Progress</th>
                            <th className="p-4">Update Terakhir</th>
                            <th className="p-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {daftarKelompok?.length > 0 ? (
                            daftarKelompok.map((kelompok) => (
                                <tr key={kelompok.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4">
                                        <p className="font-bold text-slate-800 dark:text-white text-sm">{kelompok.nama}</p>
                                        <p className="text-[10px] text-slate-500 uppercase font-medium tracking-tight truncate max-w-[200px]">
                                            {kelompok.proyek || 'Belum ada judul proyek'}
                                        </p>
                                    </td>
                                    <td className="p-4">
                                        {/* Badge Status Dinamis */}
                                        <span className={`px-2 py-0.5 text-[10px] font-black rounded-md uppercase tracking-widest ${
                                            kelompok.status === 'Aman' 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-red-100 text-red-700 animate-pulse'
                                        }`}>
                                            {kelompok.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                                                {kelompok.progress}%
                                            </span>
                                            <div className="w-20 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full transition-all duration-500 ${
                                                        parseInt(kelompok.progress) > 70 ? 'bg-emerald-500' : 
                                                        parseInt(kelompok.progress) > 30 ? 'bg-blue-500' : 'bg-orange-500'
                                                    }`} 
                                                    style={{ width: `${kelompok.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-xs italic text-slate-500 dark:text-slate-400">
                                        "{kelompok.log_terakhir || 'Belum ada aktivitas'}"
                                    </td>
                                    <td className="p-4 text-center">
                                        <Link
                                            href={route('dosen.kelompok.show', { id: kelompok.id })}
                                            className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-3 py-1.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all shadow-sm"
                                        >
                                            Detail Audit
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-12 text-center text-slate-500 text-xs italic">
                                    Belum ada kelompok terdaftar. Mulai dengan membuat kelompok baru di atas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}