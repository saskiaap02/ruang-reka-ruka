import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="flex min-h-screen bg-white font-sans antialiased text-slate-900">
            <Head title="Masuk - RuKa." />

            {/* --- BAGIAN KIRI: Biru Vibrant (Ciri Khas Login) --- */}
            <div className="hidden lg:flex w-1/2 bg-blue-700 p-12 text-white flex-col justify-between relative overflow-hidden">
                {/* Elemen Dekoratif */}
                <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-blue-500 opacity-40"></div>
                <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-blue-800 opacity-60"></div>
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-400 opacity-20"></div>

                <div className="relative z-10 flex flex-col h-full justify-center">
                    <h1 className="text-6xl font-black tracking-tighter mb-4">WELCOME <br />BACK.</h1>
                    <p className="text-2xl font-bold mb-6 text-blue-200">Lanjutkan Kolaborasi Timmu</p>
                    <p className="text-blue-100 max-w-md leading-relaxed">
                        Masuk kembali ke Ruang Reka. Pantau progres tugas, lakukan <i>peer-review</i>, dan wujudkan proyek luar biasa bersama tim tanpa hambatan.
                    </p>
                </div>

                <div className="relative z-10 text-blue-200 text-sm font-medium">
                    © 2026 RuKa. All rights reserved.
                </div>
            </div>

            {/* --- BAGIAN KANAN: Putih (Form Login) --- */}
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
                        <span className="bg-blue-600 text-white px-3 py-1.5 rounded-xl text-lg font-black tracking-tighter shadow-md group-hover:bg-blue-700 transition transform group-hover:scale-105">RuKa.</span>
                        <span className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition">Ruang Reka</span>
                    </Link>

                    <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Selamat Datang Kembali</h2>
                    <p className="text-slate-500 mb-8 font-medium">Masuk dengan akun Anda yang sudah terdaftar.</p>

                    {/* Pesan Status */}
                    {status && <div className="mb-4 font-medium text-sm text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-200">{status}</div>}

                    <form onSubmit={submit} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Kampus</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                required
                                autoFocus
                                className="block w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-slate-900 font-medium"
                                placeholder="nama@kampus.ac.id"
                            />
                            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Password</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                required
                                className="block w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-slate-900 font-medium"
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                        </div>

                        {/* Ingat Saya & Lupa Sandi */}
                        <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-slate-300 text-blue-600 shadow-sm focus:ring-blue-500 w-5 h-5 transition"
                                />
                                <span className="ms-3 text-sm text-slate-600 font-medium group-hover:text-slate-900 transition">Ingat Saya</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm font-bold text-blue-600 hover:text-blue-800 transition"
                                >
                                    Lupa sandi?
                                </Link>
                            )}
                        </div>

                        {/* Tombol Login */}
                        <div className="pt-4">
                            <button type="submit" disabled={processing} className="w-full flex justify-center py-4 px-6 border border-transparent rounded-full shadow-lg shadow-blue-500/30 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0">
                                {processing ? 'Memeriksa...' : 'Masuk Sekarang'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <p className="text-slate-600 font-medium">Belum punya akun? <Link href={route('register')} className="font-bold text-blue-600 hover:text-blue-800 transition">Daftar di sini</Link></p>
                    </div>

                </div>
            </div>
        </div>
    );
}