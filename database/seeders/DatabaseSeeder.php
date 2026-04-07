<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat Akun Dosen
        $dosen = User::create([
            'nim_nip' => '198001012005011001',
            'name' => 'Bapak Dosen Pengampu',
            'email' => 'dosen@test.com',
            'role' => 'dosen',
            'password' => Hash::make('password123'),
        ]);

        // 2. Buat Akun Mahasiswa
        $mahasiswa1 = User::create([
            'nim_nip' => '2201010045',
            'name' => 'Saskia',
            'email' => 'saskia@test.com',
            'role' => 'mahasiswa',
            'password' => Hash::make('password123'),
        ]);

        $mahasiswa2 = User::create([
            'nim_nip' => '2201010046',
            'name' => 'Ahmad Zaki',
            'email' => 'zaki@test.com',
            'role' => 'mahasiswa',
            'password' => Hash::make('password123'),
        ]);

        // 3. Buat Ruang Kelas & Mahasiswa Join
        $kelasId = DB::table('project_classes')->insertGetId([
            'dosen_id' => $dosen->id,
            'kode_mk' => 'WEB2-2026',
            'nama_mk' => 'Pemrograman Web II',
            'bobot_dasar' => 50,
            'bobot_audit' => 30,
            'bobot_peer' => 20,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('class_students')->insert([
            ['project_class_id' => $kelasId, 'student_id' => $mahasiswa1->id, 'created_at' => now(), 'updated_at' => now()],
            ['project_class_id' => $kelasId, 'student_id' => $mahasiswa2->id, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // 4. Buat Kelompok & Anggota Kelompok
        $kelompok1Id = DB::table('groups')->insertGetId([
            'project_class_id' => $kelasId,
            'nama_kelompok' => 'Kelompok 1 (Final Project)',
            'project_title' => 'Sistem Resolusi Konflik',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $kelompok2Id = DB::table('groups')->insertGetId([
            'project_class_id' => $kelasId,
            'nama_kelompok' => 'Kelompok 2 (E-Commerce)',
            'project_title' => 'Toko Material Online',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('group_members')->insert([
            ['group_id' => $kelompok1Id, 'student_id' => $mahasiswa1->id, 'created_at' => now(), 'updated_at' => now()],
            ['group_id' => $kelompok1Id, 'student_id' => $mahasiswa2->id, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // 5. Buat Tugas & Log Aktivitas (Saskia Ngerjain UI/UX)
        $task1Id = DB::table('tasks')->insertGetId([
            'group_id' => $kelompok1Id,
            'pic_id' => $mahasiswa1->id, 
            'judul' => 'Penerapan Desain Pro / UI UX',
            'status' => 'in_progress',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('tasks')->insert([
            'group_id' => $kelompok1Id,
            'pic_id' => null,
            'judul' => 'Integrasi API Midtrans',
            'status' => 'backlog',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('activity_logs')->insert([
            'user_id' => $mahasiswa1->id,
            'group_id' => $kelompok1Id,
            'task_id' => $task1Id,
            'action_type' => 'claim_task',
            'description' => 'Mengklaim tugas UI/UX',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}