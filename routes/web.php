<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ServerController;
use App\Http\Controllers\SiteController;
use App\Http\Controllers\BackupController;
use App\Http\Controllers\Api\SiteStatusController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ProfileController;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;

// Monitor endpoint (token protected via services.monitor.token and CSRF-exempt)
Route::post('/monitor/sites/{site}', SiteStatusController::class)
    ->name('monitor.sites.update')
    ->withoutMiddleware([VerifyCsrfToken::class]);

// Auth routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');

    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/servers', [ServerController::class, 'index'])->name('servers.index');
    Route::get('/servers/create', [ServerController::class, 'create'])->name('servers.create');
    Route::post('/servers', [ServerController::class, 'store'])->name('servers.store');
    Route::delete('/servers', [ServerController::class, 'destroyByPayload'])->name('servers.destroyByPayload');
    Route::get('/servers/{id}', [ServerController::class, 'show'])->name('servers.show');
    Route::get('/servers/{id}/edit', [ServerController::class, 'edit'])->name('servers.edit');
    Route::put('/servers/{id}', [ServerController::class, 'update'])->name('servers.update');
    Route::delete('/servers/{id}', [ServerController::class, 'destroy'])->name('servers.destroy');

    Route::get('/sites', [SiteController::class, 'index'])->name('sites.index');
    Route::get('/sites/create', [SiteController::class, 'create'])->name('sites.create');
    Route::post('/sites', [SiteController::class, 'store'])->name('sites.store');
    Route::delete('/sites', [SiteController::class, 'destroyFromRequest'])->name('sites.destroyFromRequest');
    Route::get('/sites/{id}', [SiteController::class, 'show'])->name('sites.show');
    Route::get('/sites/{id}/edit', [SiteController::class, 'edit'])->name('sites.edit');
    Route::put('/sites/{id}', [SiteController::class, 'update'])->name('sites.update');
    Route::delete('/sites/{id}', [SiteController::class, 'destroy'])->name('sites.destroy');
    Route::post('/sites/{site}/actions/start', [SiteController::class, 'start'])->name('sites.start');
    Route::post('/sites/{site}/actions/stop', [SiteController::class, 'stop'])->name('sites.stop');
    Route::post('/sites/{site}/actions/restart', [SiteController::class, 'restart'])->name('sites.restart');
    Route::post('/sites/{site}/actions/redeploy', [SiteController::class, 'redeploy'])->name('sites.redeploy');

    Route::get('/backups', [BackupController::class, 'all'])->name('backups.all');
    Route::delete('/backups', [BackupController::class, 'destroyFromRequest'])->name('backups.destroyFromRequest');
    Route::get('/sites/{site}/backups', [BackupController::class, 'index'])->name('backups.index');
    Route::post('/sites/{site}/backups', [BackupController::class, 'store'])->name('backups.store');
    Route::delete('/sites/{site}/backups/{backup}', [BackupController::class, 'destroy'])->name('backups.destroy');
    Route::delete('/backups/{backup}', [BackupController::class, 'destroyAny'])->name('backups.destroyAny');
    Route::get('/sites/{site}/backups/{backup}/download', [BackupController::class, 'download'])->name('backups.download');
    Route::post('/sites/{site}/backups/{backup}/restore', [BackupController::class, 'restore'])->name('backups.restore');
});
