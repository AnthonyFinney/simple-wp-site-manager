<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Show the main dashboard.
     */
    public function index()
    {
        // For now we don't pass real data – your React component
        // can still use its own dummy data.
        // Later we'll pass real stats and activity from the DB.

        return Inertia::render('Dashboard');
    }
}
