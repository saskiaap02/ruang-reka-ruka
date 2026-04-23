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
        // 1. Cari kelas berdasarkan kode yang diinput Hilma/Mahasiswa
        $class = DB::table('project_classes')->where('invite_code', $request->invite_code)->first();

        if (!$class) {
            return back()->with('error', 'Waduh, kode kelasnya salah tuh!');
        }

        // 2. Daftarkan mahasiswa ke kelas dengan status 'pending'
        // Menggunakan updateOrInsert biar kalau dia klik dua kali nggak error
        DB::table('class_students')->updateOrInsert(
            [
                'student_id' => Auth::id(),
                'project_class_id' => $class->id
            ],
            [
                'status' => 'pending', // <--- Menahan mahasiswa di ruang tunggu
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        return back()->with('message', 'Permintaan gabung sudah dikirim! Tunggu dosen approve ya.');
    }

    /**
     * [CRUD] Tambah Tugas Baru (Reka Tugas) + Upload Lampiran
     */
    public function storeTask(Request $request)
    {
        $request->validate([
            'group_id' => 'required',
            'title' => 'required|string|max:255',
            'status' => 'required|in:backlog,in_progress,done',
            'link' => 'nullable|url',
            'attachment' => 'nullable|file|mimes:pdf,jpg,jpeg,png,zip,rar,doc,docx,xlsx,xls|max:5120', // Maks 5MB
        ]);

        // Proses Upload File jika ada
        $filePath = null;
        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $fileName = time() . '_' . $file->getClientOriginalName();
            // Simpan ke folder storage/app/public/tasks
            $filePath = $file->storeAs('tasks', $fileName, 'public'); 
        }

        $task = Task::create([
            'group_id'  => $request->group_id,
            'pic_id'    => Auth::id(),
            'judul'     => $request->title,
            'status'    => strtolower($request->status),
            'link'      => $request->link, // Simpan link (jika ada)
            'file_path' => $filePath,      // Simpan path file (jika ada)
        ]);

        ActivityLog::create([
            'user_id'     => Auth::id(),
            'group_id'    => $request->group_id,
            'task_id'     => $task->id,
            'action_type' => 'create_task',
            'description' => 'Merekam tugas baru: ' . $request->title
        ]);

        return back()->with('success', 'Tugas dan lampiran berhasil ditambahkan!');
    }

    /**
     * Update Status Tugas (Drag and Drop / Tarik Kartu)
     */
    public function updateTaskStatus(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        // [KEAMANAN] Pastikan mahasiswa berada di kelompok yang sama dengan tugas ini
        $isMyGroup = GroupMember::where('student_id', Auth::id())
                        ->where('group_id', $task->group_id)
                        ->exists();

        if (!$isMyGroup) {
            return back()->with('error', 'Akses ditolak! Kamu tidak bisa mengubah tugas kelompok lain.');
        }

        $oldStatus = $task->status; 
        $newStatus = strtolower($request->status);

        // 1. Handle File (Bukti Kerja) - Dibuat konsisten dengan metode storeTask
        $filePath = $task->file_path;
        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('tasks', $fileName, 'public'); 
        }

        // 2. Update Data Tugas
        $task->update([
            'status'    => $newStatus,
            'judul'     => $request->title ?? $task->judul, 
            'file_path' => $filePath,
        ]);

        // 3. Trigger Logbook (Hanya jika status berubah jadi DONE)
        if ($newStatus === 'done' && $oldStatus !== 'done') {
            ActivityLog::create([ 
                'user_id'     => Auth::id(),
                'group_id'    => $task->group_id,
                'task_id'     => $task->id,
                'action_type' => 'task_completed',
                'description' => "Menyelesaikan tugas: {$task->judul}"
            ]);
        }

        return back();
    }

    /**
     * Hapus Tugas
     */
    public function deleteTask($id)
    {
        $task = Task::findOrFail($id);

        // [KEAMANAN] Cek kepemilikan kelompok sebelum menghapus
        $isMyGroup = GroupMember::where('student_id', Auth::id())
                        ->where('group_id', $task->group_id)
                        ->exists();

        if (!$isMyGroup) {
            return back()->with('error', 'Akses ditolak! Kamu tidak bisa menghapus tugas kelompok lain.');
        }

        $task->delete();
        return back()->with('success', 'Tugas berhasil dihapus.');
    }

    /**
     * Fitur Selesaikan Tugas (Submit Progress) + Upload Lampiran
     */
    public function completeTask(Request $request, $taskId)
    {
        $request->validate([
            'title' => 'nullable|string', 
            'attachment' => 'nullable|file|mimes:pdf,jpg,jpeg,png,zip,rar,doc,docx,xlsx,xls|max:5120',
        ]);

        $task = Task::findOrFail($taskId);
        
        // [KEAMANAN] Cek kepemilikan kelompok
        $isMyGroup = GroupMember::where('student_id', Auth::id())
                        ->where('group_id', $task->group_id)
                        ->exists();

        if (!$isMyGroup) {
            return back()->with('error', 'Akses ditolak!');
        }
        
        // Proses Upload File baru (jika ada)
        $filePath = $task->file_path; 
        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('tasks', $fileName, 'public'); 
        }

        $task->update([
            'status'        => 'done',
            'file_path'     => $filePath,
            'completed_at'  => now(),
        ]);

        $detailProgress = $request->title ? ' Detail: ' . $request->title : '';

        ActivityLog::create([
            'user_id'     => Auth::id(),
            'group_id'    => $task->group_id,
            'task_id'     => $task->id,
            'action_type' => 'complete_task',
            'description' => 'Menyelesaikan tugas: ' . $task->judul . '.' . $detailProgress
        ]);

        return back()->with('success', 'Tugas selesai! Lampiran bukti telah tersimpan.');
    }

    /**
     * Tandai Colekan (Nudge) Telah Dibaca
     */
    public function markNudgeRead($id)
    {
        DB::table('nudges')->where('id', $id)->update(['is_read' => true]);
        return back();
    }

    /**
     * Menyimpan skor Peer Review dari Mahasiswa
     */
    public function ratePeer(Request $request, $id)
    {
        // 1. Validasi input: Skor wajib diisi, angka, dan antara 20 sampai 100
        $request->validate([
            'score' => 'required|integer|min:20|max:100',
        ]);

        // 2. Cari data peer review berdasarkan ID yang dikirim
        $review = DB::table('peer_reviews')->where('id', $id)->first();

        // Cek apakah data ada
        if (!$review) {
            return back()->with('error', 'Data penilaian tidak ditemukan.');
        }

        // 3. KEAMANAN: Pastikan mahasiswa yang login ADALAH reviewer_id yang sah
        if ($review->reviewer_id !== Auth::id()) {
            return back()->with('error', 'Akses ditolak! Kamu tidak berhak memanipulasi penilaian ini.');
        }

        // 4. Update skor ke dalam database
        DB::table('peer_reviews')
            ->where('id', $id)
            ->update([
                'score'      => $request->score,
                'updated_at' => now(),
            ]);

        // Opsional: Catat ke Activity Log bahwa mahasiswa ini sudah menilai temannya
        // Ini bikin Heatmap dosen jadi lebih akurat
        DB::table('activity_logs')->insert([
            'user_id'     => Auth::id(),
            'group_id'    => $review->group_id,
            'task_id'     => null,
            'action_type' => 'peer_review',
            'description' => 'Melakukan pengisian Peer Review untuk rekan setim.',
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);

        return back()->with('success', 'Penilaian berhasil disimpan. Terima kasih atas kejujuranmu!');
    }
}