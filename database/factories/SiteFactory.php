<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Site;
use App\Models\Server;

class SiteFactory extends Factory
{
    protected $model = Site::class;

    public function definition(): array
    {
        return [
            "server_id" => Server::factory(),
            "domain" => fake()->unique()->domainName(),
            "php_version" => fake()->randomElement(["8.1", "8.2", "8.3"]),
            "status" => fake()->randomElement(["running", "stopped"]),
            "last_backup_at" => fake()->optional()->dateTimeBetween("-2 days", "now"),
            "wp_admin_user" => "admin",
            "wp_admin_email" => fake()->unique()->safeEmail(),
        ];
    }
}
