import React from 'react';
import { Link, router } from '@inertiajs/react';

export default function MonitoringTable({ daftarKelompok }) {
    const handleDelete = (id, nama) => {
        if (!confirm(`Hapus kelompok "${nama}" beserta semua anggotanya?`)) return;
        router.delete(route('dosen.kelompok.destroy', id), { preserveScroll: true });
    };

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-700 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                        <th className="p-5 whitespace-nowrap">Identitas Tim</th>
                        <th className="p-5 whitespace-nowrap text-center">Status AI</th>
                        <th className="p-5 whitespace-nowrap text-center">Progress Kanban</th>
                        <th className="p-5 whitespace-nowrap text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                    {daftarKelompok?.length > 0 ? (
                        daftarKelompok.map((kelompok) => (
                            <tr key={kelompok.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                <td className="p-5">
                                    <p className="font-black text-slate-800 dark:text-white text-sm">{kelompok.nama}</p>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight truncate max-w-[180px] mt-1">
                                        {kelompok.proyek || 'Belum ada judul'}
                                    </p>
                                </td>

                                <td className="p-5 text-center">
                                    <span className={`inline-block px-3 py-1.5 text-[9px] font-black rounded-lg uppercase tracking-widest border ${kelompok.status === 'Aman' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 animate-pulse'}`}>
                                        {kelompok.status}
                                    </span>
                                </td>

                                <td className="p-5">
                                    <div className="flex flex-col items-center max-w-[100px] mx-auto">
                                        <span className="text-[10px] font-black text-slate-500 mb-1">{kelompok.progress}</span>
                                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div className={`h-full transition-all duration-1000 ${parseInt(kelompok.progress) > 70 ? 'bg-emerald-500' : parseInt(kelompok.progress) > 30 ? 'bg-indigo-500' : 'bg-amber-500'}`} style={{ width: kelompok.progress }}></div>
                                        </div>
                                    </div>
                                </td>

                                <td className="p-5 text-center">
                                    {/* DI SINI TOMBOL BUKA PEER NYA KEMBALI */}
                                    <div className="flex flex-wrap items-center justify-center gap-2 w-max mx-auto">
                                        <Link href={route('dosen.kelompok.show', kelompok.id)} className="px-3 py-2 text-[9px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 rounded-lg transition-all text-center">
                                            Audit
                                        </Link>
                                        <Link method="post" as="button" preserveScroll href={route('dosen.peer-review.open', kelompok.id)} className="px-3 py-2 text-[9px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 hover:bg-purple-100 dark:text-purple-400 dark:bg-purple-500/10 dark:hover:bg-purple-500/20 rounded-lg transition-all text-center whitespace-nowrap">
                                            Buka Peer
                                        </Link>
                                        <button onClick={() => handleDelete(kelompok.id, kelompok.nama)} className="px-3 py-2 text-[9px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 hover:bg-rose-100 dark:text-rose-400 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 rounded-lg transition-all">
                                            Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="4" className="p-16 text-center text-slate-500 text-xs font-bold italic tracking-widest">Belum ada tim di kelas ini.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}