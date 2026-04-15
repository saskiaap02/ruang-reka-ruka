import React, { useState } from 'react';

export default function KanbanBoard({ tasks, onClaim, onComplete, onAdd }) {
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        if (newTaskTitle.trim()) {
            onAdd(newTaskTitle);
            setNewTaskTitle('');
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Kolom Backlog */}
            <div className="bg-slate-100/50 p-4 rounded-3xl min-h-[400px]">
                <h3 className="font-bold text-slate-500 mb-4 tracking-widest text-xs">BACKLOG</h3>

                {/* FORM INPUT TUGAS BARU */}
                <form onSubmit={handleAdd} className="mb-4">
                    <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="+ Tambah tugas baru..."
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
                    />
                </form>

                {tasks?.filter(t => t.status === 'backlog').map(task => (
                    <div key={task.id} className="bg-white p-4 rounded-2xl mb-3 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="font-bold text-sm text-slate-800">{task.judul}</h4>
                        <button
                            onClick={() => onClaim(task.id)}
                            className="mt-3 w-full py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors"
                        >
                            Ambil Tugas
                        </button>
                    </div>
                ))}
                {tasks?.filter(t => t.status === 'backlog').length === 0 && !newTaskTitle && (
                    <p className="text-center text-[10px] text-slate-400 mt-4 italic">Belum ada antrean tugas.</p>
                )}
            </div>

            {/* Kolom In Progress */}
            <div className="bg-slate-100/50 p-4 rounded-3xl min-h-[400px]">
                <h3 className="font-bold text-blue-500 mb-4 tracking-widest text-xs">IN PROGRESS</h3>
                {tasks?.filter(t => t.status === 'in_progress').map(task => (
                    <div key={task.id} className="bg-white p-4 rounded-2xl mb-3 shadow-sm border-l-4 border-l-blue-500">
                        <h4 className="font-bold text-sm text-slate-800">{task.judul}</h4>
                        <button
                            onClick={() => onComplete(task.id)}
                            className="mt-3 w-full py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors shadow-sm"
                        >
                            Selesaikan
                        </button>
                    </div>
                ))}
                {tasks?.filter(t => t.status === 'in_progress').length === 0 && (
                    <p className="text-center text-[10px] text-slate-400 mt-4 italic">Tidak ada tugas berjalan.</p>
                )}
            </div>

            {/* Kolom Done */}
            <div className="bg-slate-100/50 p-4 rounded-3xl min-h-[400px]">
                <h3 className="font-bold text-emerald-500 mb-4 tracking-widest text-xs">DONE</h3>
                {tasks?.filter(t => t.status === 'done').map(task => (
                    <div key={task.id} className="bg-white/60 p-4 rounded-2xl mb-3 border border-slate-200 grayscale">
                        <h4 className="font-bold text-slate-400 line-through text-sm">{task.judul}</h4>
                        {task.link_evidence && (
                            <a
                                href={task.link_evidence}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-block text-[10px] text-blue-500 hover:text-blue-700 underline font-medium"
                            >
                                Lihat Bukti Kerja
                            </a>
                        )}
                    </div>
                ))}
                {tasks?.filter(t => t.status === 'done').length === 0 && (
                    <p className="text-center text-[10px] text-slate-400 mt-4 italic">Belum ada tugas selesai.</p>
                )}
            </div>
        </div>
    );
}