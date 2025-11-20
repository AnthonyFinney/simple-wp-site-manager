<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class SiteController extends Controller
{
    /**
     * List all sites.
     */
    public function index()
    {
        return Inertia::render('Sites/Index');
    }

    /**
     * Show the "create new site" form.
     */
    public function create()
    {
        // Later we can pass available servers as props:
        // 'servers' => Server::all()
        return Inertia::render('Sites/Create');
    }

    /**
     * Show a single site's detail page.
     */
    public function show(int $id)
    {
        return Inertia::render('Sites/Show', [
            'siteId' => $id,
        ]);
    }
}
