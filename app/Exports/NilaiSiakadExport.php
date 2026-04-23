<?php

namespace App\Exports;

use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class NilaiSiakadExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $classId;

    public function __construct($classId)
    {
        $this->classId = $classId;
    }

    public function collection()
    {
        return DB::table('group_members')
            ->join('users', 'group_members.student_id', '=', 'users.id')
            ->join('groups', 'group_members.group_id', '=', 'groups.id')
            ->where('groups.project_class_id', $this->classId)
            ->select('users.nim_nip', 'users.name', 'group_members.nilai_akhir')
            ->get();
    }

    public function headings(): array
    {
        return [
            'NIM / NIP',
            'NAMA MAHASISWA',
            'NILAI ANGKA',
            'NILAI HURUF',
            'STATUS KELULUSAN'
        ];
    }

    public function map($mhs): array
    {
        // --- LOGIKA CARA KE-2: CEK NULL ---
        if (is_null($mhs->nilai_akhir)) {
            return [
                "'" . $mhs->nim_nip,
                strtoupper($mhs->name),
                '-',              // Nilai Angka jadi strip
                '-',              // Nilai Huruf jadi strip
                'BELUM DIAUDIT'   // Status lebih jelas
            ];
        }

        $nilai = (float) $mhs->nilai_akhir;
        
        // Penentuan Nilai Huruf
        if ($nilai >= 85) $huruf = 'A';
        elseif ($nilai >= 70) $huruf = 'B';
        elseif ($nilai >= 55) $huruf = 'C';
        elseif ($nilai >= 40) $huruf = 'D';
        else $huruf = 'E';

        return [
            "'" . $mhs->nim_nip,
            strtoupper($mhs->name),
            number_format($nilai, 2),
            $huruf,
            $nilai >= 55 ? 'LULUS' : 'MENGULANG'
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}