import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react'; // Tambahkan router di sini
import MonitoringTable from './Partials/MonitoringTable';
import GroupInitation from './Partials/GroupInitation';

// 1. Tambahkan pendingStudents ke dalam Props
export default function ShowKelas({ auth, kelas, daftarKelompok, mahasiswaTanpaKelompok, pendingStudents }) {
    
    const groupForm = useForm({ 
        project_class_id: kelas.id, 
        nama_kelompok: '',
        project_title: ''
    });
    
    const memberForm = useForm({ 
        group_id: '', 
        student_id: '' 
    });

    // --- 1. Handlers Internal (Sudah Ada) ---
    const submitGroup = (e) => {
        e.preventDefault();
        groupForm.post(route('dosen.kelompok.store'), { 
            onSuccess: () => groupForm.reset('nama_kelompok', 'project_title') 
        });
    };

    const submitMember = (e) => {
        e.preventDefault();
        memberForm.post(route('dosen.tambah.anggota'), { 
            onSuccess: () => memberForm.reset() 
        });
    };

    // --- 2. Handler Approval (Pindahan dari yang tadi) ---
    const approveMahasiswa = (studentId) => {
        if (confirm('Setujui mahasiswa ini masuk ke ruang kelas?')) {
            router.post(route('dosen.tambah.approve'), {
                student_id: studentId,
                class_id: kelas.id
            });
        }
    };

    // --- 3. Handler BARU: Pemicu Asisten AI (Taruh di Sini!) ---
    const generateAI = () => {
        if (confirm('Asisten AI akan menganalisis riwayat performa mahasiswa untuk merancang tim. Lanjutkan?')) {
            router.post(route('dosen.ai.generate', kelas.id), {}, {
                onSuccess: () => {
                    // Berhasil! AI sudah mengisi tabel smart_grouping_plans
                    alert('Asisten AI berhasil merancang plotting tim!');
                }
            });
        }
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    {/* Sisi Kiri: Navigasi & Judul */}
                    <div className="flex items-center gap-5">
                        <Link 
                            href={route('dosen.dashboard')} 
                            className="group p-3 bg-white rounded-2xl shadow-sm border border-slate-200 hover:bg-blue-600 transition-all duration-500"
                        >
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
                                Monitoring Audit: {kelas.mata_kuliah}
                            </p>
                        </div>
                    </div>
                    
                    {/* Sisi Kanan: Kode Akses Floating Card */}
                    <div className="bg-slate-900 px-6 py-4 rounded-[2rem] border border-slate-800 shadow-2xl flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Invite Code</p>
                            <p className="font-mono text-xl font-black text-blue-400 leading-none mt-1 tracking-wider">{kelas.invite_code}</p>
                        </div>
                        <div className="w-[1px] h-8 bg-slate-800"></div>
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(kelas.invite_code);
                                alert("Kode akses berhasil disalin!");
                            }}
                            className="p-2 text-slate-400 hover:text-white transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`Audit ${kelas.nama_kelas}`} />

            <div className="min-h-screen bg-[#f8fafc] pb-20 pt-10 font-sans px-4 sm:px-10">
                <div className="max-w-[1600px] mx-auto space-y-10">
                    
                    {/* --- 1. AREA APPROVAL (WAITING ROOM) --- */}
                    {pendingStudents && pendingStudents.length > 0 && (
                        <div className="bg-amber-50/50 border-2 border-dashed border-amber-200 p-8 rounded-[3.5rem] animate-in fade-in slide-in-from-top-4 duration-700 relative overflow-hidden shadow-sm">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/20 blur-[100px] rounded-full -z-10"></div>
                            
                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/20 text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 animate-pulse"><path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" /></svg>
                                    </div>
                                    <div>
                                        <h3 className="text-amber-900 font-black italic text-xl tracking-tight">Menunggu Validasi Akses</h3>
                                        <p className="text-amber-700/60 text-[10px] font-bold uppercase tracking-widest">Ada {pendingStudents.length} Mahasiswa baru</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10">
                                {pendingStudents.map((mhs) => (
                                    <div key={mhs.id} className="bg-white/80 backdrop-blur-md border border-amber-100 p-6 rounded-[2.5rem] flex flex-col gap-5 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500 shadow-inner">{mhs.name.charAt(0)}</div>
                                                <div className="overflow-hidden">
                                                    <p className="text-slate-800 font-black text-sm truncate">{mhs.name}</p>
                                                    <p className="text-slate-400 text-[10px] font-medium">{mhs.email}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => approveMahasiswa(mhs.id)} className="bg-slate-900 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">Izinkan</button>
                                        </div>
                                        <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl relative overflow-hidden group/ai">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50"></div>
                                            <div className="relative z-10">
                                                <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 mb-2">
                                                    <span className="flex h-2 w-2 relative">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                                    </span>
                                                    Asisten AI RuKa
                                                </p>
                                                <p className="text-[11px] text-slate-600 italic leading-relaxed font-medium">"{mhs.ai_reason || "Menganalisis performa..."}"</p>
                                            </div>
                                            <span className="absolute -right-2 -bottom-2 text-4xl opacity-[0.03] grayscale">🤖</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- 2. MAIN BENTO GRID --- */}
                    <div className="grid grid-cols-12 gap-10 items-start">
                        
                        {/* LEFT: MONITORING (8/12) */}
                        <div className="col-span-12 lg:col-span-8 space-y-8">
                            <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                                <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                    <div>
                                        <h3 className="font-black text-2xl text-slate-800 tracking-tight">Audit Log Proyek</h3>
                                        <p className="text-slate-400 text-xs font-medium mt-1">Status real-time semua kelompok aktif</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.4)]"></span>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Audit System Active</span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <MonitoringTable daftarKelompok={daftarKelompok} />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: AI MANAGEMENT (4/12) */}
                        <div className="col-span-12 lg:col-span-4 space-y-10">
                            
                            {/* Card AI Stats & Trigger */}
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-10 rounded-[3.5rem] shadow-2xl shadow-blue-500/30 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-all duration-1000"></div>
                                <div className="relative z-10">
                                    <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-70 italic">AI Intelligence Center</p>
                                    <h4 className="text-2xl font-black mt-4 leading-tight">Optimasi Plotting & Audit Tim</h4>
                                    
                                    <div className="mt-8 flex justify-between items-center p-5 bg-white/10 rounded-3xl border border-white/10 backdrop-blur-md">
                                        <div>
                                            <p className="text-3xl font-black">{daftarKelompok.length}</p>
                                            <p className="text-[9px] uppercase font-black opacity-60">Total Tim</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-black text-emerald-300">{mahasiswaTanpaKelompok.length}</p>
                                            <p className="text-[9px] uppercase font-black opacity-60">Approved Mhs</p>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={generateAI}
                                        className="w-full mt-8 py-5 bg-white text-blue-600 rounded-[1.8rem] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-50 transition-all active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        ✨ Minta Saran AI
                                    </button>
                                </div>
                            </div>

                            {/* Panel Deploy & Manajemen */}
                            <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                                    <h3 className="font-black text-xl text-slate-800 tracking-tight uppercase italic">Manajemen Tim</h3>
                                </div>
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}