<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\GroupMember;
use App\Models\ProjectClass;
use App\Models\ClassStudent;
use App\Models\ActivityLog;
use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * KATALOG KELAS — Tampilan awal mahasiswa
     */
    public function index()
    {
        $user = Auth::user();

        if ($user->role !== 'mahasiswa') {
            return redirect()->route('dosen.dashboard');
        }

        $joinedClasses = ClassStudent::where('student_id', $user->id)
            ->with(['projectClass'])
            ->get();

        $nudges = DB::table('nudges')
            ->where('student_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Student/Dashboard', [
            'joinedClasses' => $joinedClasses,
            'nudges'        => $nudges,
            'myClass'       => null,
            'myGroup'       => null,
            'tasks'         => [],
            'logs'          => [],
            'peerReviews'   => [],
        ]);
    }

    /**
     * DETAIL KELAS — Kanban + Logbook + Peer Review per kelas
     */
    public function showKelas($id)
    {
        $user    = Auth::user();
        $myClass = ProjectClass::findOrFail($id);

        // 1. Cek apakah mahasiswa ini approved di kelas ini
        $enrollment = DB::table('class_students')
            ->where('student_id', $user->id)
            ->where('project_class_id', $id)
            ->first();

        // 2. Ambil Kelompok Mahasiswa secara manual (menghindari error relasi model)
        // Kita cari tahu dulu apakah user punya group_id di kelas ini
        $myGroupId = DB::table('group_members')
            ->join('groups', 'group_members.group_id', '=', 'groups.id')
            ->where('groups.project_class_id', $id)
            ->where('group_members.student_id', $user->id)
            ->value('groups.id');

        $myGroup = null;
        $tasks   = [];
        $logs    = [];
        $peerReviews = [];
        $myAvgScore = null;
        $myReviewedCount = 0;
        $myTotalReviewers = 0;

        if ($myGroupId) {
            // Ambil data group utuh
            $myGroup = Group::find($myGroupId);
            
            // Ambil anggota kelompok secara eksplisit
            $membersData = DB::table('group_members')
                ->join('users', 'group_members.student_id', '=', 'users.id')
                ->where('group_members.group_id', $myGroupId)
                ->select('users.id', 'users.name')
                ->get();
                
            // Tempelkan members ke object myGroup agar formatnya sesuai dengan ekspektasi Frontend
            if($myGroup) {
                $myGroup->members = $membersData;
            }

            // Ambil Tasks
            $tasks = Task::where('group_id', $myGroupId)
                ->leftJoin('users', 'tasks.pic_id', '=', 'users.id') // leftJoin jaga-jaga kalau pic_id null
                ->select('tasks.*', 'users.name as pic_name')
                ->orderBy('tasks.created_at', 'desc')
                ->get();

            // Ambil Logs
            $logs = ActivityLog::where('group_id', $myGroupId)
                ->join('users', 'activity_logs.user_id', '=', 'users.id')
                ->select('activity_logs.*', 'users.name as user_name')
                ->orderBy('activity_logs.created_at', 'desc')
                ->get();

            // ── PEER REVIEWS ──────────────────────────────────────────────────────
            // Ambil semua peer review yang melibatkan user ini (sebagai reviewer)
            // KODE BENAR: Kita hanya mengambil row dimana reviewer_id adalah user yang login
            $peerReviews = DB::table('peer_reviews')
                ->join('users as reviewee', 'peer_reviews.reviewee_id', '=', 'reviewee.id')
                ->join('users as reviewer', 'peer_reviews.reviewer_id', '=', 'reviewer.id')
                ->where('peer_reviews.group_id', $myGroupId)
                ->where('peer_reviews.reviewer_id', $user->id) // HANYA YANG HARUS DINILAI OLEH USER INI
                ->select(
                    'peer_reviews.id',
                    'peer_reviews.reviewer_id',
                    'peer_reviews.reviewee_id',
                    'peer_reviews.score',
                    'peer_reviews.feedback_text as feedback',
                    'reviewee.name as reviewee_name',
                    'reviewer.name as reviewer_name'
                )
                ->get();

            // Tambahkan info nilai rata-rata yang diterima user ini
            $myReceivedScores = DB::table('peer_reviews')
                ->where('group_id', $myGroupId)
                ->where('reviewee_id', $user->id)
                ->whereNotNull('score')
                ->pluck('score');

            $myAvgScore = $myReceivedScores->count() > 0 ? round($myReceivedScores->avg()) : null;
            
            $myReviewedCount = DB::table('peer_reviews')
                ->where('group_id', $myGroupId)
                ->where('reviewee_id', $user->id)
                ->whereNotNull('score')
                ->count();

            $myTotalReviewers = DB::table('peer_reviews')
                ->where('group_id', $myGroupId)
                ->where('reviewee_id', $user->id)
                ->count();
        }

        $nudges = DB::table('nudges')
            ->where('student_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $joinedClasses = ClassStudent::where('student_id', $user->id)
            ->with(['projectClass'])
            ->get();

        return Inertia::render('Student/Dashboard', [
            'myClass'               => $myClass,
            'myGroup'               => $myGroup,
            'tasks'                 => $tasks,
            'logs'                  => $logs,
            'joinedClasses'         => $joinedClasses,
            'nudges'                => $nudges,
            'peerReviews'           => $peerReviews, // Data dikirim ke frontend
            'myPeerScore'           => $myAvgScore,
            'myPeerReviewedCount'   => $myReviewedCount,
            'myPeerTotalReviewers'  => $myTotalReviewers,
        ]);
    }

    /**
     * GABUNG KELAS via kode invite
     */
    public function joinClass(Request $request)
    {
        $request->validate([
            'invite_code' => 'required|string|size:6',
        ]);

        $class = DB::table('project_classes')
            ->where('invite_code', strtoupper($request->invite_code))
            ->first();

        if (!$class) {
            return back()->withErrors(['invite_code' => 'Kode kelas tidak ditemukan.']);
        }

        // Cek sudah terdaftar
        $existing = DB::table('class_students')
            ->where('student_id', Auth::id())
            ->where('project_class_id', $class->id)
            ->first();

        if ($existing) {
            return back()->withErrors(['invite_code' => 'Kamu sudah terdaftar di kelas ini.']);
        }

        DB::table('class_students')->insert([
            'project_class_id' => $class->id,
            'student_id'       => Auth::id(),
            'status'           => 'pending',
            'created_at'       => now(),
            'updated_at'       => now(),
        ]);

        return back()->with('message', 'Permintaan gabung dikirim! Tunggu approval dosen.');
    }

    /**
     * TAMBAH TUGAS BARU (Kanban)
     */
    public function storeTask(Request $request)
    {
        $request->validate([
            'group_id'   => 'required|exists:groups,id',
            'title'      => 'required|string|max:255',
            'status'     => 'required|in:backlog,in_progress,done',
            'link'       => 'nullable|url|max:500',
            'attachment' => 'nullable|file|mimes:pdf,jpg,jpeg,png,zip,rar,doc,docx,xlsx,xls|max:5120',
        ]);

        // Keamanan: pastikan mahasiswa ada di kelompok ini
        $isMember = GroupMember::where('student_id', Auth::id())
            ->where('group_id', $request->group_id)
            ->exists();

        if (!$isMember) {
            return back()->with('error', 'Akses ditolak!');
        }

        $filePath = null;
        if ($request->hasFile('attachment')) {
            $file     = $request->file('attachment');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('tasks', $fileName, 'public');
        }

        $task = Task::create([
            'group_id'  => $request->group_id,
            'pic_id'    => Auth::id(),
            'judul'     => $request->title,
            'status'    => $request->status,
            'link'      => $request->link,
            'file_path' => $filePath,
        ]);

        ActivityLog::create([
            'user_id'     => Auth::id(),
            'group_id'    => $request->group_id,
            'task_id'     => $task->id,
            'action_type' => 'create_task',
            'description' => 'Merekam tugas baru: ' . $request->title,
        ]);

        return back()->with('success', 'Tugas berhasil ditambahkan!');
    }

    /**
     * UPDATE STATUS TUGAS (drag kanban / progress update)
     */
    public function updateTaskStatus(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $isMember = GroupMember::where('student_id', Auth::id())
            ->where('group_id', $task->group_id)
            ->exists();

        if (!$isMember) {
            return back()->with('error', 'Akses ditolak!');
        }

        $oldStatus = $task->status;
        $newStatus = $request->status;

        $filePath = $task->file_path;
        if ($request->hasFile('attachment')) {
            $file     = $request->file('attachment');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('tasks', $fileName, 'public');
        }

        $task->update([
            'status'    => $newStatus,
            'judul'     => $request->title ?? $task->judul,
            'file_path' => $filePath,
        ]);

        // Catat log HANYA jika berpindah status
        if ($newStatus !== $oldStatus) {
            $desc = match ($newStatus) {
                'in_progress' => "Memulai pengerjaan: {$task->judul}",
                'done'        => "Menyelesaikan tugas: {$task->judul}" . ($request->title ? " — {$request->title}" : ''),
                default       => "Mengubah status tugas: {$task->judul}",
            };

            ActivityLog::create([
                'user_id'     => Auth::id(),
                'group_id'    => $task->group_id,
                'task_id'     => $task->id,
                'action_type' => $newStatus === 'done' ? 'task_completed' : 'task_progress',
                'description' => $desc,
            ]);
        }

        return back();
    }

    /**
     * HAPUS TUGAS
     */
    public function deleteTask($id)
    {
        $task = Task::findOrFail($id);

        $isMember = GroupMember::where('student_id', Auth::id())
            ->where('group_id', $task->group_id)
            ->exists();

        if (!$isMember) {
            return back()->with('error', 'Akses ditolak!');
        }

        $task->delete();
        return back()->with('success', 'Tugas berhasil dihapus.');
    }

    /**
     * TANDAI NUDGE SUDAH DIBACA
     */
    public function markNudgeRead($id)
    {
        DB::table('nudges')
            ->where('id', $id)
            ->where('student_id', Auth::id()) // keamanan
            ->update(['is_read' => true]);

        return back();
    }

    /**
     * SIMPAN SKOR PEER REVIEW
     */
    public function ratePeer(Request $request, $id)
    {
        $request->validate([
            'score'    => 'required|integer|min:1|max:100',
            'feedback' => 'nullable|string|max:500',
        ]);

        $review = DB::table('peer_reviews')->where('id', $id)->first();

        if (!$review) {
            return back()->with('error', 'Data penilaian tidak ditemukan.');
        }

        // Keamanan: hanya reviewer yang sah
        if ($review->reviewer_id !== Auth::id()) {
            return back()->with('error', 'Akses ditolak!');
        }

        // Jangan izinkan mengubah nilai yang sudah diisi
        if ($review->score !== null) {
            return back()->with('error', 'Penilaian sudah disubmit dan tidak bisa diubah.');
        }

        DB::table('peer_reviews')
            ->where('id', $id)
            ->update([
                'score'         => $request->score,
                'feedback_text' => $request->feedback,
                'updated_at'    => now(),
            ]);

        // Catat ke activity log
        ActivityLog::create([
            'user_id'     => Auth::id(),
            'group_id'    => $review->group_id,
            'task_id'     => null,
            'action_type' => 'peer_review',
            'description' => 'Menyelesaikan peer review untuk rekan setim.',
        ]);

        return back()->with('success', 'Penilaian berhasil disimpan!');
    }
}