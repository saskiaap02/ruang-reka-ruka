<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB; // Tambahkan ini agar DB::table jalan
use Illuminate\Http\Request;
use Inertia\Inertia;

// Penamaan alias agar tidak bentrok antara controller Dosen dan Student
use App\Http\Controllers\Dosen\DashboardController as DosenDashboard;
use App\Http\Controllers\Student\DashboardController as StudentDashboard;

/*
|--------------------------------------------------------------------------
| Web Routes - SIM-CR
|--------------------------------------------------------------------------
*/

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

// Redirect otomatis setelah login berdasarkan role
Route::get('/dashboard', function (Request $request) {
    if ($request->user()->role === 'dosen') {
        return redirect()->route('dosen.dashboard');
    }
    return redirect()->route('mahasiswa.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {

    // --- GRUP RUTE MAHASISWA ---
    Route::prefix('mahasiswa')->name('mahasiswa.')->group(function () {
        Route::get('/dashboard', [StudentDashboard::class, 'index'])->name('dashboard');
        Route::post('/join-class', [StudentDashboard::class, 'joinClass'])->name('class.join');
        Route::post('/tasks/{taskId}/claim', [StudentDashboard::class, 'claimTask'])->name('tasks.claim');
        Route::post('/tasks/{taskId}/complete', [StudentDashboard::class, 'completeTask'])->name('tasks.complete');
        
        // Rute untuk mahasiswa menandai colekan sudah dibaca
        Route::post('/colek/baca/{id}', function ($id) {
            DB::table('nudges')->where('id', $id)->update(['is_read' => true]);
            return back();
        })->name('colek.read');
    });

    // --- GRUP RUTE DOSEN ---
    Route::prefix('dosen')->name('dosen.')->group(function () {
        // Halaman Utama Dashboard Dosen
        Route::get('/dashboard', [DosenDashboard::class, 'index'])->name('dashboard');

        // Manajemen Kelas
        Route::post('/kelas', [DosenDashboard::class, 'storeKelas'])->name('kelas.store');
        Route::post('/kelompok', [DosenDashboard::class, 'storeKelompok'])->name('kelompok.store');
        Route::post('/tambah-anggota', [DosenDashboard::class, 'addMember'])->name('tambah.anggota');

        // Audit & Monitoring
        Route::get('/kelompok/{id}', [DosenDashboard::class, 'showKelompok'])->name('kelompok.show');
        Route::post('/colek', [DosenDashboard::class, 'sendNudge'])->name('colek');
    });

    // --- PROFILE MANAGEMENT ---
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';