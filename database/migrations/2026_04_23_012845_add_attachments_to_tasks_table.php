<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migrasi untuk menambah kolom baru.
     */
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // nullable() digunakan karena tidak semua tugas harus ada link atau filenya
            $table->string('link')->nullable()->after('status'); 
            $table->string('file_path')->nullable()->after('link');
        });
    }

    /**
     * Batalkan migrasi (Rollback).
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn(['link', 'file_path']);
        });
    }
};