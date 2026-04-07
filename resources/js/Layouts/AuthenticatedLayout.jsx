import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ user, header, children }) {
    const { url } = usePage();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Saklar Sidebar (Mulai dari tertutup)
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] font-sans transition-colors duration-300 flex flex-col">

            {/* --- OVERLAY GELAP (Muncul pas sidebar kebuka) --- */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)} // Klik area luar untuk nutup
                ></div>
            )}

            {/* --- SIDEBAR DRAWER (Warna Biru Navy) --- */}
            <aside className={`fixed top-0 left-0 h-full w-64 bg-[#0f172a] text-slate-300 z-50 transform transition-transform duration-300 shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Header Sidebar */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-[#0b1120]">
                    <span className="text-xl font-black tracking-tighter flex items-center gap-2">
                        <span className="bg-blue-600 text-white px-2 py-1 rounded-lg text-sm">SIM</span>
                        <span className="text-white">CR</span>
                    </span>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Menu Navigasi Sidebar */}
                <nav className="p-4 space-y-2">
                    <p className="text-[10px] font-bold tracking-wider text-slate-500 mb-4 px-2">MAIN MENU</p>
                    <Link
                        href={route('dosen.dashboard')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${url.startsWith('/dosen/dashboard')
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
                                : 'hover:bg-slate-800 hover:text-white'
                            }`}
                        onClick={() => setIsSidebarOpen(false)} // Otomatis nutup pas menu diklik
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                        <span className="text-sm font-medium">Dashboard Kelas</span>
                    </Link>
                </nav>
            </aside>

            {/* --- TOP NAVBAR UTAMA --- */}
            <nav className="bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">

                        {/* Kiri: Tombol Hamburger & Logo */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsSidebarOpen(true)} // Tombol ini sekarang hidup!
                                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                            </button>

                            <Link href={route('dosen.dashboard')} className="flex items-center gap-2">
                                <span className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-sm font-black tracking-tighter">SIM</span>
                                <span className="text-xl font-bold text-slate-800 dark:text-white hidden sm:block tracking-tight">ConflictResolve</span>
                            </Link>
                        </div>

                        {/* Kanan: Profil & Dark Mode */}
                        <div className="flex items-center gap-2 sm:gap-4">

                            <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                title="Mode Gelap/Terang"
                            >
                                {isDarkMode ? (
                                    <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                                )}
                            </button>

                            {/* Dropdown Profil (Tetap Sama) */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition focus:outline-none"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-sm ring-2 ring-white dark:ring-slate-800">
                                        {user.name.charAt(0)}
                                    </div>
                                </button>

                                {isProfileMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)}></div>
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 transform origin-top-right transition-all">
                                            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                                                <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                                            </div>
                                            <Link href={route('profile.edit')} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                                                Pengaturan
                                            </Link>
                                            <Link method="post" href={route('logout')} as="button" className="block w-full text-left px-4 py-2 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                                                Log Out
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800/50 shadow-sm transition-colors duration-300">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 dark:text-slate-200">
                        {header}
                    </div>
                </header>
            )}

            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}