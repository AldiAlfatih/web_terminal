<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('jadwal', function (Blueprint $table) {
            $table->decimal('current_lat', 10, 7)->nullable()->after('keterangan');
            $table->decimal('current_lng', 10, 7)->nullable()->after('current_lat');
            $table->float('current_heading')->nullable()->after('current_lng');
            $table->float('current_speed')->nullable()->after('current_heading');
            $table->timestamp('last_loc_updated_at')->nullable()->after('current_speed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jadwal', function (Blueprint $table) {
            $table->dropColumn([
                'current_lat',
                'current_lng',
                'current_heading',
                'current_speed',
                'last_loc_updated_at',
            ]);
        });
    }
};
