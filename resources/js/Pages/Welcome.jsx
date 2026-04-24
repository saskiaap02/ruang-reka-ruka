import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Ruang Reka - Kolaborasi Tim Tanpa Beban" />
            <div className="min-h-screen bg-[#0b1120] text-slate-300 font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">

                {/* --- 1. NAVBAR FIXED --- */}
                <nav className="fixed w-full flex justify-between items-center px-6 sm:px-12 py-4 z-50 bg-[#0b1120]/80 backdrop-blur-md border-b border-slate-800/50">
                    <div className="flex items-center gap-1">
                        <span className="bg-blue-600 text-white px-2.5 py-1.5 rounded-lg text-lg font-black tracking-tighter shadow-lg shadow-blue-600/30">Ru</span>
                        <span className="text-2xl font-bold text-white tracking-tight">Ka.</span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        {auth.user ? (
                            // Redirect otomatis ke dashboard yang benar sesuai role
                            <Link
                                href={auth.user.role === 'dosen' ? route('dosen.dashboard') : route('mahasiswa.dashboard')}
                                className="font-bold text-white bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-full transition shadow-lg shadow-blue-600/30 text-sm"
                            >
                                Buka Ruang {auth.user.role === 'dosen' ? 'Dosen' : 'Mahasiswa'}
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="font-bold text-slate-300 hover:text-white transition text-sm px-4">Masuk</Link>
                                <Link href={route('register')} className="font-bold text-white bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-full transition shadow-lg shadow-blue-600/30 text-sm">Daftar</Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* --- 2. HERO SECTION --- */}
                <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

                    <div className="relative z-10 max-w-4xl space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700 text-sm font-medium text-blue-400 mb-4 backdrop-blur-sm mx-auto">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Sistem Manajemen Proyek Mahasiswa
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight">
                            Kolaborasi Nyata, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Jejak yang Valid.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Solusi manajemen tim: Pantau aktivitas anggota, minimalisir free-rider, dan wujudkan transparansi nilai proyek.
                        </p>

                        {!auth.user && (
                            <div className="flex justify-center gap-4 pt-8">
                                <Link href={route('register')} className="font-bold text-white bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-full text-lg transition shadow-xl shadow-blue-600/20 transform hover:-translate-y-1">
                                    Mulai Ruang Baru
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-500">
                        <p className="text-[10px] font-bold tracking-widest uppercase mb-2">Jelajahi Fitur</p>
                        <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                        </svg>
                    </div>
                </section>

                {/* --- 3. FITUR HIGHLIGHTS --- */}
                <div className="space-y-32 pb-16">

                    {/* Fitur 1: Kelas */}
                    <section className="px-6 sm:px-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1 space-y-6">
                            <div className="w-12 h-12 bg-blue-900/50 rounded-2xl flex items-center justify-center border border-blue-700/50 text-blue-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white">Organisasi Kelas <br />Sistematis & Rapi</h2>
                            <p className="text-slate-400 text-lg leading-relaxed">Dosen dapat mengatur bobot penilaian dasar, audit, dan peer review. Mahasiswa bergabung menggunakan kode unik.</p>
                        </div>
                        <div className="flex-1 w-full bg-[#0f172a] rounded-2xl border border-slate-800 p-8 shadow-2xl transform rotate-2 hover:rotate-0 transition duration-500">
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 border-dashed flex items-center justify-center mb-4">
                                <span className="text-slate-500 font-bold">+ Buat Kelas Baru</span>
                            </div>
                            <div className="h-10 bg-blue-900/30 rounded-xl border border-blue-500/30 text-center text-sm text-blue-400 font-mono py-2 uppercase font-bold tracking-widest">KODE KELAS: WEB4AX</div>
                        </div>
                    </section>

                    {/* Fitur 2: Heatmap */}
                    <section className="px-6 sm:px-12 max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-16 relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none"></div>
                        <div className="flex-1 w-full bg-[#0f172a] rounded-2xl border border-slate-800 p-8 shadow-2xl transform -rotate-2 hover:rotate-0 transition duration-500 z-10">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-sm font-bold text-white uppercase tracking-widest">Heatmap Audit</span>
                                <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 text-[10px] px-3 py-1 rounded-full border border-emerald-500/30">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    Live Sync
                                </div>
                            </div>
                            <div className="grid grid-cols-12 gap-1.5">
                                {[...Array(36)].map((_, i) => (
                                    <div key={i} className={`h-6 rounded-sm ${Math.random() > 0.4 ? 'bg-emerald-500/60' : 'bg-slate-800'}`}></div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 space-y-6 z-10">
                            <div className="w-12 h-12 bg-emerald-900/50 rounded-2xl flex items-center justify-center border border-emerald-700/50 text-emerald-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white">Visualisasi Jejak <br />Anti Free-Rider</h2>
                            <p className="text-slate-400 text-lg leading-relaxed">Setiap pembaruan tugas direkam sebagai log aktivitas. Pantau siapa yang aktif bekerja lewat Heatmap warna-warni secara real-time.</p>
                        </div>
                    </section>

                    {/* Fitur 3: Intervensi Cerdas (Tambahan dari kode lama) */}
                    <section className="px-6 sm:px-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1 space-y-6">
                            <div className="w-12 h-12 bg-red-900/50 rounded-2xl flex items-center justify-center border border-red-700/50 text-red-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white leading-snug">Intervensi Cerdas <br /> & Tepat Waktu</h2>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                Tak perlu lagi menunggu hingga akhir semester untuk tahu ada kelompok yang stagnan. Sistem kami otomatis mendeteksi mahasiswa yang pasif lebih dari 3 hari dan memberi peringatan dini kepada Dosen.
                            </p>
                        </div>
                        <div className="flex-1 w-full">
                            <div className="bg-[#0f172a] rounded-2xl border border-red-900/30 shadow-2xl p-6 relative overflow-hidden transform rotate-1 hover:rotate-0 transition duration-500">
                                <div className="absolute top-0 right-0 w-1.5 h-full bg-red-500"></div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center shrink-0">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold mb-1">Peringatan Sistem</h4>
                                        <p className="text-sm text-slate-400 mb-4">Ahmad Zaki (Kelompok 2) tidak memiliki log aktivitas selama 4 hari terakhir.</p>
                                        <button className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition shadow-lg shadow-red-500/20">
                                            Kirim "Colekan"
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Fitur 4: Auto Grading & CTA Bottom (Tambahan dari kode lama) */}
                    <section className="pt-24 pb-12 px-6 relative text-center">
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-blue-600/10 rounded-t-full blur-[100px] pointer-events-none"></div>

                        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">Penilaian Akhir <br />yang Sangat Objektif</h2>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                Tidak ada lagi nilai pukul rata. Sistem mengalkulasi <i className="text-blue-400">Auto-Grading</i> secara objektif berdasarkan Nilai Dasar Kelompok (dari Dosen) dan Bobot Audit (Jejak Aktivitas Sistem). Data akurat dan siap diekspor ke SIAKAD.
                            </p>

                            <div className="flex justify-center gap-4 pt-8">
                                {!auth.user ? (
                                    <Link href={route('register')} className="font-bold text-[#0b1120] bg-white hover:bg-slate-200 px-8 py-4 rounded-full text-lg transition shadow-xl transform hover:-translate-y-1">
                                        Daftar RuKa Sekarang
                                    </Link>
                                ) : (
                                    <Link
                                        href={auth.user.role === 'dosen' ? route('dosen.dashboard') : route('mahasiswa.dashboard')}
                                        className="font-bold text-[#0b1120] bg-white hover:bg-slate-200 px-8 py-4 rounded-full text-lg transition shadow-xl transform hover:-translate-y-1"
                                    >
                                        Buka Ruang {auth.user.role === 'dosen' ? 'Dosen' : 'Mahasiswa'}
                                    </Link>
                                )}
                            </div>
                        </div>
                    </section>

                </div>

                {/* --- FOOTER --- */}
                <footer className="py-8 text-center border-t border-slate-800/50 bg-[#0b1120] relative z-10">
                    <div className="flex items-center justify-center gap-1 mb-4 opacity-50">
                        <span className="bg-slate-600 text-white px-2 py-1 rounded-md text-xs font-black tracking-tighter">Ru</span>
                        <span className="text-sm font-bold text-white tracking-tight">Ka.</span>
                    </div>
                    <p className="text-slate-500 text-sm">
                        © 2026 Ruang Reka. Didesain untuk mewujudkan kolaborasi adil di kampus.
                    </p>
                </footer>
            </div>
        </>
    );
}