import React from 'react';

// Tambahkan 'auth' di daftar parameter
export default function GroupInitation({ auth, groupForm, memberForm, daftarKelas, daftarKelompok, mahasiswaTanpaKelompok, submitGroup, submitMember }) {

    // Ambil nama depan Dosen yang sedang login
    const firstName = auth?.user?.name ? auth.user.name.split(' ')[0] : 'Bapak/Ibu Dosen';

    // --- LOGIKA ASISTEN AI ---
    const applyAIPlan = () => {
        const selectedStudentId = memberForm.data.student_id;
        if (!selectedStudentId) {
            // Gunakan nama dinamis di sini
            alert(`Pilih mahasiswanya dulu, ${firstName}!`);
            return;
        }

        const studentData = mahasiswaTanpaKelompok.find(m => m.id == selectedStudentId);

        if (studentData && studentData.ai_suggested_id) {
            memberForm.setData('group_id', studentData.ai_suggested_id);
            alert(`Asisten AI menyarankan ${studentData.name} masuk ke kelompok tersebut.`);
        } else {
            alert("Mahasiswa ini belum punya rencana plotting AI.");
        }
    };

    return (
        <div className="w-full flex flex-col gap-10">

            {/* --- 1. INISIASI TIM (BAGIAN ATAS) --- */}
            <div className="w-full transition-all group">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg shadow-blue-500/20">1</div>
                    <div>
                        <h3 className="font-black text-slate-800 text-sm tracking-tight italic">Inisiasi Tim Baru</h3>
                        <p className="text-[8px] text-slate-400 uppercase tracking-widest font-bold">Langkah Awal</p>
                    </div>
                </div>

                <form onSubmit={submitGroup} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 ml-1 uppercase tracking-widest">Identitas Tim</label>
                        <input
                            type="text"
                            placeholder="Contoh: Tim Aero-Shield"
                            className="w-full bg-slate-50 border-slate-200 rounded-2xl text-xs text-slate-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all py-4 px-5 outline-none placeholder:text-slate-300"
                            value={groupForm.data.nama_kelompok}
                            onChange={e => groupForm.setData('nama_kelompok', e.target.value)}
                            required
                        />
                    </div>

                    <button className="w-full py-4 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95">
                        Simpan Identitas Tim
                    </button>
                </form>
            </div>

            {/* Garis Pembatas Halus */}
            <div className="h-[1px] w-full bg-slate-100"></div>

            {/* --- 2. DEPLOY ANGGOTA (BAGIAN BAWAH) --- */}
            <div className="w-full transition-all group">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg shadow-emerald-500/20">2</div>
                    <div>
                        <h3 className="font-black text-slate-800 text-sm tracking-tight italic">Deploy Anggota</h3>
                        <p className="text-[8px] text-slate-400 uppercase tracking-widest font-bold">Penugasan Mahasiswa</p>
                    </div>
                </div>

                <form onSubmit={submitMember} className="space-y-4">
                    {/* PILIH MAHASISWA */}
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 ml-1 uppercase tracking-widest">Waiting List</label>
                        <select
                            className="w-full bg-slate-50 border-slate-200 rounded-2xl text-xs text-slate-700 focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all py-4 px-5 outline-none appearance-none"
                            value={memberForm.data.student_id}
                            onChange={e => memberForm.setData('student_id', e.target.value)}
                            required
                        >
                            <option value="">-- Pilih Mahasiswa --</option>
                            {mahasiswaTanpaKelompok?.map(m => (
                                <option key={m.id} value={m.id}>
                                    {m.ai_suggested_id ? '✨ ' : ''}{m.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* TARGET KELOMPOK + TOMBOL AI */}
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 ml-1 uppercase tracking-widest">Target Tim Audit</label>
                        <div className="flex gap-2">
                            <select
                                className="flex-1 bg-slate-50 border-slate-200 rounded-2xl text-xs text-slate-700 focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all py-4 px-5 outline-none appearance-none"
                                value={memberForm.data.group_id}
                                onChange={e => memberForm.setData('group_id', e.target.value)}
                                required
                            >
                                <option value="">-- Pilih Tim --</option>
                                {daftarKelompok?.map(g => (
                                    <option key={g.id} value={g.id}>{g.nama_kelompok || g.nama}</option>
                                ))}
                            </select>

                            <button
                                type="button"
                                onClick={applyAIPlan}
                                className="px-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-600/20 transition-all active:scale-90"
                            >
                                ✨
                            </button>
                        </div>
                    </div>

                    <button className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 mt-2">
                        Gabungkan ke Kelompok
                    </button>
                </form>
            </div>
        </div>
    );
}