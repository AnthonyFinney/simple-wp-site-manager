<?php

namespace App\Jobs;

use App\Models\Backup;
use App\Services\DockerManager;
use App\Services\SshClient;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use ZipArchive;

class RestoreBackupJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public Backup $backup)
    {
    }

    public function handle(SshClient $ssh, DockerManager $docker): void
    {
        $this->backup->loadMissing('site.server');
        $site = $this->backup->site;
        $server = $site?->server;

        if (!$site || !$server) {
            return;
        }

        if (config('services.ssh.dry_run', true)) {
            $this->backup->update(['log' => 'SSH dry-run is enabled; cannot restore.']);
            return;
        }

        $disk = Storage::disk('backups');
        if (!$this->backup->archive_path || !$disk->exists($this->backup->archive_path)) {
            $this->backup->update(['log' => 'Backup archive not found for restore.']);
            return;
        }

        $tmpDir = storage_path('app/tmp/restore/' . $this->backup->id . '-' . Str::random(6));
        File::ensureDirectoryExists($tmpDir);

        try {
            $localArchive = "{$tmpDir}/archive.zip";
            File::put($localArchive, $disk->get($this->backup->archive_path));

            $zip = new ZipArchive();
            if ($zip->open($localArchive) !== true) {
                throw new \RuntimeException('Unable to open backup archive for restore.');
            }

            $zip->extractTo($tmpDir);
            $zip->close();

            $dbPath = "{$tmpDir}/database.sql";
            $filesTar = "{$tmpDir}/files.tar";

            if (!File::exists($dbPath) || !File::exists($filesTar)) {
                throw new \RuntimeException('Backup archive missing database.sql or files.tar');
            }

            [$dbService, $wpService] = $this->serviceNames($site);
            [$dbName, $dbUser, $dbPassword] = $this->dbCredentials($site);
            $dbNameEsc = $this->escapeForSh($dbName);
            $dbUserEsc = $this->escapeForSh($dbUser);
            $dbPassEsc = $this->escapeForSh($dbPassword);
            $compose = $docker->dockerComposeCommand($server);
            $composePath = $docker->composePath($site);
            $project = $docker->projectName($site);

            // Restore database
            $dbPayload = base64_encode(File::get($dbPath));
            $dbCmd = "echo '{$dbPayload}' | base64 -d | {$compose} -p {$project} -f {$composePath} exec -T {$dbService} sh -c \"MYSQL_PWD='{$dbPassEsc}' mysql -u'{$dbUserEsc}' '{$dbNameEsc}'\"";
            $dbResult = $ssh->run($server, $dbCmd);
            if (($dbResult['exit_code'] ?? 1) !== 0) {
                throw new \RuntimeException("Database restore failed: {$dbResult['output']}");
            }

            // Restore files
            $filesPayload = base64_encode(File::get($filesTar));
            $filesCmd = "echo '{$filesPayload}' | base64 -d | {$compose} -p {$project} -f {$composePath} exec -T {$wpService} sh -c \"rm -rf /var/www/html/* && tar xf - -C /var/www/html\"";
            $filesResult = $ssh->run($server, $filesCmd);
            if (($filesResult['exit_code'] ?? 1) !== 0) {
                throw new \RuntimeException("File restore failed: {$filesResult['output']}");
            }

            $this->backup->update([
                'status' => 'completed',
                'log' => 'Restore finished at ' . now()->toDateTimeString(),
            ]);
        } finally {
            File::deleteDirectory($tmpDir);
        }
    }

    protected function serviceNames($site): array
    {
        $container = $site->container_name ?? 'wp-site';
        $dbService = "db-{$container}";

        return [$dbService, $container];
    }

    protected function dbCredentials($site): array
    {
        $dbName = $site->db_name ?? 'wordpress';
        $dbUser = $site->db_user ?? 'wp_user';
        $dbPassword = $site->db_password ?? 'change-me';

        return [$dbName, $dbUser, $dbPassword];
    }

    protected function escapeForSh(string $value): string
    {
        return str_replace("'", "'\"'\"'", $value);
    }
}
