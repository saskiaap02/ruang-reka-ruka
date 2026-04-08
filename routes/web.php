<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Dosen\DashboardController; // Pastikan ini sesuai folder controller kamu
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes - SIM-CR
|--------------------------------------------------------------------------
*/

// 1. Landing Page
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

// 2. Rute Registrasi (Manual Override)
Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);
});

// 3. Dashboard Redirector (Logika Pemisah Role)
Route::get('/dashboard', function (Request $request) {
    if ($request->user()->role === 'dosen') {
        return redirect()->route('dosen.dashboard');
    }
    return redirect()->route('mahasiswa.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// 4. Rute Terproteksi (Hanya User yang Login)
Route::middleware(['auth', 'verified'])->group(function () {
    
    // --- Dashboard Mahasiswa ---
    Route::get('/dashboard-mahasiswa', function () {
        return Inertia::render('DashboardMahasiswa');
    })->name('mahasiswa.dashboard');

    // --- Dashboard Dosen (Digabung ke sini) ---
    Route::get('/dosen/dashboard', [DashboardController::class, 'index'])->name('dosen.dashboard');

    // --- Profile Management ---
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// 5. Load Rute Otentikasi Bawaan
require __DIR__.'/auth.php';