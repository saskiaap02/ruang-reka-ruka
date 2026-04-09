<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Tabel Kelas & Pengaturan Bobot (Fitur Final Evaluation)
        Schema::create('project_classes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dosen_id')->constrained('users')->onDelete('cascade');
            $table->string('mata_kuliah'); // Contoh: Sistem Informasi Manajemen
            $table->string('nama_kelas');  // Contoh: Kelas 4A
            $table->string('invite_code', 6)->unique(); // Kode unik 6 digit untuk mahasiswa join
            
            // Dosen bisa mengatur persentase nilai akhir
            $table->integer('bobot_dasar')->default(50);
            $table->integer('bobot_audit')->default(30);
            $table->integer('bobot_peer')->default(20);
            $table->timestamps();
        });

        // 2. Tabel Mahasiswa Join Kelas (Fitur ala Google Classroom)
        Schema::create('class_students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_class_id')->constrained('project_classes')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });

        // 3. Tabel Kelompok
        Schema::create('groups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_class_id')->constrained('project_classes')->onDelete('cascade');
            $table->string('nama_kelompok');
            $table->string('project_title')->nullable();
            $table->timestamps();
        });

        // 4. Tabel Anggota Kelompok (Untuk Rekap Nilai Impor SIAKAD)
        Schema::create('group_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('group_id')->constrained('groups')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->decimal('nilai_akhir', 5, 2)->nullable(); // Tempat menyimpan kalkulasi auto-grading
            $table->timestamps();
        });

        // 5. Tabel Tugas (Papan Kanban)
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('group_id')->constrained('groups')->onDelete('cascade');
            $table->foreignId('pic_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('judul');
            $table->enum('status', ['backlog', 'in_progress', 'done'])->default('backlog');
            $table->timestamps();
        });

        // 6. Tabel Log Aktivitas (Sistem Warning AI > 3 Hari & Heatmap)
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('group_id')->constrained('groups')->onDelete('cascade'); // Agar dosen mudah filter per kelompok
            $table->foreignId('task_id')->nullable()->constrained('tasks')->onDelete('cascade');
            $table->string('action_type');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 7. Tabel Peer Review
        Schema::create('peer_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reviewer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('reviewee_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('group_id')->constrained('groups')->onDelete('cascade');
            $table->integer('score');
            $table->text('feedback_text')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        // Penghapusan harus dari bawah ke atas agar tidak kena error Foreign Key
        Schema::dropIfExists('peer_reviews');
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('tasks');
        Schema::dropIfExists('group_members');
        Schema::dropIfExists('groups');
        Schema::dropIfExists('class_students');
        Schema::dropIfExists('project_classes');
    }
};