<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jadwal', function (Blueprint $table) {
            $table->id('id_jadwal');
            $table->foreignId('id_bus')->constrained('bus', 'id_bus')->cascadeOnDelete();
            $table->foreignId('id_rute')->constrained('rute', 'id_rute')->cascadeOnDelete();
            $table->foreignId('id_admin')->constrained('admin', 'id_admin')->cascadeOnDelete();
            $table->date('tanggal');
            $table->time('jam_keberangkatan');
            $table->time('jam_kedatangan');
            $table->enum('status_bus', ['menunggu', 'berangkat', 'selesai'])->default('menunggu');
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jadwal');
    }
};
