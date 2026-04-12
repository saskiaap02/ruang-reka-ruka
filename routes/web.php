<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;

// Penamaan alias agar tidak bentrok
use App\Http\Controllers\Dosen\DashboardController as DosenDashboard;
use App\Http\Controllers\Student\DashboardController as StudentDashboard;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);
});

// Redirect otomatis setelah login
Route::get('/dashboard', function (Request $request) {
    if ($request->user()->role === 'dosen') {
        return redirect()->route('dosen.dashboard');
    }
    return redirect()->route('mahasiswa.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {

    // --- DASHBOARD MAHASISWA ---
    Route::get('/dashboard-mahasiswa', [StudentDashboard::class, 'index'])->name('mahasiswa.dashboard');
    Route::post('/join-class', [StudentDashboard::class, 'joinClass'])->name('class.join');
    Route::post('/tasks/{taskId}/claim', [StudentDashboard::class, 'claimTask'])->name('tasks.claim');
    Route::post('/tasks/{taskId}/complete', [StudentDashboard::class, 'completeTask'])->name('tasks.complete');

    // --- KELOMPOK RUTE DOSEN ---
    Route::prefix('dosen')->name('dosen.')->group(function () {
// Halaman Utama Dashboard Dosen
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Rute untuk simpan kelas baru
        Route::post('/kelas', [DashboardController::class, 'storeKelas'])->name('kelas.store');
        
        // Rute buatan kamu (pastikan nama controllernya benar ya!)
        Route::post('/kelompok', [DashboardController::class, 'storeKelompok'])->name('kelompok.store');
        Route::post('/tambah-anggota', [DashboardController::class, 'addMember'])->name('tambah.anggota');

        // Rute untuk melihat detail kelompok tertentu (ID)
        Route::get('/kelompok/{id}', [DashboardController::class, 'showKelompok'])->name('kelompok.show');

        // Rute Fitur Colek (Nudge) Mahasiswa
        Route::post('/colek', [DashboardController::class, 'sendNudge'])->name('colek');
    });

    // --- PROFILE ---
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';