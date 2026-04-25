import React from 'react';

export default function ActivityLogs({ logs }) {
    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-10 shadow-sm transition-all duration-300">
            {/* Header Logbook */}
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 mb-8 uppercase tracking-[0.3em] flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                Tim Logbook Audit
            </h3>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700">
                            <th className="pb-6 px-2">Waktu</th>
                            <th className="pb-6 px-2">Mahasiswa</th>
                            <th className="pb-6 px-2">Aktivitas</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {logs?.map((log, index) => (
                            <tr key={index} className="border-b border-slate-50 dark:border-slate-700/50 last:border-0 group hover:bg-slate-50/30 dark:hover:bg-slate-900/20 transition-colors">
                                <td className="py-6 px-2 text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">
                                    {new Date(log.created_at).toLocaleString('id-ID', {
                                        dateStyle: 'medium',
                                        timeStyle: 'short'
                                    })}
                                </td>
                                <td className="py-6 px-2 font-black text-slate-800 dark:text-slate-200">
                                    {log.user_name}
                                </td>
                                <td className="py-6 px-2 text-slate-600 dark:text-slate-400 italic leading-relaxed">
                                    "{log.description || log.action}"
                                </td>
                            </tr>
                        ))}

                        {(!logs || logs.length === 0) && (
                            <tr>
                                <td colSpan="3" className="py-20 text-center">
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                                        Belum ada aktivitas audit terekam
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}