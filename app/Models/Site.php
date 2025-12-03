<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Site extends Model
{
    use HasFactory;

    protected $fillable = [
        "domain",
        "server_id",
        "container_name",
        "project_path",
        "docker_image",
        "php_version",
        "status",
        "http_port",
        "last_backup_at",
        "last_health_check_at",
        "env_overrides",
        "db_name",
        "db_user",
        "db_password",
        "db_host",
        "db_port",
        "wp_admin_user",
        "wp_admin_email",
        "metadata",
    ];

    protected $casts = [
        'last_backup_at' => 'datetime',
        'last_health_check_at' => 'datetime',
        'env_overrides' => 'array',
        'db_port' => 'integer',
        'http_port' => 'integer',
        'db_password' => 'encrypted',
        'metadata' => 'array',
    ];

    public function server()
    {
        return $this->belongsTo(Server::class);
    }

    public function backups()
    {
        return $this->hasMany(Backup::class);
    }

    protected static function booted(): void
    {
        static::created(function (Site $site) {
            $site->refreshServerSiteCount($site->server_id);
        });

        static::updated(function (Site $site) {
            if ($site->wasChanged('server_id')) {
                $site->refreshServerSiteCount($site->getOriginal('server_id'));
                $site->refreshServerSiteCount($site->server_id);
            }
        });

        static::deleted(function (Site $site) {
            $site->refreshServerSiteCount($site->server_id);
        });
    }

    protected function refreshServerSiteCount(?int $serverId): void
    {
        if (!$serverId) {
            return;
        }

        $count = static::where('server_id', $serverId)->count();
        Server::where('id', $serverId)->update(['sites_count' => $count]);
    }
}
