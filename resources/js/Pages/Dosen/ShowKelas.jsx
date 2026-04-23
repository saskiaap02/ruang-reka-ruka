import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import MonitoringTable from './Partials/MonitoringTable';
import GroupInitation from './Partials/GroupInitation';

export default function ShowKelas({ auth, kelas, daftarKelompok, mahasiswaTanpaKelompok, pendingStudents }) {
    
    // --- 1. FORM HOOKS (Logika Utama) ---
    const groupForm = useForm({ 
        project_class_id: kelas.id, 
        nama_kelompok: '',
        project_title: ''
    });
    
    const memberForm = useForm({ 
        group_id: '', 
        student_id: '' 
    });

    // --- 2. HANDLERS (Aksi Dosen) ---
    const submitGroup = (e) => {
        e.preventDefault();
        groupForm.post(route('dosen.kelompok.store'), { 
            onSuccess: () => groupForm.reset('nama_kelompok') 
        });
    };

    const submitMember = (e) => {
        e.preventDefault();
        memberForm.post(route('dosen.tambah.anggota'), { 
            onSuccess: () => memberForm.reset() 
        });
    };

    const approveMahasiswa = (studentId) => {
        if (confirm('Setujui mahasiswa ini masuk ke ruang kelas?')) {
            router.post(route('dosen.tambah.approve'), {
                student_id: studentId,
                class_id: kelas.id
            });
        }
    };

    const generateAI = () => {
        if (confirm('Asisten AI akan menganalisis riwayat performa untuk merancang tim. Lanjutkan?')) {
            router.post(route('dosen.ai.generate', kelas.id), {}, {
                onSuccess: () => alert('Asisten AI berhasil merancang plotting tim!')
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-5">
                        <Link href={route('dosen.dashboard')} className="group p-3 bg-white rounded-2xl shadow-sm border border-slate-200 hover:bg-blue-600 transition-all duration-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 text-slate-600 group-hover:text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                        </Link>
                        <div>
                            <h2 className="font-black text-3xl text-slate-800 tracking-tighter leading-none">
                                {kelas.nama_kelas} <span className="text-blue-500">.</span>
                            </h2>
                            <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em] font-black mt-2 flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                                Sistem Audit: {kelas.mata_kuliah}
                            </p>
                        </div>
                    </div>
                    
                    <div className="bg-slate-900 px-6 py-4 rounded-[2rem] border border-slate-800 shadow-2xl flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Invite Code</p>
                            <p className="font-mono text-xl font-black text-blue-400 leading-none mt-1 tracking-wider">{kelas.invite_code}</p>
                        </div>
                        <div className="w-[1px] h-8 bg-slate-800"></div>
                        <button onClick={() => { navigator.clipboard.writeText(kelas.invite_code); alert("Disalin!"); }} className="p-2 text-slate-400 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`Audit ${kelas.nama_kelas}`} />

            <div className="min-h-screen bg-[#f8fafc] pb-20 pt-10 font-sans px-4 sm:px-10">
                <div className="max-w-[1600px] mx-auto space-y-12">
                    
                    {/* --- 1. WAITING ROOM (Area Approval Detail) --- */}
                    {pendingStudents && pendingStudents.length > 0 && (
                        <div className="bg-amber-50/50 border-2 border-dashed border-amber-200 p-8 rounded-[3.5rem] animate-in fade-in slide-in-from-top-4 duration-700 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/20 blur-[100px] rounded-full -z-10"></div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-amber-500/20">
                                    <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                                </div>
                                <div>
                                    <h3 className="text-amber-900 font-black italic text-xl tracking-tight">Menunggu Validasi</h3>
                                    <p className="text-amber-700/60 text-[10px] font-bold uppercase tracking-widest">{pendingStudents.length} Mahasiswa Baru</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {pendingStudents.map((mhs) => (
                                    <div key={mhs.id} className="bg-white/80 backdrop-blur-md border border-amber-100 p-6 rounded-[2.5rem] flex flex-col gap-5 group hover:shadow-2xl transition-all duration-500">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">{mhs.name.charAt(0)}</div>
                                                <div className="overflow-hidden">
                                                    <p className="text-slate-800 font-black text-sm truncate">{mhs.name}</p>
                                                    <p className="text-slate-400 text-[10px] font-medium italic">Bisikan AI: {mhs.ai_reason || "Belum ada analisis"}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => approveMahasiswa(mhs.id)} className="bg-slate-900 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-slate-900/10">Izinkan</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- 2. LAYOUT UTAMA (Monitoring & AI Stats) --- */}
                    <div className="grid grid-cols-12 gap-10 items-stretch">
                        <div className="col-span-12 lg:col-span-8">
                            <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100 h-full">
                                <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                    <h3 className="font-black text-2xl text-slate-800 tracking-tight italic">Audit Log Proyek</h3>
                                    <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.4)]"></span>
                                </div>
                                <div className="p-4">
                                    <MonitoringTable daftarKelompok={daftarKelompok} />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-12 lg:col-span-4">
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-10 rounded-[3.5rem] shadow-2xl shadow-blue-500/30 text-white relative overflow-hidden group h-full flex flex-col justify-between">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-all duration-1000"></div>
                                <div className="relative z-10">
                                    <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-70 italic">AI Intelligence Center</p>
                                    <h4 className="text-3xl font-black mt-4 leading-tight italic">Optimasi Plotting & Audit Tim</h4>
                                    
                                    <div className="mt-8 flex justify-between items-center p-6 bg-white/10 rounded-3xl border border-white/10 backdrop-blur-md">
                                        <div>
                                            <p className="text-4xl font-black">{daftarKelompok.length}</p>
                                            <p className="text-[9px] uppercase font-black opacity-60">Total Tim</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-4xl font-black text-emerald-300">{mahasiswaTanpaKelompok.length}</p>
                                            <p className="text-[9px] uppercase font-black opacity-60">Ready Plotting</p>
                                        </div>
                                    </div>
                                </div>

                                <button onClick={generateAI} className="relative z-10 w-full mt-8 py-5 bg-white text-blue-600 rounded-[1.8rem] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-50 transition-all active:scale-95 flex items-center justify-center gap-3">
                                    ✨ Minta Saran AI
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* --- 3. PANEL MANAJEMEN TIM (WIDE) --- */}
                    <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="w-2 h-10 bg-blue-600 rounded-full"></div>
                            <div>
                                <h3 className="font-black text-2xl text-slate-800 tracking-tight uppercase italic leading-none">Pusat Kendali Tim</h3>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Sinkronisasi Deploy Anggota & Inisiasi Kelompok</p>
                            </div>
                        </div>
                        
                        {/* Memanggil Komponen yang Samping-Sampingan */}
                        <GroupInitation 
                            groupForm={groupForm} 
                            memberForm={memberForm} 
                            daftarKelas={[kelas]} 
                            daftarKelompok={daftarKelompok} 
                            mahasiswaTanpaKelompok={mahasiswaTanpaKelompok}
                            submitGroup={submitGroup} 
                            submitMember={submitMember} 
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}