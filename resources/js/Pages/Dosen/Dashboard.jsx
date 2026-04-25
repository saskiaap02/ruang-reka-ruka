import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import StatCards from './Partials/StatCards';
import GroupInitation from './Partials/GroupInitation';
import ClassAccessList from './Partials/ClassAccessList';
import MonitoringTable from './Partials/MonitoringTable';
import CreateClassModal from './Partials/CreateClassModal';

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const AVATAR_COLORS = ['#dbeafe', '#d1fae5', '#fce7f3', '#fef3c7', '#ede9fe'];

function Av({ name = '?', size = 32, idx = 0 }) {
    return (
        <div style={{
            width: size, height: size, borderRadius: size * 0.32,
            background: AVATAR_COLORS[idx % AVATAR_COLORS.length],
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: size * 0.4, fontWeight: 800, color: '#1e293b', flexShrink: 0,
        }}>{name.charAt(0).toUpperCase()}</div>
    );
}

function MetricCard({ label, value, sub, color, icon }) {
    return (
        <div style={{
            background: 'white', borderRadius: 18, padding: '18px 20px',
            border: '1px solid #f0f0f4', flex: 1, minWidth: 0,
            borderTop: `3px solid ${color}`,
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>{label}</p>
                    <p style={{ fontSize: 28, fontWeight: 800, color: '#1e293b', margin: 0, letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</p>
                    {sub && <p style={{ fontSize: 11, color: '#94a3b8', margin: '4px 0 0', fontWeight: 500 }}>{sub}</p>}
                </div>
                <div style={{ fontSize: 22, marginTop: 2 }}>{icon}</div>
            </div>
        </div>
    );
}

/* ─── AI Eligibility Panel ────────────────────────────────────────────────── */
function AISmartPanel({ eligible, info, daftarKelas, onRun }) {
    const [selectedClass, setSelectedClass] = useState(daftarKelas?.[0]?.id || '');

    const steps = [
        {
            done: true,
            label: 'Kelas & Kelompok Dibuat',
            desc: 'Dosen menyiapkan ruang kerja',
        },
        {
            done: true,
            label: 'Mahasiswa Bergabung',
            desc: 'Via kode invite unik',
        },
        {
            done: info?.hasActivityHistory,
            label: 'Riwayat Kerja Ada',
            desc: info?.hasActivityHistory
                ? `${info.studentsWithHistory} mahasiswa punya log aktivitas`
                : 'Mahasiswa perlu menyelesaikan minimal 1 siklus proyek',
        },
        {
            done: info?.hasPeerReviewHistory,
            label: 'Peer Review Tersedia',
            desc: info?.hasPeerReviewHistory
                ? `${info.peerReviewsCompleted} penilaian sudah diisi`
                : 'Buka & selesaikan minimal 1 sesi peer review',
        },
        {
            done: eligible,
            label: 'AI Siap Dijalankan',
            desc: eligible ? 'Semua syarat terpenuhi!' : 'Tunggu syarat 3 & 4 terpenuhi',
        },
    ];

    return (
        <div style={{
            background: 'white', borderRadius: 20, border: '1px solid #f0f0f4',
            overflow: 'hidden',
        }}>
            {/* Header */}
            <div style={{
                background: eligible
                    ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                    : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                padding: '20px 24px',
                borderBottom: '1px solid #f0f0f4',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 18 }}>✨</span>
                            <p style={{ fontSize: 11, fontWeight: 800, color: eligible ? 'rgba(255,255,255,0.6)' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                                AI Smart Grouping
                            </p>
                        </div>
                        <h3 style={{ fontSize: 17, fontWeight: 800, color: eligible ? 'white' : '#1e293b', margin: 0, letterSpacing: '-0.01em' }}>
                            {eligible ? 'AI siap membentuk kelompok optimal' : 'Menunggu syarat terpenuhi'}
                        </h3>
                        <p style={{ fontSize: 12, color: eligible ? 'rgba(255,255,255,0.55)' : '#64748b', margin: '4px 0 0', fontWeight: 500 }}>
                            {eligible
                                ? 'AI akan menganalisis performa & peer review untuk distribusi yang adil'
                                : 'AI butuh riwayat kerja + peer review sebelum bisa merekomendasikan tim'}
                        </p>
                    </div>

                    {eligible && (
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                            <select
                                value={selectedClass}
                                onChange={e => setSelectedClass(e.target.value)}
                                style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: 12, fontWeight: 600, outline: 'none', cursor: 'pointer' }}
                            >
                                {daftarKelas?.map(k => (
                                    <option key={k.id} value={k.id} style={{ color: '#1e293b', background: 'white' }}>
                                        {k.nama_kelas}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={() => onRun(selectedClass)}
                                style={{
                                    padding: '9px 20px', borderRadius: 12,
                                    background: '#6366f1', color: 'white',
                                    fontSize: 12, fontWeight: 700, border: 'none',
                                    cursor: 'pointer', whiteSpace: 'nowrap',
                                    boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
                                    fontFamily: 'inherit',
                                }}
                            >
                                Generate Kelompok
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Steps */}
            <div style={{ padding: '16px 24px', display: 'flex', gap: 0, overflowX: 'auto' }}>
                {steps.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 140 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1, padding: '0 6px' }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: '50%',
                                background: s.done ? '#6366f1' : '#f1f5f9',
                                border: s.done ? 'none' : '2px solid #e2e8f0',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: 8, flexShrink: 0,
                                transition: 'all 0.3s',
                            }}>
                                {s.done
                                    ? <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    : <span style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8' }}>{i + 1}</span>
                                }
                            </div>
                            <p style={{ fontSize: 11, fontWeight: 700, color: s.done ? '#1e293b' : '#94a3b8', margin: '0 0 2px', lineHeight: 1.2 }}>{s.label}</p>
                            <p style={{ fontSize: 10, color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>{s.desc}</p>
                        </div>
                        {i < steps.length - 1 && (
                            <div style={{ width: 20, height: 2, background: s.done ? '#6366f1' : '#e2e8f0', flexShrink: 0, transition: 'all 0.3s' }}></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── MAIN ─────────────────────────────────────────────────────────────────── */
export default function Dashboard({
    auth,
    totalKelasAktif, totalKelompok, kelompokKritis,
    daftarKelompok, daftarKelas,
    mahasiswaTanpaKelompok, pendingRequestsCount,
    aiSmartGroupingEligible, aiEligibilityInfo,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const classForm = useForm({
        mata_kuliah: '', nama_kelas: '',
        bobot_dasar: 50, bobot_audit: 30, bobot_peer: 20,
    });
    const groupForm = useForm({ project_class_id: '', nama_kelompok: '' });
    const memberForm = useForm({ group_id: '', student_id: '' });

    const submitKelas = e => { e.preventDefault(); classForm.post(route('dosen.kelas.store'), { onSuccess: () => { setIsModalOpen(false); classForm.reset(); } }); };
    const submitGroup = e => { e.preventDefault(); groupForm.post(route('dosen.kelompok.store'), { onSuccess: () => groupForm.reset() }); };
    const submitMember = e => { e.preventDefault(); memberForm.post(route('dosen.tambah.anggota'), { onSuccess: () => memberForm.reset() }); };

    const handleAIRun = (classId) => {
        if (!classId) return alert('Pilih kelas terlebih dahulu.');
        if (!confirm('Jalankan AI Smart Grouping untuk kelas ini?\n\nAI akan menganalisis riwayat performa dan peer review untuk merekomendasikan komposisi kelompok yang seimbang.')) return;
        router.post(route('dosen.ai.generate', classId), {}, {
            preserveScroll: true,
            onSuccess: () => alert('✅ AI selesai! Rencana penempatan kelompok sudah dibuat. Eksekusi saat Anda approve mahasiswa.'),
        });
    };

    const firstName = auth.user.name.split(' ')[0];
    const criticalCount = kelompokKritis?.length || 0;

    const S = {
        wrap: { fontFamily: "'Plus Jakarta Sans',sans-serif", background: '#f4f6fb', minHeight: '100vh', padding: '24px 0 60px' },
        inner: { maxWidth: 1300, margin: '0 auto', padding: '0 24px' },
        white: { background: 'white', borderRadius: 20, border: '1px solid #f0f0f4' },
        label: { fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 },
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                    <div>
                        <h2 style={{ fontWeight: 800, fontSize: 18, color: '#1e293b', margin: 0 }}>
                            Ruang <span style={{ color: '#6366f1' }}>Audit.</span>
                        </h2>
                        <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                            Pusat Kendali Dosen
                        </p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: '#6366f1', color: 'white', padding: '9px 18px',
                        borderRadius: 12, fontSize: 12, fontWeight: 700, border: 'none',
                        cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                        fontFamily: "'Plus Jakarta Sans',sans-serif",
                    }}>
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Buat Kelas
                    </button>
                </div>
            }
        >
            <Head title="Dashboard Dosen" />
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

            <div style={S.wrap}>
                <div style={S.inner}>

                    {/* ── GREETING BANNER ──────────────────────────────────── */}
                    <div style={{
                        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                        borderRadius: 20, padding: '22px 28px', marginBottom: 20,
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        flexWrap: 'wrap', gap: 16, position: 'relative', overflow: 'hidden',
                    }}>
                        {/* decorative */}
                        <div style={{ position: 'absolute', right: -30, top: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(99,102,241,0.15)', pointerEvents: 'none' }}></div>
                        <div style={{ position: 'absolute', right: 60, bottom: -40, width: 100, height: 100, borderRadius: '50%', background: 'rgba(99,102,241,0.08)', pointerEvents: 'none' }}></div>

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 100, padding: '3px 10px', marginBottom: 8 }}>
                                <div style={{ width: 6, height: 6, background: '#6366f1', borderRadius: '50%' }}></div>
                                <span style={{ fontSize: 9, fontWeight: 800, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.12em' }}>AI Monitor Engine v3</span>
                            </div>
                            <h3 style={{ fontSize: 20, fontWeight: 800, color: 'white', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
                                Selamat datang, {firstName}!
                            </h3>
                            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0, fontWeight: 500 }}>
                                {criticalCount > 0
                                    ? <>Sistem mendeteksi <span style={{ color: '#fca5a5', fontWeight: 700 }}>{criticalCount} kelompok</span> dalam status stagnan</>
                                    : 'Semua kelompok aktif. Tidak ada yang perlu diintervensi.'}
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: 12, position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
                            {[
                                { label: 'Kelas', value: totalKelasAktif || 0, color: '#6366f1' },
                                { label: 'Tim', value: totalKelompok || 0, color: '#22c55e' },
                                { label: 'Kritis', value: criticalCount, color: criticalCount > 0 ? '#ef4444' : '#94a3b8' },
                                { label: 'Pending', value: pendingRequestsCount || 0, color: '#f59e0b' },
                            ].map(m => (
                                <div key={m.label} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '10px 18px', textAlign: 'center', minWidth: 70 }}>
                                    <p style={{ fontSize: 22, fontWeight: 800, color: m.color, margin: 0, lineHeight: 1 }}>{m.value}</p>
                                    <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: 700, margin: '3px 0 0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── METRIC CARDS ─────────────────────────────────────── */}
                    <div style={{ display: 'flex', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
                        <MetricCard label="Total Kelas Aktif" value={totalKelasAktif || 0} sub="Kelas yang sedang berjalan" color="#6366f1" icon="🎓" />
                        <MetricCard label="Total Tim" value={totalKelompok || 0} sub="Kelompok di semua kelas" color="#22c55e" icon="👥" />
                        <MetricCard label="Tim Kritis" value={criticalCount} sub={criticalCount > 0 ? "Butuh intervensi segera" : "Semua aman"} color={criticalCount > 0 ? "#ef4444" : "#94a3b8"} icon="⚠️" />
                        <MetricCard label="Request Pending" value={pendingRequestsCount || 0} sub="Menunggu approval kamu" color="#f59e0b" icon="⏳" />
                    </div>

                    {/* ── AI SMART GROUPING PANEL ──────────────────────────── */}
                    <div style={{ marginBottom: 20 }}>
                        <AISmartPanel
                            eligible={aiSmartGroupingEligible}
                            info={aiEligibilityInfo}
                            daftarKelas={daftarKelas}
                            onRun={handleAIRun}
                        />
                    </div>

                    {/* ── MONITORING + CLASS ACCESS ─────────────────────────── */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, marginBottom: 20, alignItems: 'start' }}>
                        {/* Monitoring table */}
                        <div style={{ ...S.white, overflow: 'hidden' }}>
                            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f4f8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={S.label}>Monitoring Kelompok</p>
                                    <p style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', margin: '2px 0 0' }}>Status semua tim aktif</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div style={{ width: 7, height: 7, background: '#22c55e', borderRadius: '50%' }}></div>
                                    <span style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Live</span>
                                </div>
                            </div>
                            <MonitoringTable daftarKelompok={daftarKelompok} />
                        </div>

                        {/* Class access */}
                        <div style={{ ...S.white, padding: 20 }}>
                            <div style={{ marginBottom: 16 }}>
                                <p style={S.label}>Kode Masuk Kelas</p>
                                <p style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', margin: '2px 0 0' }}>Bagikan ke mahasiswa</p>
                            </div>
                            <ClassAccessList daftarKelas={daftarKelas} />
                        </div>
                    </div>

                    {/* ── GROUP MANAGEMENT ──────────────────────────────────── */}
                    <div style={{ ...S.white, overflow: 'hidden' }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f4f8' }}>
                            <p style={S.label}>Manajemen Tim Manual</p>
                            <p style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', margin: '2px 0 0' }}>Inisiasi kelompok & tambah anggota</p>
                        </div>
                        <div style={{ padding: 20 }}>
                            <GroupInitation
                                auth={auth}
                                groupForm={groupForm}
                                memberForm={memberForm}
                                daftarKelas={daftarKelas}
                                daftarKelompok={daftarKelompok}
                                mahasiswaTanpaKelompok={mahasiswaTanpaKelompok}
                                submitGroup={submitGroup}
                                submitMember={submitMember}
                            />
                        </div>
                    </div>

                </div>
            </div>

            <CreateClassModal
                isOpen={isModalOpen}
                closeModal={() => setIsModalOpen(false)}
                form={classForm}
                submit={submitKelas}
            />
        </AuthenticatedLayout>
    );
}