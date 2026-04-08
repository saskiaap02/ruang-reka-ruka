import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({ auth, totalKelasAktif, totalKelompok, kelompokKritis, daftarKelompok }) {
    // State untuk kontrol Modal Pop-up
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Setup Form Inertia
    const { data, setData, post, processing, reset, errors } = useForm({
        mata_kuliah: '',
        nama_kelas: '',
        bobot_dasar: 50,
        bobot_audit: 30,
        bobot_peer: 20,
    });

    const submitKelas = (e) => {
        e.preventDefault();
        post(route('dosen.kelas.store'), {
            onSuccess: () => {
                setIsModalOpen(false); // Tutup modal jika sukses
                reset(); // Kosongkan form
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-slate-800 dark:text-white leading-tight">
                        Dashboard Dosen - Monitoring Kelas
                    </h2>

                    {/* TOMBOL TAMBAH KELAS */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all active:scale-95"
                    >
                        + Buat Ruang Kelas
                    </button>
                </div>
            }
        >
            <Head title="Dashboard Dosen" />

            {/* --- MODAL TAMBAH KELAS --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-8 relative border border-slate-200 dark:border-slate-700">
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Buat Ruang Kelas Baru</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Lengkapi data untuk membuat ruang kelas audit baru.</p>

                        <form onSubmit={submitKelas} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Mata Kuliah</label>
                                <input type="text" required value={data.mata_kuliah} onChange={e => setData('mata_kuliah', e.target.value)}
                                    className="block w-full rounded-xl border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Contoh: Sistem Informasi Manajemen" />
                                {errors.mata_kuliah && <div className="text-red-500 text-xs mt-1">{errors.mata_kuliah}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Kelas</label>
                                <input type="text" required value={data.nama_kelas} onChange={e => setData('nama_kelas', e.target.value)}
                                    className="block w-full rounded-xl border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Contoh: Kelas 4A" />
                                {errors.nama_kelas && <div className="text-red-500 text-xs mt-1">{errors.nama_kelas}</div>}
                            </div>

                            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 text-center uppercase tracking-wider">Bobot Penilaian (%)</h4>
                                <div className="grid grid-cols-3 gap-3 text-center">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-slate-500">Nilai Dasar</label>
                                        <input type="number" value={data.bobot_dasar} onChange={e => setData('bobot_dasar', e.target.value)}
                                            className="block w-full rounded-lg border-slate-300 dark:bg-slate-900 dark:text-white text-center font-bold" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-slate-500">Audit</label>
                                        <input type="number" value={data.bobot_audit} onChange={e => setData('bobot_audit', e.target.value)}
                                            className="block w-full rounded-lg border-slate-300 dark:bg-slate-900 dark:text-white text-center font-bold" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-slate-500">Peer</label>
                                        <input type="number" value={data.bobot_peer} onChange={e => setData('bobot_peer', e.target.value)}
                                            className="block w-full rounded-lg border-slate-300 dark:bg-slate-900 dark:text-white text-center font-bold" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <button type="button" onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all">
                                    Batal
                                </button>
                                <button type="submit" disabled={processing}
                                    className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50">
                                    {processing ? 'Menyimpan...' : 'Simpan Kelas'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* --- KARTU RINGKASAN ATAS --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                            <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-1">Total Kelas Aktif</p>
                            <p className="text-3xl font-bold text-slate-800 dark:text-white">{totalKelasAktif}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                            <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-1">Total Kelompok</p>
                            <p className="text-3xl font-bold text-slate-800 dark:text-white">{totalKelompok}</p>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl shadow-sm border border-red-200 dark:border-red-900/50 relative overflow-hidden transition-all">
                            <div className="absolute top-0 right-0 w-2 h-full bg-red-500 dark:bg-red-600"></div>
                            <p className="text-red-600 dark:text-red-400 text-xs uppercase font-bold mb-1">Peringatan Sistem</p>
                            <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                                {kelompokKritis?.length || 0} Kelompok Bermasalah
                            </p>
                            {kelompokKritis?.length > 0 && (
                                <button className="mt-2 text-xs font-bold text-white bg-red-600 dark:bg-red-500 px-3 py-1.5 rounded hover:bg-red-700 transition">
                                    Tinjau Konflik
                                </button>
                            )}
                        </div>
                    </div>

                    {/* --- AREA MONITORING KELOMPOK & AUDIT LOG --- */}
                    <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm sm:rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Monitoring & Audit Log Kelompok</h3>
                            <span className="bg-white dark:bg-slate-700 text-[10px] font-bold px-3 py-1 rounded-full border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 shadow-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Real-time Audit: ON
                            </span>
                        </div>

                        <div className="p-0 overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-sm">
                                        <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Nama Kelompok</th>
                                        <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                                        <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-center">Progress</th>
                                        <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Log Aktivitas Terakhir</th>
                                        <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {daftarKelompok && daftarKelompok.length > 0 ? (
                                        daftarKelompok.map((kelompok) => (
                                            <tr key={kelompok.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="p-4">
                                                    <p className="font-bold text-slate-800 dark:text-white">{kelompok.nama}</p>
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{kelompok.proyek}</p>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase tracking-tighter ${kelompok.status === 'Aman'
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                        }`}>
                                                        {kelompok.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{kelompok.progress}</span>
                                                        <div className="w-20 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full transition-all duration-500 ${parseInt(kelompok.progress) > 50 ? 'bg-blue-500' : 'bg-orange-500'}`}
                                                                style={{ width: kelompok.progress }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                                                        "{kelompok.log_terakhir}"
                                                    </p>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <button className="text-xs font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 border border-blue-200 dark:border-blue-900 px-3 py-1 rounded-lg transition-all hover:bg-blue-50">
                                                        Detail
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-slate-500">Belum ada kelompok terdaftar.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}