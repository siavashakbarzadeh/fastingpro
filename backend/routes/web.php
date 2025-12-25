<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('admin')->group(function () {
    Route::get('/', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('/users', [\App\Http\Controllers\Admin\DashboardController::class, 'users'])->name('admin.users');
    Route::get('/fasts', [\App\Http\Controllers\Admin\DashboardController::class, 'fasts'])->name('admin.fasts');
});
