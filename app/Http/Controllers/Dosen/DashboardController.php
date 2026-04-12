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
     * Dashboard Utama Dosen
     * Menggabungkan monitoring progress, status kritis, dan data mahasiswa tanpa tim.
     */
    public function index()
    {
        $dosenId = Auth::id();

        // 1. Ambil Statistik Kelas
        $totalKelasAktif = DB::table('project_classes')
            ->where('dosen_id', $dosenId)
            ->count();

        $daftarKelas = DB::table('project_classes')
            ->where('dosen_id', $dosenId)
            ->select('id', 'mata_kuliah', 'nama_kelas', 'invite_code')
            ->orderBy('created_at', 'desc')
            ->get();

        // 2. Ambil Data Kelompok & Logika Monitoring
        $groups = DB::table('groups')
            ->join('project_classes', 'groups.project_class_id', '=', 'project_classes.id')
            ->where('project_classes.dosen_id', $dosenId)
            ->select('groups.*', 'project_classes.nama_kelas')
            ->get();

        $totalKelompok = $groups->count();
        $daftarKelompok = [];
        $kelompokKritis = [];

        foreach ($groups as $group) {
            // Hitung Progress Tugas
            $totalTasks = DB::table('tasks')->where('group_id', $group->id)->count();
            $doneTasks = DB::table('tasks')->where('group_id', $group->id)->where('status', 'done')->count();
            $progressRaw = $totalTasks > 0 ? ($doneTasks / $totalTasks) * 100 : 0;
            $progress = round($progressRaw) . '%';

            // Cek Aktivitas Terakhir (Logbook)
            $latestLog = DB::table('activity_logs')
                ->join('users', 'activity_logs.user_id', '=', 'users.id')
                ->where('activity_logs.group_id', $group->id)
                ->select('activity_logs.description', 'activity_logs.action_type', 'users.name as user_name', 'activity_logs.created_at')
                ->orderBy('activity_logs.created_at', 'desc')
                ->first();

            $logText = $latestLog ? $latestLog->user_name . ' melakukan ' . $latestLog->action_type : 'Belum ada aktivitas';

            // Penentuan Status Kritis (Kebanggaan Hilma!)
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

            $daftarKelompok[] = [
                'id' => $group->id,
                'nama' => $group->nama_kelompok . ' (' . $group->nama_kelas . ')',
                'proyek' => $group->project_title ?? 'Judul belum ditentukan',
                'status' => $isKritis ? 'Kritis' : 'Aman',
                'progress' => $progress,
                'log_terakhir' => $logText
            ];

            if ($isKritis) {
                $kelompokKritis[] = ['id' => $group->id, 'nama' => $group->nama_kelompok, 'masalah' => $masalah];
            }
        }

        // 3. FITUR INTEGRASI: Ambil Mahasiswa yang sudah join kelas tapi BELUM masuk kelompok
        $mahasiswaTanpaKelompok = DB::table('class_students')
            ->join('users', 'class_students.student_id', '=', 'users.id')
            ->join('project_classes', 'class_students.project_class_id', '=', 'project_classes.id')
            ->leftJoin('group_members', 'users.id', '=', 'group_members.student_id')
            ->where('project_classes.dosen_id', $dosenId)
            ->whereNull('group_members.id') // Filter yang belum ada di tabel group_members
            ->select('users.id', 'users.name', 'project_classes.nama_kelas')
            ->get();

        return Inertia::render('Dosen/Dashboard', [
            'totalKelasAktif' => $totalKelasAktif,
            'totalKelompok' => $totalKelompok,
            'kelompokKritis' => $kelompokKritis,
            'daftarKelompok' => $daftarKelompok,
            'daftarKelas' => $daftarKelas,
            'mahasiswaTanpaKelompok' => $mahasiswaTanpaKelompok
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

        DB::table('project_classes')->insert([
            'dosen_id' => Auth::id(),
            'mata_kuliah' => $request->mata_kuliah,
            'nama_kelas' => $request->nama_kelas,
            'invite_code' => strtoupper(Str::random(6)),
            'bobot_dasar' => $request->bobot_dasar,
            'bobot_audit' => $request->bobot_audit,
            'bobot_peer' => $request->bobot_peer,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        return redirect()->back();
    }

    /**
     * Membuat Kelompok Baru
     */
    public function storeKelompok(Request $request)
    {
        $request->validate([
            'project_class_id' => 'required|exists:project_classes,id',
            'nama_kelompok' => 'required|string|max:255',
            'project_title' => 'nullable|string|max:255',
        ]);

        DB::table('groups')->insert([
            'project_class_id' => $request->project_class_id,
            'nama_kelompok' => $request->nama_kelompok,
            'project_title' => $request->project_title,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('success', 'Kelompok berhasil dibuat!');
    }

    /**
     * Memasukkan Mahasiswa ke Kelompok (Fungsi Integrasi)
     */
    public function addMember(Request $request)
    {
        $request->validate([
            'group_id' => 'required|exists:groups,id',
            'student_id' => 'required|exists:users,id',
        ]);

        DB::table('group_members')->insert([
            'group_id' => $request->group_id,
            'student_id' => $request->student_id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('success', 'Mahasiswa berhasil dimasukkan ke tim!');
    }

    /**
     * Detail Kelompok & Audit Mode
     */
    public function showKelompok($id)
    {
        $kelompok = DB::table('groups')
            ->join('project_classes', 'groups.project_class_id', '=', 'project_classes.id')
            ->where('groups.id', $id)
            ->select('groups.*', 'project_classes.mata_kuliah', 'project_classes.nama_kelas', 'project_classes.bobot_dasar', 'project_classes.bobot_audit', 'project_classes.bobot_peer')
            ->first();

        if (!$kelompok) abort(404);

        $anggota = DB::table('group_members')
            ->join('users', 'group_members.student_id', '=', 'users.id')
            ->where('group_members.group_id', $id)
            ->select('users.id', 'users.name', 'users.email', 'group_members.nilai_akhir', 'group_members.nilai_audit')
            ->get()
            ->map(function($user) use ($id) {
                $lastLog = DB::table('activity_logs')
                    ->where('group_id', $id)
                    ->where('user_id', $user->id)
                    ->orderBy('created_at', 'desc')
                    ->first();
                
                $user->last_activity = $lastLog ? Carbon::parse($lastLog->created_at)->diffForHumans() : 'Tidak ada aktivitas';
                $user->is_inactive = $lastLog ? Carbon::parse($lastLog->created_at)->diffInDays(now()) >= 3 : true;
                return $user;
            });

        $tasks = DB::table('tasks')
            ->leftJoin('users', 'tasks.pic_id', '=', 'users.id')
            ->where('tasks.group_id', $id)
            ->select('tasks.*', 'users.name as pic_name')
            ->orderBy('status', 'desc')
            ->get();

        $logs = DB::table('activity_logs')
            ->join('users', 'activity_logs.user_id', '=', 'users.id')
            ->where('activity_logs.group_id', $id)
            ->select('activity_logs.*', 'users.name as user_name')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Dosen/GroupDetail', [
            'kelompok' => $kelompok,
            'anggota' => $anggota,
            'tasks' => $tasks,
            'logs' => $logs
        ]);
    }

    /**
     * Fitur Audit: Memberikan Nilai
     */
    public function auditStudent(Request $request, $groupId, $studentId)
    {
        $request->validate(['nilai_audit' => 'required|numeric|min:0|max:100']);

        DB::table('group_members')
            ->where('group_id', $groupId)
            ->where('student_id', $studentId)
            ->update([
                'nilai_audit' => $request->nilai_audit,
                'updated_at' => now(),
            ]);

        return back()->with('success', 'Nilai audit berhasil disimpan!');
    }
}