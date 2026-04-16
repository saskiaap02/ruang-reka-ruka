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
                            // PERBAIKAN: Redirect otomatis ke dashboard yang benar sesuai role
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
                <div className="space-y-32 pb-32">
                    {/* Fitur 1: Kelas */}
                    <section className="px-6 sm:px-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1 space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold text-white">Organisasi Kelas <br/>Sistematis & Rapi</h2>
                            <p className="text-slate-400 text-lg">Dosen dapat mengatur bobot penilaian dasar, audit, dan peer review. Mahasiswa bergabung menggunakan kode unik.</p>
                        </div>
                        <div className="flex-1 w-full bg-[#0f172a] rounded-2xl border border-slate-800 p-8 shadow-2xl transform rotate-2">
                             <div className="h-10 bg-blue-900/30 rounded-xl border border-blue-500/30 text-center text-sm text-blue-400 font-mono py-2 mt-4 uppercase font-bold tracking-widest">KODE KELAS: WEB4AX</div>
                        </div>
                    </section>

                    {/* Fitur 2: Heatmap */}
                    <section className="px-6 sm:px-12 max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-16">
                        <div className="flex-1 w-full bg-[#0f172a] rounded-2xl border border-slate-800 p-8 shadow-2xl transform -rotate-2">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-sm font-bold text-white uppercase tracking-widest">Heatmap Audit</span>
                                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            </div>
                            <div className="grid grid-cols-12 gap-1.5">
                                {[...Array(36)].map((_, i) => (
                                    <div key={i} className={`h-6 rounded-sm ${Math.random() > 0.4 ? 'bg-emerald-500/40' : 'bg-slate-800'}`}></div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold text-white">Visualisasi Jejak <br/>Anti Free-Rider</h2>
                            <p className="text-slate-400 text-lg">Setiap pembaruan tugas direkam sebagai log aktivitas. Pantau siapa yang aktif bekerja lewat Heatmap warna-warni secara real-time.</p>
                        </div>
                    </section>
                </div>

                {/* --- FOOTER --- */}
                <footer className="py-12 text-center border-t border-slate-800/50">
                    <p className="text-slate-500 text-sm">© 2026 Ruang Reka. Dikembangkan di Palembang.</p>
                </footer>
            </div>
        </>
    );
}