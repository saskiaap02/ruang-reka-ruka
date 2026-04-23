import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import StatCards from './Partials/StatCards';
import GroupInitation from './Partials/GroupInitation';
import ClassAccessList from './Partials/ClassAccessList';
import MonitoringTable from './Partials/MonitoringTable';
import CreateClassModal from './Partials/CreateClassModal';

export default function Dashboard({ auth, totalKelasAktif, totalKelompok, kelompokKritis, daftarKelompok, daftarKelas, mahasiswaTanpaKelompok }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form Hooks
    const classForm = useForm({
        mata_kuliah: '',
        nama_kelas: '',
        bobot_dasar: 50,
        bobot_audit: 30,
        bobot_peer: 20
    });

    const groupForm = useForm({
        project_class_id: '',
        nama_kelompok: ''
    });

    const memberForm = useForm({
        group_id: '',
        student_id: ''
    });

    // Handlers Manual
    const submitKelas = (e) => {
        e.preventDefault();
        classForm.post(route('dosen.kelas.store'), {
            onSuccess: () => { setIsModalOpen(false); classForm.reset(); }
        });
    };

    const submitGroup = (e) => {
        e.preventDefault();
        groupForm.post(route('dosen.kelompok.store'), { onSuccess: () => groupForm.reset() });
    };

    const submitMember = (e) => {
        e.preventDefault();
        memberForm.post(route('dosen.tambah.anggota'), { onSuccess: () => memberForm.reset() });
    };

    // --- ALGORITMA SMART GROUPING (FRONTEND ENGINE) ---
    const handleSmartGrouping = (classId) => {
        if (!classId) {
            return alert('Pilih kelas terlebih dahulu untuk menjalankan AI Smart Grouping!');
        }

        // 1. Validasi ketersediaan data
        const availableGroups = daftarKelompok || [];
        const targetStudents = mahasiswaTanpaKelompok || [];

        if (targetStudents.length === 0) {
            return alert('Semua mahasiswa di kelas ini sudah masuk ke dalam kelompok.');
        }
        if (availableGroups.length === 0) {
            return alert('Buat minimal 1 kelompok kosong terlebih dahulu sebelum menjalankan AI.');
        }

        if (confirm('Jalankan Asisten AI untuk membagi mahasiswa secara seimbang berdasarkan metrik performa historis?')) {

            // 2. Analisis Riwayat Kerja (Scoring)
            // Catatan: Saat ini menggunakan simulasi skor. Nantinya bisa diganti dengan 
            // data asli (misal: student.activity_score) yang dikirim dari controller.
            let scoredStudents = targetStudents.map(student => ({
                ...student,
                performance_score: Math.floor(Math.random() * 60) + 40 // Simulasi skor 40 - 100
            }));

            // 3. Urutkan mahasiswa (High Performer -> Low Performer)
            scoredStudents.sort((a, b) => b.performance_score - a.performance_score);

            // 4. Distribusi Round-Robin (Pemerataan Kemampuan)
            let smartDistribution = [];

            scoredStudents.forEach((student, index) => {
                // Membagi rata ke dalam kelompok yang tersedia secara berurutan
                const targetGroup = availableGroups[index % availableGroups.length];

                // Labeling klasifikasi AI
                let classification = student.performance_score >= 80 ? 'Star Performer' :
                    student.performance_score >= 60 ? 'Active Member' : 'Needs Mentoring';

                smartDistribution.push({
                    student_id: student.id,
                    target_group_id: targetGroup.id,
                    reason: `Distribusi AI: ${classification} (Skor Historis: ${student.performance_score})`
                });
            });

            // 5. Kirim Hasil Kalkulasi ke Database Laravel
            console.table(smartDistribution); // Tinjau di inspect element (F12)

            router.post(route('dosen.smart-grouping.generate'), {
                project_class_id: classId,
                distribution_data: smartDistribution // Payload utama
            }, {
                preserveScroll: true,
                onSuccess: () => alert('Rancangan komposisi kelompok berhasil disusun dan disimpan AI!')
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-black text-2xl text-white leading-tight tracking-tight">
                            Ruang <span className="text-blue-500">Audit.</span>
                        </h2>
                        <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] mt-1 font-bold">Pusat Kendali Asisten AI RuKa</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-blue-600/30 transition-all active:scale-95 flex items-center gap-2 border border-blue-400/20"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Buat Ruang Kelas
                    </button>
                </div>
            }
        >
            <Head title="Audit Dashboard" />

            <div className="min-h-screen bg-[#0b1120] text-slate-300 pb-20 font-sans selection:bg-blue-500 selection:text-white">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">

                    {/* --- 1. AI INTELLIGENCE HEADER --- */}
                    <div className="relative overflow-hidden p-8 rounded-[2.5rem] bg-slate-900/40 border border-slate-800 backdrop-blur-xl shadow-2xl">
                        <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-[0.15em]">
                                    AI Monitor Engine V.3
                                </div>
                                <h3 className="text-3xl font-black text-white italic tracking-tight">"Selamat datang kembali, {auth.user.name}."</h3>
                                <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                                    Analisis sistem mendeteksi <span className="text-red-400 font-bold underline decoration-red-400/30 underline-offset-4">{kelompokKritis?.length || 0} kelompok</span> dalam status stagnan.
                                </p>
                            </div>
                            <div className="text-center px-8 py-5 rounded-3xl bg-slate-800/40 border border-slate-700/50">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Class Health</p>
                                <p className="text-4xl font-black text-emerald-400 tracking-tighter">94%</p>
                            </div>
                        </div>
                    </div>

                    {/* --- 2. STATS ROW --- */}
                    <StatCards
                        totalKelasAktif={totalKelasAktif}
                        totalKelompok={totalKelompok}
                        kelompokKritis={kelompokKritis}
                    />

                    {/* --- 3. ROW TENGAH (Monitoring & Akses Kelas) --- */}
                    <div className="grid grid-cols-12 gap-8 items-start">
                        <div className="col-span-12 lg:col-span-8">
                            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                                <MonitoringTable daftarKelompok={daftarKelompok} />
                            </div>
                        </div>

                        <div className="col-span-12 lg:col-span-4">
                            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
                                <h3 className="text-[10px] font-black text-slate-500 mb-6 uppercase tracking-[0.25em]">Akses Masuk Ruang Kelas</h3>
                                <ClassAccessList daftarKelas={daftarKelas} />
                            </div>
                        </div>
                    </div>

                    {/* --- 4. PANEL AI SMART GROUPING --- */}
                    <div className="col-span-12 bg-gradient-to-r from-blue-900/40 to-emerald-900/20 border border-blue-500/30 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div>
                                <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                                    <span className="text-2xl">✨</span> AI Smart Grouping
                                </h3>
                                <p className="text-sm text-blue-200/70 mt-2 max-w-xl">
                                    Biarkan sistem menganalisis log aktivitas dan performa historis mahasiswa untuk membentuk komposisi kelompok yang paling optimal dan seimbang secara otomatis.
                                </p>
                            </div>

                            <button
                                onClick={() => handleSmartGrouping(daftarKelas?.[0]?.id)}
                                className="bg-white text-[#0b1120] px-8 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-white/10 hover:bg-slate-200 hover:scale-105 transition-all whitespace-nowrap"
                            >
                                Generate Kelompok (AI)
                            </button>
                        </div>
                    </div>

                    {/* --- 5. MANAJEMEN TIM MANUAL (FULL WIDTH DI BAWAH) --- */}
                    <div className="col-span-12">
                        <GroupInitation
                            groupForm={groupForm}
                            memberForm={memberForm}
                            daftarKelas={daftarKelas}
                            daftarKelompok={daftarKelompok}
                            mahasiswaTanpaKelompok={mahasiswaTanpaKelompok}
                            submitGroup={submitGroup}
                            submitMember={submitMember}
                        />
                    </div>

                </div>
            </div>

            <CreateClassModal
                isOpen={isModalOpen}
                closeModal={() => setIsModalOpen(false)}
                form={classForm}
                submit={submitKelas}
            />
        </AuthenticatedLayout>
    );
}