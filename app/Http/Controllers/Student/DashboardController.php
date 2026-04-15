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
    public function index()
    {
        $user = Auth::user();
        
        $joinedClass = ClassStudent::where('student_id', $user->id)
            ->with('projectClass')
            ->first();

        $myGroupInfo = GroupMember::where('student_id', $user->id)
            ->with(['group.tasks.pic', 'group.projectClass'])
            ->first();

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
            'myTasks' => $user->myTasks()->with('group')->get(),
            'logs'    => $logs,
        ]);
    }

    public function completeTask(Request $request, $taskId)
    {
        $request->validate(['link_evidence' => 'required|url']);

        $task = Task::findOrFail($taskId);
        $task->update([
            'status' => 'done',
            'link_evidence' => $request->link_evidence,
            'completed_at' => now(),
        ]);

        ActivityLog::create([
            'user_id' => Auth::id(),
            'group_id' => $task->group_id,
            'task_id' => $task->id,
            'action_type' => 'complete_task',
            'description' => 'Menyelesaikan tugas: ' . $task->judul . '. Bukti: ' . $request->link_evidence
        ]);

        return back()->with('success', 'Tugas selesai!');
    }

    public function joinClass(Request $request)
    {
        $request->validate(['invite_code' => 'required|string|size:6']);
        $class = ProjectClass::where('invite_code', $request->invite_code)->first();

        if (!$class) return back()->with('error', 'Kode tidak valid!');

        ClassStudent::firstOrCreate(['project_class_id' => $class->id, 'student_id' => Auth::id()]);
        $group = Group::where('project_class_id', $class->id)->first();
        
        if ($group) {
            GroupMember::firstOrCreate(['group_id' => $group->id, 'student_id' => Auth::id()]);
        }

        return redirect()->route('mahasiswa.dashboard');
    }

    public function claimTask($taskId)
    {
        $task = Task::findOrFail($taskId);
        $task->update(['pic_id' => Auth::id(), 'status' => 'in_progress']);

        ActivityLog::create([
            'user_id' => Auth::id(),
            'group_id' => $task->group_id,
            'task_id' => $task->id,
            'action_type' => 'claim_task',
            'description' => 'Mengambil tugas: ' . $task->judul
        ]);

        return back()->with('success', 'Tugas diambil!');
    }
}