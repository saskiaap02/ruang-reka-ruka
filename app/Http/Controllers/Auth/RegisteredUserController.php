<?php

// app/Http/Controllers/Auth/RegisteredUserController.php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia; // Jika menggunakan Inertia.js, jika tidak, abaikan
use Inertia\Response; // Jika menggunakan Inertia.js, jika tidak, abaikan

class RegisteredUserController extends Controller
{
    /**
     * Menampilkan view registrasi.
     */
    public function create(): Response | View // Kembalikan View jika menggunakan Blade
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
        // ... (Kode validasi dan penyimpanan Anda) ...
        $request->validate([
            'name' => 'required|string|max:255',
            'nim_nip' => 'required|string|max:50|unique:'.User::class, // Validasi NIM/NIP
            'role' => 'required|in:mahasiswa,dosen', // Validasi Role
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'nim_nip' => $request->nim_nip, // Simpan NIM/NIP
            'role' => $request->role,       // Simpan Role
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}