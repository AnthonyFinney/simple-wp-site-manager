<?php

namespace Tests\Feature;

use App\Models\Server;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServerCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_server_create_update_and_delete_flow(): void
    {
        $this->actingAs(User::factory()->create());

        $serverData = Server::factory()->raw([
            'host' => '198.51.100.10',
            'ssh_private_key' => 'test-private-key',
            'ssh_password' => null,
        ]);

        $this->get(route('servers.index'))->assertOk();
        $this->get(route('servers.create'))->assertOk();

        $response = $this->post(route('servers.store'), $serverData);
        $server = Server::where('host', $serverData['host'])->first();

        $this->assertNotNull($server);
        $response->assertRedirect(route('servers.show', $server->id));
        $this->assertDatabaseHas('servers', [
            'host' => $serverData['host'],
            'name' => $serverData['name'],
        ]);

        $this->get(route('servers.show', $server->id))->assertOk();
        $this->get(route('servers.edit', $server->id))->assertOk();

        $updatedData = [
            'name' => 'Updated Server',
            'host' => '198.51.100.11',
            'provider' => 'Hetzner',
            'region' => 'fsn1',
            'status' => 'maintenance',
            'os' => 'Ubuntu 24.04',
            'memory' => '16 GB',
            'disk' => '320 GB NVMe',
            'ip_addresses' => ['198.51.100.11'],
            'ssh_user' => 'forge',
            'ssh_port' => 22,
            'ssh_auth_type' => 'key',
            'ssh_private_key' => 'updated-private-key',
            'ssh_password' => null,
            'requires_sudo' => true,
            'docker_bin_path' => '/usr/bin/docker',
        ];

        $response = $this->put(route('servers.update', $server->id), $updatedData);

        $response->assertRedirect(route('servers.show', $server->id));
        $this->assertDatabaseHas('servers', [
            'id' => $server->id,
            'name' => 'Updated Server',
            'host' => '198.51.100.11',
            'status' => 'maintenance',
        ]);

        $response = $this->delete(route('servers.destroy', $server->id));

        $response->assertRedirect(route('servers.index'));
        $this->assertDatabaseMissing('servers', ['id' => $server->id]);
    }

    public function test_server_can_be_destroyed_from_payload(): void
    {
        $this->actingAs(User::factory()->create());
        $server = Server::factory()->create(['host' => '198.51.100.12']);

        $response = $this->delete(route('servers.destroyByPayload'), ['id' => $server->id]);

        $response->assertRedirect(route('servers.index'));
        $this->assertDatabaseMissing('servers', ['id' => $server->id]);
    }
}
