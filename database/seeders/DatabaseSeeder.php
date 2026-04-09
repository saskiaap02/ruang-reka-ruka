<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat Akun Dosen (Biar kamu bisa login dan nge-test)
        $dosenId = DB::table('users')->insertGetId([
            'name' => 'Saskia (Dosen)',
            'email' => 'dosen@sim.com',
            'password' => Hash::make('password'),
            'role' => 'dosen', // Pastikan kolom role ini ada di tabel users kamu
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // Buat Akun Mahasiswa
        $mahasiswaId = DB::table('users')->insertGetId([
            'name' => 'Budi Mahasiswa',
            'email' => 'budi@sim.com',
            'password' => Hash::make('password'),
            'role' => 'mahasiswa',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // 2. Buat Kelas Proyek
        $kelasId = DB::table('project_classes')->insertGetId([
            'dosen_id' => $dosenId,
            'mata_kuliah' => 'Pemrograman Web II',
            'nama_kelas' => 'Sistem Informasi 4A',
            'invite_code' => 'WEB4AX',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // 3. Buat 3 Kelompok (Skenario: Aman Tinggi, Aman Sedang, Kritis)
        $groups = [
            ['nama' => 'Kelompok 1', 'judul' => 'Sistem Kasir Toko Bangunan'],
            ['nama' => 'Kelompok 2', 'judul' => 'Aplikasi Registrasi Soft-Skill'],
            ['nama' => 'Kelompok 3', 'judul' => 'AERO-SHIELD Drone Proposal'], // Ini yang akan kita bikin kritis
        ];

        foreach ($groups as $index => $g) {
            $groupId = DB::table('groups')->insertGetId([
                'project_class_id' => $kelasId,
                'nama_kelompok' => $g['nama'],
                'project_title' => $g['judul'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);

            // 4. Buat Tasks untuk menghitung progress
            // Kelompok 1: 4 tugas (3 done, 1 in_progress) -> Progress 75%
            // Kelompok 2: 5 tugas (2 done, 3 backlog) -> Progress 40%
            // Kelompok 3: 4 tugas (0 done, 4 backlog) -> Progress 0%
            $tasksToCreate = $index == 0 ? 4 : ($index == 1 ? 5 : 4);
            $doneCount = $index == 0 ? 3 : ($index == 1 ? 2 : 0);

            for ($i = 0; $i < $tasksToCreate; $i++) {
                DB::table('tasks')->insert([
                    'group_id' => $groupId,
                    'judul' => 'Tugas ' . ($i + 1) . ' untuk ' . $g['nama'],
                    'status' => $i < $doneCount ? 'done' : 'backlog',
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]);
            }

            // 5. Buat Log Aktivitas
            // Kelompok 1: Aktif hari ini
            // Kelompok 2: Aktif kemarin
            // Kelompok 3: Pasif (Log terakhir 4 hari yang lalu -> Memicu status Kritis)
            $logDate = Carbon::now();
            if ($index == 1) $logDate = Carbon::now()->subDays(1);
            if ($index == 2) $logDate = Carbon::now()->subDays(4); 

            DB::table('activity_logs')->insert([
                'user_id' => $mahasiswaId,
                'group_id' => $groupId,
                'action_type' => 'Mengunggah Diagram',
                'description' => 'Menyelesaikan Activity Diagram',
                'created_at' => $logDate,
                'updated_at' => $logDate,
            ]);
        }
    }
}