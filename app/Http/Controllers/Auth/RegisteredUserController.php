public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'nim_nip' => 'required|string|max:50|unique:'.User::class, // Validasi NIM/NIP
            'role' => 'required|in:mahasiswa,dosen', // Validasi Role
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', \Illuminate\Validation\Rules\Password::defaults()],
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