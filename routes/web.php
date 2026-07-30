<?php

use App\Http\Controllers\Admin\BusController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\JadwalController;
use App\Http\Controllers\Admin\PoBusController;
use App\Http\Controllers\Admin\RuteController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\TrackingController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
use App\Http\Controllers\PublicController;

/*
|--------------------------------------------------------------------------
| Public Passenger Routes
|--------------------------------------------------------------------------
*/
Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/track/{id_jadwal}', [PublicController::class, 'trackMap'])->name('penumpang.track');

/*
|--------------------------------------------------------------------------
| Supir (Driver) & Tracking Routes
|--------------------------------------------------------------------------
*/
Route::get('/supir', [TrackingController::class, 'supirIndex'])->name('supir.index');
Route::get('/supir/jadwal/{id_jadwal}/track', [TrackingController::class, 'showDriverTracking'])->name('supir.tracking');
Route::post('/api/jadwal/{id_jadwal}/location', [TrackingController::class, 'updateLocation'])->name('api.jadwal.location');
Route::post('/api/jadwal/{id_jadwal}/finish', [TrackingController::class, 'finishJourney'])->name('api.jadwal.finish');


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
        'index'   => 'admin.po-bus.index',
        'create'  => 'admin.po-bus.create',
        'store'   => 'admin.po-bus.store',
        'edit'    => 'admin.po-bus.edit',
        'update'  => 'admin.po-bus.update',
        'destroy' => 'admin.po-bus.destroy',
    ])->except(['show']);

    // Bus CRUD
    Route::resource('admin/bus', BusController::class)->names([
        'index'   => 'admin.bus.index',
        'create'  => 'admin.bus.create',
        'store'   => 'admin.bus.store',
        'edit'    => 'admin.bus.edit',
        'update'  => 'admin.bus.update',
        'destroy' => 'admin.bus.destroy',
    ])->except(['show']);

    // Rute CRUD
    Route::resource('admin/rute', RuteController::class)->names([
        'index'   => 'admin.rute.index',
        'create'  => 'admin.rute.create',
        'store'   => 'admin.rute.store',
        'edit'    => 'admin.rute.edit',
        'update'  => 'admin.rute.update',
        'destroy' => 'admin.rute.destroy',
    ])->except(['show']);

    // Jadwal CRUD
    Route::resource('admin/jadwal', JadwalController::class)->names([
        'index'   => 'admin.jadwal.index',
        'create'  => 'admin.jadwal.create',
        'store'   => 'admin.jadwal.store',
        'edit'    => 'admin.jadwal.edit',
        'update'  => 'admin.jadwal.update',
        'destroy' => 'admin.jadwal.destroy',
    ])->except(['show']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
