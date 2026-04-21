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

    // --- FORM LOGIKA ---
    const joinForm = useForm({ invite_code: '' });
    const taskForm = useForm({
        group_id: myGroup?.id,
        title: '',
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
                taskForm.reset('title', 'attachment');
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-black text-2xl text-slate-800 dark:text-white tracking-tighter">
                        Ruang <span className="text-blue-500">Kelas.</span>
                    </h2>
                    {!myClass && (
                        <button
                            onClick={() => setIsJoinModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all active:scale-95"
                        >
                            + GABUNG KELAS
                        </button>
                    )}
                </div>
            }
        >
            <Head title={myClass ? `Kelas: ${myClass.nama_kelas}` : "Katalog Kelas"} />

            {/* BUNGKUS KONTEN UTAMA */}
            <div className="min-h-screen bg-[#f0f4f8] dark:bg-[#0b1120] pb-20 font-sans px-4 sm:px-10 pt-8 transition-colors duration-500 relative z-0">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-100/60 to-transparent dark:from-blue-900/10 dark:to-transparent pointer-events-none -z-10"></div>

                <div className="max-w-7xl mx-auto space-y-8">

                    {/* ---> BANNER PERINGATAN COLEKAN DARI DOSEN <--- */}
                    {nudges && nudges.length > 0 && nudges.filter(n => !n.is_read).map((nudge) => (
                        <div key={nudge.id} className="mb-8 bg-red-50/90 backdrop-blur-sm border-l-4 border-red-500 p-5 rounded-2xl shadow-[0_8px_30px_rgb(239,68,68,0.1)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in slide-in-from-top-4">
                            <div className="flex gap-4 items-start sm:items-center">
                                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                </div>
                                <div>
                                    <h3 className="text-red-800 font-black text-sm uppercase tracking-widest">Peringatan Audit!</h3>
                                    <p className="text-red-600 text-sm mt-1 font-medium">{nudge.message}</p>
                                </div>
                            </div>
                            <Link
                                href={route('mahasiswa.colek.read', { id: nudge.id })}
                                method="post"
                                as="button"
                                preserveScroll={true}
                                className="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors shadow-md shadow-red-600/20 active:scale-95"
                            >
                                Saya Mengerti
                            </Link>
                        </div>
                    ))}

                    {/* --- TAMPILAN 1: KATALOG KELAS --- */}
                    {!myClass ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                            {joinedClasses && joinedClasses.length > 0 ? (
                                joinedClasses.map((item) => (
                                    <div key={item.id} className="bg-white/60 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-white/80 dark:border-slate-700/50 flex flex-col justify-between h-64 group hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-blue-500/10 transition-all duration-300 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>

                                        <div>
                                            <span className="px-3 py-1.5 bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-200/50 dark:border-blue-800">
                                                {item.project_class?.mata_kuliah}
                                            </span>
                                            <h2 className="text-2xl font-black text-slate-800 dark:text-white mt-5 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {item.project_class?.nama_kelas}
                                            </h2>
                                        </div>
                                        <Link
                                            href={route('mahasiswa.kelas.show', item.project_class_id)}
                                            className="w-full py-3.5 bg-slate-900 dark:bg-slate-900 text-white rounded-xl text-center text-xs font-bold uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-600 transition-all shadow-md"
                                        >
                                            Buka Ruang
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-50">
                                    <div className="text-6xl mb-4">📭</div>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">Kamu belum bergabung di kelas mana pun.</p>
                                </div>
                            )}
                        </div>
                    ) : (

                        /* --- TAMPILAN 2: DETAIL KELAS / KANBAN BOARD --- */
                        <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-700">
                            <div className="bg-white/70 dark:bg-slate-800/90 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-white/80 dark:border-slate-700/50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-bl-full -z-10 pointer-events-none"></div>

                                <div className="mb-6">
                                    <Link href={route('mahasiswa.dashboard')} className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 uppercase tracking-widest transition-colors bg-white/50 dark:bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                                        Kembali
                                    </Link>
                                </div>

                                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                    <div className="space-y-2">
                                        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
                                            {myGroup?.nama_kelompok || 'Menunggu Plotting'}
                                        </h1>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
                                            Proyek: <span className="text-blue-600 dark:text-blue-400 font-bold">{myGroup?.project_title || 'Belum ditentukan dosen'}</span>
                                        </p>
                                    </div>

                                    {myGroup && (
                                        <div className="flex gap-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
                                            <button onClick={() => setTab('kanban')} className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${tab === 'kanban' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-md border border-slate-100 dark:border-slate-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                                                Kanban
                                            </button>
                                            <button onClick={() => setTab('logs')} className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${tab === 'logs' ? 'bg-white dark:bg-slate-700 text-emerald-500 shadow-md border border-slate-100 dark:border-slate-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                                                Logbook
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {myGroup ? (
                                tab === 'kanban' ? (
                                    <KanbanBoard
                                        tasks={tasks}
                                        myGroup={myGroup}
                                        openModal={openTaskModal}
                                        onNext={handleNextProcess}
                                        handleDelete={confirmDelete}
                                    />
                                ) : (
                                    <ActivityLogs logs={logs} />
                                )
                            ) : (
                                <div className="text-center py-24 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                                    <span className="text-5xl">⏳</span>
                                    <h3 className="mt-6 text-xl font-black text-slate-700 dark:text-slate-300 tracking-tight">Menunggu Dosen</h3>
                                    <p className="text-slate-500 mt-2">Kamu sudah masuk kelas ini, tapi belum dimasukkan ke dalam kelompok kerja.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {/* AKHIR BUNGKUS KONTEN UTAMA */}

            {/* ============================================================================== */}
            {/* 🚨 AREA AMAN MODAL 🚨 */}
            {/* ============================================================================== */}

            {/* --- MODAL GABUNG KELAS --- */}
            {isJoinModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-[3rem] w-full max-w-md shadow-2xl border border-slate-100 dark:border-slate-700 relative animate-in zoom-in-95 duration-200">
                        <button onClick={() => setIsJoinModalOpen(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-700 rounded-full transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                        </button>

                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" /></svg>
                        </div>

                        <h3 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-2 tracking-tight">Gabung Kelas</h3>
                        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-8 px-4">Masukkan 6 digit kode yang diberikan oleh dosenmu untuk masuk ke ruang kelas.</p>

                        <form onSubmit={submitJoin} className="space-y-6">
                            <input
                                type="text"
                                className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-white text-center font-black tracking-[0.5em] focus:ring-2 focus:ring-blue-600 outline-none text-2xl uppercase placeholder:tracking-normal placeholder:font-medium placeholder:text-base transition-all shadow-inner"
                                placeholder="KODE 6 DIGIT"
                                value={joinForm.data.invite_code}
                                onChange={e => joinForm.setData('invite_code', e.target.value.toUpperCase())}
                                maxLength="6"
                                required
                            />
                            <button type="submit" disabled={joinForm.processing} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50">
                                {joinForm.processing ? 'Memproses...' : 'Gabung Sekarang'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- UI AESTHETIC: MODAL REKA TUGAS BARU --- */}
            {isTaskModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 dark:bg-black/70 backdrop-blur-md">
                    <div className="bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-[2.5rem] w-full max-w-xl shadow-2xl border border-slate-100 dark:border-slate-700 relative animate-in zoom-in-95 duration-200 overflow-hidden">

                        {/* Aksen Gradasi Kiri Atas */}
                        <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-400/20 blur-3xl rounded-full"></div>

                        {/* Header Kiri */}
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Reka Tugas.</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 font-medium uppercase tracking-widest">
                                    Kolom: <span className="font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded ml-1">{taskForm.data.status.replace('_', ' ')}</span>
                                </p>
                            </div>
                            <button onClick={() => setIsTaskModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={submitTask} className="space-y-8 relative z-10">

                            {/* Input Teks Raksasa (Borderless) */}
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Fokus Pengerjaan <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className="w-full bg-transparent border-none border-b-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-0 px-1 py-3 text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-colors"
                                    placeholder="Membuat Desain UI..."
                                    value={taskForm.data.title}
                                    onChange={e => taskForm.setData('title', e.target.value)}
                                    autoFocus
                                />
                                {taskForm.errors.title && <p className="text-red-500 text-xs font-bold pl-1 mt-2">{taskForm.errors.title}</p>}
                            </div>

                            {/* UI Lampiran Elegan (Horizontal) */}
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Lampiran Pendukung (Opsional)</label>
                                <label htmlFor="file-upload-task" className="flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer transition-all group">
                                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 text-blue-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                        {taskForm.data.attachment ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-emerald-500"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" /></svg>
                                        )}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
                                            {taskForm.data.attachment ? taskForm.data.attachment.name : "Pilih atau letakkan dokumen"}
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Maks. 5MB</p>
                                    </div>
                                    <input id="file-upload-task" type="file" className="hidden" onChange={e => taskForm.setData('attachment', e.target.files[0])} />
                                </label>
                                {taskForm.errors.attachment && <p className="text-red-500 text-xs font-bold pl-1 mt-1">{taskForm.errors.attachment}</p>}
                            </div>

                            {/* Tombol Action Menyatu */}
                            <div className="pt-4">
                                <button type="submit" disabled={taskForm.processing} className="w-full py-4 sm:py-5 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors shadow-xl shadow-slate-900/10 dark:shadow-blue-900/20 active:scale-95 disabled:opacity-50">
                                    {taskForm.processing ? 'Menyimpan...' : 'Tambahkan Tugas'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- UI AESTHETIC: MODAL UPDATE PROGRES --- */}
            {isActionModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 dark:bg-black/70 backdrop-blur-md">
                    <div className="bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-[2.5rem] w-full max-w-xl shadow-2xl border border-slate-100 dark:border-slate-700 relative animate-in zoom-in-95 duration-200 overflow-hidden">

                        <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-400/20 blur-3xl rounded-full"></div>

                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Progres.</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 font-medium uppercase tracking-widest">
                                    Status: <span className="font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded ml-1">IN PROGRESS</span>
                                </p>
                            </div>
                            <button onClick={() => setIsActionModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="space-y-6 mb-8 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Catatan Pengerjaan <span className="text-red-500">*</span></label>
                                <textarea
                                    className="w-full p-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-white font-bold outline-none h-32 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none shadow-inner"
                                    placeholder="Ceritakan detail yang sudah diselesaikan..."
                                    value={taskForm.data.title}
                                    onChange={e => taskForm.setData('title', e.target.value)}
                                />
                                {taskForm.errors.title && <p className="text-red-500 text-xs font-bold pl-1 mt-1">{taskForm.errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Bukti Validasi (Opsional)</label>
                                <label htmlFor="file-upload-progress" className="flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-700 cursor-pointer transition-all group">
                                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 text-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                        {taskForm.data.attachment ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                                        )}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
                                            {taskForm.data.attachment ? taskForm.data.attachment.name : "Unggah file bukti"}
                                        </p>
                                    </div>
                                    <input id="file-upload-progress" type="file" className="hidden" onChange={e => taskForm.setData('attachment', e.target.files[0])} />
                                </label>
                                {taskForm.errors.attachment && <p className="text-red-500 text-xs font-bold pl-1 mt-1">{taskForm.errors.attachment}</p>}
                            </div>
                        </div>

                        <div className="flex gap-3 relative z-10">
                            <button
                                type="button"
                                onClick={() => submitProgress('in_progress')}
                                className="flex-1 py-4 sm:py-5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-600 transition-all active:scale-95"
                            >
                                Simpan
                            </button>
                            <button
                                type="button"
                                onClick={() => submitProgress('done')}
                                className="flex-1 py-4 sm:py-5 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/30 active:scale-95 transition-all hover:bg-emerald-600"
                            >
                                Selesai ✓
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}