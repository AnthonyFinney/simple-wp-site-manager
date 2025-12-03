<?php

namespace App\Jobs;

use App\Models\Site;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class RefreshSiteStatusJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public Site $site, public string $status, public ?string $checkedAt = null)
    {
    }

    public function handle(): void
    {
        $normalized = strtolower($this->status);
        $mapped = in_array($normalized, ['running', 'stopped', 'deploying', 'failed'])
            ? $normalized
            : 'failed';

        $checkedAt = $this->checkedAt
            ? \Carbon\Carbon::parse($this->checkedAt)
            : now();

        $this->site->update([
            'status' => $mapped,
            'last_health_check_at' => $checkedAt,
        ]);

        Log::info('Site status updated from monitor', [
            'site_id' => $this->site->id,
            'status' => $mapped,
            'checked_at' => $checkedAt,
        ]);
    }
}
