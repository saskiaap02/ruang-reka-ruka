<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectClass extends Model
{
    protected $fillable = [
        'dosen_id', 
        'mata_kuliah', // Sesuai migration baru
        'nama_kelas',  // Sesuai migration baru
        'invite_code', // Sesuai migration baru
        'bobot_dasar', 
        'bobot_audit', 
        'bobot_peer'
    ];

    public function groups() {
        return $this->hasMany(Group::class);
    }
}