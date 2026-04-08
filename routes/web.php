<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Dosen\DashboardController;
use App\Http\Controllers\Auth\RegisteredUserController; // Pastikan import ini ada
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// 1. Landing Page
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

// 2. Registrasi (Opsional: Jika ingin override bawaan Breeze/Jetstream)
Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);
});

// 3. Dashboard Redirector (Logic Role Switcher)
Route::get('/dashboard', function (Request $request) {
    // Jika Role adalah Dosen
    if ($request->user()->role === 'dosen') {
        return redirect()->route('dosen.dashboard');
    }
    
    // Default: Dashboard Mahasiswa/Umum
    return Inertia::render('Dashboard'); 
})->middleware(['auth', 'verified'])->name('dashboard');

// 4. Rute Terproteksi (Hanya user yang sudah Login)
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

// 5. Load Rute Otentikasi Bawaan (Login, Logout, Reset Password, dll)
require __DIR__.'/auth.php';