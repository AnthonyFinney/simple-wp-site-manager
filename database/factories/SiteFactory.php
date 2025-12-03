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
        $domain = fake()->unique()->domainName();
        return [
            "server_id" => Server::factory(),
            "domain" => $domain,
            "http_port" => fake()->unique()->numberBetween(8080, 9099),
            "container_name" => "wp-" . str_replace('.', '-', $domain),
            "project_path" => "/var/www/{$domain}",
            "docker_image" => "wordpress:php8.2-fpm",
            "php_version" => fake()->randomElement(["8.1", "8.2", "8.3"]),
            "status" => fake()->randomElement(["running", "stopped", "deploying"]),
            "env_overrides" => [
                'WORDPRESS_ENV' => 'production',
            ],
            "db_name" => str_replace('.', '_', $domain),
            "db_user" => "wp_" . fake()->userName(),
            "db_password" => "secret-" . fake()->bothify('??##'),
            "db_host" => "127.0.0.1",
            "db_port" => 3306,
            "last_backup_at" => fake()->optional()->dateTimeBetween("-2 days", "now"),
            "last_health_check_at" => fake()->optional()->dateTimeBetween("-1 hour", "now"),
            "wp_admin_user" => "admin",
            "wp_admin_email" => fake()->unique()->safeEmail(),
        ];
    }
}
