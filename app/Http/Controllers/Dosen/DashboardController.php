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

class DashboardController extends Controller
{
    /**
     * Dashboard Utama Dosen
     */
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

        $totalKelompok = $groups->count();
        $daftarKelompok = [];
        $kelompokKritis = [];

        foreach ($groups as $group) {
            $totalTasks = DB::table('tasks')->where('group_id', $group->id)->count();
            $doneTasks = DB::table('tasks')->where('group_id', $group->id)->where('status', 'done')->count();
            $progressRaw = $totalTasks > 0 ? ($doneTasks / $totalTasks) * 100 : 0;
            $progress = round($progressRaw) . '%';

            $latestLog = DB::table('activity_logs')
                ->join('users', 'activity_logs.user_id', '=', 'users.id')
                ->where('activity_logs.group_id', $group->id)
                ->select('activity_logs.description', 'activity_logs.action_type', 'users.name as user_name', 'activity_logs.created_at')
                ->orderBy('activity_logs.created_at', 'desc')
                ->first();

            $logText = $latestLog ? $latestLog->user_name . ' melakukan ' . $latestLog->action_type : 'Belum ada aktivitas';
            
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

        $mahasiswaTanpaKelompok = DB::table('class_students')
            ->join('users', 'class_students.student_id', '=', 'users.id')
            ->join('project_classes', 'class_students.project_class_id', '=', 'project_classes.id')
            ->where('project_classes.dosen_id', $dosenId)
            ->where('class_students.status', 'approved')
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

        $pendingRequestsCount = DB::table('class_students')
            ->join('project_classes', 'class_students.project_class_id', '=', 'project_classes.id')
            ->where('project_classes.dosen_id', $dosenId)
            ->where('class_students.status', 'pending')
            ->count();

        return Inertia::render('Dosen/Dashboard', [
            'totalKelasAktif' => $totalKelasAktif,
            'totalKelompok' => $totalKelompok,
            'kelompokKritis' => $kelompokKritis,
            'daftarKelompok' => $daftarKelompok,
            'daftarKelas' => $daftarKelas,
            'mahasiswaTanpaKelompok' => $mahasiswaTanpaKelompok,
            'pendingRequestsCount' => $pendingRequestsCount
        ]);
    }

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

    public function showKelas($id)
    {
        $dosenId = Auth::id();

        // 1. Ambil Data Detail Kelas (Keamanan sudah ada di sini via ->where('dosen_id'))
        $kelas = DB::table('project_classes')
            ->where('id', $id)
            ->where('dosen_id', $dosenId)
            ->first();

        if (!$kelas) abort(404);

        $groups = DB::table('groups')->where('project_class_id', $id)->get();

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

        $classIds = DB::table('project_classes')->where('dosen_id', auth()->id())->pluck('id');

        $mahasiswaTanpaKelompok = DB::table('class_students')
            ->join('users', 'class_students.student_id', '=', 'users.id')
            ->join('project_classes', 'class_students.project_class_id', '=', 'project_classes.id')
            ->leftJoin('smart_grouping_plans', function($join) {
                $join->on('class_students.student_id', '=', 'smart_grouping_plans.student_id')
                     ->on('class_students.project_class_id', '=', 'smart_grouping_plans.project_class_id');
            })
            ->whereIn('class_students.project_class_id', $classIds)
            ->where('class_students.status', 'approved')
            ->whereNotExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('group_members')
                    ->join('groups', 'group_members.group_id', '=', 'groups.id')
                    ->whereRaw('group_members.student_id = users.id')
                    ->whereColumn('groups.project_class_id', 'class_students.project_class_id');
            })
            ->select(
                'users.id', 
                'users.name', 
                'project_classes.nama_kelas',
                'smart_grouping_plans.target_group_id as ai_suggested_id'
            )
            ->get();

        $pendingStudents = DB::table('class_students')
            ->join('users', 'class_students.student_id', '=', 'users.id')
            ->leftJoin('smart_grouping_plans', function($join) use ($id) {
                $join->on('class_students.student_id', '=', 'smart_grouping_plans.student_id')
                     ->where('smart_grouping_plans.project_class_id', '=', $id);
            })
            ->where('class_students.project_class_id', $id)
            ->where('class_students.status', 'pending')
            ->select('users.id', 'users.name', 'users.email', 'smart_grouping_plans.reason as ai_reason')
            ->get();

        return Inertia::render('Dosen/ShowKelas', [
            'kelas' => $kelas,
            'daftarKelompok' => $daftarKelompok,
            'mahasiswaTanpaKelompok' => $mahasiswaTanpaKelompok,
            'pendingStudents' => $pendingStudents
        ]);
    }

    public function storeKelompok(Request $request)
    {
        $request->validate([
            'project_class_id' => 'required|exists:project_classes,id',
            'nama_kelompok' => 'required|string|max:255',
            'project_title' => 'nullable|string|max:255',
        ]);

        // [KEAMANAN] Pastikan kelas ini milik dosen yang login
        $isMyClass = DB::table('project_classes')->where('id', $request->project_class_id)->where('dosen_id', Auth::id())->exists();
        if (!$isMyClass) return back()->with('error', 'Akses ditolak!');

        DB::table('groups')->insert([
            'project_class_id' => $request->project_class_id,
            'nama_kelompok' => $request->nama_kelompok,
            'project_title' => $request->project_title,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('success', 'Kelompok berhasil dibuat!');
    }

    public function addMember(Request $request)
    {
        $request->validate([
            'group_id' => 'required|exists:groups,id',
            'student_id' => 'required|exists:users,id',
        ]);

        // [KEAMANAN] Pastikan kelompok ini ada di dalam kelas milik dosen yang login
        $isMyGroup = DB::table('groups')
            ->join('project_classes', 'groups.project_class_id', '=', 'project_classes.id')
            ->where('groups.id', $request->group_id)
            ->where('project_classes.dosen_id', Auth::id())
            ->exists();
            
        if (!$isMyGroup) return back()->with('error', 'Akses ditolak!');

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

    public function approveStudent(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:users,id',
            'class_id' => 'required|exists:project_classes,id',
        ]);

        $studentId = $request->student_id;
        $classId = $request->class_id;

        // [KEAMANAN] Pastikan kelas ini milik dosen yang login
        $isMyClass = DB::table('project_classes')->where('id', $classId)->where('dosen_id', Auth::id())->exists();
        if (!$isMyClass) return back()->with('error', 'Akses ditolak!');

        DB::transaction(function () use ($studentId, $classId) {
            DB::table('class_students')
                ->where('student_id', $studentId)
                ->where('project_class_id', $classId)
                ->update(['status' => 'approved', 'updated_at' => now()]);

            $plan = DB::table('smart_grouping_plans')
                ->where('student_id', $studentId)
                ->where('project_class_id', $classId)
                ->first();

            if ($plan) {
                DB::table('group_members')->updateOrInsert(
                    ['group_id' => $plan->target_group_id, 'student_id' => $studentId],
                    ['created_at' => now(), 'updated_at' => now()]
                );
            }
        });

        return back()->with('success', 'Mahasiswa disetujui! AI otomatis mengalokasikan tim jika rencana tersedia.');
    }

    public function generateAIPlan(Request $request, $classId)
    {
        // [KEAMANAN] Pastikan kelas ini milik dosen yang login
        $isMyClass = DB::table('project_classes')->where('id', $classId)->where('dosen_id', Auth::id())->exists();
        if (!$isMyClass) return back()->with('error', 'Akses ditolak!');

        $students = DB::table('class_students')
            ->join('users', 'class_students.student_id', '=', 'users.id')
            ->where('class_students.project_class_id', $classId)
            ->select('users.id', 'users.name')
            ->get();

        $groups = DB::table('groups')->where('project_class_id', $classId)->get();
        
        if ($students->isEmpty() || $groups->isEmpty()) {
            return back()->with('error', 'Mahasiswa atau Kelompok belum tersedia!');
        }

        $studentScores = [];
        foreach ($students as $student) {
            $avgScore = DB::table('group_members')
                ->where('student_id', $student->id)
                ->avg('nilai_audit') ?? 70;

            $studentScores[] = [
                'id' => $student->id,
                'name' => $student->name,
                'score' => $avgScore
            ];
        }

        usort($studentScores, fn($a, $b) => $b['score'] <=> $a['score']);

        $groupCount = $groups->count();
        foreach ($studentScores as $index => $data) {
            $targetGroup = $groups[$index % $groupCount];

            $tier = $data['score'] >= 85 ? 'High Performer' : ($data['score'] >= 70 ? 'Mid' : 'Low');
            $reason = "AI menempatkan " . $data['name'] . " ($tier) untuk menyeimbangkan stabilitas tim.";

            DB::table('smart_grouping_plans')->updateOrInsert(
                ['student_id' => $data['id'], 'project_class_id' => $classId],
                [
                    'target_group_id' => $targetGroup->id,
                    'reason' => $reason,
                    'updated_at' => now()
                ]
            );
        }

        return back()->with('success', 'Asisten AI RuKa berhasil merancang tim berdasarkan riwayat performa!');
    }

    public function generateSmartGrouping(Request $request)
    {
        $request->validate([
            'project_class_id' => 'required|exists:project_classes,id',
            'distribution_data' => 'required|array',
            'distribution_data.*.student_id' => 'required|exists:users,id',
            'distribution_data.*.target_group_id' => 'required|exists:groups,id',
            'distribution_data.*.reason' => 'nullable|string',
        ]);

        // [KEAMANAN] Pastikan kelas ini milik dosen yang login
        $isMyClass = DB::table('project_classes')->where('id', $request->project_class_id)->where('dosen_id', Auth::id())->exists();
        if (!$isMyClass) return back()->with('error', 'Akses ditolak!');

        DB::beginTransaction();
        try {
            DB::table('smart_grouping_plans')->where('project_class_id', $request->project_class_id)->delete();

            foreach ($request->distribution_data as $data) {
                DB::table('smart_grouping_plans')->insert([
                    'project_class_id' => $request->project_class_id,
                    'student_id'       => $data['student_id'],
                    'target_group_id'  => $data['target_group_id'],
                    'reason'           => $data['reason'] ?? 'Didistribusikan oleh AI Smart Grouping',
                    'created_at'       => now(),
                    'updated_at'       => now(),
                ]);

                $isAlreadyMember = DB::table('group_members')
                    ->where('student_id', $data['student_id'])
                    ->where('group_id', $data['target_group_id'])
                    ->exists();

                if (!$isAlreadyMember) {
                    DB::table('group_members')->insert([
                        'group_id'   => $data['target_group_id'],
                        'student_id' => $data['student_id'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            DB::commit();
            return back()->with('success', 'Rancangan kelompok AI berhasil disimpan dan mahasiswa telah didistribusikan!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal memproses Smart Grouping: ' . $e->getMessage());
        }
    }

    public function showKelompok($id)
    {
        // [KEAMANAN & GET DATA] Cek sekalian join untuk memastikan Dosen ini yang punya
        $kelompok = DB::table('groups')
            ->join('project_classes', 'groups.project_class_id', '=', 'project_classes.id')
            ->where('groups.id', $id)
            ->where('project_classes.dosen_id', Auth::id()) // <-- KEAMANAN
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

   public function auditStudent(Request $request, $groupId, $studentId)
    {
        // [KEAMANAN] Pastikan kelompok ini ada di dalam kelas milik dosen yang login
        $config = DB::table('groups')
            ->join('project_classes', 'groups.project_class_id', '=', 'project_classes.id')
            ->where('groups.id', $groupId)
            ->where('project_classes.dosen_id', Auth::id())
            ->select('project_classes.bobot_dasar', 'project_classes.bobot_audit', 'project_classes.bobot_peer')
            ->first();

        if (!$config) return back()->with('error', 'Akses ditolak!');

        $student = DB::table('users')->where('id', $studentId)->first();

        $nilaiAudit = $request->nilai_audit;
        $nilaiDasar = 85; 
        $nilaiPeer = 88;

        $total = (($nilaiDasar * $config->bobot_dasar) + 
                  ($nilaiAudit * $config->bobot_audit) + 
                  ($nilaiPeer * $config->bobot_peer)) / 100;

        DB::table('group_members')
            ->where('group_id', $groupId)
            ->where('student_id', $studentId)
            ->update([
                'nilai_audit' => $nilaiAudit,
                'nilai_akhir' => $total,
                'updated_at' => now()
            ]);

        return back()->with('success', "Nilai {$student->name} berhasil diperbarui!");
    }

    public function eksporSiakad($id)
    {
        // [KEAMANAN] Pastikan dosen hanya mengekspor kelasnya sendiri
        $kelas = DB::table('project_classes')->where('id', $id)->where('dosen_id', Auth::id())->first();

        if (!$kelas) {
            return back()->with('error', 'Kelas tidak ditemukan atau akses ditolak.');
        }

        $namaFile = 'Nilai_SIAKAD_' . str_replace(' ', '_', $kelas->nama_kelas) . '.xlsx';
        return Excel::download(new NilaiSiakadExport($id), $namaFile);
    }

    public function sendNudge(Request $request)
    {
        // [KEAMANAN] Pastikan kelompok ini ada di dalam kelas milik dosen yang login
        $isMyGroup = DB::table('groups')
            ->join('project_classes', 'groups.project_class_id', '=', 'project_classes.id')
            ->where('groups.id', $request->group_id)
            ->where('project_classes.dosen_id', Auth::id())
            ->exists();
            
        if (!$isMyGroup) return back()->with('error', 'Akses ditolak!');

        DB::table('nudges')->insert([
            'dosen_id' => Auth::id(),
            'student_id' => $request->student_id,
            'group_id' => $request->group_id,
            'message' => "Dosen memberikan peringatan karena kamu tidak aktif.",
            'created_at' => now(),
        ]);

        return redirect()->back()->with('message', 'Mahasiswa berhasil dicolek!');
    }

    public function openPeerReview($groupId)
    {
        // [KEAMANAN] Pastikan kelompok ini ada di dalam kelas milik dosen yang login
        $group = DB::table('groups')
            ->join('project_classes', 'groups.project_class_id', '=', 'project_classes.id')
            ->where('groups.id', $groupId)
            ->where('project_classes.dosen_id', Auth::id())
            ->select('groups.*')
            ->first();

        if (!$group) {
            return back()->with('error', 'Kelompok tidak ditemukan atau akses ditolak.');
        }

        $members = DB::table('group_members')
            ->where('group_id', $groupId)
            ->pluck('student_id')
            ->toArray();

        if (count($members) < 2) {
            return back()->with('error', 'Anggota kelompok kurang dari 2 orang. Tidak bisa melakukan Peer Review.');
        }

        DB::beginTransaction();
        try {
            $isAlreadyOpened = DB::table('peer_reviews')
                ->where('group_id', $groupId)
                ->exists();

            if ($isAlreadyOpened) {
                return back()->with('info', 'Sesi Peer Review sudah pernah dibuka untuk kelompok ini.');
            }

            $peerReviewData = [];
            foreach ($members as $reviewerId) {
                foreach ($members as $revieweeId) {
                    if ($reviewerId !== $revieweeId) {
                        $peerReviewData[] = [
                            'reviewer_id' => $reviewerId,
                            'reviewee_id' => $revieweeId,
                            'group_id'    => $groupId,
                            'score'       => null, 
                            'feedback_text'=> null,
                            'created_at'  => now(),
                            'updated_at'  => now(),
                        ];
                    }
                }
            }

            DB::table('peer_reviews')->insert($peerReviewData);

            DB::commit();
            return back()->with('success', 'Sesi Peer Review untuk kelompok ' . $group->nama_kelompok . ' berhasil dibuka!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal membuka sesi Peer Review: ' . $e->getMessage());
        }
    }
}