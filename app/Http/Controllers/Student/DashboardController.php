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

class DashboardController extends Controller
{
    /**
     * Tampilan Utama Dashboard Mahasiswa
     * Mencakup: Info Kelas, Info Kelompok, Log aktivitas kelompok, dan Daftar Tugas pribadi.
     */
    public function index()
    {
        $user = Auth::user();

        // 🛡️ PAGAR KEAMANAN: Jika bukan mahasiswa, tendang balik ke dashboard dosen
        if ($user->role !== 'mahasiswa') {
            return redirect()->route('dosen.dashboard');
        }
        
        // 1. Ambil data kelas yang diikuti (Mengecek apakah sudah join kelas atau belum)
        $joinedClass = ClassStudent::where('student_id', $user->id)
            ->with('projectClass')
            ->first();

        // 2. Ambil data kelompok (Hanya muncul jika DOSEN sudah mengizinkan/memasukkan ke tim)
        $myGroupInfo = GroupMember::where('student_id', $user->id)
            ->with(['group.tasks.pic', 'group.projectClass'])
            ->first();

        // 3. LOGBOOK: Ambil semua riwayat kerja kelompok (Aktivitas Teman Sekelompok)
        $logs = [];
        if ($myGroupInfo) {
            $logs = ActivityLog::where('group_id', $myGroupInfo->group_id)
                ->join('users', 'activity_logs.user_id', '=', 'users.id')
                ->select('activity_logs.*', 'users.name as user_name')
                ->orderBy('created_at', 'desc')
                ->get();
        }
        
        return Inertia::render('Student/Dashboard', [
            'myClass' => $joinedClass ? $joinedClass->projectClass : null,
            'myGroup' => $myGroupInfo ? $myGroupInfo->group : null,
            'myTasks' => Task::where('pic_id', $user->id)->with('group')->get(),
            'logs'    => $logs,
        ]);
    }

    /**
     * Fitur Input Kode Kelas (Join Kelas)
     * Mahasiswa masuk ke Waiting List (class_students), tapi BELUM masuk ke kelompok (group_members).
     */
    public function joinClass(Request $request)
    {
        $user = Auth::user();
        
        // 🛡️ PROTEKSI: Dosen dilarang menggunakan fitur ini
        if ($user->role !== 'mahasiswa') {
            return back()->with('error', 'Dosen tidak boleh bergabung sebagai mahasiswa!');
        }

        $request->validate(['invite_code' => 'required|string|size:6']);
        
        // Cari kelas berdasarkan kode unik dari dosen
        $class = ProjectClass::where('invite_code', $request->invite_code)->first();

        if (!$class) {
            return back()->with('error', 'Kode tidak valid atau kelas tidak ditemukan!');
        }

        // Simpan ke tabel class_students (Mahasiswa resmi terdaftar di kelas tapi statusnya WAITING LIST kelompok)
        ClassStudent::firstOrCreate([
            'project_class_id' => $class->id, 
            'student_id' => $user->id
        ]);
        
        // ⚠️ PENTING: Logika auto-join grup dihapus. 
        // IZIN: Mahasiswa hanya akan muncul di list dosen, dosen yang klik "Gabungkan".

        return redirect()->route('mahasiswa.dashboard')->with('success', 'Berhasil join kelas! Tunggu dosen memasukkanmu ke dalam kelompok.');
    }

    /**
     * Fitur Ambil Tugas (Claim Task)
     * Mahasiswa memilih tugas dari daftar "Backlog" untuk dikerjakan.
     */
    public function claimTask($taskId)
    {
        $task = Task::findOrFail($taskId);
        
        // Update PIC (Penanggung Jawab) dan status tugas
        $task->update([
            'pic_id' => Auth::id(), 
            'status' => 'in_progress'
        ]);

        // Catat di Logbook (Agar Dosen tahu kamu sudah mulai kerja)
        ActivityLog::create([
            'user_id' => Auth::id(),
            'group_id' => $task->group_id,
            'task_id' => $task->id,
            'action_type' => 'claim_task',
            'description' => 'Mengambil tugas: ' . $task->judul
        ]);

        return back()->with('success', 'Tugas berhasil kamu ambil! Semangat mengerjakannya.');
    }

    /**
     * Fitur Selesaikan Tugas (Logbook / Input Bukti Kerja)
     */
    public function completeTask(Request $request, $taskId)
    {
        // Validasi input link (Bukti pengerjaan tugas)
        $request->validate([
            'link_evidence' => 'required|url'
        ]);

        $task = Task::findOrFail($taskId);
        
        // Update status menjadi selesai dan masukkan link bukti
        $task->update([
            'status' => 'done',
            'link_evidence' => $request->link_evidence,
            'completed_at' => now(),
        ]);

        // Catat di Logbook (Ini yang nanti diaudit oleh Dosen)
        ActivityLog::create([
            'user_id' => Auth::id(),
            'group_id' => $task->group_id,
            'task_id' => $task->id,
            'action_type' => 'complete_task',
            'description' => 'Menyelesaikan tugas: ' . $task->judul . '. Bukti bisa dicek di: ' . $request->link_evidence
        ]);

        return back()->with('success', 'Kerjaan bagus! Tugas berhasil diselesaikan.');
    }
}