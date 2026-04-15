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
            $table->foreignId('dosen_id')->constrained('users');
            $table->foreignId('student_id')->constrained('users');
            $table->foreignId('group_id')->constrained('groups');
            $table->string('message');
            $table->boolean('is_read')->default(false);
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
