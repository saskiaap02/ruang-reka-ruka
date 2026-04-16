export default function StatCards({ totalKelasAktif, totalKelompok, kelompokKritis }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-1 tracking-wider">Total Kelas Aktif</p>
                <p className="text-3xl font-black text-slate-800 dark:text-white">{totalKelasAktif}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-1 tracking-wider">Total Kelompok</p>
                <p className="text-3xl font-black text-slate-800 dark:text-white">{totalKelompok}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl shadow-sm border border-red-200 dark:border-red-900/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1.5 h-full bg-red-500"></div>
                <p className="text-red-600 dark:text-red-400 text-xs uppercase font-bold mb-1 tracking-wider">Peringatan Sistem</p>
                <p className="text-2xl font-black text-red-700 dark:text-red-300">
                    {kelompokKritis?.length || 0} Kelompok Kritis
                </p>
            </div>
        </div>
    );
}