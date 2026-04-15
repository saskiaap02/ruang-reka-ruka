import React from 'react';

export default function ActivityLogs({ logs }) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-4 dark:text-white">Riwayat Logbook Tim</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-xs text-slate-400 border-b">
                            <th className="pb-3">WAKTU</th>
                            <th className="pb-3">MAHASISWA</th>
                            <th className="pb-3">AKTIVITAS</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {logs?.map((log, index) => (
                            <tr key={index} className="border-b last:border-0">
                                <td className="py-4 text-slate-500">{new Date(log.created_at).toLocaleString('id-ID')}</td>
                                <td className="py-4 font-bold dark:text-white">{log.user_name}</td>
                                <td className="py-4 text-slate-600 dark:text-slate-300">{log.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}