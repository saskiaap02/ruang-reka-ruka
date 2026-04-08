import { useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="flex h-screen bg-white font-sans antialiased text-slate-900 overflow-hidden">
            <Head title="Buat Sandi Baru - RuKa." />

            {/* --- BAGIAN KIRI: Navy / Biru Gelap --- */}
            <div className="hidden lg:flex w-1/2 h-full bg-[#0a1120] p-12 text-white flex-col justify-between relative overflow-hidden">
                <div className="absolute -top-24 -left-24 w-[400px] h-[400px] rounded-full bg-blue-600 opacity-20 blur-[80px]"></div>
                <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-500 opacity-10 blur-[100px]"></div>

                <div className="relative z-10 flex flex-col h-full justify-center">
                    <h1 className="text-6xl font-black tracking-tighter mb-4 text-white">SECURE<br />ACCESS.</h1>
                    <p className="text-2xl font-bold mb-6 text-blue-400">Amankan Kembali Akunmu</p>
                    <p className="text-slate-400 max-w-md leading-relaxed text-lg">
                        Buat kata sandi baru yang kuat dan unik. Pastikan Anda menyimpannya dengan baik agar tidak tertinggal info proyek penting.
                    </p>
                </div>
                <div className="relative z-10 text-slate-500 text-sm font-medium">© 2026 RuKa. All rights reserved.</div>
            </div>

            {/* --- BAGIAN KANAN: Form Reset Password --- */}
            <div className="w-full lg:w-1/2 bg-white flex flex-col p-8 sm:p-12 md:p-16 h-full overflow-y-auto relative z-10">
                <div className="max-w-md mx-auto w-full my-auto py-8">

                    <div className="flex items-center gap-2 mb-10">
                        <span className="bg-blue-600 text-white px-3 py-1.5 rounded-xl text-lg font-black tracking-tighter shadow-md">RuKa.</span>
                        <span className="text-2xl font-bold text-slate-800 tracking-tight">Ruang Reka</span>
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Buat Sandi Baru</h2>
                    <p className="text-slate-500 mb-8 font-medium">Silakan masukkan kata sandi baru Anda di bawah ini.</p>

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="block w-full px-4 py-3.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed"
                                onChange={(e) => setData('email', e.target.value)}
                                readOnly
                            />
                            {errors.email && <p className="text-sm text-red-500 mt-2">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Sandi Baru</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="block w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-slate-900 font-medium"
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                                required
                                autoFocus
                            />
                            {errors.password && <p className="text-sm text-red-500 mt-2">{errors.password}</p>}
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Konfirmasi Sandi Baru</label>
                            <input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="block w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-slate-900 font-medium"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                            {errors.password_confirmation && <p className="text-sm text-red-500 mt-2">{errors.password_confirmation}</p>}
                        </div>

                        <div className="pt-4">
                            <button type="submit" disabled={processing} className="w-full flex justify-center py-4 px-6 border border-transparent rounded-full shadow-xl shadow-blue-500/20 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition hover:-translate-y-1 disabled:opacity-50">
                                {processing ? 'Menyimpan...' : 'Simpan Sandi Baru'}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}