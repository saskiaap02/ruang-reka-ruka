import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => { return () => { reset('password'); }; }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Log in - Ruang Reka" />

            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Selamat Datang Kembali</h2>
                <p className="text-sm text-slate-400">Masuk untuk melanjutkan kolaborasi tim.</p>
            </div>

            {status && <div className="mb-4 font-medium text-sm text-emerald-500 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">{status}</div>}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                    <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="w-full bg-[#0b1120] border border-slate-700 rounded-xl text-white px-4 py-3 focus:ring-blue-500 focus:border-blue-500" placeholder="nama@kampus.ac.id" required autoFocus />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                    <input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} className="w-full bg-[#0b1120] border border-slate-700 rounded-xl text-white px-4 py-3 focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••" required />
                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                </div>

                <div className="flex items-center justify-between mt-4">
                    <label className="flex items-center">
                        <input type="checkbox" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-600" />
                        <span className="ms-2 text-sm text-slate-400">Ingat Saya</span>
                    </label>
                    {canResetPassword && (
                        <Link href={route('password.request')} className="text-sm text-blue-400 hover:text-blue-300">Lupa sandi?</Link>
                    )}
                </div>

                <button disabled={processing} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-600/30 mt-6">
                    {processing ? 'Memproses...' : 'Log In'}
                </button>

                <p className="text-center text-sm text-slate-400 mt-6">
                    Belum punya akun? <Link href={route('register')} className="text-blue-400 font-bold hover:text-blue-300">Daftar sekarang</Link>
                </p>
            </form>
        </GuestLayout>
    );
}