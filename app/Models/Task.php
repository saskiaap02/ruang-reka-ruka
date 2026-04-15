<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model
{
    // Tambahkan link_evidence dan completed_at di sini Hil!
    protected $fillable = [
        'group_id', 
        'pic_id', 
        'judul', 
        'status', 
        'link_evidence', 
        'completed_at'
    ];

    // Relasi ke kelompok asal tugas
    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    // Mahasiswa yang mengambil tugas ini (PIC)
    public function pic(): BelongsTo
    {
        return $this->belongsTo(User::class, 'pic_id');
    }

    // Riwayat aktivitas khusus tugas ini
    public function logs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }
}