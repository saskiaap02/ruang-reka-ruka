import React from 'react';

export default function ActivityLogs({ logs }) {
    return (
        <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100">
            <h3 className="text-[10px] font-black text-slate-400 mb-8 uppercase tracking-[0.3em] flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                Tim Logbook Audit
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                            <th className="pb-6">Waktu</th>
                            <th className="pb-6">Mahasiswa</th>
                            <th className="pb-6">Aktivitas</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {logs?.map((log, index) => (
                            <tr key={index} className="border-b border-slate-50 last:border-0 group">
                                <td className="py-6 text-slate-400 font-medium">{new Date(log.created_at).toLocaleString('id-ID')}</td>
                                <td className="py-6 font-black text-slate-800">{log.user_name}</td>
                                <td className="py-6 text-slate-600 italic">"{log.description}"</td>
                            </tr>
                        ))}
                        {logs?.length === 0 && (
                            <tr><td colSpan="3" className="py-10 text-center text-slate-400 italic text-xs">Belum ada aktivitas audit terekam.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}