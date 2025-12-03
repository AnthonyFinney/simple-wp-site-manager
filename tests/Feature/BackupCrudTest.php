<?php

namespace Tests\Feature;

use App\Jobs\RunBackupJob;
use App\Models\Backup;
use App\Models\Server;
use App\Models\Site;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class BackupCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_backup_store_queues_job(): void
    {
        $this->actingAs(User::factory()->create());
        $server = Server::factory()->create();
        $site = Site::factory()->for($server)->create([
            'http_port' => 8080,
            'domain' => 'backup-store.test',
        ]);
        Bus::fake();

        $response = $this->post(route('backups.store', ['site' => $site->id]), [
            'type' => 'files',
        ]);

        $response->assertRedirect();
        $backup = Backup::where('site_id', $site->id)->first();
        $this->assertNotNull($backup);
        $this->assertDatabaseHas('backups', [
            'site_id' => $site->id,
            'server_id' => $server->id,
            'type' => 'files',
        ]);
        Bus::assertDispatched(RunBackupJob::class, fn($job) => $job->backup->is($backup));
    }

    public function test_backup_can_be_deleted_for_site(): void
    {
        $this->actingAs(User::factory()->create());
        Storage::fake('backups');
        $site = Site::factory()->create([
            'http_port' => 8081,
            'domain' => 'delete-site-backup.test',
        ]);
        $path = "sites/{$site->id}/backup.zip";
        Storage::disk('backups')->put($path, 'zipcontent');
        $backup = Backup::factory()->create([
            'site_id' => $site->id,
            'server_id' => $site->server_id,
            'archive_path' => $path,
        ]);

        $response = $this->delete(route('backups.destroy', ['site' => $site->id, 'backup' => $backup->id]));

        $response->assertRedirect();
        $this->assertDatabaseMissing('backups', ['id' => $backup->id]);
        Storage::disk('backups')->assertMissing($path);
    }

    public function test_backup_can_be_deleted_globally(): void
    {
        $this->actingAs(User::factory()->create());
        Storage::fake('backups');
        $site = Site::factory()->create([
            'http_port' => 8082,
            'domain' => 'delete-any-backup.test',
        ]);
        $path = "sites/{$site->id}/backup-any.zip";
        Storage::disk('backups')->put($path, 'zipcontent');
        $backup = Backup::factory()->create([
            'site_id' => $site->id,
            'server_id' => $site->server_id,
            'archive_path' => $path,
        ]);

        $response = $this->delete(route('backups.destroyAny', ['backup' => $backup->id]));

        $response->assertRedirect();
        $this->assertDatabaseMissing('backups', ['id' => $backup->id]);
        Storage::disk('backups')->assertMissing($path);
    }

    public function test_backup_can_be_deleted_from_payload(): void
    {
        $this->actingAs(User::factory()->create());
        Storage::fake('backups');
        $site = Site::factory()->create([
            'http_port' => 8083,
            'domain' => 'delete-payload-backup.test',
        ]);
        $path = "sites/{$site->id}/backup-payload.zip";
        Storage::disk('backups')->put($path, 'zipcontent');
        $backup = Backup::factory()->create([
            'site_id' => $site->id,
            'server_id' => $site->server_id,
            'archive_path' => $path,
        ]);

        $response = $this->delete(route('backups.destroyFromRequest'), ['id' => $backup->id]);

        $response->assertRedirect();
        $this->assertDatabaseMissing('backups', ['id' => $backup->id]);
        Storage::disk('backups')->assertMissing($path);
    }
}
