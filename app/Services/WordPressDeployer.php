<?php

namespace App\Services;

use App\Models\Site;

class WordPressDeployer
{
    public function __construct(protected DockerManager $docker)
    {
    }

    public function buildCompose(Site $site): string
    {
        $dbName = $site->db_name ?? 'wordpress';
        $dbUser = $site->db_user ?? 'wp_user';
        $dbPassword = $site->db_password ?? 'change-me';
        $container = $site->container_name ?? 'wp-site';
        $dbService = "db-{$container}";
        $dbHost = $site->db_host ?: $dbService;
        $dbPort = $site->db_port ?? 3306;
        $image = $site->docker_image ?: 'wordpress:php8.2-fpm';
        $domain = $site->domain ?? 'example.test';
        $hostPort = $site->http_port ?? 80;
        $extraEnv = $this->renderEnvOverrides($site->env_overrides);

        $lines = [
            "version: '3.8'",
            'services:',
            "  {$dbService}:",
            '    image: mysql:8.0',
            '    restart: unless-stopped',
            '    environment:',
            "      MYSQL_DATABASE: {$dbName}",
            "      MYSQL_USER: {$dbUser}",
            "      MYSQL_PASSWORD: {$dbPassword}",
            "      MYSQL_ROOT_PASSWORD: {$dbPassword}",
            '    volumes:',
            "      - db-{$container}-data:/var/lib/mysql",
            '',
            "  {$container}:",
            "    image: {$image}",
            "    depends_on:",
            "      - {$dbService}",
            '    restart: unless-stopped',
            '    environment:',
            "      WORDPRESS_DB_HOST: {$dbHost}:{$dbPort}",
            "      WORDPRESS_DB_NAME: {$dbName}",
            "      WORDPRESS_DB_USER: {$dbUser}",
            "      WORDPRESS_DB_PASSWORD: {$dbPassword}",
            '      WORDPRESS_CONFIG_EXTRA: |',
            "        define('WP_CACHE', true);",
            "        define('WP_ENVIRONMENT_TYPE', 'production');",
            "        define('WP_HOME', 'https://{$domain}');",
            "        define('WP_SITEURL', 'https://{$domain}');{$extraEnv}",
            '    ports:',
            "      - \"{$hostPort}:80\"",
            '    volumes:',
            "      - wp-{$container}-data:/var/www/html",
            '',
            'volumes:',
            "  wp-{$container}-data:",
            "  db-{$container}-data:",
        ];

        return implode("\n", $lines);
    }

    public function deploy(Site $site): array
    {
        $compose = $this->buildCompose($site);
        return $this->docker->deploy($site, $compose);
    }

    public function start(Site $site): array
    {
        return $this->docker->start($site);
    }

    public function stop(Site $site): array
    {
        return $this->docker->stop($site);
    }

    public function destroy(Site $site): array
    {
        return $this->docker->destroy($site);
    }

    protected function renderEnvOverrides(?array $overrides): string
    {
        if (empty($overrides)) {
            return '';
        }

        $lines = [];
        foreach ($overrides as $key => $value) {
            if ($value === null) {
                continue;
            }

            if (is_bool($value)) {
                $value = $value ? 'true' : 'false';
            }

            $sanitized = str_replace(["\r", "\n"], ' ', (string) $value);
            // 6 spaces so it aligns under the environment block.
            $lines[] = "      {$key}: {$sanitized}";
        }

        // Prepend newline to continue under the existing environment keys.
        return "\n" . implode("\n", $lines);
    }
}
