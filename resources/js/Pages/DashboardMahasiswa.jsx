import { Head, Link } from '@inertiajs/react';

export default function DashboardMahasiswa() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
            <Head title="Dashboard Mahasiswa" />

            <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg text-center border border-slate-100">
                <div className="text-6xl mb-4">🎓</div>
                <h1 className="text-3xl font-black text-blue-600 mb-4">Berhasil Login!</h1>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    Ini adalah parkiran sementara untuk Dashboard Mahasiswa. Nanti bagian ini akan ditimpa oleh hasil <i>codingan</i> teman kelompokmu.
                </p>

                {/* Tombol Logout Pakai React Inertia */}
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full transition shadow-lg shadow-red-500/30 transform hover:-translate-y-1"
                >
                    Keluar (Log Out)
                </Link>
            </div>
        </div>
    );
}