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
        // 1. Buat Akun Dosen
        $dosenId = DB::table('users')->insertGetId([
            'nim_nip' => '198001012005011001',
            'name' => 'Saskia (Dosen)',
            'email' => 'dosen@sim.com',
            'password' => Hash::make('password'),
            'role' => 'dosen',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // 2. Buat Akun Mahasiswa
        $mahasiswaId = DB::table('users')->insertGetId([
            'nim_nip' => '09031282227000',
            'name' => 'Budi Mahasiswa',
            'email' => 'budi@sim.com',
            'password' => Hash::make('password'),
            'role' => 'mahasiswa',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // 3. Buat Kelas Proyek
        $kelasId = DB::table('project_classes')->insertGetId([
            'dosen_id' => $dosenId,
            'mata_kuliah' => 'Pemrograman Web II',
            'nama_kelas' => 'Sistem Informasi 4A',
            'invite_code' => 'WEB4AX',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // 4. Daftarkan Mahasiswa ke Kelas (Sangat Penting!)
        DB::table('class_students')->insert([
            'project_class_id' => $kelasId,
            'student_id' => $mahasiswaId,
            'created_at' => Carbon::now(),
        ]);

        // 5. Buat Kelompok
        $groups = [
            ['nama' => 'Kelompok 1', 'judul' => 'Sistem Kasir Toko'],
            ['nama' => 'Kelompok 2', 'judul' => 'Aplikasi Soft-Skill'],
            ['nama' => 'Kelompok 3', 'judul' => 'AERO-SHIELD Drone'], 
        ];

        foreach ($groups as $index => $g) {
            $groupId = DB::table('groups')->insertGetId([
                'project_class_id' => $kelasId,
                'nama_kelompok' => $g['nama'],
                'project_title' => $g['judul'],
                'created_at' => Carbon::now(),
            ]);

            // TAMBAHAN: Masukkan Mahasiswa ke Group Members (Biar muncul di Dashboard)
            DB::table('group_members')->insert([
                'group_id' => $groupId,
                'student_id' => $mahasiswaId,
                'nilai_akhir' => ($index == 0) ? 90 : (($index == 1) ? 75 : 50), // Simulasi nilai Tinggi, Sedang, Rendah
                'created_at' => Carbon::now(),
            ]);

            // 6. Buat Tasks
            $tasksToCreate = ($index == 0) ? 4 : (($index == 1) ? 5 : 4);
            $doneCount = ($index == 0) ? 3 : (($index == 1) ? 2 : 0);

            for ($i = 0; $i < $tasksToCreate; $i++) {
                DB::table('tasks')->insert([
                    'group_id' => $groupId,
                    'pic_id' => $mahasiswaId, // Set PIC agar presentase pengerjaan bisa dihitung
                    'judul' => 'Tugas ' . ($i + 1) . ' ' . $g['nama'],
                    'status' => $i < $doneCount ? 'done' : 'backlog',
                    'created_at' => Carbon::now(),
                ]);
            }

            // 7. Buat Log Aktivitas (Untuk Tracking AI)
            $logDate = Carbon::now();
            if ($index == 2) $logDate = Carbon::now()->subDays(4); // Skenario Kritis

            DB::table('activity_logs')->insert([
                'user_id' => $mahasiswaId,
                'group_id' => $groupId,
                'action_type' => 'Update Logbook',
                'description' => 'Mengerjakan tugas ke-' . ($index + 1),
                'created_at' => $logDate,
            ]);
        }
    }
}