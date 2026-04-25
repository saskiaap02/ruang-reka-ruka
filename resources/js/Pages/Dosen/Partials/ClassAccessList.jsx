import React from 'react';
import { Link } from '@inertiajs/react';

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
                            className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900/40 border border-slate-800 rounded-[2rem] hover:border-blue-500/40 transition-all duration-300 shadow-xl overflow-hidden"
                        >
                            <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-blue-600/5 rounded-full blur-xl group-hover:bg-blue-600/10 transition-all pointer-events-none"></div>

                            {/* BAGIAN KIRI: Nama Kelas (Bisa diklik) */}
                            <Link
                                href={route('dosen.kelas.show', kelas.id)}
                                className="relative z-10 flex-1 min-w-0 cursor-pointer group/link"
                            >
                                <p className="font-black text-white text-sm tracking-tight group-hover/link:text-blue-400 transition-colors uppercase truncate">
                                    {kelas.mata_kuliah}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] shrink-0"></div>
                                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.1em] group-hover/link:text-slate-300 transition-colors truncate">
                                        {kelas.nama_kelas}
                                    </p>
                                </div>
                            </Link>

                            {/* BAGIAN KANAN: Kotak Invite Code */}
                            <div className="relative z-10 flex items-center shrink-0 w-full sm:w-auto">
                                <div className="flex items-center bg-slate-800/40 border border-slate-700/80 rounded-2xl w-full sm:w-auto overflow-hidden">

                                    {/* Teks Kode */}
                                    <div className="flex flex-col items-center justify-center px-5 py-2">
                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Invite Code</span>
                                        <span className="font-mono text-sm font-black text-blue-400 tracking-widest leading-none">
                                            {kelas.invite_code}
                                        </span>
                                    </div>

                                    {/* Garis Pemisah */}
                                    <div className="w-[1px] h-10 bg-slate-700/50"></div>

                                    {/* Tombol Copy */}
                                    <button
                                        onClick={() => copyToClipboard(kelas.invite_code)}
                                        className="px-5 py-4 text-slate-400 hover:text-white hover:bg-blue-600 transition-all active:scale-95 shrink-0 flex items-center justify-center"
                                        title="Salin Kode"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}