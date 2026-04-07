import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Selamat Datang di SIM-CR" />
            <div className="min-h-screen bg-[#0f172a] text-slate-300 font-sans selection:bg-blue-500 selection:text-white flex flex-col">

                {/* Navbar Atas */}
                <nav className="w-full flex justify-between items-center px-6 sm:px-12 py-6">
                    <div className="flex items-center gap-2">
                        <span className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-lg font-black tracking-tighter shadow-lg shadow-blue-600/30">SIM</span>
                        <span className="text-2xl font-bold text-white tracking-tight">ConflictResolve</span>
                    </div>

                    {/* Menu Kanan (Jika sudah login vs belum) */}
                    <div>
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="font-bold text-white bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-full transition shadow-lg shadow-blue-600/30"
                            >
                                Masuk ke Dashboard
                            </Link>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    href={route('login')}
                                    className="font-bold text-slate-300 hover:text-white transition"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="font-bold text-white bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-full transition shadow-lg shadow-blue-600/30"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>

                {/* Konten Tengah (Hero Section) */}
                <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 mt-[-4rem]">
                    <div className="max-w-3xl space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-sm font-medium text-blue-400 mb-4">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Sistem Monitoring Kelas Real-time
                        </div>

                        <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight tracking-tight">
                            Manajemen Proyek Kelas <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Tanpa Free-Rider.</span>
                        </h1>

                        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Pantau aktivitas kelompok, cegah konflik internal, dan berikan penilaian audit secara otomatis. Platform yang dirancang khusus untuk efisiensi Dosen dan produktivitas Mahasiswa.
                        </p>

                        {!auth.user && (
                            <div className="flex justify-center gap-4 pt-4">
                                <Link
                                    href={route('register')}
                                    className="font-bold text-white bg-blue-600 hover:bg-blue-500 px-8 py-3.5 rounded-full text-lg transition shadow-xl shadow-blue-600/20"
                                >
                                    Mulai Sekarang Gratis
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 px-8 py-3.5 rounded-full text-lg transition"
                                >
                                    Log In
                                </Link>
                            </div>
                        )}
                    </div>
                </main>

                {/* Footer Bawah */}
                <footer className="py-6 text-center text-slate-500 text-sm border-t border-slate-800/50">
                    © 2026 SIM-ConflictResolve. Didesain untuk manajemen kelas yang lebih baik.
                </footer>
            </div>
        </>
    );
}