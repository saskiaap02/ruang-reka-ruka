import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'react-hot-toast';

export default function KanbanBoard({ tasks = [], updateStatus, handleDelete, openModal, onNext, onEdit }) {
    // --- TAMBAHAN UNTUK MODAL KUMPUL BUKTI ---
    const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        evidence_file: null,
        notes: '',
    });

    // --- TAMBAHAN UNTUK SUBMIT BUKTI ---
    const handleNextAction = (task) => {
        if (normalizeStatus(task.status) === 'backlog') {
            updateStatus && updateStatus(task.id, 'in_progress');
        } else if (normalizeStatus(task.status) === 'in_progress') {
            setSelectedTask(task);
            setIsEvidenceModalOpen(true);
        }
    };

    // --- SUBMIT BUKTI KE BACKEND ---
    const submitEvidence = (e) => {
        e.preventDefault();

        // 1. Validasi dadakan (Biar ga diam aja kalau kosong)
        if (!data.evidence_file) {
            toast.error('Pilih file bukti terlebih dahulu!');
            return;
        }

        // 2. KUNCI JAWABANNYA DI SINI: pakai prefix "mahasiswa."
        post(route('mahasiswa.tasks.complete', selectedTask.id), {
            forceFormData: true, // Wajib ada untuk kirim file gambar/pdf
            preserveScroll: true,
            onSuccess: () => {
                setIsEvidenceModalOpen(false);
                reset();
                toast.success('Bukti berhasil dikirim! Tugas selesai.');
            },
            onError: (err) => {
                console.error("Error Validasi Laravel:", err);
                toast.error('Gagal mengirim! Cek peringatan warna merah.');
            }
        });
    };

    // --- TAMBAHAN KOMPONEN HEATMAP ---
    const ActivityHeatmap = () => {
        const activityMap = {};
        tasks.forEach(task => {
            // Mencari nama PIC, sesuaikan dengan struktur datamu (bisa task.pic?.name, dll)
            const pic = task.pic?.name || task.pic_name || 'Tim Gabungan'; 
            if (!activityMap[pic]) activityMap[pic] = { total: 0, done: 0 };
            activityMap[pic].total += 1;
            if (normalizeStatus(task.status) === 'done') activityMap[pic].done += 1;
        });

        const getColor = (done, total) => {
            if (total === 0) return 'bg-slate-100 dark:bg-slate-800';
            const ratio = done / total;
            if (ratio === 0) return 'bg-emerald-100 dark:bg-emerald-900/30';
            if (ratio < 0.5) return 'bg-emerald-300 dark:bg-emerald-700/50';
            if (ratio < 1) return 'bg-emerald-500 dark:bg-emerald-600';
            return 'bg-emerald-700 dark:bg-emerald-400';
        };

        return (
            <div className="mb-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 sm:p-5 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-black text-sm text-slate-800 dark:text-slate-200 tracking-tight italic">Heatmap Kontribusi</h3>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Intensitas Penyelesaian Tugas</p>
                    </div>
                    <div className="flex gap-1.5 items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>Pasif</span>
                        <div className="w-3 h-3 rounded-sm bg-emerald-100 dark:bg-emerald-900/30"></div>
                        <div className="w-3 h-3 rounded-sm bg-emerald-300 dark:bg-emerald-700/50"></div>
                        <div className="w-3 h-3 rounded-sm bg-emerald-500 dark:bg-emerald-600"></div>
                        <div className="w-3 h-3 rounded-sm bg-emerald-700 dark:bg-emerald-400"></div>
                        <span>Aktif</span>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                    {Object.keys(activityMap).length > 0 ? (
                        Object.entries(activityMap).map(([pic, stats], index) => (
                            <div key={index} className="flex items-center gap-2 group cursor-default">
                                <div className={`w-6 h-6 rounded-md ${getColor(stats.done, stats.total)} transition-all shadow-sm group-hover:scale-110`}></div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{pic}</span>
                                    <span className="text-[9px] text-slate-400 font-medium">{stats.done}/{stats.total} Selesai</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-slate-400">Belum ada data tugas untuk dianalisis.</p>
                    )}
                </div>
            </div>
        );
    };

    // Fungsi pembantu untuk menyamakan format string
    const normalizeStatus = (str) => str ? str.toLowerCase().trim() : '';

    const Column = ({ title, status, colorClass, bgBadge, borderColor, columnBg }) => {
        // Ambil tugas khusus untuk kolom ini
        const columnTasks = tasks?.filter(t => normalizeStatus(t.status) === normalizeStatus(status)) || [];

        return (
            // Menggunakan background solid di light mode agar tidak transparan
            <div className={`${columnBg} dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 p-3 sm:p-4 rounded-2xl flex flex-col h-fit transition-all`}>

                {/* Header Kolom */}
                <div className={`flex justify-between items-center mb-4 pb-3 border-b-2 ${borderColor}`}>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${bgBadge}`}></div>
                        <h3 className={`font-bold text-xs uppercase tracking-wider m-0 ${colorClass}`}>{title}</h3>
                    </div>
                    <span className="bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {columnTasks.length}
                    </span>
                </div>

                {/* List Tugas */}
                <div className="flex flex-col gap-3">
                    {columnTasks.map(task => (
                        // Kartu menggunakan putih solid dan shadow yang lebih kentara
                        <div key={task.id} className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all flex flex-col relative">

                            {/* Tombol Aksi (Edit & Hapus) - Mengambang di Kanan Atas */}
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-slate-800 pl-2 pb-1 rounded-bl-lg z-10">
                                <button
                                    onClick={() => onEdit && onEdit(task)}
                                    className="text-slate-400 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 dark:bg-slate-700 dark:hover:bg-indigo-500/20 p-1.5 rounded-md transition-colors"
                                    title="Edit"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>
                                <button
                                    onClick={() => handleDelete(task.id)}
                                    className="text-slate-400 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 dark:bg-slate-700 dark:hover:bg-rose-500/20 p-1.5 rounded-md transition-colors"
                                    title="Hapus"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>

                            {/* Judul Tugas */}
                            <p className={`text-sm font-bold text-slate-800 dark:text-slate-200 m-0 pr-12 line-clamp-3 leading-snug ${status === 'done' ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                                {task.judul || task.title}
                            </p>

                            {/* FOOTER KARTU TUGAS (Semua Inline / Sejajar) */}
                            <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center h-7">

                                {status === 'in_progress' ? (
                                    <>
                                        <button onClick={() => updateStatus && updateStatus(task.id, 'backlog')} className="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                            Batal
                                        </button>
                                        <button onClick={() => handleNextAction(task)} className="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 hover:bg-indigo-100 hover:text-indigo-700 dark:hover:bg-indigo-500/20 px-3 py-1.5 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 border border-indigo-100 dark:border-transparent">
                                            Kumpul Bukti <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                        </button>
                                    </>
                                ) : status === 'backlog' ? (
                                    <>
                                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Antrean</span>
                                        {/* INI BAGIAN YANG DIPERBAIKI (Ganti onNext jadi updateStatus) */}
                                        <button onClick={() => updateStatus && updateStatus(task.id, 'in_progress')} className="text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 border border-slate-200 dark:border-transparent">
                                            Kerjakan <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => updateStatus && updateStatus(task.id, 'in_progress')} className="text-[10px] font-bold text-slate-400 hover:text-amber-500 transition-colors flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                                            Tarik
                                        </button>
                                        <div className="flex items-center gap-2">
                                            {task.file_path && (
                                                <a href={`/storage/${task.file_path}`} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 hover:underline transition-colors flex items-center gap-0.5">
                                                    File ↗
                                                </a>
                                            )}
                                            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded border border-emerald-200 dark:border-emerald-500/20">Selesai</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Placeholder jika kosong */}
                    {columnTasks.length === 0 && (
                        <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 border-2 border-dashed border-slate-200 dark:border-slate-700/50 rounded-xl py-6 mt-1">
                            <span className="text-sm font-medium">Kosong</span>
                        </div>
                    )}
                </div>

                {/* Tombol Tambah hanya muncul kalau status kolomnya "backlog" */}
                {status === 'backlog' && (
                    <button
                        onClick={() => openModal(status)}
                        className="w-full mt-3 py-2.5 bg-white dark:bg-transparent border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm dark:shadow-none"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        Tambah Tugas
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col w-full">
            {/* --- HEATMAP KONTRIBUSI --- */}
            <ActivityHeatmap />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-start">
                <Column title="Backlog" status="backlog" colorClass="text-slate-700 dark:text-slate-300" bgBadge="bg-slate-400" borderColor="border-slate-300 dark:border-slate-600" columnBg="bg-slate-100" />
                <Column title="In Progress" status="in_progress" colorClass="text-indigo-700 dark:text-indigo-400" bgBadge="bg-indigo-500" borderColor="border-indigo-300 dark:border-indigo-600/60" columnBg="bg-indigo-50/50" />
                <Column title="Done" status="done" colorClass="text-emerald-700 dark:text-emerald-400" bgBadge="bg-emerald-500" borderColor="border-emerald-300 dark:border-emerald-600/60" columnBg="bg-emerald-50/50" />
            </div>

            {/* --- MODAL INTERNAL UPLOAD BUKTI --- */}
            {isEvidenceModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h2 className="text-lg font-black text-slate-800 dark:text-white mb-2 italic">Kumpul Bukti Kerja</h2>
                        <p className="text-xs text-slate-500 mb-6 uppercase tracking-widest font-bold">Tugas: {selectedTask?.judul || selectedTask?.title}</p>

                        <form onSubmit={submitEvidence} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">File Bukti (Gambar/PDF)</label>
                                <input 
                                    type="file" 
                                    onChange={e => setData('evidence_file', e.target.files[0])}
                                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-500/20 dark:file:text-indigo-400 transition-all outline-none"
                                    required
                                />
                                {errors.evidence_file && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.evidence_file}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Catatan Tambahan</label>
                                <textarea 
                                    className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 dark:text-slate-200 rounded-xl text-xs py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    placeholder="Tulis apa yang sudah kamu kerjakan..."
                                    rows="3"
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                ></textarea>
                                {errors.notes && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.notes}</p>}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setIsEvidenceModalOpen(false)} className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">Batal</button>
                                <button type="submit" disabled={processing} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50">
                                    {processing ? 'Mengirim...' : 'Kirim & Selesai'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}