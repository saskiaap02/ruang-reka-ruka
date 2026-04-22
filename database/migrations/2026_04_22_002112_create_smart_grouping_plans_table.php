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
        Schema::create('smart_grouping_plans', function (Blueprint $table) {
            $table->id();
            
            // Relasi ke Kelas
            $table->foreignId('project_class_id')
                  ->constrained('project_classes')
                  ->onDelete('cascade');
            
            // Relasi ke Mahasiswa (User)
            $table->foreignId('student_id')
                  ->constrained('users')
                  ->onDelete('cascade');
            
            // Relasi ke Kelompok yang diincar AI
            $table->foreignId('target_group_id')
                  ->constrained('groups')
                  ->onDelete('cascade');
            
            // Kolom untuk menyimpan "Hasil Analisis AI" atau Alasan Perhitungannya
            $table->text('reason')->nullable(); 
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('smart_grouping_plans');
    }
};