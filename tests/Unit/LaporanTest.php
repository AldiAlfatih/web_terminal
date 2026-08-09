<?php

use App\Models\Laporan;
use Tests\TestCase;

uses(TestCase::class);

test('display_time accessor converts utc timestamp to asia makassar timezone format', function () {
    $laporan = new Laporan([
        'submitted_at' => '2026-08-09 04:08:13',
    ]);

    expect($laporan->display_time)->toBe('12:08');
});

test('display_time accessor returns dash when submitted_at is null', function () {
    $laporan = new Laporan;

    expect($laporan->display_time)->toBe('-');
});
