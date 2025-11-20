<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return Inertia::render('Home', [
        'title' => 'Hello from Laravel + Inertia + React',
    ]);
});
