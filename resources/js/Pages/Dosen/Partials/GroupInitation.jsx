import React from 'react';

export default function GroupInitation({ groupForm, memberForm, daftarKelompok, mahasiswaTanpaKelompok, submitGroup, submitMember }) {

    const applyAIPlan = () => {
        const selectedStudentId = memberForm.data.student_id;
        if (!selectedStudentId) return alert("Pilih mahasiswa di Waiting List dulu!");

        const studentData = mahasiswaTanpaKelompok.find(m => m.id == selectedStudentId);
        if (studentData && studentData.ai_suggested_id) {
            memberForm.setData('group_id', studentData.ai_suggested_id);
        } else {
            alert("Mahasiswa ini belum punya rekomendasi dari AI.");
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
            <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                <h3 className="font-black text-slate-800 dark:text-white text-base">Manajemen Tim</h3>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Inisiasi & Deploy Anggota</p>
            </div>

            {/* FORM 1: BUAT TIM */}
            <form onSubmit={submitGroup} className="mb-8">
                <div className="mb-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nama Tim Baru</label>
                    <input
                        type="text"
                        placeholder="Misal: Tim Alpha"
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        value={groupForm.data.nama_kelompok}
                        onChange={e => groupForm.setData('nama_kelompok', e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={groupForm.processing} className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white transition-all">
                    Buat Tim Baru
                </button>
            </form>

            {/* FORM 2: DEPLOY ANGGOTA */}
            <form onSubmit={submitMember}>
                <div className="mb-4">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pilih Mahasiswa</label>
                    <select
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        value={memberForm.data.student_id}
                        onChange={e => memberForm.setData('student_id', e.target.value)}
                        required
                    >
                        <option value="">-- Pilih dari Waiting List --</option>
                        {mahasiswaTanpaKelompok?.map(m => (
                            <option key={m.id} value={m.id}>{m.ai_suggested_id ? '✨ ' : ''}{m.name}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Target Tim</label>
                    <div className="flex gap-2">
                        <select
                            className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            value={memberForm.data.group_id}
                            onChange={e => memberForm.setData('group_id', e.target.value)}
                            required
                        >
                            <option value="">-- Pilih Tim --</option>
                            {daftarKelompok?.map(g => (
                                <option key={g.id} value={g.id}>{g.nama_kelompok || g.nama}</option>
                            ))}
                        </select>
                        <button type="button" onClick={applyAIPlan} title="Pakai Rekomendasi AI" className="px-4 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-xl transition-all shadow-sm">
                            ✨
                        </button>
                    </div>
                </div>

                <button type="submit" disabled={memberForm.processing} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md transition-all">
                    Deploy ke Tim
                </button>
            </form>
        </div>
    );
}