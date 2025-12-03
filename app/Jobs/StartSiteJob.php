<?php

namespace App\Jobs;

use App\Models\Site;
use App\Services\SshClient;
use App\Services\DockerManager;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class StartSiteJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public Site $site)
    {
    }

    public function handle(SshClient $ssh): void
    {
        $manager = new DockerManager($ssh);

        try {
            $manager->start($this->site);
            $this->site->update([
                'status' => 'running',
                'last_health_check_at' => now(),
            ]);
        } catch (\Throwable $e) {
            Log::error('Start site failed', [
                'site_id' => $this->site->id,
                'error' => $e->getMessage(),
            ]);
            $this->site->update(['status' => 'failed']);
        }
    }
}
