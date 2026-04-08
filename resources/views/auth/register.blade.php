<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daftar - RuKa. Ruang Reka</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white font-sans antialiased text-slate-900">

    <div class="flex min-h-screen">
        <div class="hidden lg:flex w-1/2 bg-[#0a1120] p-12 text-white flex-col justify-between relative overflow-hidden">
            <div class="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-blue-600 opacity-20"></div>
            <div class="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-blue-600 opacity-20"></div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-blue-600 opacity-10"></div>

            <div class="relative z-10 flex flex-col h-full justify-center">
                <h1 class="text-6xl font-black tracking-tighter mb-4">WELCOME</h1>
                <p class="text-2xl font-bold mb-6">Ruang Reka - Kolaborasi Tim Tanpa Batas</p>
                <p class="text-slate-400 max-w-md">Platform kolaborasi untuk mahasiswa dan dosen untuk mengelola proyek kelas dengan lebih efisien dan transparan.</p>
            </div>

            <div class="relative z-10 text-slate-600 text-sm">
                © 2023 RuKa. All rights reserved.
            </div>
        </div>

        <div class="w-full lg:w-1/2 bg-white flex flex-col justify-center p-8 sm:p-12 md:p-16">
            <div class="max-w-md mx-auto w-full">
                <div class="flex items-center gap-2 mb-10">
                    <span class="bg-blue-600 text-white px-2.5 py-1.5 rounded-lg text-sm font-black tracking-tighter">RuKa.</span>
                    <span class="text-xl font-bold text-slate-800">Ruang Reka</span>
                </div>

                <h2 class="text-3xl font-bold text-slate-900 mb-2">Daftar Akun Baru</h2>
                <p class="text-slate-600 mb-8">Daftar untuk mulai kolaborasi tim di RuKa.</p>

                <form method="POST" action="{{ route('register') }}" class="space-y-6">
                    @csrf

                    <div>
                        <label for="name" class="block text-sm font-medium text-slate-700">Nama Lengkap</label>
                        <div class="mt-1">
                            <input id="name" name="name" type="text" required autofocus class="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Masukkan nama lengkap Anda">
                        </div>
                    </div>

                    <div>
                        <label for="nim_nip" class="block text-sm font-medium text-slate-700">NIM / NIP</label>
                        <div class="mt-1 relative rounded-xl shadow-sm">
                            <input id="nim_nip" name="nim_nip" type="text" required class="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Masukkan NIM atau NIP Anda">
                        </div>
                    </div>

                    <div>
                        <label for="role" class="block text-sm font-medium text-slate-700">Daftar Sebagai</label>
                        <div class="mt-1">
                            <select id="role" name="role" required class="block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900">
                                <option value="mahasiswa">Mahasiswa</option>
                                <option value="dosen">Dosen</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <button type="submit" class="w-full flex justify-center py-3.5 px-6 border border-transparent rounded-full shadow-lg text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition hover:-translate-y-0.5">
                            Daftar Sekarang
                        </button>
                    </div>
                </form>

                <div class="mt-8 text-center text-sm">
                    <p class="text-slate-600">Sudah punya akun? <a href="{{ route('login') }}" class="font-bold text-blue-600 hover:text-blue-500">Masuk</a></p>
                </div>
            </div>
        </div>
    </div>

</body>
</html>