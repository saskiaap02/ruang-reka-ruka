import React from 'react';

export default function KanbanBoard({ tasks = [], updateStatus, handleDelete, openModal, onNext }) {

    // Fungsi pembantu untuk menyamakan format string (agar aman dari error)
    const normalizeStatus = (str) => str ? str.toLowerCase().trim() : '';

    const Column = ({ title, status, color, bgColor, borderColor }) => {
        // Ambil tugas khusus untuk kolom ini
        const columnTasks = tasks?.filter(t => normalizeStatus(t.status) === normalizeStatus(status)) || [];

        return (
            <div className={`bg-white dark:bg-slate-800 border ${borderColor} dark:border-slate-700 p-6 sm:p-8 rounded-[3.5rem] flex flex-col shadow-xl shadow-slate-200/40 dark:shadow-none min-h-[500px] transition-all relative`}>

                {/* Header Kolom */}
                <div className="flex justify-between items-center mb-8 px-2">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${bgColor} shadow-sm`}></div>
                        <h3 className={`font-black text-[11px] uppercase tracking-[0.3em] ${color}`}>{title}</h3>
                    </div>
                    <span className="bg-slate-50 dark:bg-slate-900 text-slate-500 text-[11px] font-black px-4 py-1.5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-inner">
                        {columnTasks.length}
                    </span>
                </div>

                {/* List Tugas */}
                <div className="flex-1 space-y-5 mb-6">
                    {columnTasks.map(task => (
                        <div key={task.id} className="group bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 rounded-[2.5rem] hover:bg-white dark:hover:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">

                            <div className="flex justify-between items-start mb-6 pl-1">
                                <p className={`text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed ${status === 'done' ? 'line-through opacity-60' : ''}`}>
                                    {task.judul}
                                </p>
                                {/* Tombol Hapus Global (Muncul saat kartu di-hover) */}
                                <button
                                    onClick={() => handleDelete(task.id)}
                                    className="opacity-0 group-hover:opacity-100 text-[10px] font-black text-red-400 dark:text-red-500 transition-opacity p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl cursor-pointer shrink-0 ml-2"
                                    title="Hapus Tugas"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            {/* FOOTER KARTU TUGAS */}
                            <div className="pl-1 mt-auto">
                                {/* KHUSUS IN PROGRESS: Harus isi bukti */}
                                {status === 'in_progress' ? (
                                    <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-2.5 rounded-[1.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
                                        <button
                                            // Asumsi kita tarik balik ke backlog jika salah pencet
                                            onClick={() => updateStatus && updateStatus(task.id, 'backlog')}
                                            className="text-[9px] font-black text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 uppercase tracking-widest px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            ← Batal
                                        </button>

                                        <button
                                            onClick={() => onNext(task.id)}
                                            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md shadow-blue-600/30 active:scale-95 transition-all hover:bg-blue-700"
                                        >
                                            Submit Bukti
                                        </button>
                                    </div>
                                ) : (
                                    /* TAMPILAN UNTUK BACKLOG & DONE */
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-2">
                                            {status === 'done' && (
                                                <button
                                                    onClick={() => updateStatus && updateStatus(task.id, 'in_progress')}
                                                    className="text-[9px] font-black text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 uppercase tracking-widest transition-colors flex items-center"
                                                >
                                                    ← Tarik
                                                </button>
                                            )}

                                            {status === 'backlog' && (
                                                <button
                                                    onClick={() => onNext(task.id)}
                                                    className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 px-5 py-2.5 rounded-[1rem] uppercase font-black hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors tracking-widest"
                                                >
                                                    Kerjakan →
                                                </button>
                                            )}
                                        </div>

                                        {status === 'done' && (
                                            <div className="flex items-center gap-3">
                                                {task.file_path && (
                                                    <a href={`/storage/${task.file_path}`} target="_blank" rel="noreferrer" className="text-[9px] font-bold text-blue-500 hover:text-blue-700 hover:underline uppercase tracking-widest transition-colors flex items-center">
                                                        Bukti ⤤
                                                    </a>
                                                )}
                                                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-xl">✓ Selesai</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- DESAIN BARU: TOMBOL TAMBAH TUGAS (PREMIUM UI) --- */}
                <button
                    onClick={() => openModal(status)}
                    className="group w-full flex flex-col items-center justify-center gap-3 py-6 bg-slate-50/50 hover:bg-white dark:bg-slate-900/30 dark:hover:bg-slate-800 border border-slate-100 hover:border-blue-300 dark:border-slate-800/50 dark:hover:border-blue-500/50 rounded-[2.5rem] transition-all duration-300 mt-auto hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
                >
                    {/* Ikon Plus Bulat */}
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 shadow-sm border border-slate-100 dark:border-slate-600 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40 group-hover:scale-110 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 text-slate-400 group-hover:text-blue-600 dark:text-slate-500 dark:group-hover:text-blue-400 transition-colors">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </div>
                    {/* Teks Action */}
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-blue-600 dark:text-slate-500 dark:group-hover:text-blue-400 transition-colors">
                        Reka Tugas Baru
                    </span>
                </button>
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
            <Column title="Backlog" status="backlog" color="text-slate-400 dark:text-slate-400" bgColor="bg-slate-300 dark:bg-slate-600" borderColor="border-slate-100" />
            <Column title="In Progress" status="in_progress" color="text-blue-600 dark:text-blue-400" bgColor="bg-blue-500" borderColor="border-blue-100 dark:border-blue-900/30" />
            <Column title="Done" status="done" color="text-emerald-600 dark:text-emerald-400" bgColor="bg-emerald-500" borderColor="border-emerald-100 dark:border-emerald-900/30" />
        </div>
    );
}