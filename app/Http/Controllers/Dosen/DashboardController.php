<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Exports\NilaiSiakadExport;
use Maatwebsite\Excel\Facades\Excel;
use App\Notifications\DosenAlertNotification;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        if (Auth::user()->role !== 'dosen') {
            return redirect()->route('mahasiswa.dashboard');
        }

        $dosenId = Auth::id();

        $totalKelasAktif = DB::table('project_classes')->where('dosen_id', $dosenId)->count();

        $daftarKelas = DB::table('project_classes')
            ->where('dosen_id', $dosenId)
            ->select('id', 'mata_kuliah', 'nama_kelas', 'invite_code')
            ->orderBy('created_at', 'desc')
            ->get();

        $groups = DB::table('groups')
            ->join('project_classes', 'groups.project_class_id', '=', 'project_classes.id')
            ->where('project_classes.dosen_id', $dosenId)
            ->select('groups.*', 'project_classes.nama_kelas')
            ->get();

        $totalKelompok  = $groups->count();
        $daftarKelompok = [];
        $kelompokKritis = [];

        foreach ($groups as $group) {
            $totalTasks = DB::table('tasks')->where('group_id', $group->id)->count();
            $doneTasks  = DB::table('tasks')->where('group_id', $group->id)->where('status', 'done')->count();
            $progress   = $totalTasks > 0 ? round(($doneTasks / $totalTasks) * 100) . '%' : '0%';

            $latestLog = DB::table('activity_logs')
                ->join('users', 'activity_logs.user_id', '=', 'users.id')
                ->where('activity_logs.group_id', $group->id)
                ->select('activity_logs.action_type', 'users.name as user_name', 'activity_logs.created_at')
                ->orderBy('activity_logs.created_at', 'desc')
                ->first();

            $isKritis = false;
            $masalah  = '';

            if ($latestLog) {
                $days = Carbon::parse($latestLog->created_at)->diffInDays(now());
                if ($days >= 3) {
                    $isKritis = true;
                    $masalah  = "Pasif selama {$days} hari";
                }
            } else {
                $isKritis = true;
                $masalah  = 'Belum ada aktivitas sama sekali';
            }

            $daftarKelompok[] = [
                'id'          => $group->id,
                'nama'        => $group->nama_kelompok . ' (' . $group->nama_kelas . ')',
                'proyek'      => $group->project_title ?? 'Judul belum ditentukan',
                'status'      => $isKritis ? 'Kritis' : 'Aman',
                'progress'    => $progress,
                'log_terakhir'=> $latestLog
                    ? $latestLog->user_name . ' melakukan ' . $latestLog->action_type
                    : 'Belum ada aktivitas',
            ];

            if ($isKritis) {
                $kelompokKritis[] = ['id' => $group->id, 'nama' => $group->nama_kelompok, 'masalah' => $masalah];
            }
        }

        foreach ($groups as $group) {
            $totalTasks = DB::table('tasks')->where('group_id', $group->id)->count();
            $doneTasks  = DB::table('tasks')->where('group_id', $group->id)->where('status', 'done')->count();
            $progress   = $totalTasks > 0 ? round(($doneTasks / $totalTasks) * 100) : 0;

            $latestLog = DB::table('activity_logs')
                ->join('users', 'activity_logs.user_id', '=', 'users.id')
                ->where('activity_logs.group_id', $group->id)
                ->select('activity_logs.action_type', 'users.name as user_name', 'activity_logs.created_at')
                ->orderBy('activity_logs.created_at', 'desc')
                ->first();

            $isKritis = false;
            $masalah  = '';

            if ($latestLog) {
                $days = Carbon::parse($latestLog->created_at)->diffInDays(now());
                if ($days >= 3) {
                    $isKritis = true;
                    $masalah  = "Pasif selama {$days} hari";
                }
            } else {
                $isKritis = true;
                $masalah  = 'Belum ada aktivitas sama sekali';
            }

            // ─── LOGIKA NOTIFIKASI AI KRITIS ──────────────────────────────
            if ($isKritis) {
                $kelompokKritis[] = ['id' => $group->id, 'nama' => $group->nama_kelompok, 'masalah' => $masalah];
                
                // Mencegah SPAM: Cek apakah notifikasi untuk kelompok ini sudah dikirim HARI INI
                $pesanNotif = "⚠️ Peringatan AI: Kelompok '{$group->nama_kelompok}' {$masalah}. Diperlukan intervensi segera.";
                
                $sudahDikirim = DB::table('notifications')
                    ->where('notifiable_id', $dosenId)
                    ->where('data', 'like', '%' . $group->nama_kelompok . '%')
                    ->whereDate('created_at', Carbon::today())
                    ->exists();

                if (!$sudahDikirim) {
                    $dosenUser->notify(new DosenAlertNotification($pesanNotif, "warning"));
                }
            }
            // ──────────────────────────────────────────────────────────────

            $daftarKelompok[] = [
                'id'          => $group->id,
                'nama'        => $group->nama_kelompok . ' (' . $group->nama_kelas . ')',
                'proyek'      => $group->project_title ?? 'Judul belum ditentukan',
                'status'      => $isKritis ? 'Kritis' : 'Aman',
                'progress'    => $progress . '%',
                'log_terakhir'=> $latestLog
                    ? $latestLog->user_name . ' melakukan ' . $latestLog->action_type
                    : 'Belum ada aktivitas',
            ];
        }

        // Mahasiswa approved yang belum masuk kelompok manapun
        $mahasiswaTanpaKelompok = DB::table('class_students')
            ->join('users', 'class_students.student_id', '=', 'users.id')
            ->join('project_classes', 'class_students.project_class_id', '=', 'project_classes.id')
            ->where('project_classes.dosen_id', $dosenId)
            ->where('class_students.status', 'approved')
            ->where('users.role', 'mahasiswa')
            ->whereNotExists(fn($q) => $q->select(DB::raw(1))
                ->from('group_members')
                ->join('groups', 'group_members.group_id', '=', 'groups.id')
                ->whereRaw('group_members.student_id = users.id')
                ->whereRaw('groups.project_class_id = project_classes.id'))
            ->select('users.id', 'users.name', 'project_classes.id as class_id', 'project_classes.nama_kelas')
            ->get();

        $pendingRequestsCount = DB::table('class_students')
            ->join('project_classes', 'class_students.project_class_id', '=', 'project_classes.id')
            ->where('project_classes.dosen_id', $dosenId)
            ->where('class_students.status', 'pending')
            ->count();

        // ── SYARAT AI SMART GROUPING ─────────────────────────────────────────
        // AI bisa dipakai jika MINIMAL 1 mahasiswa punya riwayat kerja (activity_logs)
        // DAN ada peer_reviews yang sudah pernah diisi di kelas-kelas dosen ini
        $classIds = $daftarKelas->pluck('id');

        $hasActivityHistory = DB::table('activity_logs')
            ->join('groups', 'activity_logs.group_id', '=', 'groups.id')
            ->whereIn('groups.project_class_id', $classIds)
            ->exists();

        $hasPeerReviewHistory = DB::table('peer_reviews')
            ->join('groups', 'peer_reviews.group_id', '=', 'groups.id')
            ->whereIn('groups.project_class_id', $classIds)
            ->whereNotNull('peer_reviews.score')
            ->exists();

        $aiSmartGroupingEligible = $hasActivityHistory && $hasPeerReviewHistory;

        // Jumlah mahasiswa yang punya riwayat (untuk pesan "kenapa belum bisa")
        $studentsWithHistory = $hasActivityHistory
            ? DB::table('activity_logs')
                ->join('groups', 'activity_logs.group_id', '=', 'groups.id')
                ->whereIn('groups.project_class_id', $classIds)
                ->distinct('activity_logs.user_id')
                ->count('activity_logs.user_id')
            : 0;

        $peerReviewsCompleted = $hasPeerReviewHistory
            ? DB::table('peer_reviews')
                ->join('groups', 'peer_reviews.group_id', '=', 'groups.id')
                ->whereIn('groups.project_class_id', $classIds)
                ->whereNotNull('peer_reviews.score')
                ->count()
            : 0;

            $notifications = Auth::user()->notifications()->take(5)->get();
            $unreadNotificationsCount = Auth::user()->unreadNotifications()->count();

        return Inertia::render('Dosen/Dashboard', [
            'totalKelasAktif'         => $totalKelasAktif,
            'totalKelompok'           => $totalKelompok,
            'kelompokKritis'          => $kelompokKritis,
            'daftarKelompok'          => $daftarKelompok,
            'daftarKelas'             => $daftarKelas,
            'mahasiswaTanpaKelompok'  => $mahasiswaTanpaKelompok,
            'pendingRequestsCount'    => $pendingRequestsCount,
            // Data eligibilitas AI
            'aiSmartGroupingEligible' => $aiSmartGroupingEligible,
            'aiEligibilityInfo'       => [
                'hasActivityHistory'    => $hasActivityHistory,
                'hasPeerReviewHistory'  => $hasPeerReviewHistory,
                'studentsWithHistory'   => $studentsWithHistory,
                'peerReviewsCompleted'  => $peerReviewsCompleted,
            ],
        ]);
    }

    public function storeKelas(Request $request)
    {
        $request->validate([
            'mata_kuliah' => 'required|string|max:255',
            'nama_kelas'  => 'required|string|max:255',
            'bobot_dasar' => 'required|integer|min:0|max:100',
            'bobot_audit' => 'required|integer|min:0|max:100',
            'bobot_peer'  => 'required|integer|min:0|max:100',
        ]);

        // Validasi total bobot = 100
        if (($request->bobot_dasar + $request->bobot_audit + $request->bobot_peer) !== 100) {
            return back()->withErrors(['bobot_dasar' => 'Total bobot harus 100%.']);
        }

        DB::table('project_classes')->insert([
            'dosen_id'    => Auth::id(),
            'mata_kuliah' => $request->mata_kuliah,
            'nama_kelas'  => $request->nama_kelas,
            'invite_code' => strtoupper(Str::random(6)),
            'bobot_dasar' => $request->bobot_dasar,
            'bobot_audit' => $request->bobot_audit,
            'bobot_peer'  => $request->bobot_peer,
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);

        return back()->with('message', 'Kelas berhasil dibuat!');
    }

    public function showKelas($id)
    {
        $dosenId = Auth::id();

        $kelas = DB::table('project_classes')
            ->where('id', $id)
            ->where('dosen_id', $dosenId)
            ->first();

        if (!$kelas) abort(404);

        $groups         = DB::table('groups')->where('project_class_id', $id)->get();
        $daftarKelompok = [];

        foreach ($groups as $group) {
            $totalTasks = DB::table('tasks')->where('group_id', $group->id)->count();
            $doneTasks  = DB::table('tasks')->where('group_id', $group->id)->where('status', 'done')->count();
            $progress   = $totalTasks > 0 ? round(($doneTasks / $totalTasks) * 100) : 0;

            $latestLog = DB::table('activity_logs')
                ->join('users', 'activity_logs.user_id', '=', 'users.id')
                ->where('activity_logs.group_id', $group->id)
                ->select('activity_logs.action_type', 'users.name', 'activity_logs.created_at')
                ->orderBy('activity_logs.created_at', 'desc')
                ->first();

            $isKritis = $latestLog
                ? Carbon::parse($latestLog->created_at)->diffInDays(now()) >= 3
                : true;

            $daftarKelompok[] = [
                'id'          => $group->id,
                'nama'        => $group->nama_kelompok,
                'proyek'      => $group->project_title ?? 'Judul belum ditentukan',
                'status'      => $isKritis ? 'Kritis' : 'Aman',
                'progress'    => $progress . '%',
                'log_terakhir'=> $latestLog
                    ? $latestLog->name . ' melakukan ' . $latestLog->action_type
                    : 'Belum ada aktivitas',
            ];
        }

        $mahasiswaTanpaKelompok = DB::table('class_students')
            ->join('users', 'class_students.student_id', '=', 'users.id')
            ->join('project_classes', 'class_students.project_class_id', '=', 'project_classes.id')
            ->leftJoin('smart_grouping_plans', function ($join) use ($id) {
                $join->on('class_students.student_id', '=', 'smart_grouping_plans.student_id')
                     ->where('smart_grouping_plans.project_class_id', '=', $id);
            })
            ->where('class_students.project_class_id', $id)
            ->where('class_students.status', 'approved')
            ->whereNotExists(fn($q) => $q->select(DB::raw(1))
                ->from('group_members')
                ->join('groups', 'group_members.group_id', '=', 'groups.id')
                ->whereRaw('group_members.student_id = users.id')
                ->where('groups.project_class_id', $id))
            ->select('users.id', 'users.name', 'smart_grouping_plans.target_group_id as ai_suggested_id', 'smart_grouping_plans.reason as ai_reason')
            ->get();

        $pendingStudents = DB::table('class_students')
            ->join('users', 'class_students.student_id', '=', 'users.id')
            ->leftJoin('smart_grouping_plans', function ($join) use ($id) {
                $join->on('class_students.student_id', '=', 'smart_grouping_plans.student_id')
                     ->where('smart_grouping_plans.project_class_id', '=', $id);
            })
            ->where('class_students.project_class_id', $id)
            ->where('class_students.status', 'pending')
            ->select('users.id', 'users.name', 'users.email', 'smart_grouping_plans.reason as ai_reason')
            ->get();

        return Inertia::render('Dosen/ShowKelas', [
            'kelas'                  => $kelas,
            'daftarKelompok'         => $daftarKelompok,
            'mahasiswaTanpaKelompok' => $mahasiswaTanpaKelompok,
            'pendingStudents'        => $pendingStudents,
        ]);
    }

    public function storeKelompok(Request $request)
    {
        $request->validate([
            'project_class_id' => 'required|exists:project_classes,id',
            'nama_kelompok'    => 'required|string|max:255',
            'project_title'    => 'nullable|string|max:255',
        ]);

        $isMyClass = DB::table('project_classes')
            ->where('id', $request->project_class_id)
            ->where('dosen_id', Auth::id())
            ->exists();

        if (!$isMyClass) return back()->with('error', 'Akses ditolak!');

        DB::table('groups')->insert([
            'project_class_id' => $request->project_class_id,
            'nama_kelompok'    => $request->nama_kelompok,
            'project_title'    => $request->project_title,
            'created_at'       => now(),
            'updated_at'       => now(),
        ]);

        return back()->with('success', 'Kelompok berhasil dibuat!');
    }

    public function addMember(Request $request)
    {
        $request->validate([
            'group_id'   => 'required|exists:groups,id',
            'student_id' => 'required|exists:users,id',
        ]);

        $isMyGroup = DB::table('groups')
            ->join('project_classes', 'groups.project_class_id', '=', 'project_classes.id')
            ->where('groups.id', $request->group_id)
            ->where('project_classes.dosen_id', Auth::id())
            ->exists();

        if (!$isMyGroup) return back()->with('error', 'Akses ditolak!');

        $user = DB::table('users')->where('id', $request->student_id)->first();
        if (!$user || $user->role !== 'mahasiswa') {
            return back()->with('error', 'Hanya mahasiswa yang bisa dimasukkan ke kelompok!');
        }

        $alreadyMember = DB::table('group_members')
            ->where('group_id', $request->group_id)
            ->where('student_id', $request->student_id)
            ->exists();

        if ($alreadyMember) {
            return back()->with('error', 'Mahasiswa sudah ada di kelompok ini!');
        }

        DB::table('group_members')->insert([
            'group_id'   => $request->group_id,
            'student_id' => $request->student_id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('success', 'Mahasiswa berhasil ditambahkan ke tim!');
    }

    public function approveStudent(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:users,id',
            'class_id'   => 'required|exists:project_classes,id',
        ]);

        $isMyClass = DB::table('project_classes')
            ->where('id', $request->class_id)
            ->where('dosen_id', Auth::id())
            ->exists();

        if (!$isMyClass) return back()->with('error', 'Akses ditolak!');

        DB::transaction(function () use ($request) {
            DB::table('class_students')
                ->where('student_id', $request->student_id)
                ->where('project_class_id', $request->class_id)
                ->update(['status' => 'approved', 'updated_at' => now()]);

            // Jika AI sudah punya rencana, langsung eksekusi
            $plan = DB::table('smart_grouping_plans')
                ->where('student_id', $request->student_id)
                ->where('project_class_id', $request->class_id)
                ->first();

            if ($plan) {
                DB::table('group_members')->updateOrInsert(
                    ['group_id' => $plan->target_group_id, 'student_id' => $request->student_id],
                    ['created_at' => now(), 'updated_at' => now()]
                );
            }
        });

        return back()->with('success', 'Mahasiswa disetujui!');
    }

    /**
     * GENERATE AI PLAN
     * * SYARAT yang harus dipenuhi sebelum bisa dijalankan:
     * 1. Mahasiswa sudah pernah kerja di kelompok sebelumnya (ada activity_logs)
     * 2. Sudah ada peer review yang terisi (score NOT NULL) dari sesi sebelumnya
     * * Algoritma:
     * - Hitung skor gabungan: nilai_audit (60%) + rata-rata peer review (40%)
     * - Sort descending (High Performer dulu)
     * - Distribusi round-robin ke kelompok yang tersedia
     */
    public function generateAIPlan(Request $request, $classId)
    {
        $isMyClass = DB::table('project_classes')
            ->where('id', $classId)
            ->where('dosen_id', Auth::id())
            ->exists();

        if (!$isMyClass) return back()->with('error', 'Akses ditolak!');

        // ── CEK SYARAT 1: Ada riwayat aktivitas ────────────────────────────
        $hasActivity = DB::table('activity_logs')
            ->join('groups', 'activity_logs.group_id', '=', 'groups.id')
            ->join('project_classes', 'groups.project_class_id', '=', 'project_classes.id')
            ->where('project_classes.dosen_id', Auth::id())
            ->exists();

        if (!$hasActivity) {
            return back()->with('error',
                'AI belum bisa dijalankan. Mahasiswa perlu menyelesaikan minimal satu siklus kerja kelompok terlebih dahulu agar AI punya data riwayat performa.'
            );
        }

        // ── CEK SYARAT 2: Ada peer review yang sudah terisi ────────────────
        $hasPeerReview = DB::table('peer_reviews')
            ->join('groups', 'peer_reviews.group_id', '=', 'groups.id')
            ->join('project_classes', 'groups.project_class_id', '=', 'project_classes.id')
            ->where('project_classes.dosen_id', Auth::id())
            ->whereNotNull('peer_reviews.score')
            ->exists();

        if (!$hasPeerReview) {
            return back()->with('error',
                'AI belum bisa dijalankan. Diperlukan minimal satu sesi peer review yang sudah terisi. Buka sesi peer review untuk kelompok yang aktif terlebih dahulu.'
            );
        }

        // ── AMBIL MAHASISWA YANG AKAN DIPLOT ───────────────────────────────
        $students = DB::table('class_students')
            ->join('users', 'class_students.student_id', '=', 'users.id')
            ->where('class_students.project_class_id', $classId)
            ->where('class_students.status', 'approved')
            ->select('users.id', 'users.name')
            ->get();

        $groups = DB::table('groups')->where('project_class_id', $classId)->get();

        if ($students->isEmpty()) {
            return back()->with('error', 'Belum ada mahasiswa yang approved di kelas ini.');
        }

        if ($groups->isEmpty()) {
            return back()->with('error', 'Buat minimal 1 kelompok terlebih dahulu.');
        }

        // ── HITUNG SKOR PERFORMA TIAP MAHASISWA ────────────────────────────
        $scoredStudents = $students->map(function ($student) {
            // Nilai audit (rata-rata dari semua kelas sebelumnya)
            $nilaiAudit = DB::table('group_members')
                ->where('student_id', $student->id)
                ->whereNotNull('nilai_audit')
                ->avg('nilai_audit') ?? 70;

            // Rata-rata peer review yang diterima mahasiswa ini (dari semua kelas sebelumnya)
            $avgPeer = DB::table('peer_reviews')
                ->where('reviewee_id', $student->id)
                ->whereNotNull('score')
                ->avg('score') ?? 70;

            // Jumlah log aktivitas (bobot partisipasi)
            $logCount = DB::table('activity_logs')
                ->where('user_id', $student->id)
                ->count();

            // Skor gabungan: 50% audit + 30% peer + 20% aktivitas (dinormalisasi)
            $activityScore = min(100, $logCount * 5); // Maks 20 log = 100
            $compositeScore = ($nilaiAudit * 0.5) + ($avgPeer * 0.3) + ($activityScore * 0.2);

            $tier = $compositeScore >= 80 ? 'High Performer'
                  : ($compositeScore >= 60 ? 'Solid Contributor' : 'Needs Mentoring');

            return [
                'id'             => $student->id,
                'name'           => $student->name,
                'composite'      => round($compositeScore, 1),
                'tier'           => $tier,
                'nilai_audit'    => round($nilaiAudit, 1),
                'avg_peer'       => round($avgPeer, 1),
                'activity_score' => round($activityScore, 1),
            ];
        })->sortByDesc('composite')->values();

        // ── DISTRIBUSI ROUND-ROBIN ──────────────────────────────────────────
        $groupCount = $groups->count();

        DB::beginTransaction();
        try {
            // Hapus rencana lama untuk kelas ini
            DB::table('smart_grouping_plans')->where('project_class_id', $classId)->delete();

            foreach ($scoredStudents as $index => $data) {
                $targetGroup = $groups[$index % $groupCount];

                $reason = sprintf(
                    'AI RuKa: %s (Skor Gabungan: %.1f | Audit: %.1f | Peer: %.1f | Aktivitas: %.1f)',
                    $data['tier'],
                    $data['composite'],
                    $data['nilai_audit'],
                    $data['avg_peer'],
                    $data['activity_score']
                );

                // 1. Simpan Rencana AI
                DB::table('smart_grouping_plans')->insert([
                    'project_class_id' => $classId,
                    'student_id'       => $data['id'],
                    'target_group_id'  => $targetGroup->id,
                    'reason'           => $reason,
                    'created_at'       => now(),
                    'updated_at'       => now(),
                ]);

                // 2. [TAMBAHAN KRUSIAL] Karena mahasiswa ini SUDAH 'approved', 
                // langsung masukkan secara resmi ke dalam kelompok!
                DB::table('group_members')->updateOrInsert(
                    ['student_id' => $data['id'], 'group_id' => $targetGroup->id],
                    [
                        'nilai_audit' => 0, // Reset default
                        'created_at'  => now(), 
                        'updated_at'  => now()
                    ]
                );
            }

            DB::commit();
            return back()->with('success',
                'AI berhasil menyusun dan mengeksekusi penempatan ' . $scoredStudents->count() . ' mahasiswa ke dalam kelompok secara seimbang!'
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal: ' . $e->getMessage());
        }
    }

    /**
     * SMART GROUPING — versi dari frontend (legacy, tetap disupport)
     */
    public function generateSmartGrouping(Request $request)
    {
        $request->validate([
            'project_class_id'                    => 'required|exists:project_classes,id',
            'distribution_data'                   => 'required|array',
            'distribution_data.*.student_id'      => 'required|exists:users,id',
            'distribution_data.*.target_group_id' => 'required|exists:groups,id',
            'distribution_data.*.reason'           => 'nullable|string',
        ]);

        $isMyClass = DB::table('project_classes')
            ->where('id', $request->project_class_id)
            ->where('dosen_id', Auth::id())
            ->exists();

        if (!$isMyClass) return back()->with('error', 'Akses ditolak!');

        DB::beginTransaction();
        try {
            DB::table('smart_grouping_plans')
                ->where('project_class_id', $request->project_class_id)
                ->delete();

            foreach ($request->distribution_data as $data) {
                DB::table('smart_grouping_plans')->insert([
                    'project_class_id' => $request->project_class_id,
                    'student_id'       => $data['student_id'],
                    'target_group_id'  => $data['target_group_id'],
                    'reason'           => $data['reason'] ?? 'Smart Grouping',
                    'created_at'       => now(),
                    'updated_at'       => now(),
                ]);

                DB::table('group_members')->updateOrInsert(
                    ['group_id' => $data['target_group_id'], 'student_id' => $data['student_id']],
                    ['created_at' => now(), 'updated_at' => now()]
                );
            }

            DB::commit();
            return back()->with('success', 'Distribusi kelompok berhasil!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal: ' . $e->getMessage());
        }
    }

    public function showKelompok($id)
    {
        $kelompok = DB::table('groups')
            ->join('project_classes', 'groups.project_class_id', '=', 'project_classes.id')
            ->where('groups.id', $id)
            ->where('project_classes.dosen_id', Auth::id())
            ->select('groups.*', 'project_classes.mata_kuliah', 'project_classes.nama_kelas',
                     'project_classes.bobot_dasar', 'project_classes.bobot_audit', 'project_classes.bobot_peer')
            ->first();

        if (!$kelompok) abort(404);

        $anggota = DB::table('group_members')
            ->join('users', 'group_members.student_id', '=', 'users.id')
            ->where('group_members.group_id', $id)
            ->where('users.role', 'mahasiswa')
            ->select('users.id', 'users.name', 'users.email', 'group_members.nilai_akhir', 'group_members.nilai_audit')
            ->get()
            ->map(function ($user) use ($id) {
                $lastLog = DB::table('activity_logs')
                    ->where('group_id', $id)
                    ->where('user_id', $user->id)
                    ->orderBy('created_at', 'desc')
                    ->first();

                // Rata-rata peer review yang diterima user ini
                $peerAvg = DB::table('peer_reviews')
                    ->where('group_id', $id)
                    ->where('reviewee_id', $user->id)
                    ->whereNotNull('score')
                    ->avg('score');

                $user->last_activity  = $lastLog
                    ? Carbon::parse($lastLog->created_at)->diffForHumans()
                    : 'Tidak ada aktivitas';
                $user->is_inactive    = $lastLog
                    ? Carbon::parse($lastLog->created_at)->diffInDays(now()) >= 3
                    : true;
                $user->avg_peer_score = $peerAvg ? round($peerAvg, 1) : null;

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

        // Status peer review kelompok ini
        $peerReviewStatus = [
            'is_open'   => DB::table('peer_reviews')->where('group_id', $id)->exists(),
            'total'     => DB::table('peer_reviews')->where('group_id', $id)->count(),
            'completed' => DB::table('peer_reviews')->where('group_id', $id)->whereNotNull('score')->count(),
        ];

        return Inertia::render('Dosen/GroupDetail', [
            'kelompok'         => $kelompok,
            'anggota'          => $anggota,
            'tasks'            => $tasks,
            'logs'             => $logs,
            'peerReviewStatus' => $peerReviewStatus,
        ]);
    }

    public function auditStudent(Request $request, $groupId, $studentId)
    {
        $config = DB::table('groups')
            ->join('project_classes', 'groups.project_class_id', '=', 'project_classes.id')
            ->where('groups.id', $groupId)
            ->where('project_classes.dosen_id', Auth::id())
            ->select('project_classes.bobot_dasar', 'project_classes.bobot_audit', 'project_classes.bobot_peer')
            ->first();

        if (!$config) return back()->with('error', 'Akses ditolak!');

        $request->validate(['nilai_audit' => 'required|numeric|min:0|max:100']);

        $nilaiDasar = $request->nilai_dasar ?? 85;
        $nilaiAudit = $request->nilai_audit;

        // Ambil rata-rata peer review untuk mahasiswa ini di kelompok ini
        $nilaiPeer = DB::table('peer_reviews')
            ->where('group_id', $groupId)
            ->where('reviewee_id', $studentId)
            ->whereNotNull('score')
            ->avg('score') ?? 0;

        $total = (($nilaiDasar * $config->bobot_dasar) +
                  ($nilaiAudit * $config->bobot_audit) +
                  ($nilaiPeer  * $config->bobot_peer)) / 100;

        DB::table('group_members')
            ->where('group_id', $groupId)
            ->where('student_id', $studentId)
            ->update([
                'nilai_audit' => $nilaiAudit,
                'nilai_akhir' => round($total, 2),
                'updated_at'  => now(),
            ]);

        $student = DB::table('users')->where('id', $studentId)->first();
        return back()->with('success', "Nilai {$student->name} berhasil diperbarui! Total: " . round($total, 2));
    }

    public function eksporSiakad($id)
    {
        $kelas = DB::table('project_classes')
            ->where('id', $id)
            ->where('dosen_id', Auth::id())
            ->first();

        if (!$kelas) return back()->with('error', 'Akses ditolak.');

        $namaFile = 'Nilai_SIAKAD_' . str_replace(' ', '_', $kelas->nama_kelas) . '.xlsx';
        return Excel::download(new NilaiSiakadExport($id), $namaFile);
    }

    public function sendNudge(Request $request)
    {
        $request->validate([
            'group_id'   => 'required|exists:groups,id',
            'student_id' => 'required|exists:users,id',
            'message'    => 'nullable|string|max:500',
        ]);

        $isMyGroup = DB::table('groups')
            ->join('project_classes', 'groups.project_class_id', '=', 'project_classes.id')
            ->where('groups.id', $request->group_id)
            ->where('project_classes.dosen_id', Auth::id())
            ->exists();

        if (!$isMyGroup) return back()->with('error', 'Akses ditolak!');

        DB::table('nudges')->insert([
            'dosen_id'   => Auth::id(),
            'student_id' => $request->student_id,
            'group_id'   => $request->group_id,
            'message'    => $request->message ?? 'Dosen mengingatkan kamu untuk lebih aktif berkontribusi.',
            'is_read'    => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('message', 'Peringatan berhasil dikirim!');
    }

   /**
     * Membuka Sesi Peer Review untuk suatu Kelompok
     */
    public function openPeerReview($groupId)
    {
        $group = DB::table('groups')->where('id', $groupId)->first();

        if (!$group) {
            return back()->with('error', 'Kelompok tidak ditemukan.');
        }

        // Ambil semua anggota di kelompok ini
        $members = DB::table('group_members')
            ->where('group_id', $groupId)
            ->pluck('student_id')
            ->toArray();

        if (count($members) < 2) {
            return back()->with('error', 'Anggota kelompok kurang dari 2 orang. Tidak bisa melakukan Peer Review.');
        }

        DB::beginTransaction();
        try {
            // Cek apakah sesi Peer Review sudah pernah dibuka
            $isAlreadyOpened = DB::table('peer_reviews')
                ->where('group_id', $groupId)
                ->exists();

            if ($isAlreadyOpened) {
                return back()->with('info', 'Sesi Peer Review sudah pernah dibuka untuk kelompok ini.');
            }

            // Buat kombinasi saling menilai (Data Generation)
            $peerReviewData = [];
            foreach ($members as $reviewerId) {
                foreach ($members as $revieweeId) {
                    if ($reviewerId !== $revieweeId) {
                        $peerReviewData[] = [
                            'reviewer_id'   => $reviewerId,
                            'reviewee_id'   => $revieweeId,
                            'group_id'      => $groupId,
                            'score'         => null, // Menunggu mahasiswa mengisi
                            'feedback_text' => null,
                            'created_at'    => now(),
                            'updated_at'    => now(),
                        ];
                    }
                }
            }

            // Eksekusi insert ke database
            DB::table('peer_reviews')->insert($peerReviewData);

            DB::commit();
            
            // Ini yang akan memunculkan Toast Alert "BERHASIL" di layar Dosen
            return back()->with('success', 'Sesi Peer Review berhasil dibuka! Mahasiswa sekarang bisa mulai menilai.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal membuka sesi Peer Review: ' . $e->getMessage());
        }
    }
    
    public function destroy($id)
    {
        $kelompok = Kelompok::findOrFail($id);
        $kelompok->delete();

        return back()->with('success', 'Kelompok berhasil dihapus');
    }

}