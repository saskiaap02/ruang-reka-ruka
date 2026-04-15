import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import KanbanBoard from './Components/KanbanBoard';
import ActivityLogs from './Components/ActivityLogs';

export default function Dashboard({ auth, myClass, myGroup, logs, nudges }) {
    const [tab, setTab] = useState('kanban');

    // 1. Logika untuk Join Kelas
    const { data, setData, post, processing, errors } = useForm({
        invite_code: '',
    });

    const submitJoin = (e) => {
        e.preventDefault();
        post(route('mahasiswa.joinKelas')); // Pastikan nama route ini sesuai web.php
    };

    // 2. Logika untuk Claim Tugas
    const handleClaim = (taskId) => {
        if (confirm('Ambil tugas ini sebagai PIC?')) {
            post(route('tasks.claim', taskId));
        }
    };

    // 3. Logika untuk Menyelesaikan Tugas
    const handleComplete = (taskId) => {
        const link = prompt('Masukkan Link Bukti Kerja (URL GitHub/Google Drive):');
        if (link) {
            post(route('tasks.complete', { taskId, link_evidence: link }));
        }
    };

    // --- VIEW 1: JIKA BELUM PUNYA KELAS ---
    if (!myClass) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <Head title="Join Class" />
                <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-black text-slate-800">Halo, {auth.user.name}! 👋</h1>
                        <Link href={route('logout')} method="post" as="button" className="text-xs text-red-500 font-bold hover:underline">Logout</Link>
                    </div>
                    <p className="text-slate-500 mb-6 text-sm">Kamu belum bergabung ke kelas mana pun. Masukkan kode invite dari dosenmu.</p>
                    <form onSubmit={submitJoin}>
                        <input
                            type="text"
                            className="w-full p-4 bg-slate-100 border-none rounded-2xl mb-4 focus:ring-2 focus:ring-blue-500 font-mono text-center tracking-widest"
                            placeholder="KODE INVITE (6 Digit)"
                            value={data.invite_code}
                            onChange={e => setData('invite_code', e.target.value.toUpperCase())}
                            maxLength="6"
                        />
                        {errors.invite_code && <p className="text-red-500 text-xs mb-4">{errors.invite_code}</p>}
                        <button
                            disabled={processing}
                            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition"
                        >
                            {processing ? 'Memproses...' : 'Bergabung ke Kelas'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // --- VIEW 2: JIKA SUDAH PUNYA KELAS TAPI BELUM ADA KELOMPOK ---
    if (!myGroup) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Head title="Waiting Group" />
                <div className="text-center">
                    <div className="text-6xl mb-4">⏳</div>
                    <h2 className="text-xl font-bold text-slate-700">Berhasil Join Kelas: {myClass.nama_kelas}</h2>
                    <p className="text-slate-500 mb-4">Menunggu Dosen memasukkan kamu ke dalam kelompok...</p>
                    <Link href={route('logout')} method="post" as="button" className="text-sm text-red-600 font-bold px-4 py-2 bg-red-50 rounded-lg">Keluar Akun</Link>
                </div>
            </div>
        );
    }

    // --- VIEW 3: DASHBOARD UTAMA (SUDAH PUNYA KELOMPOK) ---
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Student Dashboard" />

            <div className="max-w-7xl mx-auto">

                {/* ---> BANNER PERINGATAN COLEKAN <--- */}
                {nudges && nudges.length > 0 && (
                    <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-5 rounded-r-2xl shadow-sm flex justify-between items-center animate-pulse border border-red-100">
                        <div className="flex gap-4 items-center">
                            <span className="text-2xl">⚠️</span>
                            <div>
                                <h3 className="text-red-800 font-bold text-sm uppercase tracking-wider">Peringatan dari Dosen!</h3>
                                <p className="text-red-600 text-xs mt-1 leading-relaxed">
                                    Kamu terdeteksi tidak memiliki riwayat aktivitas (pasif) selama lebih dari 3 hari.
                                    Dosen telah mengirimkan colekan ke akunmu. Segera perbarui progres tugasmu untuk menghindari pengurangan nilai audit!
                                </p>
                            </div>
                        </div>
                        <button className="hidden sm:block px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ml-4">
                            Saya Mengerti
                        </button>
                    </div>
                )}

                {/* Header Dashboard */}
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <span className="text-blue-600 font-bold tracking-widest text-xs uppercase">{myClass.mata_kuliah}</span>
                        <h1 className="text-4xl font-black text-slate-900 mt-2">{myGroup.nama_kelompok}</h1>
                        <p className="text-slate-500 mt-1">
                            Proyek: <span className="text-slate-800 font-semibold">{myGroup.project_title || 'Belum ada judul proyek'}</span>
                        </p>
                    </div>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="px-6 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition shadow-sm"
                    >
                        Keluar Akun
                    </Link>
                </div>

                {/* Navigasi Tab */}
                <div className="flex gap-8 mb-8 border-b border-slate-200">
                    <button
                        onClick={() => setTab('kanban')}
                        className={`pb-4 text-sm font-bold transition-all ${tab === 'kanban' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Papan Tugas (Kanban)
                    </button>
                    <button
                        onClick={() => setTab('logs')}
                        className={`pb-4 text-sm font-bold transition-all ${tab === 'logs' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Logbook Otomatis
                    </button>
                </div>

                {/* Konten Dinamis */}
                <main className="mt-8">
                    {tab === 'kanban' && (
                        <KanbanBoard
                            tasks={myGroup?.tasks}
                            onClaim={handleClaim}
                            onComplete={handleComplete}
                        />
                    )}

                    {tab === 'logs' && (
                        <ActivityLogs logs={logs} />
                    )}
                </main>
            </div>
        </div>
    );
}