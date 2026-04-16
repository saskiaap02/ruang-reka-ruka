<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Group extends Model
{
    protected $fillable = ['project_class_id', 'nama_kelompok', 'project_title'];

    public function projectClass(): BelongsTo
    {
        return $this->belongsTo(ProjectClass::class);
    }

    // RELASI: Untuk melihat siapa saja anggota di kelompok ini
    public function members(): HasMany
    {
        return $this->hasMany(GroupMember::class);
    }

    // RELASI: Untuk langsung mengambil data User (Mahasiswa) dalam kelompok
    public function students(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'group_members', 'group_id', 'student_id');
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function logs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }
}