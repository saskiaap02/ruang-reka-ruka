import React from 'react';
import { Link } from '@inertiajs/react'; // 1. TAMBAHAN: Import Link

export default function ClassAccessList({ daftarKelas }) {
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert(`Kode Akses ${text} berhasil disalin ke clipboard!`);
    };

    return (
        <div className="w-full space-y-4">
            {daftarKelas?.length === 0 ? (
                <div className="p-10 text-center border-2 border-dashed border-slate-800 rounded-[2rem]">
                    <p className="text-slate-600 text-xs font-black italic tracking-widest uppercase">
                        [ Tidak Ada Kelas Aktif ]
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {daftarKelas?.map((kelas) => (
                        <div 
                            key={kelas.id} 
                            className="group relative flex items-center justify-between p-6 bg-slate-900/40 border border-slate-800 rounded-[2rem] hover:border-blue-500/40 transition-all duration-300 shadow-xl overflow-hidden"
                        >
                            <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-blue-600/5 rounded-full blur-xl group-hover:bg-blue-600/10 transition-all"></div>
                            
                            {/* 2. TAMBAHAN: Bungkus area teks dengan Link */}
                            <Link 
                                href={route('dosen.kelas.show', kelas.id)} 
                                className="relative z-10 flex-1 cursor-pointer group/link"
                            >
                                <p className="font-black text-white text-sm tracking-tight group-hover/link:text-blue-400 transition-colors uppercase">
                                    {kelas.mata_kuliah}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.1em] group-hover/link:text-slate-300 transition-colors">
                                        {kelas.nama_kelas}
                                    </p>
                                </div>
                            </Link>

                            <div className="relative z-10 flex items-center gap-3 ml-4">
                                <div className="flex flex-col items-end">
                                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Invite Code</span>
                                    <span className="font-mono text-xs font-black text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20 shadow-inner">
                                        {kelas.invite_code}
                                    </span>
                                </div>
                                
                                <button 
                                    onClick={() => copyToClipboard(kelas.invite_code)} 
                                    className="p-3 bg-slate-800/50 text-slate-400 hover:text-white hover:bg-blue-600 rounded-2xl border border-slate-700 transition-all active:scale-90 shadow-lg"
                                    title="Salin Kode"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}