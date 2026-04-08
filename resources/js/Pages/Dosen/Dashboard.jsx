import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react'; // Tambah Link di sini
import { useState } from 'react';

export default function Dashboard({ auth, totalKelasAktif, totalKelompok, kelompokKritis, daftarKelompok, daftarKelas }) {
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

    // Fungsi submit form kelas baru
    const submitKelas = (e) => {
        e.preventDefault();
        post(route('dosen.kelas.store'), {
            onSuccess: () => {
                setIsModalOpen(false); // Tutup modal jika sukses
                reset(); // Kosongkan form
            }
        });
    };

    // Fungsi copy ke clipboard
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert(`Kode ${text} berhasil disalin!`);
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
                                    className="block w-full rounded-xl border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white shadow-sm focus:ring-blue-500"
                                    placeholder="Contoh: Sistem Informasi Manajemen" />
                                {errors.mata_kuliah && <div className="text-red-500 text-xs mt-1">{errors.mata_kuliah}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Kelas</label>
                                <input type="text" required value={data.nama_kelas} onChange={e => setData('nama_kelas', e.target.value)}
                                    className="block w-full rounded-xl border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white shadow-sm focus:ring-blue-500"
                                    placeholder="Contoh: Kelas 4A" />
                                {errors.nama_kelas && <div className="text-red-500 text-xs mt-1">{errors.nama_kelas}</div>}
                            </div>

                            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-widest">Bobot Penilaian (%)</h4>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">Dasar</label>
                                        <input type="number" value={data.bobot_dasar} onChange={e => setData('bobot_dasar', e.target.value)}
                                            className="block w-full rounded-lg border-slate-300 dark:bg-slate-900 text-center dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">Audit</label>
                                        <input type="number" value={data.bobot_audit} onChange={e => setData('bobot_audit', e.target.value)}
                                            className="block w-full rounded-lg border-slate-300 dark:bg-slate-900 text-center dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">Peer</label>
                                        <input type="number" value={data.bobot_peer} onChange={e => setData('bobot_peer', e.target.value)}
                                            className="block w-full rounded-lg border-slate-300 dark:bg-slate-900 text-center dark:text-white" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-slate-500 font-bold hover:text-slate-700">Batal</button>
                                <button type="submit" disabled={processing} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 active:scale-95 transition-all">
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
                        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl shadow-sm border border-red-200 dark:border-red-900/50 relative">
                            <div className="absolute top-0 right-0 w-2 h-full bg-red-500"></div>
                            <p className="text-red-600 dark:text-red-400 text-xs uppercase font-bold mb-1">Peringatan Sistem</p>
                            <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                                {kelompokKritis?.length || 0} Kelompok Bermasalah
                            </p>
                        </div>
                    </div>

                    {/* --- AREA MANAJEMEN KELAS & KODE INVITE --- */}
                    <div className="bg-white dark:bg-slate-800 shadow-sm sm:rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Daftar Ruang Kelas & Akses Masuk</h3>
                        </div>
                        <div className="p-6">
                            {daftarKelas?.length === 0 ? (
                                <p className="text-center text-slate-500 italic">Belum ada ruang kelas. Silakan buat kelas baru.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {daftarKelas?.map((kelas) => (
                                        <div key={kelas.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
                                            <div>
                                                <p className="font-bold text-slate-800 dark:text-white leading-tight">{kelas.mata_kuliah}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{kelas.nama_kelas}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] uppercase font-bold text-slate-400 mb-1 tracking-widest">Invite Code</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-base font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800">
                                                        {kelas.invite_code}
                                                    </span>
                                                    <button
                                                        onClick={() => copyToClipboard(kelas.invite_code)}
                                                        className="p-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors rounded"
                                                        title="Salin Kode"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
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
                    </div>

                    {/* --- AREA MONITORING KELOMPOK --- */}
                    <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm sm:rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Monitoring & Audit Log Kelompok</h3>
                            <span className="bg-white dark:bg-slate-700 text-[10px] font-bold px-3 py-1 rounded-full border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 flex items-center gap-2 shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Audit: ON
                            </span>
                        </div>
                        <div className="p-0 overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-xs font-bold uppercase tracking-wider text-slate-500">
                                        <th className="p-4">Nama Kelompok</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-center">Progress</th>
                                        <th className="p-4">Log Terakhir</th>
                                        <th className="p-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {daftarKelompok?.length > 0 ? (
                                        daftarKelompok.map((kelompok) => (
                                            <tr key={kelompok.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="p-4">
                                                    <p className="font-bold text-slate-800 dark:text-white text-sm">{kelompok.nama}</p>
                                                    <p className="text-[10px] text-slate-500 uppercase font-medium tracking-tight">{kelompok.proyek}</p>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-0.5 text-[10px] font-black rounded-md uppercase tracking-widest ${kelompok.status === 'Aman' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                        }`}>{kelompok.status}</span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-[10px] font-bold text-slate-600 mb-1">{kelompok.progress}</span>
                                                        <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
                                                            <div className={`h-full ${parseInt(kelompok.progress) > 50 ? 'bg-blue-500' : 'bg-orange-500'}`} style={{ width: kelompok.progress }}></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-xs italic text-slate-500">"{kelompok.log_terakhir}"</td>
                                                <td className="p-4 text-center">
                                                    {/* TOMBOL DETAIL SEKARANG JADI LINK INERTIA */}
                                                    <Link
                                                        href={route('dosen.kelompok.show', { id: kelompok.id })}
                                                        className="text-[10px] font-bold uppercase tracking-widest text-blue-600 border border-blue-200 px-3 py-1 rounded-lg hover:bg-blue-50 transition-all shadow-sm"
                                                    >
                                                        Detail Audit
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="5" className="p-8 text-center text-slate-500 text-xs italic">Belum ada kelompok terdaftar.</td></tr>
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