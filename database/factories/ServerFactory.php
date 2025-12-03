<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Server;

class ServerFactory extends Factory
{
    protected $model = Server::class;

    public function definition(): array
    {
        return [
            "name" => fake()->company() . " VPS",
            "host" => fake()->ipv4(),
            "ssh_user" => "root",
            "ssh_port" => 22,
            "ssh_auth_type" => "key",
            "ssh_private_key" => "-----BEGIN RSA PRIVATE KEY-----\nFAKEKEY\n-----END RSA PRIVATE KEY-----",
            "ssh_password" => null,
            "requires_sudo" => true,
            "docker_bin_path" => "/usr/bin/docker",
            "provider" => fake()->randomElement(["Hetzner", "DigitalOcean", "Vultr"]),
            "region" => fake()->randomElement(["fsn1", "nbg1", "sgo1", "lon1"]),
            "status" => "online",
            "os" => "Ubuntu 24.04 LTS",
            "memory" => fake()->randomElement(["4 GB", "8 GB", "16 GB"]),
            "disk" => fake()->randomElement(["80 GB NVMe", "160 GB NVMe", "320 GB NVMe"]),
            "ip_addresses" => [fake()->ipv4(), fake()->ipv4()],
            'sites_count' => fake()->numberBetween(1, 6),
        ];
    }
}
