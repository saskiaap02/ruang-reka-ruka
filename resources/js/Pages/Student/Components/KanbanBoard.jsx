import React from 'react';

export default function KanbanBoard({ tasks, updateStatus, handleDelete, openModal, onNext }) {
    
    const Column = ({ title, status, color, bgColor }) => (
        <div className="bg-white border border-slate-200 p-8 rounded-[3rem] flex-1 min-w-[350px] shadow-2xl shadow-black/5">
            {/* Header Kolom */}
            <div className="flex justify-between items-center mb-8 px-2">
                <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${bgColor} animate-pulse`}></div>
                    <h3 className={`font-black text-[10px] uppercase tracking-[0.3em] ${color}`}>{title}</h3>
                </div>
                <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-xl text-[10px] font-black">
                    {tasks?.filter(t => t.status.toUpperCase() === status).length || 0}
                </span>
            </div>

            {/* List Tugas */}
            <div className="space-y-5">
                {tasks?.filter(t => t.status.toUpperCase() === status).map(task => (
                    <div key={task.id} className="group bg-slate-50 border border-slate-200 p-6 rounded-[2.5rem] hover:bg-white hover:border-blue-400 hover:shadow-xl transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-bold text-slate-800 leading-relaxed">{task.judul}</p>
                            {/* Tombol Hapus Global (Hanya muncul saat hover) */}
                            <button 
                                onClick={() => handleDelete(task.id)} 
                                className="opacity-0 group-hover:opacity-100 text-[10px] font-black text-red-400 transition-opacity p-2 hover:bg-red-50 rounded-lg cursor-pointer"
                            >
                                ×
                            </button>
                        </div>
                        
                        {/* FOOTER KARTU TUGAS */}
                        <div className="mt-8">
                            {/* KHUSUS IN PROGRESS: Tampilan lebih lengkap */}
                            {status === 'IN_PROGRESS' ? (
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between items-center bg-slate-100/50 p-3 rounded-2xl border border-slate-200/50">
                                        <button 
                                            onClick={() => updateStatus(task.id, 'BACKLOG')} 
                                            className="text-[9px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-tighter"
                                        >
                                            ← Balik
                                        </button>
                                        
                                        <button 
                                            onClick={() => onNext(task.id)} 
                                            className="bg-blue-600 text-white px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md shadow-blue-600/20 active:scale-95 transition-all"
                                        >
                                            Submit / Upload
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* TAMPILAN UNTUK BACKLOG & DONE */
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-4">
                                        {status === 'DONE' && (
                                            <button 
                                                onClick={() => updateStatus(task.id, 'IN_PROGRESS')} 
                                                className="text-[9px] font-black text-slate-400 hover:text-blue-600 uppercase"
                                            >
                                                ← Tarik Lagi
                                            </button>
                                        )}
                                        
                                        {status === 'BACKLOG' && (
                                            <button 
                                                onClick={() => onNext(task.id)} 
                                                className="text-[9px] font-black text-blue-600 hover:text-blue-800 uppercase font-black"
                                            >
                                                Ambil Tugas (Next) →
                                            </button>
                                        )}
                                    </div>

                                    {status === 'DONE' && (
                                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Selesai ✓</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Tombol Tambah Tugas */}
                <button 
                    onClick={() => openModal(status.toLowerCase())} 
                    className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 hover:border-blue-300 hover:text-blue-500 transition-all"
                >
                    + Reka Tugas
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-10 overflow-x-auto pb-10 scrollbar-hide">
            <Column title="Backlog" status="BACKLOG" color="text-slate-400" bgColor="bg-slate-300" />
            <Column title="In Progress" status="IN_PROGRESS" color="text-blue-600" bgColor="bg-blue-500" />
            <Column title="Done" status="DONE" color="text-emerald-600" bgColor="bg-emerald-500" />
        </div>
    );
}