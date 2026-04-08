<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Menampilkan Dashboard Utama Dosen
     */
    public function index()
    {
        // 1. Ambil ID Dosen yang sedang login
        $dosenId = Auth::id();

        // 2. Hitung Total Kelas Aktif milik Dosen ini
        $totalKelasAktif = DB::table('project_classes')
            ->where('dosen_id', $dosenId)
            ->count();

        // 3. Ambil daftar ruang kelas & kode invite-nya (Data Baru)
        $daftarKelas = DB::table('project_classes')
            ->where('dosen_id', $dosenId)
            ->select('id', 'mata_kuliah', 'nama_kelas', 'invite_code')
            ->orderBy('created_at', 'desc')
            ->get();

        // 4. Ambil semua kelompok dari kelas-kelas dosen ini
        $groups = DB::table('groups')
            ->join('project_classes', 'groups.project_class_id', '=', 'project_classes.id')
            ->where('project_classes.dosen_id', $dosenId)
            ->select('groups.*', 'project_classes.nama_kelas')
            ->get();

        $totalKelompok = $groups->count();

        $daftarKelompok = [];
        $kelompokKritis = [];

        // 5. Looping untuk hitung Progress & Deteksi Status Kritis
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

            // --- Logika Monitoring Pasif (> 3 Hari) ---
            $isKritis = false;
            $masalah = '';

            if ($latestLog) {
                $daysSinceLastLog = Carbon::parse($latestLog->created_at)->diffInDays(Carbon::now());
                if ($daysSinceLastLog >= 3) {
                    $isKritis = true;
                    $masalah = "Pasif selama $daysSinceLastLog hari";
                }
            } else {
                $isKritis = true;
                $masalah = 'Belum ada aktivitas sama sekali';
            }

            $status = $isKritis ? 'Kritis' : 'Aman';

            $daftarKelompok[] = [
                'id' => $group->id,
                'nama' => $group->nama_kelompok . ' (' . $group->nama_kelas . ')',
                'proyek' => $group->project_title ?? 'Judul belum ditentukan',
                'status' => $status,
                'progress' => $progress,
                'log_terakhir' => $logText
            ];

            if ($isKritis) {
                $kelompokKritis[] = [
                    'id' => $group->id,
                    'nama' => $group->nama_kelompok,
                    'masalah' => $masalah
                ];
            }
        }

        // 6. Kirim semua data ke Inertia
        return Inertia::render('Dosen/Dashboard', [
            'totalKelasAktif' => $totalKelasAktif,
            'totalKelompok' => $totalKelompok,
            'kelompokKritis' => $kelompokKritis,
            'daftarKelompok' => $daftarKelompok,
            'daftarKelas' => $daftarKelas // <-- Sekarang terkirim ke React
        ]);
    }

    /**
     * Menyimpan Kelas Baru
     */
    public function storeKelas(Request $request)
    {
        $request->validate([
            'mata_kuliah' => 'required|string|max:255',
            'nama_kelas' => 'required|string|max:255',
            'bobot_dasar' => 'required|numeric',
            'bobot_audit' => 'required|numeric',
            'bobot_peer' => 'required|numeric',
        ]);

        $inviteCode = strtoupper(Str::random(6));

        DB::table('project_classes')->insert([
            'dosen_id' => Auth::id(),
            'mata_kuliah' => $request->mata_kuliah,
            'nama_kelas' => $request->nama_kelas,
            'invite_code' => $inviteCode,
            'bobot_dasar' => $request->bobot_dasar,
            'bobot_audit' => $request->bobot_audit,
            'bobot_peer' => $request->bobot_peer,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        return redirect()->back()->with('message', 'Kelas berhasil dibuat!');
    }
}