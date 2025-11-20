<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ServerController;
use App\Http\Controllers\SiteController;
use App\Http\Controllers\BackupController;

Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
Route::get('/dashboard', [DashboardController::class, 'index']);

Route::get('/servers', [ServerController::class, 'index'])->name('servers.index');
Route::get('/servers/create', [ServerController::class, 'create'])->name('servers.create');
Route::get('/servers/{id}', [ServerController::class, 'show'])->name('servers.show');

Route::get('/sites', [SiteController::class, 'index'])->name('sites.index');
Route::get('/sites/create', [SiteController::class, 'create'])->name('sites.create');
Route::get('/sites/{id}', [SiteController::class, 'show'])->name('sites.show');
Route::get('/sites/{id}/edit', [SiteController::class, 'edit'])->name('sites.edit');

Route::get('/backups', [BackupController::class, 'index'])->name('backups.index');
