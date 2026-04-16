import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ActivityLogs from './Components/ActivityLogs';

export default function Dashboard({ auth, myClass, myGroup, tasks, logs, nudges }) {
    const [tab, setTab] = useState('kanban');
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    // --- FORM 1: JOIN KELAS ---
    const joinForm = useForm({ invite_code: '' });
    const submitJoin = (e) => {
        e.preventDefault();
        joinForm.post(route('mahasiswa.join-class'));
    };

    // --- FORM 2: REKA TUGAS ---
    const taskForm = useForm({
        group_id: myGroup?.id,
        title: '',
        status: 'BACKLOG'
    });

    const submitTask = (e) => {
        e.preventDefault();
        taskForm.post(route('student.task.store'), {
            onSuccess: () => {
                taskForm.reset();
                setIsTaskModalOpen(false);
            }
        });
    };

    // --- HANDLERS: UPDATE, COMPLETE & DELETE ---
    const { post: postUpdate } = useForm();
    const { delete: destroyTask } = useForm();

    const updateStatus = (taskId, newStatus) => {
        postUpdate(route('student.task.update-status', taskId), {
            data: { status: newStatus.toUpperCase() }
        });
    };

    const handleComplete = (taskId) => {
        const link = prompt('Masukkan Link Bukti Kerja (URL GitHub/G-Drive):');
        if (link) {
            postUpdate(route('student.task.complete', taskId), {
                data: { link_evidence: link }
            });
        }
    };

    const handleDelete = (taskId) => {
        if (confirm('Hapus tugas ini?')) {
            destroyTask(route('student.task.delete', taskId));
        }
    };

    // --- SUB-COMPONENT: KANBAN COLUMN ---
    const KanbanColumn = ({ title, status, color, bgColor }) => (
        <div className="bg-white/95 backdrop-blur-md border border-slate-200 p-8 rounded-[3rem] flex-1 min-w-[350px] shadow-2xl shadow-black/10">
            <div className="flex justify-between items-center mb-8 px-2">
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${bgColor} animate-pulse`}></div>
                    <h3 className={`font-black text-[10px] uppercase tracking-[0.3em] ${color}`}>{title}</h3>
                </div>
                <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-xl text-[10px] font-black border border-slate-200">
                    {tasks?.filter(t => t.status.toUpperCase() === status).length || 0}
                </span>
            </div>

            <div className="space-y-5">
                {tasks?.filter(t => t.status.toUpperCase() === status).map(task => (
                    <div key={task.id} className="group bg-slate-50 border border-slate-200 p-6 rounded-[2rem] hover:bg-white hover:border-blue-400 hover:shadow-xl transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-bold text-slate-800 leading-relaxed">{task.judul}</p>
                            <button onClick={() => handleDelete(task.id)} className="opacity-0 group-hover:opacity-100 text-[10px] font-black text-red-400 uppercase transition-opacity">×</button>
                        </div>

                        <div className="flex justify-between items-center mt-8">
                            <div className="flex gap-4">
                                {status !== 'BACKLOG' && (
                                    <button onClick={() => updateStatus(task.id, status === 'DONE' ? 'IN_PROGRESS' : 'BACKLOG')} className="text-[9px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-tighter transition-colors">← Back</button>
                                )}
                                {status !== 'DONE' && (
                                    <button onClick={() => updateStatus(task.id, status === 'BACKLOG' ? 'IN_PROGRESS' : 'DONE')} className="text-[9px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-tighter transition-colors">Next →</button>
                                )}
                            </div>
                            {status === 'IN_PROGRESS' && (
                                <button onClick={() => handleComplete(task.id)} className="bg-blue-600 text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-95 transition-all">Submit</button>
                            )}
                            {status === 'DONE' && task.link_evidence && (
                                <a href={task.link_evidence} target="_blank" className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter hover:underline">Bukti ✓</a>
                            )}
                        </div>
                    </div>
                ))}

                <button
                    onClick={() => { taskForm.setData('status', status); setIsTaskModalOpen(true); }}
                    className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 hover:border-blue-300 hover:text-blue-500 transition-all"
                >
                    + Reka Tugas
                </button>
            </div>
        </div>
    );

    // --- VIEW 1: BELUM JOIN KELAS ---
    if (!myClass) {
        return (
            <div className="min-h-screen bg-[#0b1120] flex items-center justify-center p-6">
                <Head title="Join RuKa" />
                <div className="max-w-md w-full bg-white p-12 rounded-[3.5rem] shadow-2xl text-center border border-slate-100">
                    <div className="mb-10 text-center">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-xl text-sm font-black tracking-tighter shadow-lg shadow-blue-600/20">Ru</span>
                        <h1 className="text-3xl font-black text-slate-900 mt-6 tracking-tight">Halo, {auth.user.name}!</h1>
                        <p className="text-slate-400 text-[10px] mt-2 uppercase tracking-[0.2em] font-black">Masukkan Kode Audit Kelas</p>
                    </div>
                    <form onSubmit={submitJoin} className="space-y-6">
                        <input
                            type="text"
                            className="w-full p-6 bg-slate-50 border-none rounded-3xl text-slate-800 text-center font-black tracking-[0.5em] focus:ring-2 focus:ring-blue-600 outline-none text-xl uppercase"
                            placeholder="XXXXXX"
                            value={joinForm.data.invite_code}
                            onChange={e => joinForm.setData('invite_code', e.target.value.toUpperCase())}
                            maxLength="6"
                        />
                        <button disabled={joinForm.processing} className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-600/30 active:scale-95 transition-all">
                            {joinForm.processing ? 'SINKRONISASI...' : 'Gabung Sekarang'}
                        </button>
                    </form>
                    <Link href={route('logout')} method="post" as="button" className="mt-8 text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-red-500 transition-colors">Logout Account</Link>
                </div>
            </div>
        );
    }

    // --- VIEW 2: SUDAH JOIN TAPI BELUM ADA KELOMPOK ---
    if (!myGroup) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center space-y-6">
                    <div className="text-7xl animate-bounce">⏳</div>
                    <h2 className="text-3xl font-black text-slate-900 italic tracking-tight">Menunggu Sinkronisasi Tim...</h2>
                    <p className="text-slate-400 text-sm max-w-xs mx-auto font-medium">Dosen sedang mengatur penempatan tim kamu di kelas <span className="text-blue-600 font-bold">{myClass.nama_kelas}</span>.</p>
                    <Link href={route('logout')} method="post" as="button" className="mt-8 text-[10px] font-black text-red-400 uppercase tracking-widest hover:underline">Logout</Link>
                </div>
            </div>
        );
    }

    // --- VIEW 3: DASHBOARD UTAMA ---
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Student Intelligence Dashboard" />
            <div className="min-h-screen bg-[#0b1120] text-slate-300 pb-20 font-sans">
                <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 pt-10 space-y-8">

                    {/* --- BANNER PERINGATAN COLEKAN (NUDGES) --- */}
                    {nudges && nudges.length > 0 && nudges.map((nudge) => (
                        <div key={nudge.id} className="bg-red-500/10 border border-red-500/20 p-8 rounded-[3rem] flex flex-col md:flex-row justify-between items-center gap-6 animate-pulse backdrop-blur-sm">
                            <div className="flex gap-6 items-center">
                                <span className="text-4xl">⚠️</span>
                                <div>
                                    <h3 className="text-red-400 font-black text-xs uppercase tracking-[0.2em]">Peringatan Intelijen Dosen</h3>
                                    <p className="text-white text-sm mt-2 font-medium leading-relaxed">{nudge.message}</p>
                                </div>
                            </div>
                            <Link
                                href={route('mahasiswa.colek.read', { id: nudge.id })}
                                method="post" as="button"
                                className="px-8 py-3 bg-red-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-xl shadow-red-500/40 hover:bg-red-600 transition-all whitespace-nowrap"
                            >
                                SAYA MENGERTI
                            </Link>
                        </div>
                    ))}

                    {/* Header Tim - Dark Glassmorphism */}
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-slate-900/50 backdrop-blur-md p-12 rounded-[4rem] border border-slate-800 shadow-2xl">
                        <div className="space-y-4">
                            <span className="px-5 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-widest italic">{myClass.mata_kuliah}</span>
                            <h1 className="text-6xl font-black text-white tracking-tighter italic leading-none">{myGroup.nama_kelompok}</h1>
                            <p className="text-slate-500 font-bold text-lg">Fokus Proyek: <span className="text-slate-300 italic">"{myGroup.project_title || 'Belum ada judul'}"</span></p>
                        </div>
                        <div className="flex gap-10">
                            <button onClick={() => setTab('kanban')} className={`pb-4 text-xs font-black uppercase tracking-[0.3em] transition-all ${tab === 'kanban' ? 'text-blue-500 border-b-4 border-blue-600' : 'text-slate-600 hover:text-slate-400'}`}>Kanban Board</button>
                            <button onClick={() => setTab('logs')} className={`pb-4 text-xs font-black uppercase tracking-[0.3em] transition-all ${tab === 'logs' ? 'text-emerald-500 border-b-4 border-emerald-600' : 'text-slate-600 hover:text-slate-400'}`}>Tim Logbook</button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="w-full">
                        {tab === 'kanban' ? (
                            <div className="flex flex-col lg:flex-row gap-10 items-start overflow-x-auto pb-10 scrollbar-hide">
                                <KanbanColumn title="Backlog" status="BACKLOG" color="text-slate-400" bgColor="bg-slate-300" />
                                <KanbanColumn title="In Progress" status="IN_PROGRESS" color="text-blue-600" bgColor="bg-blue-500" />
                                <KanbanColumn title="Done" status="DONE" color="text-emerald-600" bgColor="bg-emerald-500" />
                            </div>
                        ) : (
                            <div className="bg-white p-12 rounded-[4rem] shadow-2xl shadow-black/20 border border-slate-100">
                                <ActivityLogs logs={logs} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Tambah Tugas */}
            {isTaskModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white p-12 rounded-[4rem] w-full max-w-xl shadow-[0_0_100px_rgba(0,0,0,0.2)]">
                        <h3 className="text-3xl font-black text-slate-900 mb-10 italic tracking-tight text-center underline decoration-blue-500 underline-offset-8">Reka Tugas Baru</h3>
                        <form onSubmit={submitTask} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 ml-6 uppercase tracking-[0.2em]">Apa yang ingin dikerjakan?</label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Merancang Database"
                                    className="w-full bg-slate-50 border-none rounded-3xl text-sm text-slate-900 p-6 focus:ring-2 focus:ring-blue-600 outline-none"
                                    value={taskForm.data.title}
                                    onChange={e => taskForm.setData('title', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex gap-6 pt-6">
                                <button type="button" onClick={() => setIsTaskModalOpen(false)} className="flex-1 py-6 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 transition-all">Batal</button>
                                <button type="submit" disabled={taskForm.processing} className="flex-1 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/30 active:scale-95 transition-all">
                                    {taskForm.processing ? 'MENYIMPAN...' : 'Simpan Tugas'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}