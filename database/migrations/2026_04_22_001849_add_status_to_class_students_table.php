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
        Schema::table('class_students', function (Blueprint $table) {
            // Kita tambahkan status 'pending' (menunggu approval) 
            // dan 'approved' (sudah diterima di kelas)
            $table->enum('status', ['pending', 'approved'])
                  ->default('pending')
                  ->after('project_class_id'); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('class_students', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};