import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Ruang Reka - Kolaborasi Tim Tanpa Beban" />
            <div className="min-h-screen bg-[#0f172a] text-slate-300 font-sans selection:bg-blue-500 selection:text-white flex flex-col">

                {/* --- NAVBAR ATAS --- */}
                <nav className="w-full flex justify-between items-center px-6 sm:px-12 py-6">
                    <div className="flex items-center gap-1">
                        <span className="bg-blue-600 text-white px-2.5 py-1.5 rounded-lg text-lg font-black tracking-tighter shadow-lg shadow-blue-600/30">Ru</span>
                        <span className="text-2xl font-bold text-white tracking-tight">Ka.</span>
                    </div>

                    {/* Menu Kanan */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {auth.user ? (
                            <Link href={route('dashboard')} className="font-bold text-white bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-full transition shadow-lg shadow-blue-600/30 text-sm">
                                Buka Ruang Kerja
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="font-bold text-slate-300 hover:text-white transition text-sm px-4">
                                    Masuk
                                </Link>
                                <Link href={route('register')} className="font-bold text-white bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-full transition shadow-lg shadow-blue-600/30 text-sm">
                                    Daftar
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* --- KONTEN TENGAH --- */}
                <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 mt-[-4rem]">
                    <div className="max-w-3xl space-y-8">

                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-sm font-medium text-blue-400 mb-4">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Ruang kolaborasi estetik & transparan
                        </div>

                        <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight tracking-tight">
                            Kolaborasi Nyata, <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Jejak yang Valid.</span>
                        </h1>

                        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Ruang Reka (RuKa) memantau aktivitas tim secara real-time, memastikan kolaborasi yang adil, dan memberikan penilaian audit otomatis untuk setiap anggota.
                        </p>

                        <div className="flex justify-center gap-4 pt-4">
                            {/* Logika Pintar: Kalau sudah login vs Belum login */}
                            {auth.user ? (
                                <div className="flex flex-col items-center gap-3">
                                    <p className="text-sm text-slate-500">Sesi masih aktif sebagai <span className="text-white font-bold">{auth.user.name}</span></p>
                                    <Link href={route('dashboard')} className="font-bold text-white bg-blue-600 hover:bg-blue-500 px-8 py-3.5 rounded-full text-lg transition shadow-xl shadow-blue-600/20">
                                        Lanjutkan ke Ruang Reka
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <Link href={route('register')} className="font-bold text-white bg-blue-600 hover:bg-blue-500 px-8 py-3.5 rounded-full text-lg transition shadow-xl shadow-blue-600/20">
                                        Mulai Ruang Baru
                                    </Link>
                                    <Link href={route('login')} className="font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 px-8 py-3.5 rounded-full text-lg transition">
                                        Masuk ke Akun
                                    </Link>
                                </>
                            )}
                        </div>

                    </div>
                </main>

                {/* --- FOOTER BAWAH --- */}
                <footer className="py-6 text-center text-slate-500 text-sm border-t border-slate-800/50">
                    © 2026 Ruang Reka (RuKa). Didesain untuk kolaborasi yang lebih baik.
                </footer>
            </div>
        </>
    );
}