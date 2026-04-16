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
    Schema::table('nudges', function (Blueprint $table) {
        // Tambahkan kolom is_read setelah kolom message
        $table->boolean('is_read')->default(false)->after('message');
    });
}

public function down(): void
{
    Schema::table('nudges', function (Blueprint $table) {
        $table->dropColumn('is_read');
    });
}
};
