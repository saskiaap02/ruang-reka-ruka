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
        if (confirm('Yakin mau hapus tugas ini, Hil?')) {
            taskForm.delete(route('mahasiswa.task.delete', id), {
                onSuccess: () => { console.log('Terhapus!'); },
            });
        }
    };

    const openTaskModal = (status) => {
        taskForm.reset(); // Bersihkan form dulu
        taskForm.setData('status', status);
        setIsTaskModalOpen(true);
    };

    const handleNextProcess = (taskId) => {
        console.log("Task yang diproses ID:", taskId); // Buat ngecek di Console F12
        setActiveTaskId(taskId);
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
                alert('Berhasil Update ke ' + targetStatus);
            },
            onError: (err) => console.log("Error Hil:", err)
        });
    };
    return (
        <AuthenticatedLayout 
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-black text-2xl text-white italic tracking-tighter">
                        Ruang <span className="text-blue-500">Audit.</span>
                    </h2>
                    <button 
                        onClick={() => setIsJoinModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-2xl text-xs font-black shadow-lg shadow-blue-600/20 transition-all border border-blue-400/20"
                    >
                        + GABUNG KELAS
                    </button>
                </div>
            }
        >
            <Head title={myClass ? `Audit: ${myClass.nama_kelas}` : "Katalog Kelas"} />

            <div className="min-h-screen bg-[#0b1120] pb-20 font-sans px-6 sm:px-10 pt-10 text-slate-900">
                <div className="max-w-[1600px] mx-auto space-y-10">

                    {!myClass ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
                            {joinedClasses && joinedClasses.map((item) => (
                                <div key={item.id} className="bg-white p-8 rounded-[3.5rem] shadow-2xl border border-slate-200 flex flex-col justify-between h-72 group hover:border-blue-500/50 transition-all">
                                    <div>
                                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                            {item.project_class.mata_kuliah}
                                        </span>
                                        <h2 className="text-2xl font-black text-slate-800 mt-6 leading-tight group-hover:text-blue-600 transition-colors">
                                            {item.project_class.nama_kelas}
                                        </h2>
                                    </div>
                                    <Link 
                                        href={route('mahasiswa.kelas.show', item.project_class_id)}
                                        className="w-full py-5 bg-slate-900 text-white rounded-2xl text-center text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl"
                                    >
                                        MASUK PAPAN AUDIT
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-10 animate-in slide-in-from-bottom-5 duration-700">
                            <div className="bg-white p-12 rounded-[4rem] shadow-2xl flex flex-col md:flex-row justify-between items-end border border-slate-200">
                                <div className="space-y-4 text-slate-900">
                                    <Link href={route('mahasiswa.dashboard')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline italic">← Kembali ke Katalog</Link>
                                    <h1 className="text-6xl font-black tracking-tighter italic leading-none">{myGroup?.nama_kelompok || 'TIM 1'}</h1>
                                    <p className="text-slate-500 font-bold text-lg italic">" {myGroup?.project_title || 'Belum ada judul' } "</p>
                                </div>
                                <div className="flex gap-8">
                                    <button onClick={() => setTab('kanban')} className={`pb-4 text-xs font-black uppercase tracking-[0.3em] transition-all ${tab === 'kanban' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-slate-400'}`}>Kanban Board</button>
                                    <button onClick={() => setTab('logs')} className={`pb-4 text-xs font-black uppercase tracking-[0.3em] transition-all ${tab === 'logs' ? 'text-emerald-500 border-b-4 border-emerald-500' : 'text-slate-400'}`}>Tim Logbook</button>
                                </div>
                            </div>

                            {tab === 'kanban' ? (
                                <KanbanBoard 
                                    tasks={tasks} 
                                    myGroup={myGroup} 
                                    openModal={openTaskModal}
                                    onNext={handleNextProcess}
                                    handleDelete={confirmDelete}
                                />
                            ) : (
                                <ActivityLogs logs={logs} />
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL GABUNG KELAS */}
            {isJoinModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
                    <div className="bg-white p-12 rounded-[4rem] w-full max-w-lg shadow-2xl border border-slate-100 text-slate-900 text-center">
                        <h3 className="text-3xl font-black italic tracking-tight underline decoration-blue-500 underline-offset-8">Join Audit Room</h3>
                        <form onSubmit={submitJoin} className="space-y-8 mt-10">
                            <input 
                                type="text" 
                                className="w-full p-6 bg-slate-50 border-none rounded-3xl text-slate-800 text-center font-black tracking-[0.6em] focus:ring-2 focus:ring-blue-600 outline-none text-2xl uppercase"
                                placeholder="XXXXXX"
                                value={joinForm.data.invite_code}
                                onChange={e => joinForm.setData('invite_code', e.target.value.toUpperCase())}
                                maxLength="6"
                                required
                            />
                            <div className="flex gap-4">
                                <button type="button" onClick={() => setIsJoinModalOpen(false)} className="flex-1 py-6 text-slate-400 font-black text-[10px] uppercase tracking-widest">Batal</button>
                                <button type="submit" disabled={joinForm.processing} className="flex-1 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-[10px] uppercase shadow-xl shadow-blue-600/30">GABUNG</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL REKA TUGAS */}
            {isTaskModalOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
                    <div className="bg-white p-12 rounded-[4rem] w-full max-w-xl shadow-2xl border border-slate-100 text-slate-900">
                        <h3 className="text-3xl font-black italic text-slate-900 text-center mb-10 underline decoration-blue-500 underline-offset-8">Reka Tugas Baru</h3>
                        <form onSubmit={submitTask} className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 ml-6 uppercase tracking-widest">Judul Pengerjaan</label>
                                <input 
                                    type="text" 
                                    className="w-full p-6 bg-slate-50 border-none rounded-3xl text-slate-800 font-bold focus:ring-2 focus:ring-blue-600 outline-none text-xl"
                                    placeholder="Apa yang kamu kerjakan?"
                                    value={taskForm.data.title}
                                    onChange={e => taskForm.setData('title', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 ml-6 uppercase tracking-widest">Lampiran File (Bukti Kerja)</label>
                                <input 
                                    type="file" 
                                    className="w-full p-4 bg-blue-50 border-2 border-dashed border-blue-200 rounded-3xl text-sm font-bold text-blue-600"
                                    onChange={e => taskForm.setData('attachment', e.target.files[0])}
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsTaskModalOpen(false)} className="flex-1 py-6 text-slate-400 font-black text-[10px] uppercase tracking-widest">Batal</button>
                                <button type="submit" disabled={taskForm.processing} className="flex-1 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-[10px] uppercase shadow-xl shadow-blue-600/30">
                                    {taskForm.processing ? 'SINKRONISASI...' : 'Simpan Tugas'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

{/* MODAL UPDATE PROGRES (KUNCI TOMBOL NEXT) - VERSI FIX */}
{isActionModalOpen && (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
        <div className="bg-white p-12 rounded-[4rem] w-full max-w-xl shadow-2xl border border-slate-100 text-slate-900">
            <h3 className="text-3xl font-black italic text-slate-900 text-center mb-10 underline decoration-blue-500 underline-offset-8">Update Progres</h3>
            
            <div className="space-y-6 mb-10">
                {/* Input untuk Catatan/Jawaban */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 ml-6 uppercase tracking-widest">Catatan Pengerjaan</label>
                    <textarea 
                        className="w-full p-6 bg-slate-50 border-none rounded-3xl text-slate-800 font-bold outline-none h-32 focus:ring-2 focus:ring-blue-600"
                        placeholder="Apa yang sudah kamu selesaikan?"
                        value={taskForm.data.title} // Supaya teks yang diketik muncul
                        onChange={e => taskForm.setData('title', e.target.value)}
                    />
                </div>

                {/* Input Upload Bukti */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 ml-6 uppercase tracking-widest">Upload Bukti (Opsional)</label>
                    <input 
                        type="file" 
                        className="w-full p-4 bg-blue-50 border-2 border-dashed border-blue-200 rounded-3xl text-xs font-bold text-blue-600"
                        onChange={e => taskForm.setData('attachment', e.target.files[0])}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                    <button 
                        type="button" // PENTING: Supaya gak trigger submit form lain
                        onClick={() => submitProgress('in_progress')}
                        className="flex-1 py-6 bg-slate-100 text-slate-600 rounded-[2rem] font-black text-[10px] uppercase hover:bg-slate-200 transition-all"
                    >
                        Simpan Progres
                    </button>
                    <button 
                        type="button" // PENTING: Supaya gak refresh halaman
                        onClick={() => submitProgress('done')}
                        className="flex-1 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-[10px] uppercase shadow-xl shadow-blue-600/30 active:scale-95 transition-all"
                    >
                        Selesaikan (Done)
                    </button>
                </div>
                <button 
                    type="button"
                    onClick={() => setIsActionModalOpen(false)} 
                    className="py-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600"
                >
                    Batal
                </button>
            </div>
        </div>
    </div>
)}
        </AuthenticatedLayout>
    );
}