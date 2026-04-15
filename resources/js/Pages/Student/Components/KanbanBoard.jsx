import React from 'react';

export default function KanbanBoard({ tasks, onClaim, onComplete }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Kolom Backlog */}
            <div className="bg-slate-100/50 p-4 rounded-3xl min-h-[400px]">
                <h3 className="font-bold text-slate-500 mb-4">BACKLOG</h3>
                {tasks?.filter(t => t.status === 'backlog').map(task => (
                    <div key={task.id} className="bg-white p-4 rounded-2xl mb-3 shadow-sm">
                        <h4 className="font-bold text-sm">{task.judul}</h4>
                        <button onClick={() => onClaim(task.id)} className="mt-3 w-full py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold">Ambil Tugas</button>
                    </div>
                ))}
            </div>

            {/* Kolom In Progress */}
            <div className="bg-slate-100/50 p-4 rounded-3xl min-h-[400px]">
                <h3 className="font-bold text-blue-500 mb-4">IN PROGRESS</h3>
                {tasks?.filter(t => t.status === 'in_progress').map(task => (
                    <div key={task.id} className="bg-white p-4 rounded-2xl mb-3 shadow-sm border-l-4 border-l-blue-500">
                        <h4 className="font-bold text-sm">{task.judul}</h4>
                        <button onClick={() => onComplete(task.id)} className="mt-3 w-full py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold">Selesaikan</button>
                    </div>
                ))}
            </div>

            {/* Kolom Done */}
            <div className="bg-slate-100/50 p-4 rounded-3xl min-h-[400px]">
                <h3 className="font-bold text-emerald-500 mb-4">DONE</h3>
                {tasks?.filter(t => t.status === 'done').map(task => (
                    <div key={task.id} className="bg-white/60 p-4 rounded-2xl mb-3 border border-slate-200 grayscale">
                        <h4 className="font-bold text-slate-400 line-through text-sm">{task.judul}</h4>
                        {task.link_evidence && (
                    <a href={task.link_evidence} target="_blank" className="text-[10px] text-blue-500 underline">
        Lihat Bukti Kerja
    </a>
)}
                    </div>
                ))}
            </div>
        </div>
    );
}