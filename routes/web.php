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
        Route::post('/tasks/store', [StudentDashboard::class, 'storeTask'])->name('task.store');
        Route::post('/tasks/{id}/status', [StudentDashboard::class, 'updateTaskStatus'])->name('task.update-status');
        Route::delete('/tasks/{id}', [StudentDashboard::class, 'deleteTask'])->name('task.delete');
        Route::post('/tasks/{taskId}/complete', [StudentDashboard::class, 'completeTask'])->name('tasks.complete');
        
        // Rute untuk mahasiswa menyimpan nilai Peer Review
        Route::post('/peer/{id}/rate', [StudentDashboard::class, 'ratePeer'])->name('peer.rate');
        
        // Notifikasi / Colek
        Route::post('/colek/baca/{id}', [StudentDashboard::class, 'markNudgeRead'])->name('colek.read');

        Route::post('/group/{id}/update-title', [StudentDashboard::class, 'updateGroupTitle'])->name('group.update-title');
        Route::post('/task/{id}/update', [StudentDashboard::class, 'updateTask'])->name('task.update');

    });

    // --- GRUP RUTE DOSEN ---
    Route::prefix('dosen')->name('dosen.')->group(function () {
        // Dashboard & Manajemen Kelas
        Route::get('/dashboard', [DosenDashboard::class, 'index'])->name('dashboard');
        Route::post('/kelas', [DosenDashboard::class, 'storeKelas'])->name('kelas.store');
        Route::get('/kelas/{id}', [DosenDashboard::class, 'showKelas'])->name('kelas.show');
        Route::post('/tambah-approve', [DosenDashboard::class, 'approveStudent'])->name('tambah.approve');
        
        // Generate AI Plan & Smart Grouping Eksekusi
        Route::post('/ai-generate-plot/{classId}', [DosenDashboard::class, 'generateAIPlan'])->name('ai.generate');
        Route::post('/smart-grouping', [DosenDashboard::class, 'generateSmartGrouping'])->name('smart-grouping');
        
        Route::get('/kelas/{id}/ekspor-siakad', [DosenDashboard::class, 'eksporSiakad'])->name('kelas.ekspor');

        // Manajemen Kelompok & Anggota
        Route::post('/kelompok', [DosenDashboard::class, 'storeKelompok'])->name('kelompok.store');
        Route::post('/tambah-anggota', [DosenDashboard::class, 'addMember'])->name('tambah.anggota');
        
        // Audit, Detail & Monitoring Kritis
        Route::get('/kelompok/{id}', [DosenDashboard::class, 'showKelompok'])->name('kelompok.show');
        Route::post('/audit/{groupId}/{studentId}', [DosenDashboard::class, 'auditStudent'])->name('audit.student');
        Route::post('/colek', [DosenDashboard::class, 'sendNudge'])->name('colek');

        // Rute untuk Dosen membuka sesi Peer Review
        Route::post('/buka-peer-review/{groupId}', [DosenDashboard::class, 'openPeerReview'])->name('peer-review.open');

        // Hapus kelompok (Pastikan method destroy ada di DosenDashboard atau sesuaikan controllernya)
        // KARENA SEBELUMNYA MENGGUNAKAN KelompokController::class YANG BELUM DI-IMPORT, 
        // SAYA ASUMSIKAN METHODNYA ADA DI DosenDashboard. JIKA BEDA, GANTI DosenDashboard::class
        Route::delete('/kelompok/{id}', [DosenDashboard::class, 'destroy'])->name('kelompok.destroy');

        // Rute Notifikasi Dosen (DIPERBAIKI agar tidak double prefix 'dosen.dosen.')
        Route::post('/notifikasi/{id}/read', function ($id) {
            $notification = auth()->user()->notifications()->find($id);
            if ($notification) {
                $notification->markAsRead();
            }
            return back();
        })->name('notifications.read'); 
    });

    // --- PROFILE MANAGEMENT ---
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';