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

    /**
     * Show the "add server" wizard.
     */
    public function create()
    {
        return Inertia::render('Servers/Create');
    }

    /**
     * Show a single server detail page.
     */
    public function show(int $id)
    {
        // Later: fetch the server and related data from the database.
        return Inertia::render('Servers/Show', [
            'serverId' => $id,
        ]);
    }
}
