<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class ServerController extends Controller
{
    /**
     * List all servers (UI only for now).
     */
    public function index()
    {
        // Later: fetch servers from DB and pass as props
        // e.g. 'servers' => Server::all()
        return Inertia::render('Servers/Index');
    }
}
