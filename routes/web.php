<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Dosen\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;

// 1. Tampilkan Landing Page SIM-CR di halaman paling awal
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

// 2. Cek Role saat berhasil Login
Route::get('/dashboard', function (Request $request) {
// ... (biarkan sisa kode di bawahnya tetap sama seperti sebelumnya)
    if ($request->user()->role === 'dosen') {
        return redirect()->route('dosen.dashboard');
    }
    
    // Kalau yang login Mahasiswa, arahkan ke Dashboard Mahasiswa
    return Inertia::render('Dashboard'); 
})->middleware(['auth', 'verified'])->name('dashboard');

// 3. Rute yang dilindungi sistem Login
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Rute khusus Dosen
    Route::get('/dosen/dashboard', [DashboardController::class, 'index'])->name('dosen.dashboard');
});

require __DIR__.'/auth.php';