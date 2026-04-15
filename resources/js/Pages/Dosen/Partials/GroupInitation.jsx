export default function GroupInitation({ groupForm, memberForm, daftarKelas, daftarKelompok, mahasiswaTanpaKelompok, submitGroup, submitMember }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">1</div>
                    <h3 className="font-bold text-slate-800 dark:text-white">Inisiasi Kelompok Baru</h3>
                </div>
                <form onSubmit={submitGroup} className="space-y-4">
                    <select className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white"
                        value={groupForm.data.project_class_id} onChange={e => groupForm.setData('project_class_id', e.target.value)} required>
                        <option value="">-- Pilih Ruang Kelas --</option>
                        {daftarKelas?.map(k => <option key={k.id} value={k.id}>{k.nama_kelas} ({k.mata_kuliah})</option>)}
                    </select>
                    <input type="text" placeholder="Nama Kelompok (Contoh: Tim Alpha)" className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white"
                        value={groupForm.data.nama_kelompok} onChange={e => groupForm.setData('nama_kelompok', e.target.value)} required />
                    <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition-all">Simpan Kelompok</button>
                </form>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center font-bold text-sm">2</div>
                    <h3 className="font-bold text-slate-800 dark:text-white">Penugasan Mahasiswa ke Tim</h3>
                </div>
                <form onSubmit={submitMember} className="space-y-4">
                    <select className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white"
                        value={memberForm.data.student_id} onChange={e => memberForm.setData('student_id', e.target.value)} required>
                        <option value="">-- Pilih Mahasiswa (Waiting List) --</option>
                        {mahasiswaTanpaKelompok?.map(m => <option key={m.id} value={m.id}>{m.name} ({m.nama_kelas})</option>)}
                    </select>
                    <select className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white"
                        value={memberForm.data.group_id} onChange={e => memberForm.setData('group_id', e.target.value)} required>
                        <option value="">-- Pilih Kelompok Tujuan --</option>
                        {daftarKelompok?.map(g => <option key={g.id} value={g.id}>{g.nama}</option>)}
                    </select>
                    <button className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-emerald-700 transition-all">Gabungkan ke Kelompok</button>
                </form>
            </div>
        </div>
    );
}