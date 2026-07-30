<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bus', function (Blueprint $table) {
            $table->id('id_bus');
            $table->foreignId('id_po')->constrained('po_bus', 'id_po')->cascadeOnDelete();
            $table->string('nama_bus');
            $table->string('nomor_polisi');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bus');
    }
};
