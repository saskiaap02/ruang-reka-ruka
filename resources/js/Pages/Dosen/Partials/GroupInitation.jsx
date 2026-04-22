import React from 'react';

export default function GroupInitation({ groupForm, memberForm, daftarKelompok, mahasiswaTanpaKelompok, submitGroup, submitMember }) {
    
    const applyAIPlan = () => {
        const student = mahasiswaTanpaKelompok.find(m => m.id == memberForm.data.student_id);
        if (student?.ai_suggested_id) {
            memberForm.setData('group_id', student.ai_suggested_id);
        } else {
            alert("Mahasiswa ini belum punya rencana plotting AI.");
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
            {/* --- LANGKAH 1: KIRI --- */}
            <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20">1</div>
                    <h4 className="font-black text-slate-800 tracking-tight italic text-lg">Inisiasi Tim Baru</h4>
                </div>

                <form onSubmit={submitGroup} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identitas Tim</label>
                        <input 
                            type="text" 
                            placeholder="Contoh: Tim Aero-Shield" 
                            className="w-full bg-white border-slate-200 rounded-2xl text-sm font-bold py-5 px-6 focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                            value={groupForm.data.nama_kelompok} 
                            onChange={e => groupForm.setData('nama_kelompok', e.target.value)} 
                            required 
                        />
                    </div>
                    <button className="w-full py-5 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95">
                        Simpan Identitas Tim
                    </button>
                </form>
            </div>

            {/* --- LANGKAH 2: KANAN --- */}
            <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-emerald-500/20">2</div>
                    <h4 className="font-black text-slate-800 tracking-tight italic text-lg">Deploy Anggota</h4>
                </div>

                <form onSubmit={submitMember} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pilih Mahasiswa</label>
                        <select 
                            className="w-full bg-white border-slate-200 rounded-2xl text-sm font-bold py-5 px-6 focus:ring-2 focus:ring-emerald-500 transition-all outline-none appearance-none"
                            value={memberForm.data.student_id} 
                            onChange={e => memberForm.setData('student_id', e.target.value)} 
                            required
                        >
                            <option value="">-- Waiting List --</option>
                            {mahasiswaTanpaKelompok?.map(m => (
                                <option key={m.id} value={m.id}>{m.ai_suggested_id ? '✨ ' : ''}{m.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Tim</label>
                        <div className="flex gap-3">
                            <select 
                                className="flex-1 bg-white border-slate-200 rounded-2xl text-sm font-bold py-5 px-6 focus:ring-2 focus:ring-emerald-500 transition-all outline-none appearance-none"
                                value={memberForm.data.group_id} 
                                onChange={e => memberForm.setData('group_id', e.target.value)} 
                                required
                            >
                                <option value="">-- Pilih Tim --</option>
                                {daftarKelompok?.map(g => (
                                    <option key={g.id} value={g.id}>{g.nama_kelompok || g.nama}</option>
                                ))}
                            </select>
                            <button type="button" onClick={applyAIPlan} className="px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-lg transition-all active:scale-90">✨</button>
                        </div>
                    </div>

                    <button className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95">
                        Gabungkan ke Tim
                    </button>
                </form>
            </div>
        </div>
    );
}