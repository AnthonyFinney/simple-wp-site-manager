<?php

namespace App\Http\Controllers;

use App\Models\Server;
use App\Http\Requests\ServerRequest;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

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

    public function store(ServerRequest $request): RedirectResponse
    {
        $server = Server::create($request->validated());
        return redirect()
            ->route('servers.show', $server)
            ->with('success', 'Server added.');
    }

    public function show(int $id)
    {
        $server = Server::with('sites')->findOrFail($id);
        $server->delete_url = route('servers.destroy', $server);
        $server->edit_url = route('servers.edit', $server);
        return Inertia::render('Servers/Show', compact("server"));
    }

    public function edit(int $id)
    {
        $server = Server::findOrFail($id);

        return Inertia::render('Servers/Edit', [
            'server' => $server,
            'statusOptions' => ['online', 'offline', 'maintenance'],
        ]);
    }

    public function update(ServerRequest $request, int $id): RedirectResponse
    {
        $server = Server::findOrFail($id);
        $server->update($request->validated());

        return redirect()
            ->route('servers.show', $server)
            ->with('success', 'Server updated.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $server = Server::findOrFail($id);
        $server->delete();

        return redirect()
            ->route('servers.index')
            ->with('success', 'Server removed.');
    }

    public function destroyByPayload(Request $request): RedirectResponse
    {
        $id = $request->input('id') ?? $request->input('server_id');

        if (!$id && $request->headers->has('referer')) {
            if (preg_match('/\\/servers\\/(\\d+)/', $request->headers->get('referer'), $matches)) {
                $id = $matches[1];
            }
        }

        if (!$id) {
            return redirect()
                ->route('servers.index')
                ->with('error', 'No server id provided for deletion.');
        }

        return $this->destroy((int) $id);
    }
}
