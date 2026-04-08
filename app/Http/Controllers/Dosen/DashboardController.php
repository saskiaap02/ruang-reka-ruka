<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Ambil ID Dosen yang sedang login
        $dosenId = Auth::id();

        // 2. Hitung Total Kelas Aktif milik Dosen ini
        $totalKelasAktif = DB::table('project_classes')
            ->where('dosen_id', $dosenId)
            ->count();

        // 3. Ambil semua kelompok yang ada di dalam kelas-kelas dosen ini
        $groups = DB::table('groups')
            ->join('project_classes', 'groups.project_class_id', '=', 'project_classes.id')
            ->where('project_classes.dosen_id', $dosenId)
            ->select('groups.*', 'project_classes.nama_kelas')
            ->get();

        $totalKelompok = $groups->count();

        // 4. Siapkan array kosong untuk menampung data yang akan dikirim ke React
        $daftarKelompok = [];
        $kelompokKritis = [];

        // 5. Looping setiap kelompok untuk menghitung progress dan cek status kritis
        foreach ($groups as $group) {
            
            // --- Hitung Progress dari tabel Tasks ---
            $totalTasks = DB::table('tasks')->where('group_id', $group->id)->count();
            $doneTasks = DB::table('tasks')
                ->where('group_id', $group->id)
                ->where('status', 'done')
                ->count();
            
            $progress = $totalTasks > 0 ? round(($doneTasks / $totalTasks) * 100) . '%' : '0%';

            // --- Ambil Log Aktivitas Terakhir ---
            $latestLog = DB::table('activity_logs')
                ->join('users', 'activity_logs.user_id', '=', 'users.id')
                ->where('activity_logs.group_id', $group->id)
                ->select('activity_logs.description', 'activity_logs.action_type', 'users.name as user_name', 'activity_logs.created_at')
                ->orderBy('activity_logs.created_at', 'desc')
                ->first();

            $logText = $latestLog ? $latestLog->user_name . ' melakukan ' . $latestLog->action_type : 'Belum ada aktivitas';

            // --- Logika Warning AI (> 3 Hari Pasif) ---
            $isKritis = false;
            $masalah = '';

            if ($latestLog) {
                // Hitung selisih hari dari log terakhir
                $daysSinceLastLog = Carbon::parse($latestLog->created_at)->diffInDays(Carbon::now());
                if ($daysSinceLastLog >= 3) {
                    $isKritis = true;
                    $masalah = "Pasif selama $daysSinceLastLog hari";
                }
            } else {
                // Kalau belum ada log sama sekali
                $isKritis = true;
                $masalah = 'Belum ada aktivitas sama sekali';
            }

            $status = $isKritis ? 'Kritis' : 'Aman';

            // Masukkan ke array utama
            $daftarKelompok[] = [
                'id' => $group->id,
                'nama' => $group->nama_kelompok . ' (' . $group->nama_kelas . ')',
                'proyek' => $group->project_title ?? 'Judul belum ditentukan',
                'status' => $status,
                'progress' => $progress,
                'log_terakhir' => $logText
            ];

            // Jika kritis, masukkan juga ke array peringatan
            if ($isKritis) {
                $kelompokKritis[] = [
                    'id' => $group->id,
                    'nama' => $group->nama_kelompok,
                    'masalah' => $masalah
                ];
            }
        }

        // 6. Kirim data dinamis ke Frontend React
        return Inertia::render('Dosen/Dashboard', [
            'totalKelasAktif' => $totalKelasAktif,
            'totalKelompok' => $totalKelompok,
            'kelompokKritis' => $kelompokKritis,
            'daftarKelompok' => $daftarKelompok
        ]);
    }
}