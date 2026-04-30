use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // Tambahkan 2 kolom baru ini setelah kolom 'status' (atau kolom lain yang ada)
            $table->string('file_path')->nullable()->after('status');
            $table->text('notes')->nullable()->after('file_path');
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // Untuk menghapus kolom jika migrasi di-rollback
            $table->dropColumn(['file_path', 'notes']);
        });
    }
};