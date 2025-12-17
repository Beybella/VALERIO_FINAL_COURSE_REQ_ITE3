<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// This makes the Dashboard your actual Home Page (No login needed)
Route::get('/', [DashboardController::class, 'index'])->name('home');

// This makes the /dashboard link also public
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

// Keep these for your own testing, but they won't block the dashboard
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';