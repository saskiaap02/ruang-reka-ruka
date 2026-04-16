<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ProjectClass extends Model
{
    protected $fillable = [
        'dosen_id', 
        'mata_kuliah', 
        'nama_kelas',  
        'invite_code', 
        'bobot_dasar', 
        'bobot_audit', 
        'bobot_peer'
    ];

    /**
     * RELASI: Siapa dosen pemilik kelas ini
     */
    public function dosen(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dosen_id');
    }

    /**
     * RELASI: Daftar mahasiswa yang sudah join ke kelas ini (Many to Many)
     * Penting untuk fitur dropdown pilih anggota kelompok & AI Grouping
     */
    public function students(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'class_students', 'project_class_id', 'student_id');
    }

    /**
     * RELASI: Daftar kelompok yang ada di bawah kelas ini
     */
    public function groups(): HasMany 
    {
        return $this->hasMany(Group::class);
    }
}