<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Dosen\DashboardController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes - SIM-CR
|--------------------------------------------------------------------------
*/

// 1. Landing Page (Halaman Awal)
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

// 3. Dashboard Redirector (Pintu Masuk Utama setelah Login)
Route::get('/dashboard', function (Request $request) {
    // Cek jika user adalah Dosen
    if ($request->user()->role === 'dosen') {
        return redirect()->route('dosen.dashboard');
    }
    
    // Kalau Mahasiswa, arahkan ke rute dashboard mahasiswa
    return redirect()->route('mahasiswa.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// --- RUTE SEMENTARA MAHASISWA (BUATAN TEMAN) ---
// Perhatikan: Namanya aku ubah jadi 'mahasiswa.dashboard' biar nggak bentrok
Route::get('/dashboard-mahasiswa', function () {
    return '
        <div style="font-family: sans-serif; padding: 50px; text-align: center;">
            <h1 style="color: #2563eb;">🎓 Berhasil Login sebagai Mahasiswa!</h1> 
            <p>Ini adalah area Dashboard Mahasiswa. Nanti bagian ini akan diisi oleh codingan teman saya.</p>
            
            <form method="POST" action="' . route('logout') . '" style="margin-top: 30px;">
                ' . csrf_field() . '
                <button type="submit" style="padding: 10px 24px; background-color: #ef4444; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.5);">
                    Keluar (Log Out)
                </button>
            </form>
        </div>
    ';
})->middleware(['auth', 'verified'])->name('mahasiswa.dashboard');

// 4. Rute Terproteksi (Hanya User Terautentikasi)
Route::middleware('auth')->group(function () {
    
    // Profile Management
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Grouping Rute Khusus Dosen
    Route::prefix('dosen')->name('dosen.')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        // Tambahkan rute dosen lainnya di sini...
    });
});

// 5. Load Rute Otentikasi Bawaan (Breeze/Standard)
require __DIR__.'/auth.php';