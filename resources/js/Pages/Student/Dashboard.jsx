import React, { useState } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ActivityLogs from './Components/ActivityLogs';
import KanbanBoard from './Components/KanbanBoard';

/* ─── Design Tokens ──────────────────────────────────────────────────────── */
const AVATAR_COLORS = [
    'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-400',
    'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
    'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
    'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
];

const CARD_GRADS = [
    'bg-gradient-to-br from-pink-50 to-pink-100 dark:from-slate-800 dark:to-slate-800/80',
    'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-800/80',
    'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-slate-800 dark:to-slate-800/80',
    'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-slate-800 dark:to-slate-800/80',
    'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-slate-800 dark:to-slate-800/80',
];

/* ─── Micro-components ────────────────────────────────────────────────────── */
function Av({ name = '?', size = 36, idx = 0 }) {
    return (
        <div className={`flex items-center justify-center font-extrabold shrink-0 rounded-full ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}
            style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}>
            {name.charAt(0).toUpperCase()}
        </div>
    );
}

function StatCard({ label, value, colorClass, icon }) {
    return (
        <div className="flex-1 min-w-0 p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</span>
                <span className="text-xl">{icon}</span>
            </div>
            <span className={`text-3xl font-black tracking-tight ${colorClass}`}>{value}</span>
        </div>
    );
}

function ProgressRing({ pct = 0, size = 88 }) {
    const r = (size - 10) / 2;
    const circ = 2 * Math.PI * r;
    return (
        <svg width={size} height={size} className="-rotate-90">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth={8} />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" className="stroke-indigo-500" strokeWidth={8}
                strokeDasharray={`${(pct / 100) * circ} ${circ}`} strokeLinecap="round"
                style={{ transition: 'stroke-dasharray .8s cubic-bezier(0.4, 0, 0.2, 1)' }} />
        </svg>
    );
}

function PeerCard({ review, onRate, myId }) {
    const [hov, setHov] = useState(null);
    const hasScore = review.score !== null && review.score !== undefined;

    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
            <div className={`flex justify-between items-center ${hasScore ? 'mb-0' : 'mb-4'}`}>
                <div className="flex gap-3 items-center">
                    <Av name={review.reviewee_name || '?'} size={38} idx={review.reviewee_id % 5} />
                    <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 m-0">{review.reviewee_name || 'Anggota'}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold m-0 uppercase tracking-wider">
                            {hasScore ? 'Sudah dinilai' : 'Menunggu penilaian'}
                        </p>
                    </div>
                </div>
                {hasScore ? (
                    <div className={`rounded-xl px-3 py-1 flex flex-col items-center justify-center border 
                        ${review.score >= 75 ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20' :
                            review.score >= 50 ? 'bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20' :
                                'bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/20'}`}
                    >
                        <span className={`text-lg font-black leading-none
                            ${review.score >= 75 ? 'text-emerald-600 dark:text-emerald-400' :
                                review.score >= 50 ? 'text-amber-600 dark:text-amber-400' :
                                    'text-rose-600 dark:text-rose-400'}`}
                        >
                            {review.score}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 leading-none mt-1">/100</span>
                    </div>
                ) : (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 px-3 py-1.5 rounded-xl uppercase tracking-wider">
                        Pending
                    </span>
                )}
            </div>

            {!hasScore && (
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-widest text-center">Beri Nilai</p>
                    <div className="flex gap-1.5">
                        {[20, 40, 60, 80, 100].map(s => (
                            <button key={s}
                                onMouseEnter={() => setHov(s)} onMouseLeave={() => setHov(null)}
                                onClick={() => onRate(review.id, s)}
                                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all
                                    ${hov !== null && s <= hov
                                        ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30 scale-105'
                                        : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 border border-slate-200 dark:border-slate-700'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─── MAIN COMPONENT ──────────────────────────────────────────────────────── */
export default function Dashboard({
    auth, joinedClasses, myClass, myGroup,
    tasks, logs, nudges, peerReviews,
    myPeerScore, myPeerReviewedCount, myPeerTotalReviewers,
}) {
    const [tab, setTab] = useState('overview');
    const [isJoin, setIsJoin] = useState(false);
    const [isTask, setIsTask] = useState(false);
    const [isAct, setIsAct] = useState(false);
    const [actId, setActId] = useState(null);

    // State Modal Ganti Nama Proyek
    const [isEditTitle, setIsEditTitle] = useState(false);

    const projectForm = useForm({
        project_title: myGroup?.project_title || ''
    });

    const currentRel = joinedClasses?.find(i => i.project_class_id === myClass?.id);
    const isPending = currentRel?.status === 'pending';

    const joinForm = useForm({ invite_code: '' });

    const taskForm = useForm({
        id: null,
        group_id: myGroup?.id,
        title: '',
        description: '',
        status: 'backlog',
        attachment: null,
        link: '',
        attachment: [],
        existing_files: [],
        remove_files: []
    });

    /* ── Handlers ────────────────────────────────────────────────────────── */

    // FUNGSI UNTUK MEMBUKA MODAL PROJECT TITLE
    const openEditTitleModal = () => {
        projectForm.setData('project_title', myGroup?.project_title || '');
        projectForm.clearErrors();
        setIsEditTitle(true);
    };

    // FUNGSI SUBMIT DENGAN DETEKTIF ERROR
    // FUNGSI GANTI NAMA PROYEK
    const submitProjectTitle = (e) => {
        e.preventDefault();

        // Kita pakai post biasa karena di web.php sekarang rutenya Route::post
        projectForm.post(route('mahasiswa.group.update-title', myGroup?.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditTitle(false);
            }
        });
    };

    // FUNGSI SUBMIT TUGAS (Edit dan Bikin Baru)
    const submitTask = e => {
        e.preventDefault();
        if (taskForm.data.id) {
            // Kita pakai post biasa karena di web.php rutenya Route::post untuk update task
            taskForm.post(route('mahasiswa.task.update', taskForm.data.id), {
                forceFormData: true,
                onSuccess: () => { setIsTask(false); taskForm.reset(); },
            });
        } else {
            taskForm.post(route('mahasiswa.task.store'), {
                forceFormData: true,
                onSuccess: () => { setIsTask(false); taskForm.reset(); },
            });
        }
    };

    const submitJoin = e => {
        e.preventDefault();
        joinForm.post(route('mahasiswa.join-class'), {
            onSuccess: () => { setIsJoin(false); joinForm.reset(); },
        });
    };

    const confirmDelete = id => {
        if (confirm('Hapus tugas ini?')) taskForm.delete(route('mahasiswa.task.delete', id));
    };

    const openTaskModal = status => {
        taskForm.clearErrors();
        taskForm.setData({
            id: null, group_id: myGroup?.id, title: '', description: '',
            status, attachment: [], link: '', existing_files: [], remove_files: []
        });
        setIsTask(true);
    };

    const handleEditTask = (task) => {
        taskForm.clearErrors();

        let files = [];
        if (task.file_path) {
            try { files = JSON.parse(task.file_path); } catch (e) { files = [task.file_path]; }
        }

        taskForm.setData({
            id: task.id,
            group_id: task.group_id,
            title: task.title || task.judul || '',
            description: task.description || task.deskripsi || '',
            status: task.status,
            link: task.link || '',
            attachment: [],
            existing_files: Array.isArray(files) ? files : [files],
            remove_files: []
        });
        setIsTask(true);
    };

    const handleUpdateStatus = (id, newStatus) => {
        router.post(route('mahasiswa.task.update-status', id), {
            _method: 'post',
            status: newStatus
        }, { preserveScroll: true });
    };

    const handleNext = id => {
        setActId(id); taskForm.clearErrors();
        taskForm.setData({ title: '', attachment: null });
        setIsAct(true);
    };

    const submitProgress = st => {
        router.post(
            route('mahasiswa.task.update-status', actId),
            { _method: 'post', status: st, title: taskForm.data.title, attachment: taskForm.data.attachment },
            { forceFormData: true, onSuccess: () => { setIsAct(false); taskForm.reset(); } }
        );
    };

    const handlePeerRate = (rid, score) => {
        router.post(route('mahasiswa.peer.rate', rid), { score }, { preserveScroll: true });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        taskForm.setData('attachment', [...taskForm.data.attachment, ...files]);
    };

    const removeExistingFile = (file) => {
        taskForm.setData('existing_files', taskForm.data.existing_files.filter(f => f !== file));
        taskForm.setData('remove_files', [...taskForm.data.remove_files, file]);
    };

    const removeNewFile = (index) => {
        const updated = [...taskForm.data.attachment];
        updated.splice(index, 1);
        taskForm.setData('attachment', updated);
    };

    /* ── Computed ─────────────────────────────────────────────────────────── */
    const done = tasks?.filter(t => t.status === 'done').length || 0;
    const active = tasks?.filter(t => t.status === 'in_progress').length || 0;
    const total = tasks?.length || 0;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const members = myGroup?.members || [];
    const pendingPeer = peerReviews?.filter(r => r.score === null).length || 0;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 font-sans">
                    <div>
                        <h2 className="font-extrabold text-xl text-slate-800 dark:text-white m-0">
                            Ruang <span className="text-indigo-500">Kelas.</span>
                        </h2>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold m-0 uppercase tracking-[0.15em] mt-1">
                            Portal Mahasiswa
                        </p>
                    </div>
                    {!myClass && (
                        <button onClick={() => setIsJoin(true)} className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold border-none cursor-pointer shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                            Gabung Kelas
                        </button>
                    )}
                </div>
            }
        >
            <Head title={myClass ? `Kelas: ${myClass.nama_kelas}` : 'Katalog Kelas'} />

            <div className="min-h-screen pb-20 font-sans">
                <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">

                    {/* NUDGE ALERTS */}
                    {nudges?.filter(n => !n.is_read).map(nudge => (
                        <div key={nudge.id} className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-2xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 shadow-sm">
                            <div className="flex gap-4 items-center">
                                <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center shrink-0">
                                    <svg className="w-5 h-5 text-rose-500 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[10px] font-extrabold text-rose-500 dark:text-rose-400 uppercase tracking-widest m-0 mb-1">Peringatan Dosen</p>
                                    <p className="text-sm text-slate-800 dark:text-slate-200 m-0 font-medium">{nudge.message}</p>
                                </div>
                            </div>
                            <Link href={route('mahasiswa.colek.read', { id: nudge.id })} method="post" as="button" preserveScroll
                                className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-500/30 transition-all whitespace-nowrap w-full sm:w-auto text-center">
                                Saya Mengerti
                            </Link>
                        </div>
                    ))}

                    {/* TAMPILAN 1: KATALOG KELAS */}
                    {!myClass ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="mb-8">
                                <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight m-0">Hai, {auth.user.name.split(' ')[0]}! 👋</h1>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">Kamu terdaftar di {joinedClasses?.length || 0} kelas semester ini.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {joinedClasses?.map((item, idx) => (
                                    <div key={item.id}
                                        className={`relative overflow-hidden rounded-3xl p-6 flex flex-col justify-between h-48 border border-slate-100 dark:border-slate-700/60 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group ${CARD_GRADS[idx % CARD_GRADS.length]}`}
                                    >
                                        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/30 dark:bg-white/5 blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20 dark:border-slate-700/50">
                                                    {item.project_class?.nama_kelas}
                                                </span>
                                                <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider shrink-0 ml-2
                                                    ${item.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'}`}
                                                >
                                                    {item.status === 'pending' ? '⏳ Pending' : '✓ Aktif'}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white leading-tight mt-4 line-clamp-2" title={item.project_class?.mata_kuliah}>
                                                {item.project_class?.mata_kuliah}
                                            </h3>
                                        </div>
                                        <Link href={route('mahasiswa.kelas.show', item.project_class_id)}
                                            className="relative z-10 flex items-center justify-between bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-xl p-3 text-sm font-bold text-slate-800 dark:text-white hover:bg-white dark:hover:bg-slate-900 transition-colors group/btn">
                                            {item.status === 'pending' ? 'Cek Status' : 'Buka Ruang'}
                                            <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>

                    ) : isPending ? (
                        <div className="text-center py-20 px-4 max-w-md mx-auto animate-in zoom-in-95 duration-500">
                            <div className="w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner border 8 border-amber-50 dark:border-amber-500/10">⏳</div>
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-3">Sabar ya, {auth.user.name.split(' ')[0]}!</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
                                Akses ke <strong className="text-indigo-500 dark:text-indigo-400">{myClass.nama_kelas}</strong> sedang diproses. Dosen perlu memberikan approval manual ke akunmu.
                            </p>
                            <div className="inline-flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full py-2.5 px-5 shadow-sm">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                                </span>
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Menunggu Konfirmasi</span>
                            </div>
                            <div className="mt-10">
                                <Link href={route('mahasiswa.dashboard')} className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 uppercase tracking-widest transition-colors">
                                    ← Kembali ke Katalog
                                </Link>
                            </div>
                        </div>

                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Header Section */}
                            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mb-8">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <Link href={route('mahasiswa.dashboard')} className="flex items-center justify-center w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-indigo-500 transition-colors shadow-sm">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                                        </Link>
                                        <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm px-3 py-1 rounded-lg">{myClass.nama_kelas}</span>
                                    </div>
                                    <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-2">Halo, {auth.user.name.split(' ')[0]}! 👋</h1>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium m-0">
                                        {myGroup
                                            ? <>Tergabung di <strong className="text-indigo-500 dark:text-indigo-400">Tim {myGroup.nama_kelompok}</strong></>
                                            : 'AI sedang memetakan tim kamu...'}
                                    </p>
                                </div>

                                {myGroup && (
                                    <div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-1.5 shadow-sm overflow-x-auto hide-scrollbar">
                                        {[
                                            { k: 'overview', l: 'Overview' },
                                            { k: 'kanban', l: 'Kanban' },
                                            { k: 'logs', l: 'Logbook' },
                                            { k: 'peer', l: `Peer Review${pendingPeer > 0 ? ` (${pendingPeer})` : ''}` },
                                        ].map(t => (
                                            <button key={t.k} onClick={() => setTab(t.k)}
                                                className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${tab === t.k
                                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                                                    : 'bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                                    }`}>
                                                {t.l}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {!myGroup ? (
                                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-3xl p-16 text-center shadow-sm max-w-2xl mx-auto mt-10">
                                    <div className="text-6xl mb-6 animate-bounce">🤖</div>
                                    <h3 className="text-xl font-black text-slate-800 dark:text-white mb-3">AI Sedang Mengolah Data...</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
                                        Status kamu <span className="text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">Approved</span>. Saat ini sistem sedang bekerja menganalisis profil untuk membagi tim secara proporsional.
                                    </p>
                                </div>

                            ) : tab === 'overview' ? (
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-300">

                                    {/* LEFT COLUMN */}
                                    <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">

                                        {/* Stat cards */}
                                        <div className="grid grid-cols-3 gap-4">
                                            <StatCard label="Selesai" value={done} colorClass="text-blue-600 dark:text-blue-400" icon="✅" />
                                            <StatCard label="Berjalan" value={active} colorClass="text-amber-600 dark:text-amber-400" icon="🔥" />
                                            <StatCard label="Total" value={total} colorClass="text-emerald-600 dark:text-emerald-400" icon="📋" />
                                        </div>

                                        {/* Progress card */}
                                        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-stretch gap-6">
                                            <div className="relative shrink-0 flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl">
                                                <ProgressRing pct={pct} size={100} />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">{pct}%</span>
                                                </div>
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center text-center sm:text-left">
                                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">Progress Proyek Tim</p>

                                                <div className="flex items-center justify-center sm:justify-start gap-3 mb-4 group/title relative">
                                                    <p className="text-xl font-black text-slate-800 dark:text-white m-0">
                                                        {myGroup.project_title || 'Proyek Belum Berjudul'}
                                                    </p>
                                                    <button
                                                        onClick={openEditTitleModal}
                                                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-indigo-500 opacity-0 group-hover/title:opacity-100 transition-all"
                                                        title="Ganti Nama Proyek"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                    </button>
                                                </div>

                                                <div className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-full h-2.5 mb-2 overflow-hidden border border-slate-200 dark:border-slate-700">
                                                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full relative" style={{ width: `${pct}%`, transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                                                        <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                                                    </div>
                                                </div>

                                                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                                                    <strong className="text-slate-800 dark:text-slate-200">{done}</strong> dari <strong className="text-slate-800 dark:text-slate-200">{total}</strong> tugas utama selesai dikerjakan
                                                </p>
                                            </div>
                                        </div>

                                        {/* Active tasks */}
                                        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 shadow-sm">
                                            <div className="flex justify-between items-center mb-6">
                                                <p className="text-base font-black text-slate-800 dark:text-white m-0">Tugas Aktif</p>
                                                <button onClick={() => setTab('kanban')} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">Lihat Papan →</button>
                                            </div>

                                            <div className="flex flex-col gap-3">
                                                {tasks?.filter(t => t.status !== 'done').slice(0, 5).map(t => (
                                                    <div key={t.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-colors group">
                                                        <div className={`w-2 h-2 rounded-full shrink-0 ${t.status === 'in_progress' ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'bg-slate-300 dark:bg-slate-600'}`} />
                                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 flex-1 m-0 truncate">{t.title || t.judul}</p>

                                                        <span className={`hidden sm:inline-block text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg
                                                            ${t.status === 'in_progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}
                                                        >
                                                            {t.status === 'in_progress' ? 'Progress' : 'Backlog'}
                                                        </span>

                                                        <button onClick={() => handleNext(t.id)} className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-indigo-500 hover:border-indigo-500 flex items-center justify-center shrink-0 transition-all group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10">
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                                        </button>
                                                    </div>
                                                ))}

                                                {!tasks?.filter(t => t.status !== 'done').length && (
                                                    <div className="text-center py-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                                                        <span className="text-2xl block mb-2">🎉</span>
                                                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 m-0">Semua tugas beres, luar biasa!</p>
                                                    </div>
                                                )}
                                            </div>

                                            <button onClick={() => openTaskModal('backlog')} className="w-full mt-4 py-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors uppercase tracking-widest">
                                                + Tambah Tugas Baru
                                            </button>
                                        </div>

                                        {/* Recent logs */}
                                        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 shadow-sm">
                                            <div className="flex justify-between items-center mb-6">
                                                <p className="text-base font-black text-slate-800 dark:text-white m-0">Log Aktivitas Terbaru</p>
                                                <button onClick={() => setTab('logs')} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">Logbook Penuh →</button>
                                            </div>
                                            <div className="relative border-l-2 border-slate-100 dark:border-slate-700/50 ml-3 space-y-6">
                                                {logs?.slice(0, 5).map((log, i) => (
                                                    <div key={log.id || i} className="relative pl-6">
                                                        <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1.5 shadow-[0_0_0_4px_white] dark:shadow-[0_0_0_4px_#1e293b]" />
                                                        <p className="text-sm text-slate-700 dark:text-slate-300 m-0 leading-relaxed font-medium">{log.description || log.action}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">{log.created_at_human || ''}</p>
                                                    </div>
                                                ))}
                                                {!logs?.length && <p className="text-sm font-medium text-slate-500 dark:text-slate-400 pl-6 m-0">Belum ada jejak aktivitas di logbook.</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* RIGHT SIDEBAR */}
                                    <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">

                                        {/* Team members */}
                                        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 shadow-sm">
                                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-5">Tim Divisi ({members.length} Orang)</p>
                                            <div className="flex flex-col gap-4">
                                                {members.map((m, i) => (
                                                    <div key={m.id || i} className="flex items-center gap-3">
                                                        <Av name={m.name || m.user?.name || '?'} size={40} idx={i} />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100 m-0 truncate">{m.name || m.user?.name}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 m-0 uppercase tracking-widest mt-0.5">
                                                                {(m.id || m.user_id) === auth.user.id ? 'Kamu' : 'Anggota'}
                                                            </p>
                                                        </div>
                                                        <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_6px_rgba(16,185,129,0.5)]" title="Active" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Peer review summary */}
                                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden">
                                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />

                                            <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest mb-4">Agenda Peer Review</p>
                                            <div className="flex items-end gap-2 mb-2">
                                                <span className="text-5xl font-black leading-none tracking-tighter">
                                                    {(peerReviews?.length || 0) - pendingPeer}
                                                </span>
                                                <span className="text-sm font-bold text-indigo-200 mb-1">/ {peerReviews?.length || 0} dinilai</span>
                                            </div>

                                            {pendingPeer > 0 && (
                                                <div className="bg-white/20 backdrop-blur-md rounded-xl px-3 py-2 mt-4 border border-white/20">
                                                    <p className="text-[11px] font-bold text-white m-0 flex items-center gap-1.5">
                                                        <svg className="w-3.5 h-3.5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                                        {pendingPeer} rekan menunggu nilaimu!
                                                    </p>
                                                </div>
                                            )}

                                            <button onClick={() => setTab('peer')} className="w-full mt-6 py-3 rounded-xl bg-white text-indigo-600 text-xs font-black uppercase tracking-widest shadow-md hover:bg-slate-50 transition-colors">
                                                {pendingPeer > 0 ? 'Mulai Menilai →' : 'Lihat Rekap →'}
                                            </button>
                                        </div>

                                        {/* Score received */}
                                        {myPeerScore !== null && myPeerScore !== undefined && (
                                            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-6 shadow-sm">
                                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Nilai Kinerja Kamu</p>
                                                <div className="flex items-end gap-1 mb-1">
                                                    <span className="text-4xl font-black text-emerald-500 leading-none tracking-tighter">{myPeerScore}</span>
                                                    <span className="text-lg font-bold text-slate-300 dark:text-slate-600">/100</span>
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">
                                                    Rata-rata dari {myPeerReviewedCount}/{myPeerTotalReviewers} penilai
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            ) : tab === 'kanban' ? (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <KanbanBoard
                                        tasks={tasks}
                                        myGroup={myGroup}
                                        openModal={openTaskModal}
                                        onNext={handleNext}
                                        handleDelete={confirmDelete}
                                        updateStatus={handleUpdateStatus}
                                        onEdit={handleEditTask}
                                    />
                                </div>

                            ) : tab === 'logs' ? (
                                <div className="animate-in fade-in duration-300">
                                    <ActivityLogs logs={logs} />
                                </div>

                            ) : tab === 'peer' ? (
                                <div className="animate-in fade-in duration-300">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                                        <div>
                                            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Penilaian Teman Sejawat (Peer)</h3>
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 m-0 max-w-lg">
                                                Evaluasi performa rekan satu tim secara jujur dan objektif. Penilaian kamu bersifat rahasia (anonim) dan akan berkontribusi pada nilai akhir mereka.
                                            </p>
                                        </div>
                                        {pendingPeer > 0 && (
                                            <span className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold px-4 py-2 rounded-xl uppercase tracking-wider shrink-0 shadow-sm">
                                                <svg className="w-4 h-4 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                {pendingPeer} Belum Dinilai
                                            </span>
                                        )}
                                    </div>

                                    {peerReviews?.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                            {peerReviews.map(r => (
                                                <PeerCard key={r.id} review={r} onRate={handlePeerRate} myId={auth.user.id} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 px-4">
                                            <div className="text-6xl mb-4">📊</div>
                                            <h4 className="text-lg font-black text-slate-800 dark:text-white mb-2">Sesi Penilaian Belum Dibuka</h4>
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 m-0">
                                                Dosen belum mengaktifkan sesi peer review untuk kelas ini. Cek lagi nanti!
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>

            {/* MODALS TUGAS */}
            {isTask && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsTask(false)} />
                    <div className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-700 animate-in zoom-in-95 duration-200`}>
                        <button onClick={() => setIsTask(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 dark:hover:text-white"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>

                        <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">{taskForm.data.id ? 'Edit Tugas' : 'Tugas Baru'}</h3>
                        <p className="text-sm text-slate-500 mb-6">Lengkapi rincian tugas kelompok kamu.</p>

                        <form onSubmit={submitTask} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Judul Tugas</label>
                                <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Input judul..." value={taskForm.data.title} onChange={e => taskForm.setData('title', e.target.value)} required />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Deskripsi Detail</label>
                                <textarea className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[100px] resize-none" placeholder="Tulis rincian tugas..." value={taskForm.data.description} onChange={e => taskForm.setData('description', e.target.value)} />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tautan Pendukung (Opsional)</label>
                                <input type="url" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="https://..." value={taskForm.data.link} onChange={e => taskForm.setData('link', e.target.value)} />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Manajer Lampiran</label>
                                {taskForm.data.existing_files.length > 0 && (
                                    <div className="space-y-2 mb-3">
                                        {taskForm.data.existing_files.map((file, i) => (
                                            !taskForm.data.remove_files.includes(file) && (
                                                <div key={i} className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl">
                                                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 truncate pr-4">✓ File Tersimpan {i + 1}</span>
                                                    <div className="flex gap-3 shrink-0">
                                                        <a href={`/storage/${file}`} target="_blank" rel="noreferrer" className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase hover:underline">Buka ↗</a>
                                                        <button type="button" onClick={() => removeExistingFile(file)} className="text-[10px] font-black text-rose-500 dark:text-rose-400 uppercase hover:underline">Hapus</button>
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                )}
                                {taskForm.data.attachment.length > 0 && (
                                    <div className="space-y-2 mb-3">
                                        {taskForm.data.attachment.map((file, i) => (
                                            <div key={i} className="flex justify-between items-center p-3 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl">
                                                <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 truncate pr-4">📎 {file.name}</span>
                                                <button type="button" onClick={() => removeNewFile(i)} className="text-[10px] font-black text-rose-500 dark:text-rose-400 uppercase shrink-0 hover:underline">Batal</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="relative w-full bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center hover:border-indigo-400 transition-colors cursor-pointer group">
                                    <input type="file" multiple onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                    <div className="flex items-center justify-center gap-2 text-slate-400 group-hover:text-indigo-600 transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                                        <p className="text-xs font-bold m-0">Tambah Lampiran Baru</p>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={taskForm.processing} className="w-full mt-2 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl py-4 text-xs font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-50">
                                {taskForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL EDIT NAMA PROYEK (DENGAN DETEKTIF ERROR) */}
            {isEditTitle && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsEditTitle(false)} />
                    <div className="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-700 animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">Ganti Nama Proyek</h3>
                        <p className="text-xs text-slate-500 mb-6">Nama ini akan dilihat oleh Dosen dan seluruh anggota tim.</p>

                        <form onSubmit={submitProjectTitle}>
                            <div className="mb-6">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nama Proyek Baru</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    value={projectForm.data.project_title}
                                    onChange={e => projectForm.setData('project_title', e.target.value)}
                                    required
                                />
                                {projectForm.errors.project_title && (
                                    <p className="text-rose-500 text-xs font-bold mt-2">{projectForm.errors.project_title}</p>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button type="button" onClick={() => setIsEditTitle(false)} className="flex-1 py-3 text-xs font-black uppercase text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">Batal</button>
                                <button
                                    type="submit"
                                    disabled={projectForm.processing}
                                    className="flex-1 bg-indigo-600 text-white rounded-xl py-3 text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/30 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {projectForm.processing ? 'Saving...' : 'Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}