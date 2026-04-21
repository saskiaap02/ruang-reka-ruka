import React from 'react';

export default function KanbanBoard({ tasks, updateStatus, handleDelete, openModal, onNext }) {

    // Fungsi pembantu untuk menyamakan format string (agar aman dari case-sensitive)
    const normalizeStatus = (str) => str ? str.toLowerCase().trim() : '';

    const Column = ({ title, status, color, bgColor, borderColor }) => (
        <div className={`bg-white dark:bg-slate-800 border ${borderColor} dark:border-slate-700 p-6 sm:p-8 rounded-[3rem] flex-1 min-w-[320px] shadow-sm hover:shadow-md transition-shadow duration-300`}>

            {/* Header Kolom */}
            <div className="flex justify-between items-center mb-8 px-2">
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${bgColor} shadow-sm`}></div>
                    <h3 className={`font-black text-[10px] uppercase tracking-[0.3em] ${color}`}>{title}</h3>
                </div>
                <span className="bg-slate-50 dark:bg-slate-900 text-slate-500 text-[10px] font-black px-3 py-1 rounded-full border border-slate-100 dark:border-slate-700 shadow-inner">
                    {/* PERBAIKAN LOGIKA FILTER DI SINI */}
                    {tasks?.filter(t => normalizeStatus(t.status) === normalizeStatus(status)).length || 0}
                </span>
            </div>

            {/* List Tugas */}
            <div className="space-y-4">
                {tasks?.filter(t => normalizeStatus(t.status) === normalizeStatus(status)).map(task => (
                    <div key={task.id} className="group bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-5 rounded-[2rem] hover:bg-white dark:hover:bg-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-300 relative overflow-hidden">

                        {/* Garis Aksen Kiri Berdasarkan Status */}
                        <div className={`absolute top-0 left-0 w-1.5 h-full ${bgColor} opacity-50`}></div>

                        <div className="flex justify-between items-start mb-4 pl-2">
                            <p className={`text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed ${status === 'done' ? 'line-through opacity-70' : ''}`}>
                                {task.judul}
                            </p>
                            {/* Tombol Hapus Global (Hanya muncul saat hover) */}
                            <button
                                onClick={() => handleDelete(task.id)}
                                className="opacity-0 group-hover:opacity-100 text-[10px] font-black text-red-400 dark:text-red-500 transition-opacity p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl cursor-pointer shrink-0"
                                title="Hapus Tugas"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* FOOTER KARTU TUGAS */}
                        <div className="mt-6 pl-2">
                            {/* KHUSUS IN PROGRESS: Tampilan lebih lengkap */}
                            {status === 'in_progress' ? (
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between items-center bg-slate-100/50 dark:bg-slate-900/50 p-2.5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                                        <button
                                            // Asumsi kamu punya fungsi updateStatus(id, newStatus) di Dashboard.jsx
                                            onClick={() => updateStatus && updateStatus(task.id, 'backlog')}
                                            className="text-[9px] font-black text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 uppercase tracking-tighter px-2"
                                        >
                                            ← Balik
                                        </button>

                                        <button
                                            onClick={() => onNext(task.id)}
                                            className="bg-blue-600 text-white px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md shadow-blue-600/20 active:scale-95 transition-all hover:bg-blue-700"
                                        >
                                            Submit / Selesai
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* TAMPILAN UNTUK BACKLOG & DONE */
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-4">
                                        {status === 'done' && (
                                            <button
                                                onClick={() => updateStatus && updateStatus(task.id, 'in_progress')}
                                                className="text-[9px] font-black text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 uppercase"
                                            >
                                                ← Tarik Lagi
                                            </button>
                                        )}

                                        {status === 'backlog' && (
                                            <button
                                                onClick={() => onNext(task.id)}
                                                className="text-[10px] bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 px-4 py-2 rounded-xl uppercase font-black hover:bg-blue-200 dark:hover:bg-blue-900/80 transition-colors"
                                            >
                                                Kerjakan →
                                            </button>
                                        )}
                                    </div>

                                    {status === 'done' && (
                                        <div className="flex items-center gap-2">
                                            {task.file_path && (
                                                <a href={`/storage/${task.file_path}`} target="_blank" rel="noreferrer" className="text-[9px] font-bold text-blue-500 hover:underline uppercase tracking-wider mr-2">
                                                    Lihat Bukti
                                                </a>
                                            )}
                                            <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md">Selesai ✓</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Tombol Tambah Tugas */}
                <button
                    // Pastikan memanggil format kecil: 'backlog', 'in_progress', 'done'
                    onClick={() => openModal(status)}
                    className="w-full py-5 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-500 transition-all mt-4"
                >
                    + Reka Tugas
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-8 overflow-x-auto pb-8 pt-4 scrollbar-hide">
            {/* Pemanggilan status menggunakan format standard backend (huruf kecil & underscore) */}
            <Column title="Backlog" status="backlog" color="text-slate-400 dark:text-slate-500" bgColor="bg-slate-300 dark:bg-slate-600" borderColor="border-slate-100" />
            <Column title="In Progress" status="in_progress" color="text-blue-600 dark:text-blue-400" bgColor="bg-blue-500" borderColor="border-blue-100" />
            <Column title="Done" status="done" color="text-emerald-600 dark:text-emerald-400" bgColor="bg-emerald-500" borderColor="border-emerald-100" />
        </div>
    );
}