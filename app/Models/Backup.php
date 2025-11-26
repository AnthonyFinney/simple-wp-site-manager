<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Backup extends Model
{
    protected $fillable = [
        "site_id",
        "server_id",
        "name",
        "type",
        "status",
        "archive_path",
        "database_dump_path",
        "size",
        "db_size",
        "snapshot_at",
        "started_at",
        "finished_at",
        "duration_seconds",
        "log",
        "metadata",
        "triggered_by"
    ];

    protected $casts = [
        "snapshot_at" => "datetime",
        "started_at" => "datetime",
        "finished_at" => "datetime",
        "metadata" => "array",
    ];

    public function site()
    {
        return $this->belongsTo(Site::class);
    }

    public function server()
    {
        return $this->belongsTo(Server::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, "triggered_by");
    }
}
