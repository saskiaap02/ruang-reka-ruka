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
                $umurGrup = Carbon::parse($group->created_at)->diffInDays(now());
                if ($umurGrup >= 3) {
                    $isKritis = true;
                    $masalah  = "Belum ada aktivitas sejak dibentuk ({$umurGrup} hari lalu)";
                }
            }

            if ($isKritis) {
                $kelompokKritis[] = ['id' => $group->id, 'nama' => $group->nama_kelompok, 'kelas' => $group->nama_kelas, 'class_id' => $group->project_class_id, 'masalah' => $masalah];
                
                $pesanNotif = "⚠️ Peringatan AI: Kelompok '{$group->nama_kelompok}' {$masalah}. Diperlukan intervensi segera.";
                $sudahDikirim = DB::table('notifications')
                    ->where('notifiable_id', $dosenId)
                    ->where('data', 'like', '%' . $group->nama_kelompok . '%')
                    ->whereDate('created_at', Carbon::today())
                    ->exists();

                if (!$sudahDikirim) {
                    Auth::user()->notify(new DosenAlertNotification($pesanNotif, "warning"));
                }
            }

            $daftarKelompok[] = [
                'id'          => $group->id,
                'class_id'    => $group->project_class_id,
                'nama'        => $group->nama_kelompok,
                'kelas'       => $group->nama_kelas,
                'proyek'      => $group->project_title ?? 'Judul belum ditentukan',
                'status'      => $isKritis ? 'Kritis' : 'Aman',
                'progress'    => $progress . '%',
                'log_terakhir'=> $latestLog ? $latestLog->user_name . ' melakukan ' . $latestLog->action_type : 'Belum ada aktivitas',
            ];
        }

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
                ->whereRaw('groups.project_class_id = project_classes.id')
            )
            ->select('users.id', 'users.name', 'project_classes.id as class_id', 'project_classes.nama_kelas')
            ->get();

        $pendingRequestsCount = DB::table('class_students')
            ->join('project_classes', 'class_students.project_class_id', '=', 'project_classes.id')
            ->where('project_classes.dosen_id', $dosenId)
            ->where('class_students.status', 'pending')
            ->count();

        $classIds = $daftarKelas->pluck('id');
        $hasActivityHistory = DB::table('activity_logs')->join('groups', 'activity_logs.group_id', '=', 'groups.id')->whereIn('groups.project_class_id', $classIds)->exists();
        $hasPeerReviewHistory = DB::table('peer_reviews')->join('groups', 'peer_reviews.group_id', '=', 'groups.id')->whereIn('groups.project_class_id', $classIds)->whereNotNull('peer_reviews.score')->exists();
        $aiSmartGroupingEligible = $hasActivityHistory && $hasPeerReviewHistory;

        return Inertia::render('Dosen/Dashboard', [
            'totalKelasAktif'         => $totalKelasAktif,
            'totalKelompok'           => $totalKelompok,
            'kelompokKritis'          => $kelompokKritis,
            'daftarKelompok'          => $daftarKelompok,
            'daftarKelas'             => $daftarKelas,
            'mahasiswaTanpaKelompok'  => $mahasiswaTanpaKelompok,
            'pendingRequestsCount'    => $pendingRequestsCount,
            'aiSmartGroupingEligible' => $aiSmartGroupingEligible,
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
        $kelas = DB::table('project_classes')->where('id', $id)->where('dosen_id', $dosenId)->first();
        if (!$kelas) abort(404);

        $groups = DB::table('groups')->where('project_class_id', $id)->get();
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

            $isKritis = false;
            if ($latestLog) {
                $isKritis = Carbon::parse($latestLog->created_at)->diffInDays(now()) >= 3;
            } else {
                $isKritis = Carbon::parse($group->created_at)->diffInDays(now()) >= 3;
            }

            $daftarKelompok[] = [
                'id'          => $group->id,
                'nama'        => $group->nama_kelompok,
                'proyek'      => $group->project_title ?? 'Judul belum ditentukan',
                'status'      => $isKritis ? 'Kritis' : 'Aman',
                'progress'    => $progress . '%',
                'log_terakhir'=> $latestLog ? $latestLog->name . ' melakukan ' . $latestLog->action_type : 'Belum ada aktivitas',
            ];
        }

        $daftarMahasiswa = DB::table('class_students')
            ->join('users', 'class_students.student_id', '=', 'users.id')
            ->where('class_students.project_class_id', $id)
            ->where('class_students.status', 'approved')
            ->select('users.id', 'users.name', 'users.email')
            ->get()
            ->map(function ($mhs) use ($id) {
                $group = DB::table('group_members')
                    ->join('groups', 'group_members.group_id', '=', 'groups.id')
                    ->where('group_members.student_id', $mhs->id)
                    ->where('groups.project_class_id', $id)
                    ->select('groups.id as group_id', 'groups.nama_kelompok')
                    ->first();
                
                $mhs->group_name = $group ? $group->nama_kelompok : null;

                $ai = DB::table('smart_grouping_plans')->where('student_id', $mhs->id)->where('project_class_id', $id)->first();
                $mhs->ai_suggested_id = $ai ? $ai->target_group_id : null;
                $mhs->ai_reason = $ai ? $ai->reason : null;

                $nilaiAudit = DB::table('group_members')->where('student_id', $mhs->id)->where('nilai_audit', '>', 0)->avg('nilai_audit') ?? 0;
                $avgPeer = DB::table('peer_reviews')->where('reviewee_id', $mhs->id)->whereNotNull('score')->avg('score') ?? 0;
                $logCount = DB::table('activity_logs')->where('user_id', $mhs->id)->count();
                
                $activityScore = min(100, $logCount * 5);
                $compositeScore = ($nilaiAudit * 0.5) + ($avgPeer * 0.3) + ($activityScore * 0.2);

                $mhs->history = [
                    'audit'     => round($nilaiAudit, 1),
                    'peer'      => round($avgPeer, 1),
                    'aktivitas' => round($activityScore, 1),
                    'gabungan'  => round($compositeScore, 1),
                    'tier'      => $compositeScore >= 80 ? 'High Performer' : ($compositeScore >= 60 ? 'Solid Contributor' : 'Needs Mentoring')
                ];
                return $mhs;
            });

        $mahasiswaTanpaKelompok = $daftarMahasiswa->filter(fn($m) => is_null($m->group_name))->values();
        $pendingStudents = DB::table('class_students')->join('users', 'class_students.student_id', '=', 'users.id')->where('class_students.project_class_id', $id)->where('class_students.status', 'pending')->select('users.id', 'users.name', 'users.email')->get();

        return Inertia::render('Dosen/ShowKelas', [
            'kelas'                  => $kelas,
            'daftarKelompok'         => $daftarKelompok,
            'mahasiswaTanpaKelompok' => $mahasiswaTanpaKelompok,
            'pendingStudents'        => $pendingStudents,
            'daftarMahasiswa'        => $daftarMahasiswa, 
        ]);
    }

    public function storeKelompok(Request $request)
    {
        $request->validate([
            'project_class_id' => 'required|exists:project_classes,id',
            'nama_kelompok'    => 'required|string|max:255',
        ]);

        DB::table('groups')->insert([
            'project_class_id' => $request->project_class_id,
            'nama_kelompok'    => $request->nama_kelompok,
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

        $alreadyMember = DB::table('group_members')->where('group_id', $request->group_id)->where('student_id', $request->student_id)->exists();
        if ($alreadyMember) return back()->with('error', 'Mahasiswa sudah ada di kelompok ini!');

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
        DB::table('class_students')
            ->where('student_id', $request->student_id)
            ->where('project_class_id', $request->class_id)
            ->update(['status' => 'approved', 'updated_at' => now()]);

        return back()->with('success', 'Mahasiswa disetujui!');
    }

    public function generateAIPlan(Request $request, $classId)
    {
        $request->validate([
            'mode' => 'required|in:manual,auto',
            'jumlah_kelompok' => 'nullable|integer|min:1'
        ]);

        $students = DB::table('class_students')
            ->join('users', 'class_students.student_id', '=', 'users.id')
            ->where('class_students.project_class_id', $classId)
            ->where('class_students.status', 'approved')
            ->whereNotExists(fn($q) => $q->select(DB::raw(1))
                ->from('group_members')
                ->join('groups', 'group_members.group_id', '=', 'groups.id')
                ->whereRaw('group_members.student_id = users.id')
                ->where('groups.project_class_id', $classId)
            )
            ->select('users.id', 'users.name')
            ->get();

        if ($students->isEmpty()) return back()->with('error', 'Semua mahasiswa sudah mendapatkan tim.');

        if ($request->mode === 'auto') {
            if (!$request->jumlah_kelompok) return back()->with('error', 'Jumlah kelompok harus diisi.');
            
            for ($i = 1; $i <= $request->jumlah_kelompok; $i++) {
                DB::table('groups')->insert([
                    'project_class_id' => $classId,
                    'nama_kelompok'    => 'Tim ' . $i,
                    'created_at'       => now(),
                    'updated_at'       => now()
                ]);
            }
        }

        $groups = DB::table('groups')->where('project_class_id', $classId)->get();
        if ($groups->isEmpty()) return back()->with('error', 'Harap buat minimal 1 kelompok (Tim Kosong) atau pilih mode Buat Tim Otomatis!');

        $scoredStudents = $students->map(function ($student) {
            $nilaiAudit = DB::table('group_members')->where('student_id', $student->id)->where('nilai_audit', '>', 0)->avg('nilai_audit') ?? 0;
            $avgPeer = DB::table('peer_reviews')->where('reviewee_id', $student->id)->whereNotNull('score')->avg('score') ?? 0;
            $logCount = DB::table('activity_logs')->where('user_id', $student->id)->count();

            $activityScore = min(100, $logCount * 5);
            $compositeScore = ($nilaiAudit * 0.5) + ($avgPeer * 0.3) + ($activityScore * 0.2);
            $tier = $compositeScore >= 80 ? 'High Performer' : ($compositeScore >= 60 ? 'Solid Contributor' : 'Needs Mentoring');

            return [
                'id' => $student->id, 'composite' => $compositeScore, 'tier' => $tier, 'audit' => $nilaiAudit, 'peer' => $avgPeer, 'aktivitas' => $activityScore
            ];
        })->sortByDesc('composite')->values();

        $groupCount = $groups->count();
        DB::beginTransaction();
        try {
            DB::table('smart_grouping_plans')->where('project_class_id', $classId)->delete();

            foreach ($scoredStudents as $index => $data) {
                $targetGroup = $groups[$index % $groupCount];
                $reason = sprintf('AI RuKa: %s (Skor Gabungan: %.1f | Audit: %.1f | Peer: %.1f | Aktivitas: %.1f)', $data['tier'], $data['composite'], $data['audit'], $data['peer'], $data['aktivitas']);
                
                DB::table('smart_grouping_plans')->insert([
                    'project_class_id' => $classId,
                    'student_id'       => $data['id'],
                    'target_group_id'  => $targetGroup->id,
                    'reason'           => $reason,
                    'created_at'       => now(),
                    'updated_at'       => now(),
                ]);

                DB::table('group_members')->updateOrInsert(
                    ['student_id' => $data['id'], 'group_id' => $targetGroup->id],
                    ['nilai_audit' => 0, 'created_at' => now(), 'updated_at' => now()]
                );
            }
            DB::commit();
            return back()->with('success', 'AI berhasil menganalisis, membuat, dan mendistribusikan ' . $scoredStudents->count() . ' mahasiswa ke dalam tim!');
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
            ->select('groups.*', 'project_classes.bobot_dasar', 'project_classes.bobot_audit', 'project_classes.bobot_peer', 'project_classes.nama_kelas')
            ->first();
            
        if (!$kelompok) abort(404);

        // PERBAIKAN: Kembalikan data last_activity agar tombol Colek muncul!
        $anggota = DB::table('group_members')
            ->join('users', 'group_members.student_id', '=', 'users.id')
            ->where('group_members.group_id', $id)
            ->select('users.id', 'users.name', 'users.email', 'group_members.nilai_akhir', 'group_members.nilai_audit')
            ->get()
            ->map(function ($user) use ($id) {
                // 1. Rata-rata Peer yang diterima
                $peerScores = DB::table('peer_reviews')->where('group_id', $id)->where('reviewee_id', $user->id)->whereNotNull('score')->pluck('score');
                $user->avg_peer_score = $peerScores->count() > 0 ? round($peerScores->avg(), 1) : 0;
                
                // 2. Cek apakah mahasiswa ini SUDAH mengerjakan Peer Review-nya
                $isPeerReviewDone = DB::table('peer_reviews')
                    ->where('group_id', $id)
                    ->where('reviewer_id', $user->id)
                    ->whereNotNull('score')
                    ->exists();

                // 3. Ambil log terakhir di Kanban
                $lastLog = DB::table('activity_logs')
                    ->where('group_id', $id)
                    ->where('user_id', $user->id)
                    ->orderBy('created_at', 'desc')
                    ->first();

                // 4. Status keaktifan
                $user->last_activity = $lastLog ? \Carbon\Carbon::parse($lastLog->created_at)->diffForHumans() : 'Belum ada aktivitas';
                
                // LOGIKA PINTAR: Kalau Peer Review sudah diisi, matikan tombol Colek!
                if ($isPeerReviewDone) {
                    $user->is_inactive = false; // Anggap "Aman" karena proyek tamat
                } else {
                    $user->is_inactive = $lastLog ? \Carbon\Carbon::parse($lastLog->created_at)->diffInDays(now()) >= 3 : true;
                }

                return $user;
            });

        $tasks = DB::table('tasks')->leftJoin('users', 'tasks.pic_id', '=', 'users.id')->where('tasks.group_id', $id)->select('tasks.*', 'users.name as pic_name')->orderBy('status', 'desc')->get();
        $logs = DB::table('activity_logs')->join('users', 'activity_logs.user_id', '=', 'users.id')->where('activity_logs.group_id', $id)->select('activity_logs.*', 'users.name as user_name')->orderBy('created_at', 'desc')->get();

        return Inertia::render('Dosen/GroupDetail', ['kelompok' => $kelompok, 'anggota' => $anggota, 'tasks' => $tasks, 'logs' => $logs]);
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            // Hapus semua data yang berelasi dengan kelompok ini (Manual Cascade)
            DB::table('group_members')->where('group_id', $id)->delete();
            DB::table('smart_grouping_plans')->where('target_group_id', $id)->delete();
            DB::table('tasks')->where('group_id', $id)->delete();
            DB::table('activity_logs')->where('group_id', $id)->delete();
            DB::table('peer_reviews')->where('group_id', $id)->delete();
            DB::table('nudges')->where('group_id', $id)->delete();
            
            // Terakhir hapus kelompoknya
            DB::table('groups')->where('id', $id)->delete();
            
            DB::commit();
            return back()->with('success', 'Kelompok beserta seluruh datanya berhasil dihapus bersih!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal menghapus kelompok: ' . $e->getMessage());
        }
    }

    public function openPeerReview($groupId)
    {
        $members = DB::table('group_members')->where('group_id', $groupId)->pluck('student_id')->toArray();
        if (count($members) < 2) return back()->with('error', 'Anggota tim kurang dari 2 orang.');

        DB::beginTransaction();
        try {
            if (DB::table('peer_reviews')->where('group_id', $groupId)->exists()) return back()->with('info', 'Sesi Peer Review sudah pernah dibuka.');
            $peerReviewData = [];
            foreach ($members as $reviewerId) {
                foreach ($members as $revieweeId) {
                    if ($reviewerId !== $revieweeId) {
                        $peerReviewData[] = ['reviewer_id' => $reviewerId, 'reviewee_id' => $revieweeId, 'group_id' => $groupId, 'score' => null, 'created_at' => now(), 'updated_at' => now()];
                    }
                }
            }
            DB::table('peer_reviews')->insert($peerReviewData);
            DB::commit();
            return back()->with('success', 'Sesi Peer Review berhasil dibuka!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal: ' . $e->getMessage());
        }
    }
}