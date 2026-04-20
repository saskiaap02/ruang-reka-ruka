<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

// Penamaan alias agar tidak bentrok antara controller Dosen dan Student
use App\Http\Controllers\Dosen\DashboardController as DosenDashboard;
use App\Http\Controllers\Student\DashboardController as StudentDashboard;

/*
|--------------------------------------------------------------------------
| Web Routes - Ruang Reka (RuKa)
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

// 1. REDIRECTOR OTOMATIS (Setelah Login)
Route::get('/dashboard', function (Request $request) {
    if ($request->user()->role === 'dosen') {
        return redirect()->route('dosen.dashboard');
    }
    return redirect()->route('mahasiswa.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


// 2. SEMUA RUTE TERPROTEKSI (Harus Login)
Route::middleware(['auth', 'verified'])->group(function () {

    // --- GRUP RUTE MAHASISWA ---
    Route::prefix('mahasiswa')->name('mahasiswa.')->group(function () {
        // Katalog & Detail
        Route::get('/dashboard', [StudentDashboard::class, 'index'])->name('dashboard');
        Route::get('/kelas/{id}', [StudentDashboard::class, 'showKelas'])->name('kelas.show');
        
        // Gabung Kelas
        Route::post('/join-class', [StudentDashboard::class, 'joinClass'])->name('join-class');
        
        // --- TUGAS (KANBAN SYSTEM RUANG REKA) ---
        // Simpan tugas baru (Reka Tugas)
        Route::post('/tasks/store', [StudentDashboard::class, 'storeTask'])->name('task.store');
        
        // Update status (Tarik kartu: Backlog -> In Progress -> Done)
        Route::post('/tasks/{id}/status', [StudentDashboard::class, 'updateTaskStatus'])->name('task.update-status');
        
        // Hapus tugas (Tombol X merah)
        Route::delete('/tasks/{id}', [StudentDashboard::class, 'deleteTask'])->name('task.delete');
        
        // Selesaikan tugas (Tombol Submit di In Progress)
        Route::post('/tasks/{taskId}/complete', [StudentDashboard::class, 'completeTask'])->name('tasks.complete');
        
        // Notifikasi / Colek
        Route::post('/colek/baca/{id}', [StudentDashboard::class, 'markNudgeRead'])->name('colek.read');
    });

    // --- GRUP RUTE DOSEN ---
    Route::prefix('dosen')->name('dosen.')->group(function () {
        // Dashboard & Manajemen Kelas
        Route::get('/dashboard', [DosenDashboard::class, 'index'])->name('dashboard');
        Route::post('/kelas', [DosenDashboard::class, 'storeKelas'])->name('kelas.store');
        Route::get('/kelas/{id}', [DosenDashboard::class, 'showKelas'])->name('kelas.show');

        // Manajemen Kelompok & Anggota
        Route::post('/kelompok', [DosenDashboard::class, 'storeKelompok'])->name('kelompok.store');
        Route::post('/tambah-anggota', [DosenDashboard::class, 'addMember'])->name('tambah.anggota');
        
        // Audit, Detail & Monitoring Kritis
        Route::get('/kelompok/{id}', [DosenDashboard::class, 'showKelompok'])->name('kelompok.show');
        Route::post('/audit/{groupId}/{studentId}', [DosenDashboard::class, 'auditStudent'])->name('audit.student');
        Route::post('/colek', [DosenDashboard::class, 'sendNudge'])->name('colek');
    });

    // --- PROFILE MANAGEMENT ---
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';