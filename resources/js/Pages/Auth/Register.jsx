import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        nim_nip: '',      // <-- Form Baru
        role: 'mahasiswa', // <-- Form Baru (Default Mahasiswa)
        password: '',
        password_confirmation: '',
    });

    useEffect(() => { return () => { reset('password', 'password_confirmation'); }; }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Daftar - Ruang Reka" />

            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Buat Akun RuKa</h2>
                <p className="text-sm text-slate-400">Bergabunglah untuk memulai kolaborasi tim.</p>
            </div>

            <form onSubmit={submit} className="space-y-4">

                {/* PILIHAN ROLE (Radio Button Estetik) */}
                <div className="bg-[#0b1120] p-1.5 rounded-xl border border-slate-700 flex mb-4">
                    <button type="button" onClick={() => setData('role', 'mahasiswa')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${data.role === 'mahasiswa' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}>
                        🎓 Mahasiswa
                    </button>
                    <button type="button" onClick={() => setData('role', 'dosen')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${data.role === 'dosen' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}>
                        👨‍🏫 Dosen
                    </button>
                </div>
                {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Nama Lengkap</label>
                    <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="w-full bg-[#0b1120] border border-slate-700 rounded-xl text-white px-4 py-2.5 focus:ring-blue-500 focus:border-blue-500" required autoFocus />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                        {data.role === 'mahasiswa' ? 'NIM (Nomor Induk Mahasiswa)' : 'NIP / NIDN Dosen'}
                    </label>
                    <input type="text" value={data.nim_nip} onChange={(e) => setData('nim_nip', e.target.value)} className="w-full bg-[#0b1120] border border-slate-700 rounded-xl text-white px-4 py-2.5 focus:ring-blue-500 focus:border-blue-500 font-mono" required />
                    {errors.nim_nip && <p className="mt-1 text-sm text-red-500">{errors.nim_nip}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                    <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="w-full bg-[#0b1120] border border-slate-700 rounded-xl text-white px-4 py-2.5 focus:ring-blue-500 focus:border-blue-500" required />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                        <input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} className="w-full bg-[#0b1120] border border-slate-700 rounded-xl text-white px-4 py-2.5 focus:ring-blue-500 focus:border-blue-500" required />
                        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Konfirmasi</label>
                        <input type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} className="w-full bg-[#0b1120] border border-slate-700 rounded-xl text-white px-4 py-2.5 focus:ring-blue-500 focus:border-blue-500" required />
                        {errors.password_confirmation && <p className="mt-1 text-sm text-red-500">{errors.password_confirmation}</p>}
                    </div>
                </div>

                <button disabled={processing} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-600/30 mt-6">
                    {processing ? 'Mendaftarkan...' : 'Daftar Sekarang'}
                </button>

                <p className="text-center text-sm text-slate-400 mt-4">
                    Sudah punya akun? <Link href={route('login')} className="text-blue-400 font-bold hover:text-blue-300">Log in di sini</Link>
                </p>
            </form>
        </GuestLayout>
    );
}