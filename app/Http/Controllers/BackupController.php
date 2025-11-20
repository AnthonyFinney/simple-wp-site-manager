<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class BackupController extends Controller
{
    /**
     * List backups across sites (UI only for now).
     */
    public function index()
    {
        // Later: pull backups from storage/DB.
        return Inertia::render('Backups/Index');
    }
}
