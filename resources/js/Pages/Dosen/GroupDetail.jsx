import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function GroupDetail({ auth, kelompok, anggota, tasks, logs }) {
    // 1. Setup Form untuk fitur Colek (Nudge)
    const { post: postColek, processing } = useForm();

    const handleColek = (studentId) => {
        if (confirm('Kirim peringatan otomatis ke mahasiswa ini?')) {
            postColek(route('dosen.colek', {
                student_id: studentId,
                group_id: kelompok.id
            }), {
                preserveScroll: true,
                onSuccess: () => alert('Mahasiswa berhasil dicolek oleh Asisten AI!')
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('dosen.dashboard')} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                    </Link>
                    <h2 className="font-semibold text-xl text-slate-800 dark:text-white leading-tight">
                        Audit: {kelompok.nama_kelompok} - {kelompok.project_title}
                    </h2>
                </div>
            }
        >
            <Head title={`Audit ${kelompok.nama_kelompok}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* --- BARIS ATAS: ANGGOTA & KANBAN --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* 1. Panel Anggota & Monitoring Keaktifan */}
                        <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-blue-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                </svg>
                                Anggota Kelompok
                            </h3>
                            <div className="space-y-3">
                                {anggota.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                        <div>
                                            <p className="font-bold text-sm text-slate-800 dark:text-white">{user.name}</p>
                                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Log Akhir: {user.last_activity}</p>
                                        </div>

                                        {/* Deteksi Otomatis AI: Jika Inaktif > 3 hari */}
                                        {user.is_inactive && (
                                            <button
                                                onClick={() => handleColek(user.id)}
                                                disabled={processing}
                                                className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black shadow-lg shadow-orange-200 transition-all active:scale-90"
                                            >
                                                COLEK
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. Papan Progres (Kanban Summary) */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Papan Tugas (Kanban)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {['backlog', 'in_progress', 'done'].map((status) => (
                                    <div key={status} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <p className="text-[10px] uppercase font-black text-slate-400 mb-3 tracking-widest border-b border-slate-200 dark:border-slate-700 pb-2">
                                            {status.replace('_', ' ')}
                                        </p>
                                        <div className="space-y-2">
                                            {tasks.filter(t => t.status === status).map(task => (
                                                <div key={task.id} className="p-3 bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-slate-200 dark:border-slate-700">
                                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{task.judul}</p>
                                                    <p className="text-[9px] text-blue-500 font-bold mt-1 uppercase">PIC: {task.pic_name || 'Belum Ada'}</p>
                                                </div>
                                            ))}
                                            {tasks.filter(t => t.status === status).length === 0 && (
                                                <p className="text-[10px] italic text-slate-400 text-center py-2">Tidak ada tugas</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* --- AREA TENGAH: TIMELINE JEJAK AKTIVITAS --- */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-emerald-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                                </svg>
                                Log Aktivitas (Heatmap Jejak)
                            </h3>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                                Real-time Audit
                            </span>
                        </div>
                        <div className="p-8">
                            <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 space-y-8">
                                {logs.length > 0 ? logs.map((log) => (
                                    <div key={log.id} className="relative pl-8">
                                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-white dark:border-slate-800 shadow-md"></div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            {new Date(log.created_at).toLocaleString('id-ID')}
                                        </p>
                                        <div className="mt-1 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 inline-block min-w-[300px]">
                                            <p className="text-sm text-slate-800 dark:text-slate-200">
                                                <span className="font-black text-blue-600 dark:text-blue-400">{log.user_name}</span>
                                                <span className="mx-1 text-slate-500">{log.description}</span>
                                            </p>
                                            <div className="mt-3 flex items-center gap-2">
                                                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-[9px] font-black rounded text-blue-600 uppercase tracking-tighter">
                                                    {log.action_type}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-10">
                                        <p className="text-slate-400 italic text-sm">Belum ada jejak aktivitas terdeteksi.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- AREA BAWAH: PENILAIAN AKHIR (AUTO-GRADING) --- */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mt-6">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-white">Rekap Penilaian Akhir (Auto-Grading)</h3>
                                <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-widest">
                                    Bobot: Dasar ({kelompok.bobot_dasar}%) | Audit ({kelompok.bobot_audit}%) | Peer ({kelompok.bobot_peer}%)
                                </p>
                            </div>
                            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                                Ekspor SIAKAD
                            </button>
                        </div>
                        <div className="p-0 overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-xs text-slate-500 uppercase">
                                        <th className="p-4 font-bold">Nama Mahasiswa</th>
                                        <th className="p-4 text-center font-bold">Nilai Dasar</th>
                                        <th className="p-4 text-center font-bold">Skor Audit (AI)</th>
                                        <th className="p-4 text-center font-bold">Peer Review</th>
                                        <th className="p-4 text-center font-black text-blue-600 dark:text-blue-400">Total Akhir</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {anggota.map((user) => {
                                        // Kalkulasi Dasar: Dasar (85), Audit (Berdasar Keaktifan), Peer (88)
                                        const nDasar = 85;
                                        const nAudit = user.is_inactive ? 40 : 90;
                                        const nPeer = 88;

                                        const total = ((nDasar * kelompok.bobot_dasar) / 100) + ((nAudit * kelompok.bobot_audit) / 100) + ((nPeer * kelompok.bobot_peer) / 100);

                                        return (
                                            <tr key={user.id} className="border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                                <td className="p-4 font-bold text-slate-800 dark:text-white">{user.name}</td>
                                                <td className="p-4 text-center text-slate-600 dark:text-slate-300">{nDasar}</td>
                                                <td className="p-4 text-center">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${nAudit < 50 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                        {nAudit}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center text-slate-600 dark:text-slate-300">{nPeer}</td>
                                                <td className="p-4 text-center font-black text-lg text-slate-800 dark:text-white">
                                                    {total.toFixed(2)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}