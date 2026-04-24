import React, { useState } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ActivityLogs from './Components/ActivityLogs';
import KanbanBoard from './Components/KanbanBoard';

/* ─── Design tokens ───────────────────────────────────────────────────────── */
const AVATAR_BG = ['#fce7f3', '#dbeafe', '#d1fae5', '#fef3c7', '#ede9fe', '#fee2e2'];
const CARD_GRADS = [
    'linear-gradient(135deg,#fce7f3,#fbcfe8)',
    'linear-gradient(135deg,#dbeafe,#bfdbfe)',
    'linear-gradient(135deg,#d1fae5,#a7f3d0)',
    'linear-gradient(135deg,#fef3c7,#fde68a)',
    'linear-gradient(135deg,#ede9fe,#ddd6fe)',
];

/* ─── Micro-components ────────────────────────────────────────────────────── */
function Av({ name = '?', size = 36, idx = 0 }) {
    return (
        <div style={{
            width: size, height: size, borderRadius: Math.round(size * 0.33),
            background: AVATAR_BG[idx % AVATAR_BG.length],
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: Math.round(size * 0.38), fontWeight: 800, color: '#1e293b', flexShrink: 0,
        }}>{name.charAt(0).toUpperCase()}</div>
    );
}

function StatCard({ label, value, bg, icon }) {
    return (
        <div style={{ background: bg, borderRadius: 18, padding: '18px 20px', flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</span>
                <span style={{ fontSize: 18 }}>{icon}</span>
            </div>
            <span style={{ fontSize: 30, fontWeight: 800, color: '#1e293b', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</span>
        </div>
    );
}

function ProgressRing({ pct = 0, size = 88 }) {
    const r = (size - 10) / 2;
    const circ = 2 * Math.PI * r;
    return (
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={8} />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#6366f1" strokeWidth={8}
                strokeDasharray={`${(pct / 100) * circ} ${circ}`} strokeLinecap="round"
                style={{ transition: 'stroke-dasharray .6s ease' }} />
        </svg>
    );
}

/**
 * PeerCard — Kartu peer review untuk satu pasangan reviewer→reviewee
 * 
 * Props yang dipakai dari backend (peer_reviews table):
 *   review.id, review.reviewer_id, review.reviewee_id, review.score,
 *   review.feedback, review.reviewee_name
 * 
 * Mahasiswa hanya melihat review yang ia BERI (reviewer_id === myId).
 * Jika score masih null → tampilkan tombol rating 1-100.
 * Jika score sudah ada → tampilkan badge nilai (readonly).
 */
function PeerCard({ review, onRate, myId }) {
    const [hov, setHov] = useState(null);
    // review.score dari DB bisa null (belum diisi) atau integer
    const hasScore = review.score !== null && review.score !== undefined;

    return (
        <div style={{ background: 'white', borderRadius: 16, padding: '16px 18px', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: hasScore ? 0 : 12 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <Av name={review.reviewee_name || '?'} size={32} idx={review.reviewee_id % 6} />
                    <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', margin: 0 }}>{review.reviewee_name || 'Anggota'}</p>
                        <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {hasScore ? 'Sudah dinilai' : 'Menunggu penilaianmu'}
                        </p>
                    </div>
                </div>
                {hasScore ? (
                    <div style={{
                        borderRadius: 10, padding: '4px 14px',
                        background: review.score >= 75 ? '#dcfce7' : review.score >= 50 ? '#fef9c3' : '#fee2e2',
                    }}>
                        <span style={{
                            fontSize: 16, fontWeight: 800,
                            color: review.score >= 75 ? '#16a34a' : review.score >= 50 ? '#ca8a04' : '#dc2626'
                        }}>
                            {review.score}
                        </span>
                        <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>/100</span>
                    </div>
                ) : (
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b', background: '#fef3c7', padding: '4px 10px', borderRadius: 8, textTransform: 'uppercase' }}>
                        Pending
                    </span>
                )}
            </div>

            {/* Rating buttons — hanya muncul jika belum ada skor */}
            {!hasScore && (
                <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Beri Nilai (klik skor)</p>
                    <div style={{ display: 'flex', gap: 4 }}>
                        {[20, 40, 60, 80, 100].map(s => (
                            <button key={s}
                                onMouseEnter={() => setHov(s)} onMouseLeave={() => setHov(null)}
                                onClick={() => onRate(review.id, s)}
                                style={{
                                    flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                                    background: hov !== null && s <= hov ? '#6366f1' : '#f1f5f9',
                                    color: hov !== null && s <= hov ? 'white' : '#64748b',
                                    fontSize: 12, fontWeight: 700, transition: 'all .15s', fontFamily: 'inherit',
                                }}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {review.feedback && (
                <p style={{ fontSize: 11, color: '#64748b', fontStyle: 'italic', marginTop: 10, borderTop: '1px solid #f8fafc', paddingTop: 8, marginBottom: 0 }}>
                    "{review.feedback}"
                </p>
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

    const currentRel = joinedClasses?.find(i => i.project_class_id === myClass?.id);
    const isPending = currentRel?.status === 'pending';

    const joinForm = useForm({ invite_code: '' });
    const taskForm = useForm({
        group_id: myGroup?.id, title: '', status: 'backlog', attachment: null, link: '',
    });

    /* ── Handlers ────────────────────────────────────────────────────────── */
    const submitJoin = e => {
        e.preventDefault();
        joinForm.post(route('mahasiswa.join-class'), {
            onSuccess: () => { setIsJoin(false); joinForm.reset(); },
        });
    };

    const submitTask = e => {
        e.preventDefault();
        taskForm.post(route('mahasiswa.task.store'), {
            forceFormData: true,
            onSuccess: () => { setIsTask(false); taskForm.reset('title', 'attachment', 'link'); },
        });
    };

    const confirmDelete = id => {
        if (confirm('Hapus tugas ini?')) taskForm.delete(route('mahasiswa.task.delete', id));
    };

    const openTaskModal = status => {
        taskForm.clearErrors();
        taskForm.setData({ group_id: myGroup?.id, title: '', status, attachment: null, link: '' });
        setIsTask(true);
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

    /**
     * Rate peer — panggil route mahasiswa.peer.rate dengan score (dan opsional feedback)
     */
    const handlePeerRate = (rid, score) => {
        router.post(route('mahasiswa.peer.rate', rid), { score }, { preserveScroll: true });
    };

    /* ── Computed ─────────────────────────────────────────────────────────── */
    const done = tasks?.filter(t => t.status === 'done').length || 0;
    const active = tasks?.filter(t => t.status === 'in_progress').length || 0;
    const total = tasks?.length || 0;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const members = myGroup?.members || [];

    // Berapa peerReview yang belum diisi oleh user ini?
    const pendingPeer = peerReviews?.filter(r => r.score === null).length || 0;

    /* ── Shared style tokens ──────────────────────────────────────────────── */
    const S = {
        wrap: { fontFamily: "'Plus Jakarta Sans',sans-serif", background: '#f4f6fb', minHeight: '100vh', padding: '24px 0 60px' },
        inner: { maxWidth: 1180, margin: '0 auto', padding: '0 24px' },
        white: { background: 'white', borderRadius: 20, border: '1px solid #f0f0f4', padding: 20 },
        lbl: { fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 },
        h1: { fontSize: 26, fontWeight: 800, color: '#1e293b', margin: 0, letterSpacing: '-0.02em' },
        tab: active => ({
            padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
            transition: 'all .2s', fontFamily: 'inherit',
            background: active ? '#6366f1' : 'transparent',
            color: active ? 'white' : '#94a3b8',
        }),
        input: {
            width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0',
            borderRadius: 12, padding: '11px 14px', fontSize: 14, fontWeight: 500,
            color: '#1e293b', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
        },
        btn: (bg, color, shadow) => ({
            padding: '12px', borderRadius: 12, background: bg, color,
            fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', transition: 'all .2s',
            boxShadow: shadow || 'none',
        }),
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                    <div>
                        <h2 style={{ fontWeight: 800, fontSize: 18, color: '#1e293b', margin: 0 }}>
                            Ruang <span style={{ color: '#6366f1' }}>Kelas.</span>
                        </h2>
                        <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                            Portal Mahasiswa
                        </p>
                    </div>
                    {!myClass && (
                        <button onClick={() => setIsJoin(true)} style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            background: '#6366f1', color: 'white', padding: '9px 18px', borderRadius: 12,
                            fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(99,102,241,.35)', fontFamily: 'inherit',
                        }}>+ Gabung Kelas</button>
                    )}
                </div>
            }
        >
            <Head title={myClass ? `Kelas: ${myClass.nama_kelas}` : 'Katalog Kelas'} />
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

            <div style={S.wrap}>
                <div style={S.inner}>

                    {/* ── NUDGE ALERTS ──────────────────────────────────────── */}
                    {nudges?.filter(n => !n.is_read).map(nudge => (
                        <div key={nudge.id} style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 16, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                <div style={{ width: 32, height: 32, borderRadius: 10, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <p style={{ fontSize: 10, fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>Peringatan Dosen</p>
                                    <p style={{ fontSize: 13, color: '#7c3aed', margin: 0, fontWeight: 500 }}>{nudge.message}</p>
                                </div>
                            </div>
                            <Link href={route('mahasiswa.colek.read', { id: nudge.id })} method="post" as="button" preserveScroll
                                style={{ padding: '8px 14px', background: '#ef4444', color: 'white', borderRadius: 10, fontSize: 11, fontWeight: 700, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}>
                                Saya Mengerti
                            </Link>
                        </div>
                    ))}

                    {/* ══════════════════════════════════════════════
                        TAMPILAN 1: KATALOG KELAS (myClass === null)
                    ══════════════════════════════════════════════ */}
                    {!myClass ? (
                        <div>
                            <div style={{ marginBottom: 24 }}>
                                <h1 style={S.h1}>Hai, {auth.user.name.split(' ')[0]}! 👋</h1>
                                <p style={{ fontSize: 14, color: '#64748b', margin: '4px 0 0', fontWeight: 500 }}>
                                    Kamu terdaftar di {joinedClasses?.length || 0} kelas.
                                </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
                                {joinedClasses?.map((item, idx) => (
                                    <div key={item.id}
                                        style={{ background: CARD_GRADS[idx % CARD_GRADS.length], borderRadius: 20, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 176, position: 'relative', overflow: 'hidden', transition: 'transform .2s', cursor: 'default' }}
                                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                        <div style={{ position: 'absolute', right: -16, bottom: -16, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,.3)', pointerEvents: 'none' }} />
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(0,0,0,.5)', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(255,255,255,.5)', padding: '3px 8px', borderRadius: 6 }}>
                                                    {item.project_class?.mata_kuliah}
                                                </span>
                                                <span style={{
                                                    fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 6, textTransform: 'uppercase',
                                                    background: item.status === 'pending' ? '#fef3c7' : '#dcfce7',
                                                    color: item.status === 'pending' ? '#b45309' : '#15803d'
                                                }}>
                                                    {item.status === 'pending' ? '⏳ Pending' : '✓ Aktif'}
                                                </span>
                                            </div>
                                            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#1e293b', margin: '10px 0 0', lineHeight: 1.25, letterSpacing: '-0.01em' }}>
                                                {item.project_class?.nama_kelas}
                                            </h3>
                                        </div>
                                        <Link href={route('mahasiswa.kelas.show', item.project_class_id)}
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,.65)', borderRadius: 12, padding: '9px 13px', textDecoration: 'none', color: '#1e293b', fontSize: 12, fontWeight: 700, backdropFilter: 'blur(4px)' }}>
                                            {item.status === 'pending' ? 'Cek Status' : 'Buka Ruang'}
                                            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                        </Link>
                                    </div>
                                ))}

                                {/* + Join card */}
                                <div onClick={() => setIsJoin(true)}
                                    style={{ border: '2px dashed #c7d2fe', background: 'white', borderRadius: 20, height: 176, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', transition: 'all .2s' }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = '#f5f3ff'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#c7d2fe'; e.currentTarget.style.background = 'white'; }}>
                                    <div style={{ width: 42, height: 42, borderRadius: 14, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#6366f1" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                                    </div>
                                    <p style={{ fontSize: 13, fontWeight: 700, color: '#6366f1', margin: 0 }}>Gabung Kelas Baru</p>
                                    <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Masukkan kode dari dosen</p>
                                </div>
                            </div>
                        </div>

                    ) : isPending ? (
                        /* ══════════════════════════════════════════════
                            TAMPILAN: PENDING APPROVAL
                        ══════════════════════════════════════════════ */
                        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                            <div style={{ width: 76, height: 76, borderRadius: 24, background: '#fef9c3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, margin: '0 auto 20px' }}>⏳</div>
                            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1e293b', margin: '0 0 10px' }}>
                                Sabar ya, {auth.user.name.split(' ')[0]}!
                            </h2>
                            <p style={{ color: '#64748b', fontSize: 14, maxWidth: 380, margin: '0 auto 22px', lineHeight: 1.7 }}>
                                Akses ke <strong style={{ color: '#6366f1' }}>{myClass.nama_kelas}</strong> sedang diproses. Dosen perlu memberikan approval manual.
                            </p>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '9px 16px' }}>
                                <div style={{ width: 7, height: 7, background: '#f59e0b', borderRadius: '50%' }}></div>
                                <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Menunggu Konfirmasi Dosen</span>
                            </div>
                            <br />
                            <Link href={route('mahasiswa.dashboard')} style={{ display: 'inline-block', marginTop: 18, fontSize: 12, fontWeight: 700, color: '#94a3b8', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                                ← Kembali ke Katalog
                            </Link>
                        </div>

                    ) : (
                        /* ══════════════════════════════════════════════
                            TAMPILAN: DETAIL KELAS (APPROVED)
                        ══════════════════════════════════════════════ */
                        <div>
                            {/* Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                        <Link href={route('mahasiswa.dashboard')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 10, background: 'white', border: '1px solid #e2e8f0', textDecoration: 'none' }}>
                                            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#64748b" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                                        </Link>
                                        <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{myClass.nama_kelas}</span>
                                    </div>
                                    <h1 style={S.h1}>Halo, {auth.user.name.split(' ')[0]}! 👋</h1>
                                    <p style={{ fontSize: 14, color: '#64748b', margin: '4px 0 0', fontWeight: 500 }}>
                                        {myGroup
                                            ? <>Tim <strong style={{ color: '#6366f1' }}>{myGroup.nama_kelompok}</strong> · {myGroup.project_title || 'Proyek Kelompok'}</>
                                            : 'AI sedang memetakan tim kamu...'}
                                    </p>
                                </div>

                                {myGroup && (
                                    <div style={{ display: 'flex', background: 'white', border: '1px solid #e2e8f0', borderRadius: 14, padding: 4, gap: 2 }}>
                                        {[
                                            { k: 'overview', l: 'Overview' },
                                            { k: 'kanban', l: 'Kanban' },
                                            { k: 'logs', l: 'Logbook' },
                                            { k: 'peer', l: `Peer Review${pendingPeer > 0 ? ` (${pendingPeer})` : ''}` },
                                        ].map(t => (
                                            <button key={t.k} onClick={() => setTab(t.k)} style={S.tab(tab === t.k)}>{t.l}</button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {!myGroup ? (
                                /* AI Plotting state */
                                <div style={{ textAlign: 'center', padding: '60px 24px', ...S.white }}>
                                    <div style={{ fontSize: 46, marginBottom: 12 }}>🤖</div>
                                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#1e293b', margin: '0 0 8px' }}>AI Sedang Mengolah Data...</h3>
                                    <p style={{ color: '#64748b', fontSize: 13, maxWidth: 340, margin: '0 auto' }}>
                                        Status <span style={{ color: '#22c55e', fontWeight: 700 }}>Approved</span>. Tunggu AI membagi tim berdasarkan performamu!
                                    </p>
                                </div>

                            ) : tab === 'overview' ? (
                                /* ─────────────────────────────────────────────
                                   OVERVIEW TAB
                                ───────────────────────────────────────────── */
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, alignItems: 'start' }}>

                                    {/* LEFT COLUMN */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                                        {/* Stat cards */}
                                        <div style={{ display: 'flex', gap: 12 }}>
                                            <StatCard label="Selesai" value={done} bg="#dbeafe" icon="✅" />
                                            <StatCard label="Berjalan" value={active} bg="#fce7f3" icon="🔥" />
                                            <StatCard label="Total" value={total} bg="#d1fae5" icon="📋" />
                                        </div>

                                        {/* Progress card */}
                                        <div style={{ ...S.white, display: 'flex', alignItems: 'center', gap: 20 }}>
                                            <div style={{ position: 'relative', flexShrink: 0 }}>
                                                <ProgressRing pct={pct} size={88} />
                                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span style={{ fontSize: 16, fontWeight: 800, color: '#6366f1' }}>{pct}%</span>
                                                </div>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 4px' }}>Progress Proyek</p>
                                                <p style={{ fontSize: 17, fontWeight: 800, color: '#1e293b', margin: '0 0 12px', letterSpacing: '-0.01em' }}>{myGroup.project_title || 'Proyek Kelompok'}</p>
                                                <div style={{ background: '#f1f5f9', borderRadius: 100, height: 6, overflow: 'hidden' }}>
                                                    <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: 100, transition: 'width .6s ease' }} />
                                                </div>
                                                <p style={{ fontSize: 11, color: '#94a3b8', margin: '6px 0 0', fontWeight: 600 }}>{done} dari {total} tugas selesai</p>
                                            </div>
                                        </div>

                                        {/* Active tasks */}
                                        <div style={S.white}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                                                <p style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', margin: 0 }}>Tugas Aktif</p>
                                                <button onClick={() => setTab('kanban')} style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Lihat Semua →</button>
                                            </div>
                                            {tasks?.filter(t => t.status !== 'done').slice(0, 5).map(t => (
                                                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: '1px solid #f8fafc' }}>
                                                    <div style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: t.status === 'in_progress' ? '#6366f1' : '#94a3b8' }} />
                                                    <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', flex: 1, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title || t.judul}</p>
                                                    <span style={{
                                                        fontSize: 10, fontWeight: 700, textTransform: 'uppercase', padding: '3px 8px', borderRadius: 6,
                                                        background: t.status === 'in_progress' ? '#dbeafe' : '#f1f5f9',
                                                        color: t.status === 'in_progress' ? '#2563eb' : '#64748b'
                                                    }}>
                                                        {t.status === 'in_progress' ? 'Progress' : 'Backlog'}
                                                    </span>
                                                    <button onClick={() => handleNext(t.id)} style={{ width: 26, height: 26, borderRadius: 8, background: '#f1f5f9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                        <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="#64748b" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                                    </button>
                                                </div>
                                            ))}
                                            {!tasks?.filter(t => t.status !== 'done').length && (
                                                <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', padding: '16px 0', margin: 0 }}>Semua tugas selesai 🎉</p>
                                            )}
                                            <button onClick={() => openTaskModal('backlog')} style={{ width: '100%', marginTop: 12, padding: '9px', borderRadius: 10, border: '1.5px dashed #c7d2fe', background: 'none', color: '#6366f1', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                                                + Tambah Tugas
                                            </button>
                                        </div>

                                        {/* Recent logs */}
                                        <div style={S.white}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                                                <p style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', margin: 0 }}>Aktivitas Terbaru</p>
                                                <button onClick={() => setTab('logs')} style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Semua →</button>
                                            </div>
                                            {logs?.slice(0, 5).map((log, i) => (
                                                <div key={log.id || i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', marginTop: 5, flexShrink: 0 }} />
                                                    <div>
                                                        <p style={{ fontSize: 12, color: '#475569', margin: 0, lineHeight: 1.5 }}>{log.description || log.action}</p>
                                                        <p style={{ fontSize: 10, color: '#94a3b8', margin: '2px 0 0', fontWeight: 600 }}>{log.created_at_human || ''}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {!logs?.length && <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Belum ada aktivitas.</p>}
                                        </div>
                                    </div>

                                    {/* RIGHT SIDEBAR */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                                        {/* Team members */}
                                        <div style={S.white}>
                                            <p style={{ ...S.lbl, marginBottom: 14 }}>Anggota Tim · {members.length} orang</p>
                                            {members.map((m, i) => (
                                                <div key={m.id || i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < members.length - 1 ? 10 : 0 }}>
                                                    <Av name={m.name || m.user?.name || '?'} size={34} idx={i} />
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <p style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name || m.user?.name}</p>
                                                        <p style={{ fontSize: 10, color: '#94a3b8', margin: 0, fontWeight: 600 }}>
                                                            {(m.id || m.user_id) === auth.user.id ? 'Kamu' : 'Anggota'}
                                                        </p>
                                                    </div>
                                                    <div style={{ width: 7, height: 7, background: '#22c55e', borderRadius: '50%' }} />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Peer review summary */}
                                        <div style={{ background: 'linear-gradient(135deg,#ede9fe,#ddd6fe)', borderRadius: 20, padding: 18 }}>
                                            <p style={{ ...S.lbl, color: 'rgba(0,0,0,.4)', marginBottom: 10 }}>Peer Review</p>
                                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 6 }}>
                                                <span style={{ fontSize: 30, fontWeight: 800, color: '#4c1d95', lineHeight: 1 }}>
                                                    {(peerReviews?.length || 0) - pendingPeer}
                                                </span>
                                                <span style={{ fontSize: 14, color: '#6d28d9', fontWeight: 600, marginBottom: 3 }}>/ {peerReviews?.length || 0} selesai</span>
                                            </div>
                                            {pendingPeer > 0 && (
                                                <p style={{ fontSize: 11, color: '#7c3aed', fontWeight: 600, margin: '0 0 10px' }}>
                                                    ⚠ {pendingPeer} menunggu penilaianmu
                                                </p>
                                            )}
                                            <button onClick={() => setTab('peer')} style={{ width: '100%', padding: '9px', borderRadius: 10, background: 'rgba(255,255,255,.55)', border: 'none', fontSize: 12, fontWeight: 700, color: '#4c1d95', cursor: 'pointer', fontFamily: 'inherit' }}>
                                                {pendingPeer > 0 ? 'Nilai Sekarang →' : 'Lihat Detail →'}
                                            </button>
                                        </div>

                                        {/* Score received (dari myPeerScore props) */}
                                        {myPeerScore !== null && myPeerScore !== undefined && (
                                            <div style={{ background: 'linear-gradient(135deg,#d1fae5,#a7f3d0)', borderRadius: 20, padding: 18 }}>
                                                <p style={{ ...S.lbl, color: 'rgba(0,0,0,.4)', marginBottom: 8 }}>Nilai Peer Kamu</p>
                                                <p style={{ fontSize: 34, fontWeight: 800, color: '#065f46', margin: '0 0 2px', lineHeight: 1 }}>
                                                    {myPeerScore}
                                                    <span style={{ fontSize: 16, fontWeight: 600, color: '#059669' }}>/100</span>
                                                </p>
                                                <p style={{ fontSize: 11, color: '#047857', margin: 0, fontWeight: 600 }}>
                                                    Rata-rata dari {myPeerReviewedCount}/{myPeerTotalReviewers} penilai
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            ) : tab === 'kanban' ? (
                                <KanbanBoard tasks={tasks} myGroup={myGroup} openModal={openTaskModal} onNext={handleNext} handleDelete={confirmDelete} />

                            ) : tab === 'logs' ? (
                                <ActivityLogs logs={logs} />

                            ) : tab === 'peer' ? (
                                /* ─────────────────────────────────────────────
                                   PEER REVIEW TAB
                                   Hanya menampilkan review yang user INI berikan
                                   (reviewer_id === auth.user.id) — sudah difilter di controller
                                ───────────────────────────────────────────── */
                                <div>
                                    <div style={{ ...S.white, marginBottom: 14 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                                            <div>
                                                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', margin: '0 0 4px' }}>Peer Review Anggota Tim</h3>
                                                <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
                                                    Nilai kontribusi rekan secara objektif. Penilaian bersifat anonim.
                                                </p>
                                            </div>
                                            {pendingPeer > 0 && (
                                                <span style={{ fontSize: 11, fontWeight: 700, background: '#fef3c7', color: '#b45309', padding: '6px 12px', borderRadius: 10, border: '1px solid #fde68a' }}>
                                                    ⏳ {pendingPeer} belum dinilai
                                                </span>
                                            )}
                                        </div>

                                        {peerReviews?.length > 0 ? (
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
                                                {peerReviews.map(r => (
                                                    <PeerCard key={r.id} review={r} onRate={handlePeerRate} myId={auth.user.id} />
                                                ))}
                                            </div>
                                        ) : (
                                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                                <div style={{ fontSize: 36, marginBottom: 8 }}>📊</div>
                                                <p style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', margin: 0 }}>
                                                    Peer review belum dibuka oleh dosen.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Score received aggregate */}
                                    {myPeerScore !== null && myPeerScore !== undefined && (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
                                            <div style={{ background: 'linear-gradient(135deg,#d1fae5,#a7f3d0)', borderRadius: 20, padding: 20 }}>
                                                <p style={{ ...S.lbl, color: 'rgba(0,0,0,.4)', marginBottom: 8 }}>Nilai Peer Kamu</p>
                                                <p style={{ fontSize: 36, fontWeight: 800, color: '#065f46', margin: '0 0 2px', lineHeight: 1 }}>
                                                    {myPeerScore}
                                                    <span style={{ fontSize: 16, fontWeight: 600, color: '#059669' }}>/100</span>
                                                </p>
                                                <p style={{ fontSize: 11, color: '#047857', fontWeight: 600, margin: 0 }}>Rata-rata</p>
                                            </div>
                                            <div style={{ background: 'linear-gradient(135deg,#ede9fe,#ddd6fe)', borderRadius: 20, padding: 20 }}>
                                                <p style={{ ...S.lbl, color: 'rgba(0,0,0,.4)', marginBottom: 8 }}>Sudah Dinilai</p>
                                                <p style={{ fontSize: 36, fontWeight: 800, color: '#4c1d95', margin: '0 0 2px', lineHeight: 1 }}>
                                                    {myPeerReviewedCount}
                                                    <span style={{ fontSize: 16, fontWeight: 600, color: '#6d28d9' }}>/{myPeerTotalReviewers}</span>
                                                </p>
                                                <p style={{ fontSize: 11, color: '#6d28d9', fontWeight: 600, margin: 0 }}>penilai yang mengisi</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════
                MODALS
            ═══════════════════════════════════════════════════════ */}
            {[
                {
                    show: isJoin, close: () => setIsJoin(false), maxW: 380,
                    body: (
                        <>
                            <div style={{ width: 46, height: 46, borderRadius: 15, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                                <svg width="21" height="21" fill="none" viewBox="0 0 24 24" stroke="#6366f1" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                            </div>
                            <h3 style={{ fontSize: 19, fontWeight: 800, color: '#1e293b', margin: '0 0 4px' }}>Gabung Kelas</h3>
                            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 18px' }}>Masukkan kode 6 karakter dari dosen</p>
                            <form onSubmit={submitJoin}>
                                <input type="text" value={joinForm.data.invite_code}
                                    onChange={e => joinForm.setData('invite_code', e.target.value.toUpperCase())}
                                    maxLength="6" required
                                    style={{ ...S.input, textAlign: 'center', fontSize: 24, fontWeight: 800, letterSpacing: '0.4em', marginBottom: 10 }}
                                    placeholder="AABBCC" />
                                {joinForm.errors.invite_code && <p style={{ color: '#ef4444', fontSize: 12, margin: '0 0 10px' }}>{joinForm.errors.invite_code}</p>}
                                <button type="submit" disabled={joinForm.processing} style={{ ...S.btn('#6366f1', 'white', '0 4px 14px rgba(99,102,241,.35)'), width: '100%', fontSize: 14 }}>
                                    {joinForm.processing ? 'Memproses...' : 'Gabung Sekarang'}
                                </button>
                            </form>
                        </>
                    ),
                },
                {
                    show: isTask, close: () => setIsTask(false), maxW: 500,
                    body: (
                        <>
                            <h3 style={{ fontSize: 19, fontWeight: 800, color: '#1e293b', margin: '0 0 4px' }}>Tugas Baru</h3>
                            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 18px' }}>Tambahkan ke papan kanban tim</p>
                            <form onSubmit={submitTask} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {[
                                    { label: 'Judul Tugas', el: <input type="text" style={S.input} placeholder="Misal: Slicing UI Dashboard..." value={taskForm.data.title} onChange={e => taskForm.setData('title', e.target.value)} autoFocus /> },
                                    { label: 'Tautan (Opsional)', el: <input type="url" style={S.input} placeholder="https://..." value={taskForm.data.link} onChange={e => taskForm.setData('link', e.target.value)} /> },
                                ].map(f => (
                                    <div key={f.label}>
                                        <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>{f.label}</label>
                                        {f.el}
                                    </div>
                                ))}
                                <div>
                                    <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Lampiran</label>
                                    <div style={{ border: '2px dashed #c7d2fe', borderRadius: 12, padding: 14, textAlign: 'center', background: '#f5f3ff', position: 'relative', cursor: 'pointer' }}>
                                        <input type="file" onChange={e => taskForm.setData('attachment', e.target.files[0])} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
                                        <p style={{ fontSize: 12, fontWeight: 600, color: taskForm.data.attachment ? '#6366f1' : '#94a3b8', margin: 0 }}>
                                            {taskForm.data.attachment ? `📎 ${taskForm.data.attachment.name}` : 'Pilih file atau seret ke sini'}
                                        </p>
                                    </div>
                                </div>
                                <button type="submit" disabled={taskForm.processing} style={{ ...S.btn('#1e293b', 'white'), padding: '12px', marginTop: 4 }}>
                                    {taskForm.processing ? 'Menyimpan...' : 'Simpan Tugas'}
                                </button>
                            </form>
                        </>
                    ),
                },
                {
                    show: isAct, close: () => setIsAct(false), maxW: 460,
                    body: (
                        <>
                            <h3 style={{ fontSize: 19, fontWeight: 800, color: '#1e293b', margin: '0 0 4px' }}>Update Progres</h3>
                            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 14px' }}>Catat apa yang sudah dikerjakan</p>
                            <textarea value={taskForm.data.title}
                                onChange={e => taskForm.setData('title', e.target.value)}
                                style={{ ...S.input, height: 110, resize: 'none', marginBottom: 14 }}
                                placeholder="Detail progres..." />
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button onClick={() => submitProgress('in_progress')} style={{ ...S.btn('#f1f5f9', '#475569'), flex: 1, padding: '12px' }}>Simpan Progress</button>
                                <button onClick={() => submitProgress('done')} style={{ ...S.btn('#22c55e', 'white', '0 4px 14px rgba(34,197,94,.3)'), flex: 1, padding: '12px' }}>✓ Selesai</button>
                            </div>
                        </>
                    ),
                },
            ].map((m, i) => m.show && (
                <div key={i} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.5)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                    <div style={{ background: 'white', borderRadius: 24, width: '100%', maxWidth: m.maxW, padding: 28, position: 'relative', boxShadow: '0 24px 60px rgba(0,0,0,.18)', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                        <button onClick={m.close} style={{ position: 'absolute', top: 18, right: 18, width: 28, height: 28, borderRadius: 8, background: '#f1f5f9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#64748b" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        {m.body}
                    </div>
                </div>
            ))}
        </AuthenticatedLayout>
    );
}