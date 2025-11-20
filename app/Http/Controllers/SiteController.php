<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Site;

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
        return Inertia::render('Sites/Create');
    }

    public function show(int $id)
    {
        $site = Site::with("server")->findOrFail(($id));
        return Inertia::render('Sites/Show', [
            'site' => $site,
        ]);
    }

    public function edit(int $id)
    {
        return Inertia::render('Sites/Edit', [
            'siteId' => $id,
        ]);
    }
}
