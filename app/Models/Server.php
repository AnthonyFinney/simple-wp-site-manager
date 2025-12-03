<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Server extends Model
{
    use HasFactory;

    protected $fillable = [
        "name",
        "host",
        "ssh_user",
        "ssh_port",
        "ssh_auth_type",
        "ssh_private_key",
        "ssh_password",
        "requires_sudo",
        "docker_bin_path",
        "provider",
        "region",
        "status",
        "os",
        "memory",
        "disk",
        "ip_addresses",
        "sites_count",
    ];

    protected $casts = [
        "ip_addresses" => "array",
        "ssh_port" => "integer",
        "requires_sudo" => "boolean",
        "ssh_private_key" => "encrypted",
        "ssh_password" => "encrypted",
    ];

    public function sites()
    {
        return $this->hasMany(Site::class);
    }

    public function backups()
    {
        return $this->hasMany(Backup::class);
    }
}
