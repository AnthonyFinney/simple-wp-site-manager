<?php

namespace Tests\Feature;

use App\Jobs\DeploySiteJob;
use App\Jobs\DestroySiteJob;
use App\Models\Server;
use App\Models\Site;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Tests\TestCase;

class SiteCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_site_create_dispatches_deploy_job(): void
    {
        $this->actingAs(User::factory()->create());
        $server = Server::factory()->create(['host' => '203.0.113.10']);
        Bus::fake();

        $this->get(route('sites.index'))->assertOk();
        $this->get(route('sites.create'))->assertOk();

        $sitePayload = [
            'server_id' => $server->id,
            'domain' => 'example.test',
            'project_path' => '/var/www/example.test',
            'php_version' => '8.2',
            'status' => 'running',
            'http_port' => 8080,
            'wp_admin_user' => 'admin',
            'wp_admin_email' => 'admin@example.test',
        ];

        $response = $this->post(route('sites.store'), $sitePayload);
        $site = Site::where('domain', 'example.test')->first();

        $this->assertNotNull($site);
        $response->assertRedirect(route('sites.show', $site->id));
        $this->assertDatabaseHas('sites', [
            'server_id' => $server->id,
            'domain' => 'example.test',
        ]);
        Bus::assertDispatched(DeploySiteJob::class, fn($job) => $job->site->is($site));
    }

    public function test_site_update_dispatches_deploy_job(): void
    {
        $this->actingAs(User::factory()->create());
        $server = Server::factory()->create(['host' => '203.0.113.11']);
        $site = Site::factory()->for($server)->create([
            'domain' => 'update.example.test',
            'http_port' => 8081,
        ]);
        Bus::fake();

        $this->get(route('sites.edit', $site->id))->assertOk();

        $updateData = [
            'server_id' => $server->id,
            'domain' => 'updated.example.test',
            'project_path' => '/srv/updated',
            'php_version' => '8.1',
            'status' => 'stopped',
            'http_port' => 8082,
            'wp_admin_user' => 'newadmin',
            'wp_admin_email' => 'new-admin@example.test',
        ];

        $response = $this->put(route('sites.update', $site->id), $updateData);

        $response->assertRedirect(route('sites.show', $site->id));
        $this->assertDatabaseHas('sites', [
            'id' => $site->id,
            'domain' => 'updated.example.test',
            'status' => 'stopped',
            'http_port' => 8082,
        ]);
        Bus::assertDispatched(DeploySiteJob::class, fn($job) => $job->site->id === $site->id);
    }

    public function test_site_destroy_dispatches_destroy_job(): void
    {
        $this->actingAs(User::factory()->create());
        $server = Server::factory()->create(['host' => '203.0.113.12']);
        $site = Site::factory()->for($server)->create([
            'domain' => 'delete.example.test',
            'http_port' => 8083,
        ]);
        Bus::fake();

        $response = $this->delete(route('sites.destroy', $site->id));

        $response->assertRedirect(route('sites.index'));
        $this->assertDatabaseHas('sites', ['id' => $site->id, 'status' => 'destroying']);
        Bus::assertDispatched(DestroySiteJob::class, fn($job) => $job->siteId === $site->id);
    }

    public function test_site_destroy_from_request_dispatches_destroy_job(): void
    {
        $this->actingAs(User::factory()->create());
        $server = Server::factory()->create(['host' => '203.0.113.13']);
        $site = Site::factory()->for($server)->create([
            'domain' => 'payload.example.test',
            'http_port' => 8084,
        ]);
        Bus::fake();

        $response = $this->delete(route('sites.destroyFromRequest'), ['id' => $site->id]);

        $response->assertRedirect(route('sites.index'));
        $this->assertDatabaseHas('sites', ['id' => $site->id, 'status' => 'destroying']);
        Bus::assertDispatched(DestroySiteJob::class, fn($job) => $job->siteId === $site->id);
    }
}
