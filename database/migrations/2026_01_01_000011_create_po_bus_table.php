<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('po_bus', function (Blueprint $table) {
            $table->id('id_po');
            $table->string('nama_po');
            $table->text('alamat_po');
            $table->string('no_telp_po');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('po_bus');
    }
};
