import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function GroupDetail({ auth, kelompok, anggota, tasks, logs }) {
    // Setup Form untuk fitur Colek (Nudge)
    const { post: postColek } = useForm();

    const handleColek = (studentId) => {
        if (confirm('Kirim peringatan ke mahasiswa ini?')) {
            postColek(route('dosen.colek', {
                student_id: studentId,
                group_id: kelompok.id
            }), {
                preserveScroll: true,
                onSuccess: () => alert('Mahasiswa berhasil dicolek!')
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

                    {/* GRID ATAS: DAFTAR ANGGOTA & KANBAN SINGKAT */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* 1. Panel Anggota & "Colekan" */}
                        <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Anggota Kelompok</h3>
                            <div className="space-y-4">
                                {anggota.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
                                        <div>
                                            <p className="font-bold text-sm text-slate-800 dark:text-white">{user.name}</p>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Aktif: {user.last_activity}</p>
                                        </div>
                                        {/* Tampilkan tombol COLEK jika mahasiswa terdeteksi tidak aktif */}
                                        {user.is_inactive && (
                                            <button
                                                onClick={() => handleColek(user.id)}
                                                className="bg-orange-100 text-orange-600 px-3 py-1 rounded-md text-[10px] font-bold hover:bg-orange-200 transition-all active:scale-90"
                                            >
                                                COLEK
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. Papan Tugas (Kanban Summary) */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Status Tugas (Kanban)</h3>
                            <div className="grid grid-cols-3 gap-4">
                                {['backlog', 'in_progress', 'done'].map((status) => (
                                    <div key={status} className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">{status.replace('_', ' ')}</p>
                                        <div className="space-y-2">
                                            {tasks.filter(t => t.status === status).map(task => (
                                                <div key={task.id} className="p-2 bg-white dark:bg-slate-800 shadow-sm rounded border border-slate-100 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300">
                                                    {task.judul}
                                                </div>
                                            ))}
                                            {tasks.filter(t => t.status === status).length === 0 && <p className="text-[10px] italic text-slate-400">Kosong</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* AREA LOG AKTIVITAS (HEATMAP JEJAK) */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 dark:text-white">Log Aktivitas (Heatmap Jejak)</h3>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Urutan Terbaru</span>
                        </div>
                        <div className="p-6">
                            <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 space-y-6">
                                {logs.map((log) => (
                                    <div key={log.id} className="relative pl-6">
                                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-white dark:border-slate-800 shadow-sm shadow-blue-500/50"></div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                            {new Date(log.created_at).toLocaleString('id-ID')}
                                        </p>
                                        <p className="text-sm text-slate-800 dark:text-slate-200 mt-1 leading-relaxed">
                                            <span className="font-bold text-blue-600 dark:text-blue-400">{log.user_name}</span> {log.description}
                                        </p>
                                        <span className="inline-block mt-2 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-[9px] font-bold rounded text-slate-500 uppercase">
                                            {log.action_type}
                                        </span>
                                    </div>
                                ))}
                                {logs.length === 0 && (
                                    <div className="text-center py-10">
                                        <p className="text-slate-400 italic text-sm">Belum ada jejak aktivitas terdeteksi.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}