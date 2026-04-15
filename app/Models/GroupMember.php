<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupMember extends Model
{
    use HasFactory;

    /**
     * Kolom yang boleh diisi secara massal.
     * Sesuai dengan Migration nomor 4 yang kamu buat tadi.
     */
    protected $fillable = [
        'group_id', 
        'student_id', 
        'nilai_akhir'
    ];

    /**
     * Relasi: Setiap anggota kelompok (GroupMember) 
     * pasti merujuk ke satu Kelompok (Group).
     */
    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    /**
     * Relasi: Setiap anggota kelompok (GroupMember) 
     * merujuk ke satu User (Mahasiswa).
     */
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}