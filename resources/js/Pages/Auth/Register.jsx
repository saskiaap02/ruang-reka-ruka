import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        nim_nip: '',
        role: 'mahasiswa', // Default pilihan mahasiswa
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => { reset('password', 'password_confirmation'); };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="flex min-h-screen bg-white font-sans antialiased text-slate-900">
            <Head title="Daftar - RuKa." />

            {/* --- BAGIAN KIRI: Navy Gelap (Desktop Only) --- */}
            <div className="hidden lg:flex w-1/2 bg-[#0a1120] p-12 text-white flex-col justify-between relative overflow-hidden">
                <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-blue-600 opacity-20"></div>
                <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-blue-600 opacity-20"></div>
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-500 opacity-10"></div>

                <div className="relative z-10 flex flex-col h-full justify-center">
                    <h1 className="text-6xl font-black tracking-tighter mb-4">WELCOME</h1>
                    <p className="text-2xl font-bold mb-6 text-blue-400">Ruang Reka - Kolaborasi Tim</p>
                    <p className="text-slate-400 max-w-md leading-relaxed">
                        Platform kolaborasi cerdas untuk mahasiswa dan dosen. Kelola proyek kelas dengan lebih efisien, adil, dan transparan tanpa ada <i>free-rider</i>.
                    </p>
                </div>

                <div className="relative z-10 text-slate-500 text-sm font-medium">
                    © 2026 RuKa. All rights reserved.
                </div>
            </div>

            {/* --- BAGIAN KANAN: Putih (Form Registrasi) --- */}
            <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center p-8 sm:p-12 md:p-16 relative">
                <div className="max-w-md mx-auto w-full">

                    {/* Tombol Kembali ke Beranda */}
                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition mb-8 group">
                        <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        Kembali ke Beranda
                    </Link>

                    {/* Logo RuKa (Sekarang bisa diklik!) */}
                    <Link href="/" className="flex items-center gap-2 mb-10 group w-fit">
                        <span className="bg-blue-600 text-white px-2.5 py-1.5 rounded-lg text-sm font-black tracking-tighter shadow-md group-hover:bg-blue-700 transition transform group-hover:scale-105">RuKa.</span>
                        <span className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition">Ruang Reka</span>
                    </Link>

                    <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Daftar Akun Baru</h2>
                    <p className="text-slate-500 mb-8 font-medium">Daftar untuk mulai ruang kolaborasi di RuKa.</p>

                    <form onSubmit={submit} className="space-y-5">

                        {/* Tombol Pilihan Role */}
                        <div className="bg-slate-100 p-1.5 rounded-xl flex mb-4 border border-slate-200">
                            <button type="button" onClick={() => setData('role', 'mahasiswa')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${data.role === 'mahasiswa' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
                                🎓 Mahasiswa
                            </button>
                            <button type="button" onClick={() => setData('role', 'dosen')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${data.role === 'dosen' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
                                👨‍🏫 Dosen
                            </button>
                        </div>
                        {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}

                        {/* Nama Lengkap */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Nama Lengkap</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} required autoFocus className="block w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-slate-900 font-medium" placeholder="Masukkan nama lengkap" />
                            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                        </div>

                        {/* NIM/NIP Dinamis */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                {data.role === 'mahasiswa' ? 'NIM Mahasiswa' : 'NIP / NIDN Dosen'}
                            </label>
                            <input type="text" value={data.nim_nip} onChange={e => setData('nim_nip', e.target.value)} required className="block w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-slate-900 font-medium" placeholder={`Masukkan ${data.role === 'mahasiswa' ? 'NIM' : 'NIP'} Anda`} />
                            {errors.nim_nip && <p className="text-sm text-red-500 mt-1">{errors.nim_nip}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email</label>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} required className="block w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-slate-900 font-medium" placeholder="nama@kampus.ac.id" />
                            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                        </div>

                        {/* Password Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Password</label>
                                <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} required className="block w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-slate-900 font-medium" placeholder="••••••••" />
                                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Konfirmasi</label>
                                <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} required className="block w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-slate-900 font-medium" placeholder="••••••••" />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button type="submit" disabled={processing} className="w-full flex justify-center py-4 px-6 border border-transparent rounded-full shadow-lg shadow-blue-500/30 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0">
                                {processing ? 'Memproses...' : 'Daftar Sekarang'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <p className="text-slate-600 font-medium">Sudah punya akun? <Link href={route('login')} className="font-bold text-blue-600 hover:text-blue-800 transition">Masuk di sini</Link></p>
                    </div>

                </div>
            </div>
        </div>
    );
}