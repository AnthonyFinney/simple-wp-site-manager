<?php

namespace App\Jobs;

use App\Models\Site;
use App\Services\SshClient;
use App\Services\DockerManager;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class DestroySiteJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable;

    public function __construct(public int $siteId)
    {
    }

    public function handle(SshClient $ssh): void
    {
        $site = Site::find($this->siteId);

        if (!$site) {
            Log::warning('Destroy site skipped; site missing', ['site_id' => $this->siteId]);
            return;
        }

        $manager = new DockerManager($ssh);

        try {
            $manager->destroy($site);
            $site->delete();
        } catch (\Throwable $e) {
            Log::error('Destroy site failed', [
                'site_id' => $site->id,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }
}
