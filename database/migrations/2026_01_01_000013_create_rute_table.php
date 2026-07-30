<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rute', function (Blueprint $table) {
            $table->id('id_rute');
            $table->string('asal');
            $table->string('tujuan');
            $table->text('keterangan_rute')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rute');
    }
};
