<?php

namespace App\Services;

use App\Models\Site;
use App\Models\Server;

class DockerManager
{
    public function __construct(protected SshClient $ssh)
    {
    }

    public function deploy(Site $site, string $composeContent): array
    {
        $server = $site->server ?? Server::findOrFail($site->server_id);
        $compose = $this->dockerComposeCommand($server);
        $projectDir = dirname($this->composePath($site));
        $projectName = $this->projectName($site);
        $composePath = $this->composePath($site);

        $cmd = "mkdir -p {$projectDir}\n"
            . "cat > {$composePath} <<'EOF'\n{$composeContent}\nEOF\n"
            . "{$compose} -p {$projectName} -f {$composePath} up -d --remove-orphans";

        return $this->ssh->run($server, $cmd);
    }

    public function start(Site $site): array
    {
        $server = $site->server ?? Server::findOrFail($site->server_id);
        $compose = $this->dockerComposeCommand($server);
        $composePath = $this->composePath($site);
        $projectName = $this->projectName($site);

        return $this->ssh->run($server, "{$compose} -p {$projectName} -f {$composePath} start");
    }

    public function stop(Site $site): array
    {
        $server = $site->server ?? Server::findOrFail($site->server_id);
        $compose = $this->dockerComposeCommand($server);
        $composePath = $this->composePath($site);
        $projectName = $this->projectName($site);

        return $this->ssh->run($server, "{$compose} -p {$projectName} -f {$composePath} stop");
    }

    public function destroy(Site $site): array
    {
        $server = $site->server ?? Server::findOrFail($site->server_id);
        $compose = $this->dockerComposeCommand($server);
        $composePath = $this->composePath($site);
        $projectName = $this->projectName($site);

        $cmd = "{$compose} -p {$projectName} -f {$composePath} down --remove-orphans --volumes";

        return $this->ssh->run($server, $cmd);
    }

    public function composePath(Site $site): string
    {
        $path = $site->project_path ?: "/opt/{$site->container_name}";
        return rtrim($path, '/') . '/docker-compose.yml';
    }

    public function dockerCommand(Server $server): string
    {
        $binary = $server->docker_bin_path ?: 'docker';
        $prefix = $server->requires_sudo ? 'sudo ' : '';

        return $prefix . $binary;
    }

    public function dockerComposeCommand(Server $server): string
    {
        $docker = $this->dockerCommand($server);
        return $docker . ' compose';
    }

    public function projectName(Site $site): string
    {
        $slug = $site->container_name ?: 'wp-site';
        return str_replace(['.', ' '], '-', strtolower($slug));
    }
}
