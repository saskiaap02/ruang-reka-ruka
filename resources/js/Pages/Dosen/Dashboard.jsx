import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CreateClassModal from './Partials/CreateClassModal';

const CARD_GRADS = [
    'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-800',
    'bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-slate-800 dark:to-slate-800',
    'bg-gradient-to-br from-rose-50 to-pink-100 dark:from-slate-800 dark:to-slate-800',
    'bg-gradient-to-br from-amber-50 to-orange-100 dark:from-slate-800 dark:to-slate-800',
];

export default function Dashboard({ auth, totalKelasAktif, totalKelompok, kelompokKritis, daftarKelas, daftarKelompok }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State untuk Modal List (Semua Tim vs Tim Kritis)
    const [viewingList, setViewingList] = useState(null); // 'all' | 'kritis' | null

    const classForm = useForm({
        mata_kuliah: '', nama_kelas: '',
        bobot_dasar: 50, bobot_audit: 30, bobot_peer: 20,
    });

    const submitKelas = e => {
        e.preventDefault();
        classForm.post(route('dosen.kelas.store'), {
            onSuccess: () => { setIsModalOpen(false); classForm.reset(); }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="font-extrabold text-xl text-slate-800 dark:text-white m-0">
                            Ruang <span className="text-indigo-600">Audit.</span>
                        </h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Pusat Kendali Dosen</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/30 transition-all active:scale-95">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        Buat Kelas
                    </button>
                </div>
            }
        >
            <Head title="Dashboard Dosen" />

            <div className="min-h-screen pb-20 font-sans">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

                    {/* STATISTIK GLOBAL (SEKARANG BISA DIKLIK) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden">
                            <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-1 tracking-wider">Total Kelas Aktif</p>
                            <p className="text-3xl font-black text-slate-800 dark:text-white">{totalKelasAktif}</p>
                        </div>

                        <div
                            onClick={() => setViewingList('all')}
                            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-all group"
                        >
                            <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-1 tracking-wider group-hover:text-indigo-500 transition-colors">Total Kelompok</p>
                            <div className="flex justify-between items-end">
                                <p className="text-3xl font-black text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors">{totalKelompok}</p>
                                <span className="text-[10px] font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">Lihat Detail &rarr;</span>
                            </div>
                        </div>

                        <div
                            onClick={() => setViewingList('kritis')}
                            className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl shadow-sm border border-red-200 dark:border-red-900/50 relative overflow-hidden cursor-pointer hover:border-red-400 transition-all group"
                        >
                            <div className="absolute top-0 right-0 w-1.5 h-full bg-red-500"></div>
                            <p className="text-red-600 dark:text-red-400 text-xs uppercase font-bold mb-1 tracking-wider">Peringatan Sistem</p>
                            <div className="flex justify-between items-end">
                                <p className="text-2xl font-black text-red-700 dark:text-red-300">
                                    {kelompokKritis?.length || 0} Kelompok Kritis
                                </p>
                                <span className="text-[10px] font-bold text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">Cek Masalah &rarr;</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-black text-slate-800 dark:text-white">Katalog Ruang Kelas</h3>
                    </div>

                    {/* DAFTAR KELAS */}
                    {daftarKelas?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {daftarKelas.map((kelas, idx) => (
                                <div key={kelas.id} className={`relative overflow-hidden rounded-3xl p-6 flex flex-col justify-between h-48 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 group ${CARD_GRADS[idx % CARD_GRADS.length]}`}>
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-3 gap-2">
                                            <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 bg-white/60 dark:bg-slate-900/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20 dark:border-slate-700/50 shadow-sm flex-1 truncate" title={kelas.nama_kelas}>
                                                {kelas.nama_kelas}
                                            </span>
                                            <span className="text-[9px] font-black px-3 py-1.5 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 uppercase tracking-widest shrink-0 border border-indigo-200 dark:border-indigo-500/30">
                                                Kode: {kelas.invite_code}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-extrabold text-slate-800 dark:text-white leading-tight mt-4 line-clamp-2" title={kelas.mata_kuliah}>
                                            {kelas.mata_kuliah}
                                        </h3>
                                    </div>
                                    <Link href={route('dosen.kelas.show', kelas.id)} className="relative z-10 flex items-center justify-between bg-white dark:bg-slate-900 rounded-xl p-3 text-sm font-bold text-slate-800 dark:text-white hover:bg-indigo-600 hover:text-white transition-colors border border-slate-200 dark:border-slate-700 group/btn shadow-sm">
                                        Masuk Kelas
                                        <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-16 text-center shadow-sm border border-slate-200 dark:border-slate-700">
                            <div className="text-5xl mb-4">👨‍🏫</div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Belum Ada Kelas Aktif</h3>
                            <p className="text-sm text-slate-500 max-w-sm mx-auto">Mulai dengan membuat ruang kelas baru untuk proyek mahasiswa Anda.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL DAFTAR KELOMPOK */}
            {viewingList && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewingList(null)} />
                    <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-700 animate-in zoom-in-95 overflow-hidden">

                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/80">
                            <div>
                                <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
                                    {viewingList === 'all' ? 'Daftar Semua Tim' : '⚠️ Tim Status Kritis'}
                                </h3>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Laporan Lintas Kelas</p>
                            </div>
                            <button onClick={() => setViewingList(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all outline-none">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 sm:p-6 bg-slate-50 dark:bg-slate-900/20">
                            <div className="space-y-3">
                                {viewingList === 'all' && daftarKelompok?.length > 0 ? (
                                    daftarKelompok.map(g => (
                                        <div key={g.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <p className="font-bold text-slate-800 dark:text-white text-sm">{g.nama}</p>
                                                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{g.kelas}</p>
                                            </div>
                                            <Link href={route('dosen.kelas.show', g.class_id)} className="px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all text-center">
                                                Buka Kelas
                                            </Link>
                                        </div>
                                    ))
                                ) : viewingList === 'kritis' && kelompokKritis?.length > 0 ? (
                                    kelompokKritis.map(g => (
                                        <div key={g.id} className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <p className="font-bold text-red-800 dark:text-red-400 text-sm flex items-center gap-2">
                                                    ⚠️ {g.nama}
                                                </p>
                                                <p className="text-xs font-medium text-red-600 dark:text-red-300 mt-1">{g.masalah}</p>
                                                <p className="text-[9px] font-black text-red-400 dark:text-red-500 mt-2 uppercase tracking-widest">Kelas: {g.kelas}</p>
                                            </div>
                                            <Link href={route('dosen.kelas.show', g.class_id)} className="px-4 py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all text-center shadow-md">
                                                Tindak Lanjuti
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10">
                                        <p className="text-slate-400 text-sm font-medium italic">Tidak ada data untuk ditampilkan.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            )}

            <CreateClassModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} form={classForm} submit={submitKelas} />
        </AuthenticatedLayout>
    );
}