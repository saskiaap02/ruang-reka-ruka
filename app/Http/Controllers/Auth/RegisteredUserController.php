<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Menampilkan view registrasi.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Menangani permintaan registrasi akun baru.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'nim_nip' => 'required|string|max:50|unique:'.User::class, 
            'role' => 'required|in:mahasiswa,dosen', 
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'nim_nip' => $request->nim_nip,
            'role' => $request->role,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        // --- LOGIKA REDIRECT BERDASARKAN ROLE ---
        
        // 1. Jika pendaftar adalah Dosen, arahkan ke dashboard khusus dosen
        if ($user->role === 'dosen') {
            return redirect()->route('dosen.dashboard');
        }

        // 2. Jika Mahasiswa, arahkan ke rute 'dashboard' (halaman parkir sementara)
        return redirect(route('dashboard', absolute: false));
    }
}