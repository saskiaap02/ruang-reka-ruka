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
     * Tampilan Utama: KATALOG KELAS
     */
    public function index()
    {
        $user = Auth::user();

        if ($user->role !== 'mahasiswa') {
            return redirect()->route('dosen.dashboard');
        }
        
        // Ambil SEMUA kelas yang diikuti mahasiswa
        $joinedClasses = ClassStudent::where('student_id', $user->id)
            ->with(['projectClass'])
            ->get();

        // REVISI: Ambil SEMUA notifikasi colekan (Nudges) tanpa difilter is_read
        // Tujuannya agar riwayat lama tetap bisa tampil di menu Lonceng
        $nudges = DB::table('nudges')
            ->where('student_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('Student/Dashboard', [
            'joinedClasses' => $joinedClasses,
            'nudges'  => $nudges,
            'myClass' => null, // Penanda sedang di halaman Katalog
            'myGroup' => null,
            'tasks'   => [],
            'logs'    => []
        ]);
    }

    /**
     * Tampilan Detail: KANBAN & LOGBOOK PER KELAS
     */
    public function showKelas($id)
    {
        $user = Auth::user();

        // 1. Ambil data kelas spesifik
        $myClass = ProjectClass::findOrFail($id);

        // 2. Ambil data kelompok mahasiswa di kelas ini saja
        $myGroupInfo = GroupMember::where('student_id', $user->id)
            ->whereHas('group', function($q) use ($id) {
                $q->where('project_class_id', $id);
            })
            ->with(['group.tasks.pic'])
            ->first();

        $logs = [];
        $tasks = [];

        if ($myGroupInfo) {
            $tasks = Task::where('group_id', $myGroupInfo->group_id)
                ->with('pic')
                ->orderBy('created_at', 'desc')
                ->get();

            $logs = ActivityLog::where('group_id', $myGroupInfo->group_id)
                ->join('users', 'activity_logs.user_id', '=', 'users.id')
                ->select('activity_logs.*', 'users.name as user_name')
                ->orderBy('created_at', 'desc')
                ->get();
        }

        // REVISI: Tambahkan pemanggilan Nudges di sini juga
        // Agar notifikasi dan lonceng tetap berfungsi saat mahasiswa di dalam kelas
        $nudges = DB::table('nudges')
            ->where('student_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Student/Dashboard', [
            'myClass' => $myClass,
            'myGroup' => $myGroupInfo ? $myGroupInfo->group : null,
            'tasks'   => $tasks,
            'logs'    => $logs,
            'joinedClasses' => null, // Penanda sedang di halaman Detail
            'nudges'  => $nudges,
        ]);
    }

    /**
     * Fitur Join Kelas via Kode Invite
     */
    public function joinClass(Request $request)
    {
        $user = Auth::user();
        
        $request->validate([
            'invite_code' => 'required|string|size:6'
        ]);
        
        $class = ProjectClass::where('invite_code', strtoupper($request->invite_code))->first();

        if (!$class) {
            return back()->with('error', 'Kode kelas tidak ditemukan!');
        }

        ClassStudent::firstOrCreate([
            'project_class_id' => $class->id, 
            'student_id' => $user->id
        ]);

        return redirect()->route('mahasiswa.dashboard')->with('success', 'Berhasil bergabung!');
    }

    /**
     * [CRUD] Tambah Tugas Baru (Reka Tugas) dengan File Upload
     */
    public function storeTask(Request $request)
    {
        // 1. Validasi Input: Judul wajib, status wajib, file opsional
        $request->validate([
            'group_id' => 'required',
            'title' => 'required|string|max:255',
            'status' => 'required',
            'attachment' => 'nullable|file|mimes:pdf,doc,docx,png,jpg,zip|max:5120', // Maks 5MB
        ]);

        // 2. Logika Simpan File
        $filePath = null;
        if ($request->hasFile('attachment')) {
            // File akan masuk ke storage/app/public/tasks
            $filePath = $request->file('attachment')->store('tasks', 'public');
        }

        // 3. Simpan ke Database
        $task = Task::create([
            'group_id' => $request->group_id,
            'pic_id'   => Auth::id(),
            'judul'    => $request->title,
            'status'   => strtolower($request->status),
            'file_path' => $filePath, // Simpan path file-nya
        ]);

        return back()->with('success', 'Tugas berhasil ditambahkan!');
    }

    public function updateTaskStatus(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $oldStatus = $task->status; 
        $newStatus = strtolower($request->status);

        // 1. Handle File (Bukti Kerja)
        // Kalau ada file baru, simpan. Kalau nggak ada, pakai file yang lama.
        $filePath = $task->file_path;
        if ($request->hasFile('attachment')) {
            $filePath = $request->file('attachment')->store('tasks', 'public');
        }

        // 2. Update Data Tugas
        $task->update([
            'status'    => $newStatus,
            // Kita pakai 'judul' karena di React kamu pakai setData('title', ...) untuk catatan
            'judul'     => $request->title ?? $task->judul, 
            'file_path' => $filePath,
        ]);

        // 3. Trigger Logbook (Hanya jika status berubah jadi DONE)
        // Tambahan safety: && $oldStatus !== 'done' biar kalau di-submit ulang nggak nyampah di log
        if ($newStatus === 'done' && $oldStatus !== 'done') {
            \App\Models\ActivityLog::create([
                'user_id'     => Auth::id(),
                'group_id'    => $task->group_id,
                'task_id'     => $task->id,
                'action_type' => 'task_completed',
                'description' => "Menyelesaikan tugas: {$task->judul}"
            ]);
        }

        return back();
    }

    public function deleteTask($id)
    {
        Task::findOrFail($id)->delete();
        return back();
    }

    public function completeTask(Request $request, $taskId)
    {
        $request->validate(['link_evidence' => 'required|url']);
        Task::findOrFail($taskId)->update([
            'status' => 'done',
            'link_evidence' => $request->link_evidence,
            'completed_at' => now(),
        ]);
        return back();
    }

    public function markNudgeRead($id)
    {
        DB::table('nudges')->where('id', $id)->update(['is_read' => true]);
        return back();
    }
}