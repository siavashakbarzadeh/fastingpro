<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Fasting Routes
    Route::post('/fasts/start', [\App\Http\Controllers\Api\FastingController::class, 'start']);
    Route::post('/fasts/end', [\App\Http\Controllers\Api\FastingController::class, 'end']);
    Route::get('/fasts/current', [\App\Http\Controllers\Api\FastingController::class, 'current']);
    Route::apiResource('fasts', \App\Http\Controllers\Api\FastingController::class);

    // Weight Routes
    Route::apiResource('weights', \App\Http\Controllers\Api\WeightController::class);

    // Plans
    Route::get('/plans', [\App\Http\Controllers\Api\PlanController::class, 'index']);

    // Cycle Data
    Route::get('/cycle-data', [\App\Http\Controllers\Api\CycleDataController::class, 'show']);
    Route::post('/cycle-data', [\App\Http\Controllers\Api\CycleDataController::class, 'store']);

    // Water Intake
    Route::post('/water/intake', [\App\Http\Controllers\Api\WaterController::class, 'store']);
});

// Auth Routes
Route::post('/register', [\App\Http\Controllers\Auth\RegisterController::class, 'store']);
Route::post('/login', [\App\Http\Controllers\Auth\LoginController::class, 'store']);
