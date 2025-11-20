<?php

namespace Database\Seeders;

use App\Models\Server;
use App\Models\Site;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $serverData = [
            [
                'name' => 'Main VPS',
                'host' => '203.0.113.5',
                'provider' => 'Hetzner',
                'region' => 'fsn1',
                'status' => 'online',
                'os' => 'Ubuntu 24.04 LTS',
                'memory' => '8 GB',
                'disk' => '160 GB NVMe',
                'ip_addresses' => ['203.0.113.5', '10.0.0.5'],
            ],
            [
                'name' => 'DO #1',
                'host' => '198.51.100.12',
                'provider' => 'DigitalOcean',
                'region' => 'sgp1',
                'status' => 'online',
                'os' => 'Ubuntu 24.04 LTS',
                'memory' => '4 GB',
                'disk' => '80 GB NVMe',
                'ip_addresses' => ['198.51.100.12'],
            ],
        ];

        $servers = collect($serverData)->map(
            fn($attrs) =>
            Server::updateOrCreate(['host' => $attrs['host']], $attrs)
        );

        foreach ($servers as $server) {
            $server->sites()->delete();
            Site::factory()->count(2)->for($server)->create();
        }
    }
}
