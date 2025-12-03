<?php

namespace Database\Factories;

use App\Models\Backup;
use App\Models\Server;
use App\Models\Site;
use Illuminate\Database\Eloquent\Factories\Factory;

class BackupFactory extends Factory
{
    protected $model = Backup::class;

    public function definition(): array
    {
        return [
            'site_id' => Site::factory(),
            'server_id' => Server::factory(),
            'name' => 'backup-' . $this->faker->unique()->lexify('??????'),
            'type' => 'full',
            'status' => 'queued',
            'archive_path' => null,
            'database_dump_path' => null,
            'size' => null,
            'db_size' => null,
            'snapshot_at' => now(),
            'started_at' => null,
            'finished_at' => null,
            'duration_seconds' => null,
            'metadata' => null,
            'log' => null,
            'triggered_by' => null,
        ];
    }
}
