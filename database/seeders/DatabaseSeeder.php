<?php

namespace Database\Seeders;

use App\Models\Server;
use App\Models\Site;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
            ]
        );

        $serverData = [
            [
                'name' => 'Main VPS',
                'host' => '203.0.113.5',
                'ssh_user' => 'root',
                'ssh_port' => 22,
                'ssh_auth_type' => 'key',
                'ssh_private_key' => '-----BEGIN PRIVATE KEY----- MAIN -----END PRIVATE KEY-----',
                'ssh_password' => null,
                'requires_sudo' => true,
                'docker_bin_path' => '/usr/bin/docker',
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
                'ssh_user' => 'root',
                'ssh_port' => 22,
                'ssh_auth_type' => 'password',
                'ssh_private_key' => null,
                'ssh_password' => 'example-password',
                'requires_sudo' => true,
                'docker_bin_path' => '/usr/bin/docker',
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
