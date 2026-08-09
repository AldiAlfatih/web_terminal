<?php

use App\Http\Controllers\Admin\BusController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\JadwalController;
use App\Http\Controllers\Admin\LaporanController;
use App\Http\Controllers\Admin\PoBusController;
use App\Http\Controllers\Admin\RuteController;
use App\Http\Controllers\Admin\SupirController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\TrackingController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/track/{id_jadwal}', [PublicController::class, 'trackMap'])->name('penumpang.track');

// Redirect legacy supir login route to unified login
Route::get('/supir/login', function () {
    return redirect()->route('login');
})->name('supir.login');

/*
|--------------------------------------------------------------------------
| Supir (Driver) Protected Routes (auth:supir)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:supir')->group(function () {
    Route::get('/supir', [TrackingController::class, 'supirIndex'])->name('supir.index');
    Route::get('/supir/jadwal/{id_jadwal}/track', [TrackingController::class, 'showDriverTracking'])->name('supir.tracking');
    Route::post('/api/jadwal/{id_jadwal}/location', [TrackingController::class, 'updateLocation'])->name('api.jadwal.location');
    Route::post('/api/jadwal/{id_jadwal}/finish', [TrackingController::class, 'finishJourney'])->name('api.jadwal.finish');
});

/*
|--------------------------------------------------------------------------
| Admin Routes (require auth)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {

    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Perusahaan Otobus (PO Bus) CRUD
    Route::resource('admin/po-bus', PoBusController::class)->names([
        'index' => 'admin.po-bus.index',
        'create' => 'admin.po-bus.create',
        'store' => 'admin.po-bus.store',
        'edit' => 'admin.po-bus.edit',
        'update' => 'admin.po-bus.update',
        'destroy' => 'admin.po-bus.destroy',
    ])->except(['show']);

    // Bus CRUD
    Route::resource('admin/bus', BusController::class)->names([
        'index' => 'admin.bus.index',
        'create' => 'admin.bus.create',
        'store' => 'admin.bus.store',
        'edit' => 'admin.bus.edit',
        'update' => 'admin.bus.update',
        'destroy' => 'admin.bus.destroy',
    ])->except(['show']);

    // Rute CRUD
    Route::resource('admin/rute', RuteController::class)->names([
        'index' => 'admin.rute.index',
        'create' => 'admin.rute.create',
        'store' => 'admin.rute.store',
        'edit' => 'admin.rute.edit',
        'update' => 'admin.rute.update',
        'destroy' => 'admin.rute.destroy',
    ])->except(['show']);

    // Jadwal CRUD
    Route::resource('admin/jadwal', JadwalController::class)->names([
        'index' => 'admin.jadwal.index',
        'create' => 'admin.jadwal.create',
        'store' => 'admin.jadwal.store',
        'edit' => 'admin.jadwal.edit',
        'update' => 'admin.jadwal.update',
        'destroy' => 'admin.jadwal.destroy',
    ])->except(['show']);

    // Supir CRUD
    Route::resource('admin/supir', SupirController::class)->names([
        'index' => 'admin.supir.index',
        'create' => 'admin.supir.create',
        'store' => 'admin.supir.store',
        'edit' => 'admin.supir.edit',
        'update' => 'admin.supir.update',
        'destroy' => 'admin.supir.destroy',
    ])->except(['show']);

    // Laporan CRUD, PDF Generator & Rekap Harian
    Route::get('admin/laporan/pdf-form', [LaporanController::class, 'pdfForm'])->name('admin.laporan.pdf-form');
    Route::get('admin/laporan/preview', [LaporanController::class, 'previewPdf'])->name('admin.laporan.preview');
    Route::get('admin/laporan/download-pdf', [LaporanController::class, 'downloadPdf'])->name('admin.laporan.download-pdf');
    Route::get('admin/laporan/detail/{tanggal}', [LaporanController::class, 'detailDate'])->name('admin.laporan.detail');
    Route::resource('admin/laporan', LaporanController::class)->names([
        'index' => 'admin.laporan.index',
        'create' => 'admin.laporan.create',
        'store' => 'admin.laporan.store',
        'show' => 'admin.laporan.show',
        'edit' => 'admin.laporan.edit',
        'update' => 'admin.laporan.update',
        'destroy' => 'admin.laporan.destroy',
    ]);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
