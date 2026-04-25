import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router, usePage } from '@inertiajs/react';
import GroupInitation from './Partials/GroupInitation';
import MonitoringTable from './Partials/MonitoringTable';

export default function ShowKelas({ auth, kelas, daftarKelompok, mahasiswaTanpaKelompok, pendingStudents, daftarMahasiswa }) {

    const { flash } = usePage().props;
    const [toast, setToast] = useState(null);

    const [activeTab, setActiveTab] = useState('kelompok');
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [selectedMhs, setSelectedMhs] = useState(null);

    // STATE UNTUK MODAL AI
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const aiForm = useForm({ mode: 'auto', jumlah_kelompok: '' });

    useEffect(() => {
        if (flash?.success) setToast({ type: 'success', message: flash.success });
        else if (flash?.error) setToast({ type: 'error', message: flash.error });
        else if (flash?.info) setToast({ type: 'info', message: flash.info });

        if (flash?.success || flash?.error || flash?.info) {
            const timer = setTimeout(() => setToast(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const groupForm = useForm({ project_class_id: kelas.id, nama_kelompok: '' });
    const memberForm = useForm({ group_id: '', student_id: '' });

    const submitGroup = (e) => { e.preventDefault(); groupForm.post(route('dosen.kelompok.store'), { onSuccess: () => groupForm.reset('nama_kelompok') }); };
    const submitMember = (e) => { e.preventDefault(); memberForm.post(route('dosen.tambah.anggota'), { onSuccess: () => memberForm.reset('student_id') }); };
    const approveMahasiswa = (studentId) => { router.post(route('dosen.tambah.approve'), { student_id: studentId, class_id: kelas.id }, { preserveScroll: true }); };

    // FUNGSI JALANIN AI BERDASARKAN PILIHAN MODAL
    const executeAI = (e) => {
        e.preventDefault();
        aiForm.post(route('dosen.ai.generate', kelas.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsAiModalOpen(false);
                aiForm.reset();
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 w-full">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Link href={route('dosen.dashboard')} className="p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:text-indigo-600 transition-colors shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                    </Link>
                    <div className="truncate">
                        <h2 className="font-black text-2xl text-slate-800 dark:text-white tracking-tight leading-none truncate">{kelas.nama_kelas}</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest font-bold mt-1.5 truncate">{kelas.mata_kuliah}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center w-max shrink-0 self-start sm:self-auto">
                    <div className="flex flex-col text-right pr-4">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Invite Code</span>
                        <span className="font-mono text-base font-black text-indigo-500 dark:text-indigo-400 leading-none tracking-widest">{kelas.invite_code}</span>
                    </div>
                    <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 shrink-0"></div>
                    <button onClick={() => { navigator.clipboard.writeText(kelas.invite_code); alert("Kode Disalin!"); }} className="pl-4 text-slate-400 hover:text-indigo-500 transition-colors shrink-0 outline-none" title="Salin Kode">
                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" /></svg>
                    </button>
                </div>
            </div>
        }>
            <Head title={`Kelas ${kelas.nama_kelas}`} />

            {toast && (
                <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[99999] px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 font-black text-xs tracking-widest uppercase animate-in slide-in-from-top-10 fade-in duration-300 ${toast.type === 'success' ? 'bg-emerald-500 text-white' : toast.type === 'error' ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white'}`}>
                    {toast.type === 'success' ? '✅' : toast.type === 'error' ? '⚠️' : 'ℹ️'} {toast.message}
                </div>
            )}

            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* WAITING ROOM */}
                    {pendingStudents?.length > 0 && (
                        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-6 rounded-3xl shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="flex h-3 w-3 relative shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span></span>
                                <h3 className="text-amber-800 dark:text-amber-400 font-black text-lg uppercase tracking-widest truncate">Menunggu Validasi ({pendingStudents.length})</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {pendingStudents.map(mhs => (
                                    <div key={mhs.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-amber-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
                                        <div className="min-w-0 pr-4">
                                            <p className="font-bold text-sm text-slate-800 dark:text-white truncate">{mhs.name}</p>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-1">Daftar Tunggu</p>
                                        </div>
                                        <button onClick={() => approveMahasiswa(mhs.id)} className="shrink-0 bg-slate-800 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Terima</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* KIRI: DEPLOY & AI CENTER */}
                        <div className="col-span-1 lg:col-span-4 space-y-6">
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-3xl shadow-lg text-white relative overflow-hidden">
                                <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">AI Intelligence Center</p>
                                        <h4 className="text-2xl font-black">Smart Grouping</h4>
                                    </div>
                                    <button onClick={() => setIsHelpOpen(true)} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors shrink-0 outline-none" title="Syarat AI"><span className="font-black text-sm">?</span></button>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                                    <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                                        <p className="text-2xl font-black">{daftarKelompok?.length || 0}</p>
                                        <p className="text-[9px] uppercase font-bold opacity-70">Total Tim</p>
                                    </div>
                                    <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                                        <p className="text-2xl font-black text-emerald-300">{mahasiswaTanpaKelompok?.length || 0}</p>
                                        <p className="text-[9px] uppercase font-bold opacity-70">Unassigned</p>
                                    </div>
                                </div>

                                {/* TOMBOL BUKA MODAL AI CONFIG */}
                                <button onClick={() => setIsAiModalOpen(true)} disabled={mahasiswaTanpaKelompok?.length === 0} className="w-full py-3.5 bg-white text-indigo-700 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 active:scale-95 transition-all shadow-md relative z-10 outline-none disabled:opacity-80 disabled:cursor-not-allowed">
                                    ✨ Konfigurasi AI Pembagi
                                </button>
                                {mahasiswaTanpaKelompok?.length === 0 && <p className="text-[9px] text-indigo-200 mt-2 text-center uppercase tracking-widest leading-relaxed">Tidak ada mahasiswa menganggur.</p>}
                            </div>
                            <GroupInitation groupForm={groupForm} memberForm={memberForm} daftarKelompok={daftarKelompok} mahasiswaTanpaKelompok={mahasiswaTanpaKelompok} submitGroup={submitGroup} submitMember={submitMember} />
                        </div>

                        {/* KANAN: TAB MONITORING & DAFTAR MAHASISWA */}
                        <div className="col-span-1 lg:col-span-8">
                            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 overflow-x-auto hide-scrollbar">
                                    <button onClick={() => setActiveTab('kelompok')} className={`flex-1 min-w-[150px] py-4 text-xs font-black uppercase tracking-widest transition-colors outline-none ${activeTab === 'kelompok' ? 'bg-white dark:bg-slate-800 text-indigo-600 border-t-2 border-indigo-500' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Monitoring Tim</button>
                                    <button onClick={() => setActiveTab('mahasiswa')} className={`flex-1 min-w-[150px] py-4 text-xs font-black uppercase tracking-widest transition-colors outline-none ${activeTab === 'mahasiswa' ? 'bg-white dark:bg-slate-800 text-indigo-600 border-t-2 border-indigo-500' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Daftar Mahasiswa</button>
                                </div>
                                {activeTab === 'kelompok' && <MonitoringTable daftarKelompok={daftarKelompok} />}
                                {activeTab === 'mahasiswa' && (
                                    <div className="w-full overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-700 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                                                    <th className="p-5 whitespace-nowrap">Nama Mahasiswa</th>
                                                    <th className="p-5 whitespace-nowrap text-center">Status Kelompok</th>
                                                    <th className="p-5 whitespace-nowrap text-center">Aksi Lanjutan</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                                                {daftarMahasiswa?.length > 0 ? (
                                                    daftarMahasiswa.map(mhs => (
                                                        <tr key={mhs.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                                            <td className="p-5">
                                                                <p className="font-bold text-slate-800 dark:text-white text-sm">{mhs.name}</p>
                                                                <p className="text-[10px] text-slate-500 mt-1">{mhs.email}</p>
                                                            </td>
                                                            <td className="p-5 text-center">
                                                                {mhs.group_name ? (
                                                                    <span className="inline-block bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-emerald-200 dark:border-emerald-500/30 whitespace-nowrap">✓ {mhs.group_name}</span>
                                                                ) : (
                                                                    <span className="inline-block bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-amber-200 dark:border-amber-500/30 whitespace-nowrap">⏳ Belum Ada Tim</span>
                                                                )}
                                                            </td>
                                                            <td className="p-5 text-center">
                                                                <button onClick={() => setSelectedMhs(mhs)} className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-600 bg-slate-100 hover:bg-indigo-600 hover:text-white dark:text-slate-300 dark:bg-slate-700 dark:hover:bg-indigo-500 rounded-lg transition-all whitespace-nowrap">Riwayat Performa</button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr><td colSpan="3" className="p-10 text-center text-slate-500 text-xs italic">Belum ada mahasiswa.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL CONFIG AI PEMBAGI KELOMPOK */}
            {isAiModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAiModalOpen(false)} />
                    <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-700 animate-in zoom-in-95 overflow-hidden">
                        <button onClick={() => setIsAiModalOpen(false)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all z-10 shrink-0 outline-none"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>

                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-6"><span className="text-2xl">🤖</span></div>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">Konfigurasi AI</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-6">Terdapat <strong className="text-indigo-500">{mahasiswaTanpaKelompok.length} mahasiswa</strong> yang belum memiliki kelompok. Bagaimana Anda ingin AI membagi mereka?</p>

                        <form onSubmit={executeAI}>
                            <div className="space-y-3 mb-6">
                                <label className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${aiForm.data.mode === 'auto' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}>
                                    <input type="radio" name="mode" value="auto" checked={aiForm.data.mode === 'auto'} onChange={(e) => aiForm.setData('mode', e.target.value)} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                                    <div>
                                        <p className={`text-sm font-bold ${aiForm.data.mode === 'auto' ? 'text-indigo-800 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>Buat Tim Otomatis</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">AI akan membuatkan grup baru (Tim 1, Tim 2, dst)</p>
                                    </div>
                                </label>

                                {aiForm.data.mode === 'auto' && (
                                    <div className="pl-10 animate-in fade-in slide-in-from-top-2">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ingin dibuat berapa kelompok?</label>
                                        <input type="number" min="1" max={mahasiswaTanpaKelompok.length} required value={aiForm.data.jumlah_kelompok} onChange={e => aiForm.setData('jumlah_kelompok', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white" placeholder="Misal: 5" />
                                    </div>
                                )}

                                <label className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${aiForm.data.mode === 'manual' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}>
                                    <input type="radio" name="mode" value="manual" checked={aiForm.data.mode === 'manual'} onChange={(e) => aiForm.setData('mode', e.target.value)} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                                    <div>
                                        <p className={`text-sm font-bold ${aiForm.data.mode === 'manual' ? 'text-indigo-800 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>Gunakan Tim yang Ada</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Sebar ke {daftarKelompok.length} tim yang sudah Anda buat</p>
                                    </div>
                                </label>
                            </div>

                            <button type="submit" disabled={aiForm.processing || (aiForm.data.mode === 'manual' && daftarKelompok.length === 0)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-4 text-xs font-black tracking-widest uppercase shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50">
                                {aiForm.processing ? 'AI Sedang Bekerja...' : 'Jalankan AI'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL RIWAYAT MAHASISWA & SYARAT AI TETAP SAMA SEPERTI SEBELUMNYA */}
            {selectedMhs && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedMhs(null)} />
                    <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-700 animate-in zoom-in-95 overflow-hidden">
                        <button onClick={() => setSelectedMhs(null)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all z-10 shrink-0 outline-none"><svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>

                        <div className="text-center mb-8 relative z-10 mt-4">
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-full flex items-center justify-center text-3xl font-black text-indigo-600 dark:text-indigo-400 mb-4 shadow-inner border border-indigo-200 dark:border-indigo-500/30">{selectedMhs.name.charAt(0)}</div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-white leading-tight">{selectedMhs.name}</h3>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">Rapor Performa Lintas Kelas</p>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-4 text-center">
                                <p className="text-[9px] uppercase font-black text-indigo-500 tracking-widest mb-1">Klasifikasi AI</p>
                                <p className="text-lg font-black text-indigo-700 dark:text-indigo-400">{selectedMhs.history?.tier || 'Belum Dianalisis'}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl p-4">
                                    <p className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">Skor Audit</p>
                                    <p className="text-2xl font-black text-slate-800 dark:text-white">{selectedMhs.history?.audit}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl p-4">
                                    <p className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">Peer Review</p>
                                    <p className="text-2xl font-black text-slate-800 dark:text-white">{selectedMhs.history?.peer}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl p-4">
                                    <p className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">Log Aktivitas</p>
                                    <p className="text-2xl font-black text-slate-800 dark:text-white">{selectedMhs.history?.aktivitas}</p>
                                </div>
                                <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl p-4">
                                    <p className="text-[9px] uppercase font-bold text-emerald-600 tracking-widest">Skor Gabungan</p>
                                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{selectedMhs.history?.gabungan}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isHelpOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsHelpOpen(false)} />
                    <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border border-slate-100 dark:border-slate-700 animate-in zoom-in-95">
                        <button onClick={() => setIsHelpOpen(false)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all z-10 shrink-0 outline-none"><svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-6"><span className="text-2xl">✨</span></div>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">Cara Kerja Smart Grouping AI</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8">AI membutuhkan data performa mahasiswa untuk merekomendasikan tim yang seimbang. Pastikan 4 langkah ini terpenuhi:</p>
                        <div className="space-y-4">
                            {[{ done: true, label: '1. Kelas Dibuat', desc: 'Dosen sudah menyiapkan ruang kerja.' }, { done: true, label: '2. Mahasiswa Masuk', desc: 'Mahasiswa bergabung via kode invite.' }, { done: false, label: '3. Data Logbook Ada', desc: 'Minimal ada 1 mahasiswa yang punya riwayat kerja (Kanban/Log) dari proyek sebelumnya.' }, { done: false, label: '4. Data Peer Review Ada', desc: 'Minimal ada 1 sesi Peer Review yang sudah diselesaikan dari proyek sebelumnya.' }].map((step, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center border-2 ${step.done ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400'}`}>
                                        {step.done ? <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : <span className="text-xs font-bold shrink-0">{i + 1}</span>}
                                    </div>
                                    <div><p className={`text-sm font-bold ${step.done ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500'}`}>{step.label}</p><p className="text-[10px] text-slate-400 font-medium mt-1 leading-relaxed">{step.desc}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}