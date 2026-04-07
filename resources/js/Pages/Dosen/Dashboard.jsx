import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth, totalKelasAktif, totalKelompok }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-slate-800 dark:text-white leading-tight">Dashboard Dosen - Monitoring Kelas</h2>}
        >
            <Head title="Dashboard Dosen" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* --- KARTU RINGKASAN ATAS --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-300">
                            <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-1">Total Kelas Aktif</p>
                            <p className="text-3xl font-bold text-slate-800 dark:text-white">{totalKelasAktif}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-300">
                            <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-1">Total Kelompok</p>
                            <p className="text-3xl font-bold text-slate-800 dark:text-white">{totalKelompok}</p>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl shadow-sm border border-red-200 dark:border-red-900/50 relative overflow-hidden transition-colors duration-300">
                            <div className="absolute top-0 right-0 w-2 h-full bg-red-500 dark:bg-red-600"></div>
                            <p className="text-red-600 dark:text-red-400 text-xs uppercase font-bold mb-1">Peringatan Sistem</p>
                            <p className="text-2xl font-bold text-red-700 dark:text-red-300">1 Kelompok Pasif</p>
                            <button className="mt-2 text-xs font-bold text-white bg-red-600 dark:bg-red-500 px-3 py-1.5 rounded hover:bg-red-700 dark:hover:bg-red-600 transition">
                                Tinjau Aktivitas
                            </button>
                        </div>
                    </div>

                    {/* --- AREA MONITORING KELOMPOK --- */}
                    <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm sm:rounded-xl border border-slate-200 dark:border-slate-700 transition-colors duration-300">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Monitoring Kelompok - Pemrograman Web II</h3>
                            <span className="bg-white dark:bg-slate-700 text-xs font-bold px-3 py-1 rounded-full border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 shadow-sm">
                                Real-time Audit: ON
                            </span>
                        </div>

                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="text-sm text-slate-500 dark:text-slate-400 italic p-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                                    Daftar detail kelompok sedang dipersiapkan...
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}