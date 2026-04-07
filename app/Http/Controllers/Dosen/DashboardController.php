<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB; // Tambahan untuk memanggil Database

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Ambil data (hitung) langsung dari tabel
        $jumlahKelas = DB::table('project_classes')->count();
        $jumlahKelompok = DB::table('groups')->count();

        // 2. Kirim datanya ke React sebagai variabel pendamping
        return inertia('Dosen/Dashboard', [
            'totalKelasAktif' => $jumlahKelas,
            'totalKelompok'   => $jumlahKelompok,
        ]);
    }
}