export default function CreateClassModal({ isOpen, closeModal, form, submit }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg p-8 relative border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Buat Ruang Kelas Baru</h3>
                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Mata Kuliah</label>
                        <input type="text" required value={form.data.mata_kuliah} onChange={e => form.setData('mata_kuliah', e.target.value)}
                            className="block w-full rounded-xl border-slate-300 dark:bg-slate-900 dark:text-white shadow-sm focus:ring-blue-500" placeholder="Contoh: Pemrograman Web" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Kelas</label>
                        <input type="text" required value={form.data.nama_kelas} onChange={e => form.setData('nama_kelas', e.target.value)}
                            className="block w-full rounded-xl border-slate-300 dark:bg-slate-900 dark:text-white shadow-sm focus:ring-blue-500" placeholder="Contoh: SI 4B" />
                    </div>
                    <div className="pt-4 border-t border-slate-200">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase text-center">Bobot Penilaian (%)</h4>
                        <div className="grid grid-cols-3 gap-3">
                            {['dasar', 'audit', 'peer'].map(type => (
                                <div key={type}>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase block text-center">{type}</label>
                                    <input type="number" value={form.data[`bobot_${type}`]} onChange={e => form.setData(`bobot_${type}`, e.target.value)}
                                        className="block w-full rounded-lg border-slate-300 dark:bg-slate-900 text-center dark:text-white" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                        <button type="button" onClick={closeModal} className="px-6 py-2 text-slate-500 font-bold">Batal</button>
                        <button type="submit" disabled={form.processing} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg">
                            {form.processing ? 'Menyimpan...' : 'Simpan Kelas'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}