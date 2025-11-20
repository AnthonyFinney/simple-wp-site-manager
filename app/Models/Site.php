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
        "php_version",
        "status",
        "last_backup_at",
        "wp_admin_user",
        "wp_admin_email",
    ];

    protected $casts = ['last_backup_at' => 'datetime'];

    public function server()
    {
        return $this->belongsTo(Server::class);
    }
}
