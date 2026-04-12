<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassStudent extends Model
{
    use HasFactory;

    // Nama tabel di database (sesuaikan dengan migration kamu)
    protected $table = 'class_students';

    protected $fillable = [
        'project_class_id',
        'student_id'
    ];

    /**
     * Relasi ke tabel ProjectClass
     */
    public function projectClass()
    {
        return $this->belongsTo(ProjectClass::class);
    }

    /**
     * Relasi ke tabel User (Mahasiswa)
     */
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}