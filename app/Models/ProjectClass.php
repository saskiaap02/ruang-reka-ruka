<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectClass extends Model
{
    protected $fillable = [
        'dosen_id', 'kode_mk', 'nama_mk', 
        'bobot_dasar', 'bobot_audit', 'bobot_peer'
    ];

    // Relasi ke Dosen (User)
    public function dosen(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dosen_id');
    }

    // Daftar kelompok di kelas ini
    public function groups(): HasMany
    {
        return $this->hasMany(Group::class);
    }

    // Daftar mahasiswa yang join kelas ini
    public function students(): HasMany
    {
        return $this->hasMany(ClassStudent::class);
    }
}