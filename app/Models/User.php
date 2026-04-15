<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'nim_nip',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * RELASI: Daftar kelas yang diikuti oleh Mahasiswa (Many to Many)
     * Digunakan untuk memfilter mahasiswa di dalam kelas tertentu (misal: untuk pembagian kelompok AI)
     */
    public function projectClasses(): BelongsToMany
    {
        return $this->belongsToMany(ProjectClass::class, 'class_students', 'student_id', 'project_class_id');
    }

    /**
     * RELASI: Tugas yang diambil oleh User ini (sebagai PIC)
     * Menghubungkan User ke tabel Tasks melalui kolom pic_id
     */
    public function myTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'pic_id');
    }

    /**
     * RELASI: Kelompok di mana User ini bergabung
     * Menghubungkan User ke Group secara langsung melalui tabel perantara GroupMember
     */
    public function group(): HasOneThrough
    {
        return $this->hasOneThrough(
            Group::class,
            GroupMember::class,
            'student_id', // Foreign key di tabel group_members
            'id',         // Foreign key di tabel groups
            'id',         // Local key di tabel users
            'group_id'    // Local key di tabel group_members
        );
    }
}