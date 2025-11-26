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
