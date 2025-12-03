<?php

namespace App\Jobs;

use App\Models\Site;
use App\Services\SshClient;
use App\Services\DockerManager;
use App\Services\WordPressDeployer;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

class DeploySiteJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 180;
    public bool $failOnTimeout = true;

    public function __construct(public Site $site)
    {
    }

    public function handle(SshClient $ssh): void
    {
        $this->site->refresh();
        $this->ensureDefaults();

        $deployer = new WordPressDeployer(new DockerManager($ssh));
        $result = null;

        try {
            if ($this->site->status === 'stopped') {
                $deployer->stop($this->site);
                $this->site->update([
                    'status' => 'stopped',
                    'last_health_check_at' => now(),
                ]);
                return;
            }

            $this->site->update(['status' => 'deploying']);
            $result = $deployer->deploy($this->site);

            if (($result['exit_code'] ?? 1) !== 0) {
                throw new \RuntimeException(
                    'Deployment failed with exit code ' . ($result['exit_code'] ?? 'unknown')
                );
            }

            $this->site->update([
                'status' => 'running',
                'last_health_check_at' => now(),
                'metadata->last_deploy_output' => $result['output'] ?? null,
                'metadata->last_deploy_exit_code' => $result['exit_code'] ?? null,
            ]);
        } catch (Throwable $e) {
            Log::error('Site deploy failed', [
                'site_id' => $this->site->id,
                'error' => $e->getMessage(),
                'exit_code' => $result['exit_code'] ?? null,
                'output' => $result['output'] ?? null,
            ]);
            $this->site->update([
                'status' => 'failed',
                'metadata->last_error' => $e->getMessage(),
                'metadata->last_deploy_output' => $result['output'] ?? null,
                'metadata->last_deploy_exit_code' => $result['exit_code'] ?? null,
            ]);
        }
    }

    public function failed(Throwable $e): void
    {
        $this->site->update([
            'status' => 'failed',
            'metadata->last_error' => $e->getMessage(),
        ]);
    }

    protected function ensureDefaults(): void
    {
        $updates = [];

        if (!$this->site->container_name) {
            $updates['container_name'] = 'wp-' . str_replace('.', '-', $this->site->domain);
        }

        if (!$this->site->project_path) {
            $slug = $updates['container_name'] ?? $this->site->container_name ?? 'wp-site';
            $updates['project_path'] = '/opt/' . $slug;
        }

        if (!$this->site->docker_image) {
            $updates['docker_image'] = 'wordpress:php8.2-fpm';
        }

        if (!$this->site->http_port) {
            $updates['http_port'] = min(65535, 8000 + $this->site->id);
        }

        $this->site->update($updates);
        $this->site->refresh();
    }
}
