import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="flex h-screen bg-white font-sans antialiased text-slate-900 overflow-hidden">
            <Head title="Lupa Sandi - RuKa." />

            {/* --- BAGIAN KIRI: Navy / Biru Gelap --- */}
            <div className="hidden lg:flex w-1/2 h-full bg-[#0a1120] p-12 text-white flex-col justify-between relative overflow-hidden">
                <div className="absolute -top-24 -left-24 w-[400px] h-[400px] rounded-full bg-blue-600 opacity-20 blur-[80px]"></div>
                <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-blue-600 opacity-20 blur-[60px]"></div>

                <div className="relative z-10 flex flex-col h-full justify-center">
                    <h1 className="text-6xl font-black tracking-tighter mb-4 text-white">RECOVERY<br />MODE.</h1>
                    <p className="text-2xl font-bold mb-6 text-blue-400">Jangan Panik, Data Anda Aman</p>
                    <p className="text-slate-400 max-w-md leading-relaxed text-lg">
                        Lupa kata sandi itu wajar. Kami akan membantu Anda mendapatkan kembali akses ke Ruang Reka agar kolaborasi tim tetap berjalan lancar.
                    </p>
                </div>
                <div className="relative z-10 text-slate-500 text-sm font-medium">© 2026 RuKa. All rights reserved.</div>
            </div>

            {/* --- BAGIAN KANAN: Form Forgot Password --- */}
            <div className="w-full lg:w-1/2 bg-white flex flex-col p-8 sm:p-12 md:p-16 h-full overflow-y-auto relative z-10">
                <div className="max-w-md mx-auto w-full my-auto py-8">

                    <div className="flex items-center gap-2 mb-10">
                        <span className="bg-blue-600 text-white px-3 py-1.5 rounded-xl text-lg font-black tracking-tighter shadow-md">RuKa.</span>
                        <span className="text-2xl font-bold text-slate-800 tracking-tight">Ruang Reka</span>
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Lupa Kata Sandi?</h2>
                    <p className="text-slate-500 mb-8 font-medium leading-relaxed">
                        Tidak masalah. Cukup beri tahu kami alamat email Anda, dan kami akan mengirimkan tautan untuk membuat kata sandi baru.
                    </p>

                    {/* Notifikasi Sukses Tetap Hijau Biar Jelas */}
                    {status && <div className="mb-6 font-medium text-sm text-emerald-700 bg-emerald-50 p-4 rounded-xl border border-emerald-200">{status}</div>}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Terdaftar</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="block w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-slate-900 font-medium"
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="nama@kampus.ac.id"
                                required
                                autoFocus
                            />
                            {errors.email && <p className="text-sm text-red-500 mt-2">{errors.email}</p>}
                        </div>

                        <div className="pt-2">
                            <button type="submit" disabled={processing} className="w-full flex justify-center py-4 px-6 border border-transparent rounded-full shadow-xl shadow-blue-500/20 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition hover:-translate-y-1 disabled:opacity-50">
                                {processing ? 'Mengirim...' : 'Kirim Tautan Reset Sandi'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <Link href={route('login')} className="font-bold text-slate-500 hover:text-slate-800 transition flex items-center justify-center gap-2">
                            <span>&larr;</span> Kembali ke halaman Masuk
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}