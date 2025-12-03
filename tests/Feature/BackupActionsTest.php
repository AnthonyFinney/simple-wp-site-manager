<?php

namespace Tests\Feature;

use App\Jobs\RestoreBackupJob;
use App\Jobs\RunBackupJob;
use App\Models\Backup;
use App\Models\Server;
use App\Models\Site;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Tests\TestCase;

class BackupActionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_dispatches_backup_job(): void
    {
        $this->seed();
        $this->actingAs(User::first() ?? User::factory()->create());
        Bus::fake();

        $server = Server::first();
        $site = Site::factory()->for($server)->create();

        $response = $this->post("/sites/{$site->id}/backups");

        $response->assertRedirect();
        Bus::assertDispatched(RunBackupJob::class);
    }

    public function test_it_dispatches_restore_job(): void
    {
        $this->seed();
        $this->actingAs(User::first() ?? User::factory()->create());
        Bus::fake();

        $server = Server::first();
        $site = Site::factory()->for($server)->create();
        $backup = Backup::factory()->for($site)->for($server)->create([
            'archive_path' => 'sites/' . $site->id . '/dummy.zip',
        ]);

        $response = $this->post("/sites/{$site->id}/backups/{$backup->id}/restore");

        $response->assertRedirect();
        Bus::assertDispatched(RestoreBackupJob::class);
    }
}
