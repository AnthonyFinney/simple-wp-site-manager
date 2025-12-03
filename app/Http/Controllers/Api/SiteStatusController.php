<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\RefreshSiteStatusJob;
use App\Models\Site;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SiteStatusController extends Controller
{
    public function __invoke(Request $request, Site $site)
    {
        $token = config('services.monitor.token');
        if ($token && $request->header('X-Monitor-Token') !== $token) {
            return response()->json(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $data = $request->validate([
            'status' => ['required', 'string'],
            'checked_at' => ['nullable', 'date'],
        ]);

        dispatch(new RefreshSiteStatusJob($site, $data['status'], $data['checked_at'] ?? null));

        return response()->json([
            'ok' => true,
            'site_id' => $site->id,
            'status' => $data['status'],
        ]);
    }
}
