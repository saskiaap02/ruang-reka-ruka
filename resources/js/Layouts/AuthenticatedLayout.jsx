import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ user, header, children }) {
    const { url, props } = usePage();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    // ─── LOGIKA MULTI-ROLE NOTIFIKASI ──────────────────────────────────────
    const isDosen = user.role === 'dosen';

    // Jika Dosen, ambil dari props.notifications. Jika Mahasiswa, ambil dari props.nudges.
    const notificationsList = isDosen ? (props.notifications || []) : (props.nudges || []);

    // Hitung jumlah yang belum dibaca
    const unreadCount = isDosen
        ? (props.unreadNotificationsCount || 0)
        : notificationsList.filter(n => !n.is_read).length;

    useEffect(() => {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDarkMode(true);
        }
    };

    return (
        <div className="min-h-screen bg-[#f0f4f8] dark:bg-[#0b1120] font-sans transition-colors duration-300 flex flex-col">

            {/* --- OVERLAY GELAP --- */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/30 dark:bg-black/50 z-40 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* --- SIDEBAR DRAWER --- */}
            <aside className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 z-50 transform transition-transform duration-300 shadow-2xl dark:shadow-[5px_0_30px_rgba(0,0,0,0.5)] ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                {/* Header Sidebar */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b1120]">
                    <span className="text-xl font-black tracking-tighter flex items-center gap-2">
                        <span className="bg-blue-600 text-white px-2 py-1 rounded-lg text-sm shadow-sm shadow-blue-600/20">Ru</span>
                        <span className="text-slate-800 dark:text-white">Ka.</span>
                    </span>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Menu Navigasi Sidebar */}
                <nav className="p-4 space-y-1.5">
                    <p className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 mb-3 px-3 uppercase">Menu Utama</p>

                    <Link
                        href={isDosen ? route('dosen.dashboard') : route('mahasiswa.dashboard')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${url.includes('/dashboard')
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-600 dark:text-white font-bold shadow-sm dark:shadow-blue-900/20'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
                            }`}
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                        <span className="text-sm">Dashboard Kelas</span>
                    </Link>

                    <div className="pt-4"></div>

                    <p className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 mb-3 px-3 uppercase">Pengaturan</p>

                    <Link
                        href={route('profile.edit')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${url.includes('/profile')
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-600 dark:text-white font-bold shadow-sm'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
                            }`}
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        <span className="text-sm">Pengaturan Akun</span>
                    </Link>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium mt-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        <span className="text-sm">Keluar Aplikasi</span>
                    </Link>
                </nav>
            </aside>

            {/* --- TOP NAVBAR UTAMA --- */}
            <nav className="bg-white/80 dark:bg-[#0b1120]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                            </button>

                            <Link href={isDosen ? route('dosen.dashboard') : route('mahasiswa.dashboard')} className="flex items-center gap-2 group">
                                <div className="flex items-center gap-1.5">
                                    <span className="bg-blue-600 text-white px-2 py-1 rounded-lg text-sm font-black tracking-tighter shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
                                        Ru
                                    </span>
                                    <span className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
                                        Ka.
                                    </span>
                                </div>

                                <div className="hidden md:flex items-center">
                                    <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2"></div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                        WORKSPACE
                                    </span>
                                </div>
                            </Link>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                title="Mode Gelap/Terang"
                            >
                                {isDarkMode ? (
                                    <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                                )}
                            </button>

                            {/* 2. Lonceng Notifikasi */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                                    className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition relative"
                                    title="Notifikasi"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>

                                    {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-red-500 border-2 border-white dark:border-slate-900 rounded-full">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {isNotifOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)}></div>
                                        <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                                                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Riwayat Pemberitahuan</h3>
                                            </div>
                                            <div className="max-h-80 overflow-y-auto">
                                                {notificationsList.length > 0 ? (
                                                    notificationsList.map((notif) => {
                                                        // Tentukan isi pesan dan status baca berdasarkan Role
                                                        const message = isDosen ? notif.data?.message : notif.message;
                                                        const isRead = isDosen ? (notif.read_at !== null) : notif.is_read;
                                                        const date = new Date(notif.created_at).toLocaleDateString('id-ID');
                                                        const markReadUrl = isDosen
                                                            ? route('dosen.notifications.read', notif.id)
                                                            : route('mahasiswa.colek.read', notif.id);

                                                        return (
                                                            <div key={notif.id} className={`p-4 border-b border-slate-50 dark:border-slate-700/50 transition-colors ${!isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'}`}>
                                                                <div className="flex gap-3">
                                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${!isRead ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" /></svg>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <p className={`text-xs font-medium leading-relaxed ${!isRead ? 'text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400'}`}>
                                                                            {message}
                                                                        </p>
                                                                        <div className="flex justify-between items-center mt-2">
                                                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{date}</p>
                                                                            {!isRead && (
                                                                                <Link href={markReadUrl} method="post" as="button" preserveScroll className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline">
                                                                                    Tandai Dibaca
                                                                                </Link>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="p-8 text-center text-slate-400">
                                                        <span className="text-3xl mb-2 block">🎉</span>
                                                        <p className="text-xs font-medium">Belum ada riwayat pemberitahuan.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

                            {/* 3. Dropdown Profil Pengguna */}
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
                                                Pengaturan Akun
                                            </Link>
                                            <Link method="post" href={route('logout')} as="button" className="block w-full text-left px-4 py-2 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                                                Keluar Aplikasi
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- HEADER HALAMAN --- */}
            {header && (
                <header className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-700/60 shadow-sm z-10 relative transition-colors duration-300">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* --- KONTEN UTAMA --- */}
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}