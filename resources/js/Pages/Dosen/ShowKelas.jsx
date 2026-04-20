import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import MonitoringTable from './Partials/MonitoringTable';
import GroupInitation from './Partials/GroupInitation';

export default function ShowKelas({ auth, kelas, daftarKelompok, mahasiswaTanpaKelompok }) {
    
    // Form untuk membuat kelompok baru di dalam kelas ini
    const groupForm = useForm({ 
        project_class_id: kelas.id, 
        nama_kelompok: '',
        project_title: ''
    });
    
    // Form untuk memasukkan mahasiswa ke kelompok
    const memberForm = useForm({ 
        group_id: '', 
        student_id: '' 
    });

    // Handlers
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href={route('dosen.dashboard')} className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-slate-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                        </Link>
                        <div>
                            <h2 className="font-black text-2xl text-slate-800 leading-tight">
                                Monitoring <span className="text-blue-600">{kelas.nama_kelas}</span>
                            </h2>
                            <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold">Mata Kuliah: {kelas.mata_kuliah}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Kode Akses Kelas</p>
                            <p className="font-mono text-lg font-black text-blue-600">{kelas.invite_code}</p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`Kelas ${kelas.nama_kelas}`} />

            <div className="min-h-screen bg-slate-50 pb-20 pt-10 font-sans">
                <div className="max-w-[1600px] mx-auto px-6 space-y-10">
                    
                    {/* Grid Sistem: Monitoring (Kiri) & Management (Kanan) */}
                    <div className="grid grid-cols-12 gap-8 items-start">
                        
                        {/* 1. AREA MONITORING (70% Lebar Layar) */}
                        <div className="col-span-12 lg:col-span-8">
                            <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100">
                                <MonitoringTable daftarKelompok={daftarKelompok} />
                            </div>
                        </div>

                        {/* 2. AREA MANAGEMENT (30% Lebar Layar) */}
                        <div className="col-span-12 lg:col-span-4 space-y-8">
                            
                            {/* Card Statistik Cepat Kelas Ini */}
                            <div className="bg-blue-600 p-8 rounded-[2.5rem] shadow-xl shadow-blue-200 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Informasi Audit</p>
                                    <h4 className="text-xl font-bold mt-1 italic">Bot AI Siap Memantau</h4>
                                    <div className="mt-6 flex justify-between items-center">
                                        <div>
                                            <p className="text-2xl font-black">{daftarKelompok.length}</p>
                                            <p className="text-[10px] uppercase font-bold opacity-70">Total Tim</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black">{mahasiswaTanpaKelompok.length}</p>
                                            <p className="text-[10px] uppercase font-bold opacity-70">Waiting List</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                            </div>

                            {/* Komponen Inisiasi Kelompok (Pindahan dari Dashboard Utama) */}
                            <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-100">
                                <h3 className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                    Manajemen Tim Kelas
                                </h3>
                                <GroupInitation 
                                    groupForm={groupForm} 
                                    memberForm={memberForm} 
                                    daftarKelas={[kelas]} // Kirim kelas ini saja
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