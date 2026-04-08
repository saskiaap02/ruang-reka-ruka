<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia; // Jangan lupa import ini

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Ambil data asli dari Database (kalau tabelnya sudah ada isinya)
        $jumlahKelas = DB::table('project_classes')->count();
        $jumlahKelompok = DB::table('groups')->count();

        // 2. Data Dummy (Sambil nunggu database kamu selesai diisi semua)
        // Ini supaya UI React kamu nggak kosong melompong pas di-test
        $kelompokKritis = [
            ['id' => 1, 'nama' => 'Kelompok 3', 'masalah' => 'Anggota Pasif (> 1 Minggu)']
        ];

        $daftarKelompok = [
            [
                'id' => 1,
                'nama' => 'Kelompok 1',
                'proyek' => 'Sistem Kasir Toko Bangunan',
                'status' => 'Aman',
                'progress' => '75%',
                'log_terakhir' => 'Budi mengunggah Sequence Diagram'
            ],
            [
                'id' => 2,
                'nama' => 'Kelompok 2',
                'proyek' => 'Aplikasi Registrasi Soft-Skill',
                'status' => 'Aman',
                'progress' => '40%',
                'log_terakhir' => 'Siti memperbarui skema Database'
            ],
            [
                'id' => 3,
                'nama' => 'Kelompok 3',
                'proyek' => 'Web E-Commerce',
                'status' => 'Konflik',
                'progress' => '15%',
                'log_terakhir' => 'Andi mengajukan komplain pembagian tugas'
            ],
        ];

        // 3. Kirim SEMUA data ke React
        return Inertia::render('Dosen/Dashboard', [
            'totalKelasAktif' => $jumlahKelas ?: 4, // Pakai angka 4 kalau DB masih kosong
            'totalKelompok'   => $jumlahKelompok ?: 12, // Pakai angka 12 kalau DB masih kosong
            'kelompokKritis'  => $kelompokKritis,
            'daftarKelompok'  => $daftarKelompok,
        ]);
    }
}