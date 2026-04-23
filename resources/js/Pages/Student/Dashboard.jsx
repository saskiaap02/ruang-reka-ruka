import React, { useState } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ActivityLogs from './Components/ActivityLogs';
import KanbanBoard from './Components/KanbanBoard';

export default function Dashboard({ auth, joinedClasses, myClass, myGroup, tasks, logs, nudges }) {
    const [tab, setTab] = useState('kanban');
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [activeTaskId, setActiveTaskId] = useState(null);

    // --- LOGIKA STATUS APPROVAL ---
    const currentRelation = joinedClasses?.find(item => item.project_class_id === myClass?.id);
    const isPending = currentRelation?.status === 'pending';

    // --- FORM LOGIKA ---
    const joinForm = useForm({ invite_code: '' });
    const taskForm = useForm({
        group_id: myGroup?.id,
        title: '',
        link: '',
        status: 'backlog',
        attachment: null,
    });

    const submitJoin = (e) => {
        e.preventDefault();
        joinForm.post(route('mahasiswa.join-class'), {
            onSuccess: () => { setIsJoinModalOpen(false); joinForm.reset(); }
        });
    };

    const submitTask = (e) => {
        e.preventDefault();
        taskForm.post(route('mahasiswa.task.store'), {
            forceFormData: true,
            onSuccess: () => {
                setIsTaskModalOpen(false);
                taskForm.reset('title', 'link', 'attachment');
            },
        });
    };

    const confirmDelete = (id) => {
        if (confirm('Yakin mau hapus tugas ini?')) {
            taskForm.delete(route('mahasiswa.task.delete', id));
        }
    };

    const openTaskModal = (status) => {
        taskForm.clearErrors();
        taskForm.setData({
            group_id: myGroup?.id,
            title: '',
            link: '',
            status: status,
            attachment: null
        });
        setIsTaskModalOpen(true);
    };

    const handleNextProcess = (taskId) => {
        setActiveTaskId(taskId);
        taskForm.clearErrors();
        taskForm.setData({
            title: '',
            attachment: null
        });
        setIsActionModalOpen(true);
    };

    const submitProgress = (targetStatus) => {
        router.post(route('mahasiswa.task.update-status', activeTaskId), {
            _method: 'post',
            status: targetStatus,
            title: taskForm.data.title,
            attachment: taskForm.data.attachment,
        }, {
            forceFormData: true,
            onSuccess: () => {
                setIsActionModalOpen(false);
                taskForm.reset();
            },
        });
    };

    // Array warna pastel ala referensi UI untuk kartu kelas
    const pastelThemes = [
        { bg: 'bg-[#dcfce7] dark:bg-emerald-900/20', text: 'text-emerald-900 dark:text-emerald-300', icon: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' },
        { bg: 'bg-[#fce7f3] dark:bg-rose-900/20', text: 'text-rose-900 dark:text-rose-300', icon: 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400' },
        { bg: 'bg-[#fef3c7] dark:bg-amber-900/20', text: 'text-amber-900 dark:text-amber-300', icon: 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400' },
        { bg: 'bg-[#e0f2fe] dark:bg-blue-900/20', text: 'text-blue-900 dark:text-blue-300', icon: 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' },
        { bg: 'bg-[#f3e8ff] dark:bg-purple-900/20', text: 'text-purple-900 dark:text-purple-300', icon: 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400' },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-black text-2xl text-slate-800 dark:text-white tracking-tighter">
                            SIM-<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-400 dark:from-blue-400 dark:to-emerald-400">CR.</span>
                        </h2>
                    </div>
                    {!myClass && (
                        <button
                            onClick={() => setIsJoinModalOpen(true)}
                            className="bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white px-5 sm:px-6 py-2.5 rounded-full text-xs font-bold shadow-[0_8px_20px_rgb(0,0,0,0.1)] dark:shadow-blue-600/30 transition-all active:scale-95 flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                            <span className="hidden sm:inline">GABUNG KELAS</span>
                        </button>
                    )}
                </div>
            }
        >
            <Head title={myClass ? `Kelas: ${myClass.nama_kelas}` : "Workspace"} />

            {/* Background super soft untuk Light Mode (#f4f7fc), Dark Mode tetap pekat */}
            <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b1120] pb-20 font-sans px-4 sm:px-10 pt-8 transition-colors duration-500 relative z-0 selection:bg-blue-500 selection:text-white">

                <div className="max-w-7xl mx-auto space-y-8 relative z-10">

                    {/* BANNER NUDGE */}
                    {nudges && nudges.length > 0 && nudges.filter(n => !n.is_read).map((nudge) => (
                        <div key={nudge.id} className="mb-8 bg-red-50 dark:bg-red-900/20 backdrop-blur-xl border border-red-100 dark:border-red-500/30 p-5 rounded-[1.5rem] shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in slide-in-from-top-4">
                            <div className="flex gap-4 items-start sm:items-center">
                                <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-500/20 text-red-500 flex items-center justify-center shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                </div>
                                <div>
                                    <h3 className="text-red-600 dark:text-red-400 font-bold text-sm tracking-wide">Peringatan Audit!</h3>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">{nudge.message}</p>
                                </div>
                            </div>
                            <Link
                                href={route('mahasiswa.colek.read', { id: nudge.id })}
                                method="post"
                                as="button"
                                preserveScroll={true}
                                className="w-full sm:w-auto px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-full transition-all active:scale-95"
                            >
                                Saya Mengerti
                            </Link>
                        </div>
                    ))}

                    {/* LOGIKA SATU PINTU: Katalog vs Detail */}
                    {!myClass ? (
                        /* ========================================= */
                        /* TAMPILAN 1: KATALOG KELAS (PASTEL AESTHETIC) */
                        /* ========================================= */
                        <>
                            <div className="mb-8 animate-in fade-in duration-500 flex items-center gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                        Welcome back 👏
                                    </h1>
                                    <p className="text-slate-500 mt-1 font-medium">Your classes today ({joinedClasses?.length || 0})</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
                                {joinedClasses && joinedClasses.length > 0 ? (
                                    joinedClasses.map((item, idx) => {
                                        const theme = pastelThemes[idx % pastelThemes.length];

                                        return (
                                            <Link
                                                key={item.id}
                                                href={route('mahasiswa.kelas.show', item.project_class_id)}
                                                className={`group relative flex flex-col justify-between h-56 p-6 rounded-[2rem] ${theme.bg} transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] dark:shadow-none cursor-pointer border border-transparent dark:border-slate-800`}
                                            >
                                                {/* Status Badge ala Referensi */}
                                                <div className="flex justify-between items-start">
                                                    <div className="flex -space-x-2">
                                                        {/* Avatar Dummmy (Estetika) */}
                                                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800"></div>
                                                        <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-600 border-2 border-white dark:border-slate-800"></div>
                                                        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[9px] font-bold text-slate-600 dark:text-slate-400">+</div>
                                                    </div>

                                                    <div className="bg-white/60 dark:bg-slate-900/50 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'pending' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></div>
                                                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                                                            {item.status}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mt-auto">
                                                    <h2 className={`text-2xl font-bold tracking-tight ${theme.text} mb-1 line-clamp-1`}>
                                                        {item.project_class?.mata_kuliah}
                                                    </h2>
                                                    <div className="flex justify-between items-end">
                                                        <p className={`text-sm font-medium ${theme.text} opacity-80`}>
                                                            {item.project_class?.nama_kelas}
                                                        </p>
                                                        {/* Ikon Arrow Aesthetic */}
                                                        <div className={`w-8 h-8 rounded-full bg-white/60 dark:bg-slate-900/50 backdrop-blur-sm flex items-center justify-center shadow-sm group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors`}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-4 h-4 ${theme.text}`}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" /></svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })
                                ) : (
                                    <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-60">
                                        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-3xl shadow-sm border border-slate-100 dark:border-slate-700">📭</div>
                                        <p className="text-slate-500 font-medium">Belum ada aktivitas hari ini.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        /* ========================================= */
                        /* TAMPILAN 2: DETAIL KELAS */
                        /* ========================================= */
                        <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-500">

                            {/* TOMBOL KEMBALI AESTHETIC (PILL) */}
                            <Link href={route('mahasiswa.dashboard')} className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/50 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 transition-all shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
                                Dashboard
                            </Link>

                            {isPending ? (
                                /* LAYAR PENDING */
                                <div className="bg-white dark:bg-slate-900/50 p-16 rounded-[2.5rem] text-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col items-center">
                                    <div className="w-24 h-24 bg-amber-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-amber-100 dark:border-slate-700">
                                        <span className="text-4xl animate-bounce">⏳</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white leading-tight">Menunggu Approval</h2>
                                    <p className="text-slate-500 mt-3 max-w-md text-lg">
                                        Akses kelas <span className="font-bold text-slate-700 dark:text-slate-300">{myClass.mata_kuliah}</span> sedang diproses oleh dosen.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* HEADER KELAS & SWITCHER */}
                                    <div className="bg-white dark:bg-slate-900/50 p-8 sm:p-10 rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                                        <div className="space-y-3">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                {myClass.nama_kelas}
                                            </div>
                                            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-800 dark:text-white leading-tight">
                                                {myGroup?.nama_kelompok || 'Belum Ada Tim'}
                                            </h1>
                                            <p className="text-slate-500 font-medium">
                                                Proyek: <span className="text-slate-800 dark:text-white font-bold">{myGroup?.project_title || 'Menunggu Penugasan...'}</span>
                                            </p>
                                        </div>

                                        {myGroup && (
                                            /* TOGGLE SWITCHER ALA iOS */
                                            <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-full md:w-auto shadow-inner">
                                                <button onClick={() => setTab('kanban')} className={`flex-1 md:flex-none px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${tab === 'kanban' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                                                    Kanban
                                                </button>
                                                <button onClick={() => setTab('logs')} className={`flex-1 md:flex-none px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${tab === 'logs' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                                                    Logbook
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* KONTEN BOARD / AI */}
                                    {myGroup ? (
                                        tab === 'kanban' ? (
                                            <KanbanBoard tasks={tasks} myGroup={myGroup} openModal={openTaskModal} onNext={handleNextProcess} handleDelete={confirmDelete} />
                                        ) : (
                                            <ActivityLogs logs={logs} />
                                        )
                                    ) : (
                                        <div className="text-center py-20 bg-white dark:bg-slate-900/30 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
                                            <div className="w-20 h-20 bg-blue-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">🤖</div>
                                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Smart Grouping Aktif</h3>
                                            <p className="text-slate-500 max-w-sm mx-auto">
                                                Asisten AI sedang mengkalkulasi dan membagi tim terbaik untukmu.
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ============================================================================== */}
            {/* 🚨 AREA MODAL TETAP SAMA 🚨 */}
            {/* ============================================================================== */}

            {isJoinModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-[#0b1120]/80 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] w-full max-w-md relative animate-in zoom-in-95 border border-slate-100 dark:border-slate-800 shadow-2xl">
                        <button onClick={() => setIsJoinModalOpen(false)} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full transition-colors">✕</button>

                        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-1">Gabung Kelas</h3>
                        <p className="text-slate-500 text-center text-sm mb-8">Masukkan 6 digit kode unik dosen.</p>

                        <form onSubmit={submitJoin} className="space-y-5">
                            <input type="text" className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-center font-black tracking-[0.5em] text-2xl uppercase text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="KODE 6" value={joinForm.data.invite_code} onChange={e => joinForm.setData('invite_code', e.target.value.toUpperCase())} maxLength="6" required />
                            <button type="submit" disabled={joinForm.processing} className="w-full py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-bold text-sm transition-all active:scale-95 disabled:opacity-50">Gabung Ruang</button>
                        </form>
                    </div>
                </div>
            )}

            {isTaskModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-[#0b1120]/80 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] w-full max-w-lg relative border border-slate-100 dark:border-slate-800 shadow-2xl animate-in zoom-in-95">
                        <button onClick={() => setIsTaskModalOpen(false)} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full transition-colors">✕</button>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Tambah Tugas ({taskForm.data.status})</h3>

                        <form onSubmit={submitTask} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-1">Judul Tugas</label>
                                <input type="text" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Apa yang mau dikerjakan?" value={taskForm.data.title} onChange={e => taskForm.setData('title', e.target.value)} autoFocus required />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-1">Tautan (Opsional)</label>
                                <input type="url" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." value={taskForm.data.link} onChange={e => taskForm.setData('link', e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-1">Lampiran (Opsional)</label>
                                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-950 hover:border-blue-400 transition-all">
                                    <div className="flex flex-col items-center justify-center text-center px-4">
                                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                                            {taskForm.data.attachment ? <span className="text-blue-500">{taskForm.data.attachment.name}</span> : "Pilih dokumen (Maks. 5MB)"}
                                        </p>
                                    </div>
                                    <input type="file" className="hidden" onChange={e => taskForm.setData('attachment', e.target.files[0])} />
                                </label>
                            </div>
                            <button type="submit" disabled={taskForm.processing} className="w-full py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold text-sm active:scale-95 transition-all disabled:opacity-50 mt-2">
                                {taskForm.processing ? 'Menyimpan...' : 'Simpan Tugas'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {isActionModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-[#0b1120]/80 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] w-full max-w-lg relative border border-slate-100 dark:border-slate-800 shadow-2xl animate-in zoom-in-95">
                        <button onClick={() => setIsActionModalOpen(false)} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full transition-colors">✕</button>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Update Progres</h3>

                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-1">Catatan Pengerjaan</label>
                                <textarea
                                    className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl h-28 text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                                    placeholder="Ceritakan progresmu hari ini..."
                                    value={taskForm.data.title}
                                    onChange={e => taskForm.setData('title', e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button onClick={() => submitProgress('in_progress')} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-white rounded-xl font-bold text-sm active:scale-95 transition-all">Simpan Draft</button>
                                <button onClick={() => submitProgress('done')} className="flex-1 py-4 bg-emerald-500 text-white rounded-xl font-bold text-sm active:scale-95 transition-all shadow-md shadow-emerald-500/20">Selesai ✓</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}