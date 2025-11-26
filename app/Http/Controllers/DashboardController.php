<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Server;
use App\Models\Site;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            "servers" => Server::withCount("sites")->orderBy("name")->get(),
            "sites" => Site::with("server")->orderBy("domain")->get(),
        ]);
    }
}
