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
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Tampilan Utama Dashboard Mahasiswa
     */
    public function index()
    {
        $user = Auth::user();

        // 🛡️ PAGAR KEAMANAN: Jika bukan mahasiswa, tendang balik
        if ($user->role !== 'mahasiswa') {
            return redirect()->route('dosen.dashboard');
        }
        
        // 1. Ambil data kelas yang diikuti
        $joinedClass = ClassStudent::where('student_id', $user->id)
            ->with('projectClass')
            ->first();

        // 2. Ambil data kelompok & tugas tim
        $myGroupInfo = GroupMember::where('student_id', $user->id)
            ->with(['group.tasks.pic', 'group.projectClass'])
            ->first();

        $logs = [];
        $tasks = [];

        if ($myGroupInfo) {
            // Ambil semua tugas dalam kelompok ini untuk Kanban
            $tasks = Task::where('group_id', $myGroupInfo->group_id)
                ->with('pic')
                ->orderBy('created_at', 'desc')
                ->get();

            // Ambil log aktivitas tim (untuk logbook otomatis)
            $logs = ActivityLog::where('group_id', $myGroupInfo->group_id)
                ->join('users', 'activity_logs.user_id', '=', 'users.id')
                ->select('activity_logs.*', 'users.name as user_name')
                ->orderBy('created_at', 'desc')
                ->get();
        }
        
        return Inertia::render('Student/Dashboard', [
            'myClass' => $joinedClass ? $joinedClass->projectClass : null,
            'myGroup' => $myGroupInfo ? $myGroupInfo->group : null,
            'tasks'   => $tasks,
            'logs'    => $logs,
        ]);
    }

    /**
     * Fitur Join Kelas via Kode Invite
     */
    public function joinClass(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'mahasiswa') {
            return back()->with('error', 'Dosen tidak boleh bergabung sebagai mahasiswa!');
        }

        $request->validate(['invite_code' => 'required|string|size:6']);
        
        $class = ProjectClass::where('invite_code', $request->invite_code)->first();

        if (!$class) {
            return back()->with('error', 'Kode tidak valid atau kelas tidak ditemukan!');
        }

        ClassStudent::firstOrCreate([
            'project_class_id' => $class->id, 
            'student_id' => $user->id
        ]);

        return redirect()->route('mahasiswa.dashboard')->with('success', 'Berhasil join kelas! Tunggu dosen memasukkanmu ke tim.');
    }

    /**
     * [CRUD] Tambah Tugas Baru (Reka Tugas)
     */
    public function storeTask(Request $request)
    {
        $request->validate([
            'group_id' => 'required',
            'title' => 'required|string|max:255',
            'status' => 'required|in:BACKLOG,IN_PROGRESS,DONE'
        ]);

        $task = Task::create([
            'group_id' => $request->group_id,
            'pic_id'   => Auth::id(), // Pembuat otomatis jadi penanggung jawab
            'judul'    => $request->title,
            'status'   => strtolower($request->status),
        ]);

        ActivityLog::create([
            'user_id'     => Auth::id(),
            'group_id'    => $request->group_id,
            'task_id'     => $task->id,
            'action_type' => 'create_task',
            'description' => 'Merekam tugas baru: ' . $request->title
        ]);

        return back()->with('success', 'Tugas berhasil ditambahkan!');
    }

    /**
     * [CRUD] Update Status / Pindah Kolom Kanban
     */
    public function updateTaskStatus(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $oldStatus = $task->status;
        $newStatus = strtolower($request->status);

        $task->update(['status' => $newStatus]);

        ActivityLog::create([
            'user_id'     => Auth::id(),
            'group_id'    => $task->group_id,
            'task_id'     => $task->id,
            'action_type' => 'move_task',
            'description' => "Memindahkan '{$task->judul}' dari {$oldStatus} ke {$newStatus}"
        ]);

        return back()->with('success', 'Status tugas diperbarui!');
    }

    /**
     * [CRUD] Hapus Tugas
     */
    public function deleteTask($id)
    {
        $task = Task::findOrFail($id);
        
        ActivityLog::create([
            'user_id'     => Auth::id(),
            'group_id'    => $task->group_id,
            'action_type' => 'delete_task',
            'description' => "Menghapus tugas: " . $task->judul
        ]);

        $task->delete();

        return back()->with('success', 'Tugas berhasil dihapus.');
    }

    /**
     * Fitur Ambil Tugas (Claim Task)
     */
    public function claimTask($taskId)
    {
        $task = Task::findOrFail($taskId);
        
        $task->update([
            'pic_id' => Auth::id(), 
            'status' => 'in_progress'
        ]);

        ActivityLog::create([
            'user_id'     => Auth::id(),
            'group_id'    => $task->group_id,
            'task_id'     => $task->id,
            'action_type' => 'claim_task',
            'description' => 'Mengambil alih tanggung jawab tugas: ' . $task->judul
        ]);

        return back()->with('success', 'Tugas berhasil kamu ambil!');
    }

    /**
     * Fitur Selesaikan Tugas (Evidence Submission)
     */
    public function completeTask(Request $request, $taskId)
    {
        $request->validate([
            'link_evidence' => 'required|url'
        ]);

        $task = Task::findOrFail($taskId);
        
        $task->update([
            'status'        => 'done',
            'link_evidence' => $request->link_evidence,
            'completed_at'  => now(),
        ]);

        ActivityLog::create([
            'user_id'     => Auth::id(),
            'group_id'    => $task->group_id,
            'task_id'     => $task->id,
            'action_type' => 'complete_task',
            'description' => 'Menyelesaikan tugas: ' . $task->judul . '. Bukti: ' . $request->link_evidence
        ]);

        return back()->with('success', 'Tugas selesai! Jejak digitalmu sudah terekam AI.');
    }
}