<x-guest-layout>
    
    <div class="text-center mb-8">
        <h2 class="text-white text-2xl font-bold">Daftar Akun Baru</h2>
        <p class="text-gray-400 text-sm mt-2">Daftar untuk mulai kolaborasi tim di RuKa.</p>
    </div>

    <form method="POST" action="{{ route('register') }}">
        @csrf

        <div class="mb-4">
            <label class="text-gray-300 text-sm mb-2 block">Nama Lengkap</label>
            <input type="text" name="name" value="{{ old('name') }}" required autofocus
                class="w-full bg-[#E8F0FE] rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 border-none">
            <x-input-error :messages="$errors->get('name')" class="mt-1 text-red-500 text-xs" />
        </div>

        <div class="mb-4">
            <label class="text-gray-300 text-sm mb-2 block">NIM / NIP</label>
            <input type="text" name="nim_nip" value="{{ old('nim_nip') }}" required
                class="w-full bg-[#E8F0FE] rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 border-none">
            <x-input-error :messages="$errors->get('nim_nip')" class="mt-1 text-red-500 text-xs" />
        </div>

        <div class="mb-4">
            <label class="text-gray-300 text-sm mb-2 block">Daftar Sebagai</label>
            <select name="role" required
                class="w-full bg-[#E8F0FE] rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 border-none">
                <option value="mahasiswa">Mahasiswa</option>
                <option value="dosen">Dosen</option>
            </select>
            <x-input-error :messages="$errors->get('role')" class="mt-1 text-red-500 text-xs" />
        </div>

        <div class="mb-4">
            <label class="text-gray-300 text-sm mb-2 block">Email</label>
            <input type="email" name="email" value="{{ old('email') }}" required
                class="w-full bg-[#E8F0FE] rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 border-none">
            <x-input-error :messages="$errors->get('email')" class="mt-1 text-red-500 text-xs" />
        </div>

        <div class="mb-4">
            <label class="text-gray-300 text-sm mb-2 block">Password</label>
            <input type="password" name="password" required
                class="w-full bg-[#E8F0FE] rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 border-none">
            <x-input-error :messages="$errors->get('password')" class="mt-1 text-red-500 text-xs" />
        </div>

        <div class="mb-8">
            <label class="text-gray-300 text-sm mb-2 block">Konfirmasi Password</label>
            <input type="password" name="password_confirmation" required
                class="w-full bg-[#E8F0FE] rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 border-none">
            <x-input-error :messages="$errors->get('password_confirmation')" class="mt-1 text-red-500 text-xs" />
        </div>

        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition duration-300 shadow-lg shadow-blue-900/50">
            Daftar Sekarang
        </button>

        <div class="mt-6 text-center text-sm">
            <span class="text-gray-400">Sudah punya akun? </span>
            <a href="{{ route('login') }}" class="text-blue-500 hover:underline">Masuk</a>
        </div>
    </form>
</x-guest-layout>