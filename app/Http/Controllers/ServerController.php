<?php

namespace App\Http\Controllers;

use App\Models\Server;
use Inertia\Inertia;

class ServerController extends Controller
{
    public function index()
    {
        return Inertia::render('Servers/Index', [
            'servers' => Server::withCount('sites')->orderBy('name')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Servers/Create');
    }

    public function show(int $id)
    {
        $server = Server::with('sites')->findOrFail($id);
        return Inertia::render('Servers/Show', compact("server"));
    }
}
