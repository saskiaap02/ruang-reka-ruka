import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Edit({ auth, mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;

    // --- FORM 1: UPDATE PROFIL ---
    const {
        data: profileData,
        setData: setProfileData,
        patch,
        errors: profileErrors,
        processing: profileProcessing,
        recentlySuccessful: profileSuccessful
    } = useForm({
        name: user.name,
        email: user.email,
    });

    const submitProfile = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    // --- FORM 2: UPDATE PASSWORD ---
    const {
        data: pwdData,
        setData: setPwdData,
        put,
        errors: pwdErrors,
        processing: pwdProcessing,
        recentlySuccessful: pwdSuccessful,
        reset: pwdReset
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submitPassword = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => pwdReset(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-slate-800 dark:text-white leading-tight">Pengaturan Akun</h2>}
        >
            <Head title="Pengaturan Akun" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* --- KARTU INFORMASI PROFIL --- */}
                    <div className="p-4 sm:p-8 bg-white dark:bg-slate-800 shadow-sm sm:rounded-xl border border-slate-200 dark:border-slate-700">
                        <section className="max-w-xl">
                            <header>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Informasi Profil</h2>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Perbarui informasi nama dan alamat email akun Anda.
                                </p>
                            </header>

                            <form onSubmit={submitProfile} className="mt-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={e => setProfileData('name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-900 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {profileErrors.name && <p className="mt-2 text-sm text-red-600">{profileErrors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Alamat Email</label>
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        onChange={e => setProfileData('email', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-900 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {profileErrors.email && <p className="mt-2 text-sm text-red-600">{profileErrors.email}</p>}
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                        disabled={profileProcessing}
                                        className="px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                                    >
                                        Simpan Profil
                                    </button>
                                    {profileSuccessful && (
                                        <p className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-md">
                                            Berhasil diperbarui.
                                        </p>
                                    )}
                                </div>
                            </form>
                        </section>
                    </div>

                    {/* --- KARTU UBAH PASSWORD --- */}
                    <div className="p-4 sm:p-8 bg-white dark:bg-slate-800 shadow-sm sm:rounded-xl border border-slate-200 dark:border-slate-700">
                        <section className="max-w-xl">
                            <header>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Ubah Password</h2>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Pastikan akun Anda menggunakan kata sandi yang panjang dan acak agar tetap aman.
                                </p>
                            </header>

                            <form onSubmit={submitPassword} className="mt-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password Saat Ini</label>
                                    <input
                                        type="password"
                                        value={pwdData.current_password}
                                        onChange={e => setPwdData('current_password', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-900 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {pwdErrors.current_password && <p className="mt-2 text-sm text-red-600">{pwdErrors.current_password}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password Baru</label>
                                    <input
                                        type="password"
                                        value={pwdData.password}
                                        onChange={e => setPwdData('password', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-900 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {pwdErrors.password && <p className="mt-2 text-sm text-red-600">{pwdErrors.password}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Konfirmasi Password Baru</label>
                                    <input
                                        type="password"
                                        value={pwdData.password_confirmation}
                                        onChange={e => setPwdData('password_confirmation', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-900 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {pwdErrors.password_confirmation && <p className="mt-2 text-sm text-red-600">{pwdErrors.password_confirmation}</p>}
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                        disabled={pwdProcessing}
                                        className="px-4 py-2 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 font-semibold text-sm rounded-lg hover:bg-slate-700 dark:hover:bg-white transition-colors shadow-sm disabled:opacity-50"
                                    >
                                        Ubah Password
                                    </button>
                                    {pwdSuccessful && (
                                        <p className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-md">
                                            Password berhasil diubah.
                                        </p>
                                    )}
                                </div>
                            </form>
                        </section>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}