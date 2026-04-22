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
// Kita cari tahu status mahasiswa di kelas yang sedang dibuka sekarang
const currentRelation = joinedClasses?.find(item => item.project_class_id === myClass?.id);
const isPending = currentRelation?.status === 'pending';

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
                    
                    {/* --- 1. BADGE STATUS (TAMBAHAN BARU) --- */}
                    <div className="absolute top-4 right-4 z-20">
                        {item.status === 'pending' ? (
                            <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg text-[8px] font-black uppercase tracking-tighter border border-amber-200 dark:border-amber-800 animate-pulse">
                                ⏳ Waiting Approval
                            </span>
                        ) : (
                            <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-[8px] font-black uppercase tracking-tighter border border-emerald-200 dark:border-emerald-800">
                                ✓ Active
                            </span>
                        )}
                    </div>

                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>

                    <div>
                        <span className="px-3 py-1.5 bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-200/50 dark:border-blue-800">
                            {item.project_class?.mata_kuliah}
                        </span>
                        <h2 className="text-2xl font-black text-slate-800 dark:text-white mt-5 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                            {item.project_class?.nama_kelas}
                        </h2>
                    </div>

                    {/* Button: Kalau pending warnanya beda/disable juga boleh */}
                    <Link
                        href={route('mahasiswa.kelas.show', item.project_class_id)}
                        className={`w-full py-3.5 rounded-xl text-center text-xs font-bold uppercase tracking-widest transition-all shadow-md ${
                            item.status === 'pending' 
                            ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 cursor-not-allowed' 
                            : 'bg-slate-900 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-500'
                        }`}
                    >
                        {item.status === 'pending' ? 'Cek Status' : 'Buka Ruang'}
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
    /* Di sini lanjut ke Tampilan 2 (Detail Kelas) yang ada logic isPending tadi */
    <p>Loading Detail...</p> 
)}
                        {/* --- TAMPILAN 2: DETAIL KELAS / KANBAN BOARD --- */}
<div className="space-y-8 animate-in slide-in-from-bottom-5 duration-700">
    
    {/* LOGIKA GERBANG: Cek apakah status di kelas ini masih pending? */}
    {joinedClasses?.find(item => item.project_class_id === myClass?.id)?.status === 'pending' ? (
        
        /* === TAMPILAN A: LAYAR TUNGGU (PENDING) === */
        <div className="bg-white/70 dark:bg-slate-800/90 backdrop-blur-xl p-20 rounded-[3rem] shadow-2xl border border-white/80 dark:border-slate-700/50 flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Dekorasi Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none"></div>
            
            <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center animate-bounce border border-blue-500/20 mb-8 relative z-10">
                <span className="text-4xl">⏳</span>
            </div>
            
            <div className="relative z-10">
                <h2 className="text-4xl font-black italic text-slate-900 dark:text-white tracking-tighter">Sabar Ya, {auth.user.name.split(' ')[0]}!</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-md leading-relaxed font-medium mx-auto">
                    Akses ke kelas <span className="text-blue-600 font-bold">{myClass.nama_kelas}</span> sedang diproses. <br/> 
                    Dosen perlu memberikan <span className="italic">Approval</span> manual sebelum kamu bisa mulai audit.
                </p>
                
                <div className="mt-10 inline-flex items-center gap-3 px-6 py-3 bg-slate-900/5 dark:bg-slate-900/50 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status: Menunggu Konfirmasi Dosen</p>
                </div>
            </div>

            <Link href={route('mahasiswa.dashboard')} className="mt-12 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors relative z-10">
                ← Kembali ke Katalog
            </Link>
        </div>

    ) : (
        
        /* === TAMPILAN B: KONTEN KELAS (APPROVED) === */
        <>
            {/* Header Detail Kelas */}
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
                            {myGroup?.nama_kelompok || 'Plotting Tim'}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
                            Proyek: <span className="text-blue-600 dark:text-blue-400 font-bold">{myGroup?.project_title || 'Menganalisis Riwayat...'}</span>
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

            {/* Konten Utama (Kanban / Waiting AI) */}
            {myGroup ? (
                tab === 'kanban' ? (
                    <KanbanBoard tasks={tasks} myGroup={myGroup} openModal={openTaskModal} onNext={handleNextProcess} handleDelete={confirmDelete} />
                ) : (
                    <ActivityLogs logs={logs} />
                )
            ) : (
                /* TAMPILAN KHUSUS ASISTEN AI (Jika sudah Approve tapi belum masuk Tim) */
                <div className="text-center py-24 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 animate-pulse"></div>
                    <span className="text-5xl relative z-10">🤖</span>
                    <h3 className="mt-6 text-xl font-black text-slate-700 dark:text-slate-300 tracking-tight relative z-10">Asisten AI Sedang Mengolah Data...</h3>
                    <p className="text-slate-500 mt-2 max-w-sm mx-auto relative z-10">Status kamu sudah <span className="text-emerald-500 font-bold uppercase">Approved</span>. Tunggu sebentar ya, AI sedang menempatkanmu ke tim berdasarkan riwayat performamu!</p>
                </div>
            )}
        </>
    )}
</div>
            {/* --- LOGIKA UTAMA: KATALOG vs DETAIL --- */}
                    {!myClass ? (
                        /* TAMPILAN 1: KATALOG KELAS */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                            {joinedClasses && joinedClasses.length > 0 ? (
                                joinedClasses.map((item) => (
                                    <div key={item.id} className="bg-white/60 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white/80 dark:border-slate-700/50 flex flex-col justify-between h-64 relative overflow-hidden group">
                                        <div className="absolute top-4 right-4 z-20">
                                            {item.status === 'pending' ? (
                                                <span className="px-2 py-1 bg-amber-100 text-amber-600 rounded-lg text-[8px] font-black uppercase animate-pulse">⏳ Pending</span>
                                            ) : (
                                                <span className="px-2 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[8px] font-black uppercase">✓ Active</span>
                                            )}
                                        </div>
                                        <div>
                                            <span className="px-3 py-1.5 bg-blue-100/50 text-blue-700 rounded-lg text-[10px] font-black uppercase tracking-widest">{item.project_class?.mata_kuliah}</span>
                                            <h2 className="text-2xl font-black text-slate-800 dark:text-white mt-5 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">{item.project_class?.nama_kelas}</h2>
                                        </div>
                                        <Link href={route('mahasiswa.kelas.show', item.project_class_id)} className={`w-full py-3.5 rounded-xl text-center text-xs font-bold uppercase ${item.status === 'pending' ? 'bg-slate-200 text-slate-500' : 'bg-slate-900 text-white hover:bg-blue-600'}`}>
                                            {item.status === 'pending' ? 'Cek Status' : 'Buka Ruang'}
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20 opacity-50"><p>Kamu belum bergabung di kelas mana pun.</p></div>
                            )}
                        </div>
                    ) : (
                        /* TAMPILAN 2: DETAIL KELAS */
                        <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-700">
                            {/* CEK GERBANG PENDING */}
                            {joinedClasses?.find(item => item.project_class_id === myClass?.id)?.status === 'pending' ? (
                                <div className="bg-white/70 dark:bg-slate-800/90 backdrop-blur-xl p-20 rounded-[3rem] text-center border border-white/80 flex flex-col items-center">
                                    <div className="text-5xl mb-6 animate-bounce">⏳</div>
                                    <h2 className="text-4xl font-black italic text-slate-900 dark:text-white leading-tight">Sabar Ya, {auth.user.name.split(' ')[0]}!</h2>
                                    <p className="text-slate-500 mt-4 max-w-md">Akses kelas <span className="text-blue-600 font-bold">{myClass.nama_kelas}</span> sedang diproses dosen.</p>
                                    <Link href={route('mahasiswa.dashboard')} className="mt-12 text-xs font-black uppercase tracking-widest text-slate-400">← Kembali ke Katalog</Link>
                                </div>
                            ) : (
                                <>
                                    {/* HEADER KELAS */}
                                    <div className="bg-white/70 dark:bg-slate-800/90 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/80 relative overflow-hidden">
                                        <div className="mb-6">
                                            <Link href={route('mahasiswa.dashboard')} className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 uppercase bg-white/50 px-4 py-2 rounded-xl">← Kembali</Link>
                                        </div>
                                        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                                            <div className="space-y-2">
                                                <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">{myGroup?.nama_kelompok || 'Plotting Tim...'}</h1>
                                                <p className="text-slate-500 text-lg">Proyek: <span className="text-blue-600 font-bold">{myGroup?.project_title || 'Menunggu Analisis AI...'}</span></p>
                                            </div>
                                            {myGroup && (
                                                <div className="flex gap-2 bg-white/50 p-1.5 rounded-2xl border border-slate-200">
                                                    <button onClick={() => setTab('kanban')} className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase transition-all ${tab === 'kanban' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Kanban</button>
                                                    <button onClick={() => setTab('logs')} className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase transition-all ${tab === 'logs' ? 'bg-white text-emerald-500 shadow-sm' : 'text-slate-500'}`}>Logbook</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* KONTEN BOARD */}
                                    {myGroup ? (
                                        tab === 'kanban' ? (
                                            <KanbanBoard tasks={tasks} myGroup={myGroup} openModal={openTaskModal} onNext={handleNextProcess} handleDelete={confirmDelete} />
                                        ) : (
                                            <ActivityLogs logs={logs} />
                                        )
                                    ) : (
                                        <div className="text-center py-24 bg-white/50 dark:bg-slate-800/50 rounded-3xl border border-slate-200">
                                            <div className="text-5xl mb-6">🤖</div>
                                            <h3 className="text-xl font-black text-slate-700 dark:text-slate-300 uppercase tracking-tighter">Asisten AI Sedang Mengolah Data...</h3>
                                            <p className="text-slate-500 mt-2 max-w-sm mx-auto">Status kamu sudah <span className="text-emerald-500 font-bold">Approved</span>. Tunggu AI membagi tim ya!</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* --- AREA MODAL --- */}
            {isJoinModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 p-12 rounded-[3rem] w-full max-w-md relative animate-in zoom-in-95">
                        <button onClick={() => setIsJoinModalOpen(false)} className="absolute top-6 right-6 p-2 text-slate-400">✕</button>
                        <h3 className="text-2xl font-black text-center mb-8">Gabung Kelas</h3>
                        <form onSubmit={submitJoin} className="space-y-6">
                            <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center font-black tracking-[0.5em] text-2xl uppercase" placeholder="KODE 6" value={joinForm.data.invite_code} onChange={e => joinForm.setData('invite_code', e.target.value.toUpperCase())} maxLength="6" required />
                            <button type="submit" disabled={joinForm.processing} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase shadow-lg">Gabung Sekarang</button>
                        </form>
                    </div>
                </div>
            )}

            {isTaskModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
                    <div className="bg-white dark:bg-slate-800 p-12 rounded-[2.5rem] w-full max-w-xl relative animate-in zoom-in-95">
                        <button onClick={() => setIsTaskModalOpen(false)} className="absolute top-6 right-6 p-2">✕</button>
                        <h3 className="text-3xl font-black tracking-tighter mb-8">Reka Tugas.</h3>
                        <form onSubmit={submitTask} className="space-y-8">
                            <input type="text" className="w-full bg-transparent border-0 border-b-2 border-slate-200 text-2xl font-bold" placeholder="Tulis tugas..." value={taskForm.data.title} onChange={e => taskForm.setData('title', e.target.value)} autoFocus />
                            <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs">Simpan Tugas</button>
                        </form>
                    </div>
                </div>
            )}

            {isActionModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
                    <div className="bg-white dark:bg-slate-800 p-12 rounded-[2.5rem] w-full max-w-xl relative overflow-hidden animate-in zoom-in-95">
                        <button onClick={() => setIsActionModalOpen(false)} className="absolute top-6 right-6 p-2">✕</button>
                        <h3 className="text-3xl font-black tracking-tighter mb-8">Update Progres.</h3>
                        <textarea className="w-full p-5 bg-slate-50 border-0 rounded-2xl h-32 font-bold mb-6" placeholder="Detail progres..." value={taskForm.data.title} onChange={e => taskForm.setData('title', e.target.value)} />
                        <div className="flex gap-3">
                            <button onClick={() => submitProgress('in_progress')} className="flex-1 py-5 bg-slate-100 rounded-2xl font-black uppercase text-[10px]">Simpan</button>
                            <button onClick={() => submitProgress('done')} className="flex-1 py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase text-[10px]">Selesai ✓</button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}