<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('nudges', function (Blueprint $table) {
            $table->id();
            
            // Relasi ke Dosen yang memberikan peringatan
            $table->foreignId('dosen_id')->constrained('users')->onDelete('cascade');
            
            // Relasi ke Mahasiswa yang dicolek
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            
            // Relasi ke Kelompok terkait
            $table->foreignId('group_id')->constrained('groups')->onDelete('cascade');
            
            // Pesan peringatan
            $table->text('message');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nudges');
    }
};