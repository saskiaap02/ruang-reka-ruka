import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react'; 
import { useState } from 'react';
import StatCards from './Partials/StatCards';
import GroupInitation from './Partials/GroupInitation';
import ClassAccessList from './Partials/ClassAccessList';
import MonitoringTable from './Partials/MonitoringTable';
import CreateClassModal from './Partials/CreateClassModal';

export default function Dashboard({ auth, totalKelasAktif, totalKelompok, kelompokKritis, daftarKelompok, daftarKelas, mahasiswaTanpaKelompok }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form Hooks
    const classForm = useForm({ mata_kuliah: '', nama_kelas: '', bobot_dasar: 50, bobot_audit: 30, bobot_peer: 20 });
    const groupForm = useForm({ project_class_id: '', nama_kelompok: '' });
    const memberForm = useForm({ group_id: '', student_id: '' });

    // Handlers
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-slate-800 dark:text-white leading-tight">Dashboard Dosen - Ruang Reka Ruka</h2>
                    <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 transition-all active:scale-95">
                        + Buat Ruang Kelas
                    </button>
                </div>
            }
        >
            <Head title="Dashboard Dosen" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    <StatCards 
                        totalKelasAktif={totalKelasAktif} 
                        totalKelompok={totalKelompok} 
                        kelompokKritis={kelompokKritis} 
                    />

                    <GroupInitation 
                        groupForm={groupForm} 
                        memberForm={memberForm} 
                        daftarKelas={daftarKelas} 
                        daftarKelompok={daftarKelompok} 
                        mahasiswaTanpaKelompok={mahasiswaTanpaKelompok}
                        submitGroup={submitGroup} 
                        submitMember={submitMember} 
                    />

                    <ClassAccessList daftarKelas={daftarKelas} />

                    <MonitoringTable daftarKelompok={daftarKelompok} />

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