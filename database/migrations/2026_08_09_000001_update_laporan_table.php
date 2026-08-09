<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('laporan', function (Blueprint $table) {
            // Make old columns nullable for backward compatibility
            $table->date('tanggal_laporan')->nullable()->change();
            $table->date('periode_awal')->nullable()->change();
            $table->string('jenis_laporan')->nullable()->change();

            // Add new daily operational report fields
            $table->string('source_type')->default('trip')->after('id_admin'); // 'trip' or 'manual'
            $table->foreignId('source_trip_id')->nullable()->after('source_type')->constrained('jadwal', 'id_jadwal')->nullOnDelete();
            $table->timestamp('submitted_at')->useCurrent()->after('source_trip_id');
            $table->string('nama_po')->after('submitted_at');
            $table->string('nomor_polisi')->after('nama_po');
            $table->string('asal')->after('nomor_polisi');
            $table->string('tujuan')->after('asal');
            $table->string('nama_supir')->after('tujuan');
            $table->integer('seat')->default(0)->after('nama_supir');
            $table->integer('pnp')->default(0)->after('seat');
            $table->integer('naik')->default(0)->after('pnp');
            $table->integer('turun')->default(0)->after('naik');
            $table->string('akap_akdp', 10)->default('AKDP')->after('turun');
        });
    }

    public function down(): void
    {
        Schema::table('laporan', function (Blueprint $table) {
            $table->dropForeign(['source_trip_id']);
            $table->dropColumn([
                'source_type',
                'source_trip_id',
                'submitted_at',
                'nama_po',
                'nomor_polisi',
                'asal',
                'tujuan',
                'nama_supir',
                'seat',
                'pnp',
                'naik',
                'turun',
                'akap_akdp',
            ]);
        });
    }
};
