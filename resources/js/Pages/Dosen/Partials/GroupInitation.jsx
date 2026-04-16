import React from 'react';

export default function GroupInitation({ groupForm, memberForm, daftarKelas, daftarKelompok, mahasiswaTanpaKelompok, submitGroup, submitMember }) {
    return (
        <div className="w-full">
            {/* Grid dibuat 2 kolom pada layar besar (lg), dan tetap berdampingan tanpa celah lebar yang sia-sia */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                
                {/* --- 1. INISIASI KELOMPOK (KIRI) --- */}
                <div className="w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl flex flex-col justify-between transition-all hover:border-blue-500/30 group">
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20 text-blue-400 font-black text-lg">1</div>
                            <div>
                                <h3 className="font-black text-white text-base tracking-tight italic">Inisiasi Tim Baru</h3>
                                <p className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-bold">Deploy Kelompok</p>
                            </div>
                        </div>

                        <form onSubmit={submitGroup} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-600 ml-2 uppercase tracking-widest">Ruang Kelas</label>
                                <select 
                                    className="w-full bg-[#0b1120]/80 border-slate-800 rounded-2xl text-xs text-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all py-4 px-5 outline-none"
                                    value={groupForm.data.project_class_id} 
                                    onChange={e => groupForm.setData('project_class_id', e.target.value)} 
                                    required
                                >
                                    <option value="">-- Pilih Kelas --</option>
                                    {daftarKelas?.map(k => (
                                        <option key={k.id} value={k.id} className="bg-slate-900">{k.nama_kelas} ({k.mata_kuliah})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-600 ml-2 uppercase tracking-widest">Identitas Tim</label>
                                <input 
                                    type="text" 
                                    placeholder="Contoh: Tim Aero-Shield" 
                                    className="w-full bg-[#0b1120]/80 border-slate-800 rounded-2xl text-xs text-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder:text-slate-700 transition-all py-4 px-5 outline-none"
                                    value={groupForm.data.nama_kelompok} 
                                    onChange={e => groupForm.setData('nama_kelompok', e.target.value)} 
                                    required 
                                />
                            </div>

                            <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 transition-all active:scale-95">
                                Simpan Identitas Tim
                            </button>
                        </form>
                    </div>
                </div>

                {/* --- 2. PENUGASAN MAHASISWA (KANAN) --- */}
                <div className="w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl flex flex-col justify-between transition-all hover:border-emerald-500/30 group">
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 bg-emerald-600/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 text-emerald-400 font-black text-lg">2</div>
                            <div>
                                <h3 className="font-black text-white text-base tracking-tight italic">Deploy Anggota</h3>
                                <p className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-bold">Penugasan Mahasiswa</p>
                            </div>
                        </div>

                        <form onSubmit={submitMember} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-600 ml-2 uppercase tracking-widest">Mahasiswa Waiting List</label>
                                <select 
                                    className="w-full bg-[#0b1120]/80 border-slate-800 rounded-2xl text-xs text-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all py-4 px-5 outline-none"
                                    value={memberForm.data.student_id} 
                                    onChange={e => memberForm.setData('student_id', e.target.value)} 
                                    required
                                >
                                    <option value="">-- Pilih Mahasiswa --</option>
                                    {mahasiswaTanpaKelompok?.map(m => (
                                        <option key={m.id} value={m.id} className="bg-slate-900">{m.name} ({m.nama_kelas})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-600 ml-2 uppercase tracking-widest">Target Tim Audit</label>
                                <select 
                                    className="w-full bg-[#0b1120]/80 border-slate-800 rounded-2xl text-xs text-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all py-4 px-5 outline-none"
                                    value={memberForm.data.group_id} 
                                    onChange={e => memberForm.setData('group_id', e.target.value)} 
                                    required
                                >
                                    <option value="">-- Pilih Kelompok --</option>
                                    {daftarKelompok?.map(g => (
                                        <option key={g.id} value={g.id} className="bg-slate-900">{g.nama}</option>
                                    ))}
                                </select>
                            </div>

                            <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/20 transition-all active:scale-95">
                                Gabungkan ke Kelompok
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}