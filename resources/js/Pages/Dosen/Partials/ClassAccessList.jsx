export default function ClassAccessList({ daftarKelas }) {
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert(`Kode ${text} berhasil disalin!`);
    };

    return (
        <div className="bg-white dark:bg-slate-800 shadow-sm sm:rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Akses Masuk Ruang Kelas</h3>
            </div>
            <div className="p-6">
                {daftarKelas?.length === 0 ? (
                    <p className="text-center text-slate-500 italic py-4">Belum ada ruang kelas aktif.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {daftarKelas?.map((kelas) => (
                            <div key={kelas.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl">
                                <div>
                                    <p className="font-bold text-slate-800 dark:text-white text-sm">{kelas.mata_kuliah}</p>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">{kelas.nama_kelas}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-lg border border-blue-100">
                                        {kelas.invite_code}
                                    </span>
                                    <button onClick={() => copyToClipboard(kelas.invite_code)} className="p-2 bg-slate-200 dark:bg-slate-700 hover:bg-blue-100 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}