<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\View\View;

class RegisteredUserController extends Controller
{
    /**
     * Menampilkan halaman registrasi.
     */
    public function create(): View
    {
        return view('auth.register');
    }

    /**
     * Proses pendaftaran user baru.
     */
    public function store(Request $request): RedirectResponse
    {
        // 1. Validasi Input
        $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'nim_nip'  => ['required', 'string', 'max:50', 'unique:users,nim_nip'], // Validasi NIM/NIP unik di tabel users
            'role'     => ['required', 'in:mahasiswa,dosen'],                    // Hanya boleh pilih salah satu
            'email'    => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        // 2. Simpan ke Database
        $user = User::create([
            'name'     => $request->name,
            'nim_nip'  => $request->nim_nip,
            'role'     => $request->role,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // 3. Jalankan Event Registered
        event(new Registered($user));

        // 4. Otomatis Login setelah daftar
        Auth::login($user);

        // 5. Redirect ke Dashboard
        return redirect(route('dashboard', absolute: false));
    }
}
