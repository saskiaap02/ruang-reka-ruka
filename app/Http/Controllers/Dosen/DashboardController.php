<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Dummy data untuk testing UI sebelum disambung ke Database
        $data = [
            'totalKelasAktif' => 4,
            'totalKelompok' => 12,
            
            // Data untuk peringatan kelompok bermasalah
            'kelompokKritis' => [
                ['id' => 1, 'nama' => 'Kelompok 3', 'masalah' => 'Anggota Pasif (> 1 Minggu)']
            ],

            // Data untuk fitur Monitoring & Log Audit
            'daftarKelompok' => [
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
            ]
        ];

        return Inertia::render('Dosen/Dashboard', $data);
    }
}