<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia; // Jangan lupa import Inertia

class DosenController extends Controller
{
    public function dashboard()
    {
        // Kita pakai dummy data dulu biar cepat bisa di-testing
        $data = [
            'total_proyek' => 5,
            'total_kelompok' => 15,
            'kelompok_kritis' => [
                ['id' => 1, 'nama' => 'Kelompok 3 - Sistem Kasir', 'status' => 'Konflik Internal (Anggota Pasif)'],
                ['id' => 2, 'nama' => 'Kelompok 5 - Web E-Commerce', 'status' => 'Tenggat Waktu Terlewat']
            ]
        ];

        // Ini akan merender file Pages/Dosen/Dashboard.jsx yang ada di gambarmu
        return Inertia::render('Dosen/Dashboard', $data);
    }
}