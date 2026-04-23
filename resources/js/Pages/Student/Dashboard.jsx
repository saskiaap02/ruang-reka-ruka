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

    const currentRelation = joinedClasses?.find(item => item.project_class_id === myClass?.id);
    const isPending = currentRelation?.status === 'pending';

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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-black text-2xl text-slate-800 dark:text-white tracking-tighter">
                            Ruang<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-400 dark:from-blue-400 dark:to-emerald-400"> Reka.</span>
                        </h2>
                        <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] mt-1 font-bold">Personal Workspace</p>
                    </div>
                    {!myClass && (
                        <button
                            onClick={() => setIsJoinModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-5 sm:px-6 py-2.5 rounded-full text-xs font-black shadow-[0_8px_20px_rgb(37,99,235,0.3)] dark:shadow-blue-600/30 transition-all active:scale-95 flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                            <span className="hidden sm:inline">GABUNG KELAS</span>
                        </button>
                    )}
                </div>
            }
        >
            <Head title={myClass ? `Kelas: ${myClass.nama_kelas}` : "Workspace"} />

            <div className="min-h-screen bg-[#f4f7fe] dark:bg-[#0b1120] pb-20 font-sans px-4 sm:px-10 pt-8 transition-colors duration-500 relative z-0 selection:bg-blue-500 selection:text-white">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-blue-400/5 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

                <div className="max-w-7xl mx-auto space-y-8 relative z-10">

                    {nudges && nudges.length > 0 && nudges.filter(n => !n.is_read).map((nudge) => (
                        <div key={nudge.id} className="mb-8 bg-white dark:bg-red-900/20 backdrop-blur-xl border border-red-100 dark:border-red-500/30 p-5 rounded-[1.5rem] shadow-[0_10px_40px_-10px_rgba(239,68,68,0.15)] dark:shadow-none flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in slide-in-from-top-4">
                            <div className="flex gap-4 items-start sm:items-center">
                                <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-500/20 border border-red-100 dark:border-red-500/30 text-red-500 flex items-center justify-center shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                </div>
                                <div>
                                    <h3 className="text-red-500 font-black text-sm uppercase tracking-widest">Peringatan Audit!</h3>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 font-medium">{nudge.message}</p>
                                </div>
                            </div>
                            <Link
                                href={route('mahasiswa.colek.read', { id: nudge.id })}
                                method="post"
                                as="button"
                                preserveScroll={true}
                                className="w-full sm:w-auto px-8 py-3 bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_5px_15px_rgba(239,68,68,0.3)] dark:shadow-none active:scale-95"
                            >
                                SAYA MENGERTI
                            </Link>
                        </div>
                    ))}

                    {!myClass ? (
                        <>
                            <div className="mb-6 animate-in fade-in duration-500">
                                <h1 className="text-3xl font-black text-slate-800 dark:text-white">Hai, {auth.user.name.split(' ')[0]}! 👋</h1>
                                <p className="text-slate-500 mt-1 font-medium">Berikut adalah daftar kelas yang kamu ikuti.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
                                {joinedClasses && joinedClasses.length > 0 ? (
                                    joinedClasses.map((item) => (
                                        <div key={item.id} className="bg-white dark:bg-slate-900/50 p-8 rounded-[2.5rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-none border border-white dark:border-slate-800 flex flex-col justify-between h-72 relative overflow-hidden group hover:shadow-[0_20px_50px_-15px_rgba(37,99,235,0.15)] dark:hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1">

                                            <div className="absolute top-6 right-6 z-20">
                                                {item.status === 'pending' ? (
                                                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-500 dark:text-amber-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-100 dark:border-amber-500/20 animate-pulse">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div> Pending
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> Active
                                                    </span>
                                                )}
                                            </div>

                                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-500/10 rounded-bl-full -z-10 group-hover:scale-125 transition-transform duration-700"></div>

                                            <div className="mt-4 pr-16">
                                                <span className="px-3 py-1.5 bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-slate-700">
                                                    Kelas: {item.project_class?.nama_kelas}
                                                </span>
                                                <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white mt-5 leading-tight group-hover:text-blue-600 dark:group-hover:text-transparent dark:group-hover:bg-clip-text dark:group-hover:bg-gradient-to-r dark:group-hover:from-blue-400 dark:group-hover:to-emerald-400 transition-all line-clamp-3">
                                                    {item.project_class?.mata_kuliah}
                                                </h2>
                                            </div>

                                            <Link
                                                href={route('mahasiswa.kelas.show', item.project_class_id)}
                                                className={`w-full py-4 rounded-full text-center text-xs font-black uppercase tracking-widest transition-all ${item.status === 'pending'
                                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                                                    : 'bg-slate-900 dark:bg-blue-600 text-white shadow-[0_10px_20px_rgba(15,23,42,0.15)] dark:shadow-blue-600/20 hover:bg-blue-600 dark:hover:bg-blue-500 active:scale-95'
                                                    }`}
                                            >
                                                {item.status === 'pending' ? 'Menunggu Approval' : 'Buka Workspace'}
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full flex flex-col items-center justify-center py-32 opacity-60">
                                        <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 text-4xl shadow-sm border border-slate-100 dark:border-slate-700">📭</div>
                                        <p className="text-slate-500 font-medium text-lg">Kamu belum bergabung di kelas mana pun.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-700">

                            {isPending ? (
                                <div className="bg-white dark:bg-slate-900/50 p-20 rounded-[3rem] text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-2xl border border-white dark:border-slate-800 flex flex-col items-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none"></div>
                                    <div className="w-28 h-28 bg-amber-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-8 border border-amber-100 dark:border-slate-700 relative z-10 shadow-inner">
                                        <span className="text-5xl animate-bounce">⏳</span>
                                    </div>
                                    <h2 className="text-4xl font-black italic text-slate-800 dark:text-white leading-tight relative z-10">Sabar Ya, {auth.user.name.split(' ')[0]}!</h2>
                                    <p className="text-slate-500 mt-4 max-w-md text-lg relative z-10">
                                        Akses kelas <span className="text-blue-500 font-bold">{myClass.mata_kuliah}</span> sedang diproses dosen.
                                    </p>

                                    {/* TOMBOL KEMBALI ESTETIK (PENDING) */}
                                    <Link href={route('mahasiswa.dashboard')} className="mt-12 group inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-lg transition-all relative z-10">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
                                        Kembali
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-white dark:bg-slate-900/50 p-8 sm:p-10 rounded-[3rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-none border border-white dark:border-slate-800 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-bl-full -z-10 pointer-events-none"></div>

                                        <div className="mb-8">
                                            {/* TOMBOL KEMBALI ESTETIK (ACTIVE) */}
                                            <Link href={route('mahasiswa.dashboard')} className="group inline-flex items-center gap-2 px-5 py-2.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700/80 border border-slate-200/50 dark:border-slate-700/50 rounded-full text-[10px] font-black text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 uppercase tracking-widest transition-all shadow-sm hover:shadow-md">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 group-hover:-translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
                                                Kembali
                                            </Link>
                                        </div>
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                                            <div className="space-y-4">
                                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-slate-800 dark:text-white leading-none">
                                                    {myGroup?.nama_kelompok || 'Belum Ada Tim'}
                                                </h1>
                                                <p className="text-slate-500 text-lg">
                                                    Proyek: <span className="text-blue-500 font-bold bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-100 dark:border-blue-500/20 ml-2">{myGroup?.project_title || 'Menunggu Penugasan AI...'}</span>
                                                </p>
                                            </div>
                                            {myGroup && (
                                                /* MENU SWITCHER ALA iOS / APPLE */
                                                <div className="flex p-1.5 bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 w-full md:w-auto">
                                                    <button onClick={() => setTab('kanban')} className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${tab === 'kanban' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/50 dark:border-slate-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                                                        Kanban
                                                    </button>
                                                    <button onClick={() => setTab('logs')} className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${tab === 'logs' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200/50 dark:border-slate-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                                                        Logbook
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {myGroup ? (
                                        tab === 'kanban' ? (
                                            <KanbanBoard tasks={tasks} myGroup={myGroup} openModal={openTaskModal} onNext={handleNextProcess} handleDelete={confirmDelete} />
                                        ) : (
                                            <ActivityLogs logs={logs} />
                                        )
                                    ) : (
                                        <div className="text-center py-24 bg-white dark:bg-slate-900/30 rounded-[3rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-none border border-white dark:border-slate-800 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 animate-pulse"></div>

                                            <div className="w-24 h-24 bg-blue-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 relative z-10 border border-blue-100 dark:border-slate-700 shadow-inner">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-blue-500">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z" />
                                                </svg>
                                            </div>

                                            <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter relative z-10 mb-3">AI Smart Grouping Aktif</h3>
                                            <p className="text-slate-500 max-w-md mx-auto relative z-10 text-lg">
                                                Akses kelas sudah <span className="text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-500/20">Approved</span>. <br />Asisten AI sedang mengkalkulasi komposisi tim terbaik berdasarkan performamu.
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* AREA MODAL (Tetap sama seperti kode sebelumnya) */}
            {isJoinModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-[#0b1120]/80 backdrop-blur-md">
                    <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] w-full max-w-md relative animate-in zoom-in-95 border border-white dark:border-slate-800 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-2xl">
                        <button onClick={() => setIsJoinModalOpen(false)} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full transition-colors">✕</button>

                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 text-blue-500 border border-blue-100 dark:border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" /></svg>
                        </div>

                        <h3 className="text-3xl font-black text-center text-slate-800 dark:text-white mb-2 tracking-tight">Gabung Kelas</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-center text-sm mb-10">Masukkan 6 digit kode dari dosenmu.</p>

                        <form onSubmit={submitJoin} className="space-y-6">
                            <input
                                type="text"
                                className="w-full p-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl text-center font-black tracking-[0.5em] text-3xl uppercase text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-slate-300 dark:placeholder:text-slate-700 transition-all shadow-inner"
                                placeholder="KODE 6"
                                value={joinForm.data.invite_code}
                                onChange={e => joinForm.setData('invite_code', e.target.value.toUpperCase())}
                                maxLength="6"
                                required
                            />
                            <button type="submit" disabled={joinForm.processing} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-[0_10px_20px_rgba(37,99,235,0.2)] dark:shadow-blue-600/30 active:scale-95 transition-all disabled:opacity-50">
                                Gabung Ruang
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {isTaskModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-[#0b1120]/80 backdrop-blur-md">
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] w-full max-w-xl relative shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-2xl border border-white dark:border-slate-800 animate-in fade-in zoom-in-95 overflow-hidden">

                        <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-100 dark:bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>

                        <button onClick={() => setIsTaskModalOpen(false)} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full transition-colors z-10">✕</button>

                        <div className="mb-10 relative z-10 text-center">
                            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                            </div>
                            <h3 className="text-4xl font-black tracking-tighter text-slate-800 dark:text-white">Reka Tugas.</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Menambahkan ke: <span className="text-blue-500">{taskForm.data.status}</span></p>
                        </div>

                        <form onSubmit={submitTask} className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 ml-2 uppercase tracking-widest">Judul Tugas <span className="text-red-500">*</span></label>
                                <input type="text" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 px-5 text-slate-800 dark:text-white font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-inner" placeholder="Misal: Slicing UI Dashboard..." value={taskForm.data.title} onChange={e => taskForm.setData('title', e.target.value)} autoFocus required />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 ml-2 uppercase tracking-widest">Tautan / Link (Opsional)</label>
                                <input type="url" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 px-5 text-slate-800 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-inner" placeholder="https://github.com/..." value={taskForm.data.link} onChange={e => taskForm.setData('link', e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 ml-2 uppercase tracking-widest">Lampiran File (Opsional)</label>
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl cursor-pointer bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:border-blue-300 dark:hover:border-blue-500/50 transition-all group relative">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 z-10">
                                        <svg className={`w-8 h-8 mb-3 transition-colors ${taskForm.data.attachment ? 'text-blue-500' : 'text-slate-400 dark:text-slate-600 group-hover:text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 text-center px-4">
                                            {taskForm.data.attachment ? <span className="text-blue-500">{taskForm.data.attachment.name}</span> : "Pilih file atau drag ke sini"}
                                        </p>
                                    </div>
                                    <input type="file" className="hidden" onChange={e => taskForm.setData('attachment', e.target.files[0])} />
                                </label>
                            </div>

                            <div className="pt-4">
                                <button type="submit" disabled={taskForm.processing} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-[0_10px_20px_rgba(37,99,235,0.2)] dark:shadow-blue-600/20 active:scale-95 transition-all disabled:opacity-50">
                                    {taskForm.processing ? 'Menyimpan...' : 'SIMPAN TUGAS BARU'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isActionModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-[#0b1120]/80 backdrop-blur-md">
                    <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] w-full max-w-xl relative shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-2xl border border-white dark:border-slate-800 animate-in zoom-in-95 overflow-hidden">

                        <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-100 dark:bg-emerald-500/10 blur-3xl rounded-full pointer-events-none"></div>

                        <button onClick={() => setIsActionModalOpen(false)} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full transition-colors z-10">✕</button>

                        <div className="mb-10 relative z-10 text-center">
                            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                            </div>
                            <h3 className="text-4xl font-black tracking-tighter text-slate-800 dark:text-white">Update Progres.</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Laporkan Status Pengerjaan</p>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 ml-2 uppercase tracking-widest">Catatan Detail</label>
                                <textarea
                                    className="w-full p-6 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl h-32 text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none transition-all shadow-inner"
                                    placeholder="Detail progres yang sudah diselesaikan..."
                                    value={taskForm.data.title}
                                    onChange={e => taskForm.setData('title', e.target.value)}
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button onClick={() => submitProgress('in_progress')} className="flex-1 py-5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-white rounded-2xl font-black uppercase text-[10px] tracking-widest border border-slate-200 dark:border-slate-700 transition-all active:scale-95">
                                    Simpan Draft
                                </button>
                                <button onClick={() => submitProgress('done')} className="flex-1 py-5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-[0_10px_20px_rgba(16,185,129,0.2)] dark:shadow-emerald-600/20 transition-all active:scale-95">
                                    Tandai Selesai ✓
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}