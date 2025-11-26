<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Backup;

class BackupPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }

    public function view(User $user, Backup $backup): bool
    {
        return $backup->triggered_by === $user->id || $backup->triggered_by === null;
    }
}
