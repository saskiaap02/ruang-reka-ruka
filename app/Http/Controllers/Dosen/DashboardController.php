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
     * Menampilkan statistik, monitoring kelompok kritis, dan mahasiswa yang menunggu tim.
     */
    public function index()
    {
        // PAGAR KEAMANAN: Pastikan hanya Dosen yang bisa akses
        if (Auth::user()->role !== 'dosen') {
            return redirect()->route('mahasiswa.dashboard');
        }

        $dosenId = Auth::id();

        // 1. DATA STATISTIK KELAS
        $totalKelasAktif = DB::table('project_classes')
            ->where('dosen_id', $dosenId)
            ->count();

        $daftarKelas = DB::table('project_classes')
            ->where('dosen_id', $dosenId)
            ->select('id', 'mata_kuliah', 'nama_kelas', 'invite_code')
            ->orderBy('created_at', 'desc')
            ->get();

        // 2. MONITORING KELOMPOK & LOGIKA KRITIS
        $groups = DB::table('groups')
            ->join('project_classes', 'groups.project_class_id', '=', 'project_classes.id')
            ->where('project_classes.dosen_id', $dosenId)
            ->select('groups.*', 'project_classes.nama_kelas')
            ->get();

        $totalKelompok = $groups->count();
        $daftarKelompok = [];
        $kelompokKritis = [];

        foreach ($groups as $group) {
            // Hitung Progress Tugas dalam Kelompok
            $totalTasks = DB::table('tasks')->where('group_id', $group->id)->count();
            $doneTasks = DB::table('tasks')->where('group_id', $group->id)->where('status', 'done')->count();
            $progressRaw = $totalTasks > 0 ? ($doneTasks / $totalTasks) * 100 : 0;
            $progress = round($progressRaw) . '%';

            // Ambil Log Aktivitas Terakhir
            $latestLog = DB::table('activity_logs')
                ->join('users', 'activity_logs.user_id', '=', 'users.id')
                ->where('activity_logs.group_id', $group->id)
                ->select('activity_logs.description', 'activity_logs.action_type', 'users.name as user_name', 'activity_logs.created_at')
                ->orderBy('activity_logs.created_at', 'desc')
                ->first();

            $logText = $latestLog ? $latestLog->user_name . ' melakukan ' . $latestLog->action_type : 'Belum ada aktivitas';
            
            // Logika Penentuan Status Kritis (Pasif >= 3 Hari)
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
                $kelompokKritis[] = [
                    'id' => $group->id, 
                    'nama' => $group->nama_kelompok, 
                    'masalah' => $masalah
                ];
            }
        }

        // 3. INTEGRASI MAHASISWA: Ambil Mahasiswa yang sudah join kelas tapi BELUM masuk tim
        $mahasiswaTanpaKelompok = DB::table('class_students')
            ->join('users', 'class_students.student_id', '=', 'users.id')
            ->join('project_classes', 'class_students.project_class_id', '=', 'project_classes.id')
            ->where('project_classes.dosen_id', $dosenId)
            ->where('users.role', 'mahasiswa')
            ->whereNotExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('group_members')
                    ->join('groups', 'group_members.group_id', '=', 'groups.id')
                    ->whereRaw('group_members.student_id = users.id')
                    ->whereRaw('groups.project_class_id = project_classes.id');
            })
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
     * Membuat Ruang Kelas Baru
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

        return redirect()->back()->with('message', 'Kelas berhasil dibuat!');
    }

    /**
     * Menampilkan Detail Satu Ruang Kelas (Monitoring Per Kelas)
     */
    public function showKelas($id)
    {
        $dosenId = Auth::id();

        // 1. Ambil Data Detail Kelas
        $kelas = DB::table('project_classes')
            ->where('id', $id)
            ->where('dosen_id', $dosenId)
            ->first();

        if (!$kelas) abort(404);

        // 2. Ambil Daftar Kelompok KHUSUS di kelas ini
        $groups = DB::table('groups')
            ->where('project_class_id', $id)
            ->get();

        $daftarKelompok = [];
        foreach ($groups as $group) {
            $totalTasks = DB::table('tasks')->where('group_id', $group->id)->count();
            $doneTasks = DB::table('tasks')->where('group_id', $group->id)->where('status', 'done')->count();
            $progress = $totalTasks > 0 ? round(($doneTasks / $totalTasks) * 100) : 0;

            $latestLog = DB::table('activity_logs')
                ->join('users', 'activity_logs.user_id', '=', 'users.id')
                ->where('activity_logs.group_id', $group->id)
                ->select('activity_logs.action_type', 'users.name', 'activity_logs.created_at')
                ->orderBy('activity_logs.created_at', 'desc')
                ->first();

            $isKritis = $latestLog ? Carbon::parse($latestLog->created_at)->diffInDays(now()) >= 3 : true;

            $daftarKelompok[] = [
                'id' => $group->id,
                'nama' => $group->nama_kelompok,
                'proyek' => $group->project_title ?? 'Judul belum ditentukan',
                'status' => $isKritis ? 'Kritis' : 'Aman',
                'progress' => $progress . '%',
                'log_terakhir' => $latestLog ? $latestLog->name . ' melakukan ' . $latestLog->action_type : 'Belum ada aktivitas'
            ];
        }

        // 3. Ambil Mahasiswa Waiting List KHUSUS kelas ini
        $mahasiswaTanpaKelompok = DB::table('class_students')
            ->join('users', 'class_students.student_id', '=', 'users.id')
            ->where('class_students.project_class_id', $id)
            ->whereNotExists(function ($query) use ($id) {
                $query->select(DB::raw(1))
                    ->from('group_members')
                    ->join('groups', 'group_members.group_id', '=', 'groups.id')
                    ->whereRaw('group_members.student_id = users.id')
                    ->where('groups.project_class_id', $id);
            })
            ->select('users.id', 'users.name')
            ->get();

        return Inertia::render('Dosen/ShowKelas', [
            'kelas' => $kelas,
            'daftarKelompok' => $daftarKelompok,
            'mahasiswaTanpaKelompok' => $mahasiswaTanpaKelompok
        ]);
    }

    /**
     * Membuat Kelompok Baru dalam Kelas
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
     * Menugaskan Mahasiswa ke dalam Tim (Add Member)
     */
    public function addMember(Request $request)
    {
        $request->validate([
            'group_id' => 'required|exists:groups,id',
            'student_id' => 'required|exists:users,id',
        ]);

        $checkUser = DB::table('users')->where('id', $request->student_id)->first();
        if ($checkUser->role !== 'mahasiswa') {
            return back()->with('error', 'Hanya mahasiswa yang bisa dimasukkan ke kelompok!');
        }

        DB::table('group_members')->insert([
            'group_id' => $request->group_id,
            'student_id' => $request->student_id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('success', 'Mahasiswa berhasil dimasukkan ke tim!');
    }

    /**
     * Detail Kelompok & Mode Audit Dosen
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
            ->where('users.role', 'mahasiswa')
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
     * Fitur Audit: Memberikan Nilai Audit Mahasiswa
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

    /**
     * Mengirim Colekan (Nudge) via Database
     */
    public function sendNudge(Request $request)
    {
        DB::table('nudges')->insert([
            'dosen_id' => Auth::id(),
            'student_id' => $request->student_id,
            'group_id' => $request->group_id,
            'message' => "Dosen memberikan peringatan karena kamu tidak aktif.",
            'created_at' => now(),
        ]);

        return redirect()->back()->with('message', 'Mahasiswa berhasil dicolek!');
    }
}