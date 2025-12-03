<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Site;
use App\Models\Server;
use App\Http\Requests\SiteRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SiteController extends Controller
{
    public function index()
    {
        $sites = Site::with("server")->orderBy("domain")->get();
        return Inertia::render('Sites/Index', [
            "sites" => $sites,
        ]);
    }

    public function create()
    {
        return Inertia::render('Sites/Create', [
            'servers' => Server::orderBy('name')->get(['id', 'name', 'host']),
            'statusOptions' => ['running', 'stopped', 'deploying', 'failed'],
        ]);
    }

    public function store(SiteRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['status'] = $data['status'] ?? 'deploying';
        $data['container_name'] = $data['container_name'] ?? 'wp-' . str_replace('.', '-', $data['domain']);

        $site = Site::create($data);
        dispatch(new \App\Jobs\DeploySiteJob($site));

        return redirect()
            ->route('sites.show', $site)
            ->with('success', 'Site created and queued for deploy.');
    }

    public function show(int $id)
    {
        $site = Site::with([
            "server",
            "backups" => fn($q) => $q
                ->with("server")
                ->orderByDesc("snapshot_at")
                ->orderByDesc("started_at")
                ->latest()
                ->limit(10)
        ])->find($id);

        if (!$site) {
            return redirect()
                ->route('sites.index')
                ->with('info', 'Site not found (it may have been deleted).');
        }

        $site->delete_url = route('sites.destroy', $site);

        return Inertia::render('Sites/Show', [
            'site' => $site,
        ]);
    }

    public function edit(int $id)
    {
        $site = Site::with('server')->findOrFail($id);
        return Inertia::render('Sites/Edit', [
            'site' => $site,
            'servers' => Server::orderBy('name')->get(['id', 'name', 'host']),
            'statusOptions' => ['running', 'stopped', 'deploying', 'failed'],
        ]);
    }

    public function update(SiteRequest $request, int $id): RedirectResponse
    {
        $site = Site::findOrFail($id);
        $site->update($request->validated());
        dispatch(new \App\Jobs\DeploySiteJob($site));

        return redirect()
            ->route('sites.show', $site)
            ->with('success', 'Site updated.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $site = Site::find($id);

        if ($site) {
            $site->update(['status' => 'destroying']);
            dispatch(new \App\Jobs\DestroySiteJob($site->id));
        }

        return redirect()
            ->route('sites.index')
            ->with('success', 'Container cleanup queued; site will be removed after shutdown.');
    }

    public function destroyFromRequest(Request $request): RedirectResponse
    {
        $id = $request->input('id') ?? $request->input('site_id');

        if (!$id && $request->headers->has('referer')) {
            if (preg_match('/\\/sites\\/(\\d+)/', $request->headers->get('referer'), $matches)) {
                $id = $matches[1];
            }
        }

        if (!$id) {
            return redirect()
                ->route('sites.index')
                ->with('error', 'No site id provided for deletion.');
        }

        return $this->destroy((int) $id);
    }

    public function start(Request $request, Site $site): RedirectResponse
    {
        dispatch(new \App\Jobs\StartSiteJob($site));
        return back()->with('success', 'Start queued.');
    }

    public function stop(Request $request, Site $site): RedirectResponse
    {
        dispatch(new \App\Jobs\StopSiteJob($site));

        return back()->with('success', 'Stop queued.');
    }

    public function redeploy(Request $request, Site $site): RedirectResponse
    {
        dispatch(new \App\Jobs\DeploySiteJob($site));
        return back()->with('success', 'Redeploy queued.');
    }

    public function restart(Request $request, Site $site): RedirectResponse
    {
        dispatch(new \App\Jobs\StopSiteJob($site));
        dispatch(new \App\Jobs\StartSiteJob($site));

        return back()->with('success', 'Restart queued.');
    }
}
