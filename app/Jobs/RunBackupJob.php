<?php

namespace App\Jobs;

use App\Models\Backup;
use App\Models\Server;
use App\Services\DockerManager;
use App\Services\SshClient;
use Illuminate\Support\Facades\File;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use ZipArchive;

class RunBackupJob implements ShouldQueue
{
    use Queueable, Dispatchable, InteractsWithQueue, SerializesModels;

    protected bool $dryRun;
    protected bool $allowStub;

    public function __construct(public Backup $backup)
    {
        $this->dryRun = (bool) config('services.ssh.dry_run', true);
        $this->allowStub = (bool) config('services.ssh.stub_backups', app()->environment('local'));
    }

    public function handle(SshClient $ssh, DockerManager $docker): void
    {
        $startedAt = now();
        $this->backup->update([
            "status" => "running",
            "started_at" => $startedAt,
        ]);

        $this->backup->loadMissing('site.server');
        $site = $this->backup->site;
        $server = $site?->server;

        if (!$site || !$server) {
            $this->markFailed('Backup requires a site and server.');
            return;
        }

        $disk = Storage::disk('backups');
        $tmpDir = storage_path('app/tmp/backups/' . $this->backup->id . '-' . Str::random(6));
        File::ensureDirectoryExists($tmpDir);

        $manifest = $this->buildManifest();

        if ($this->dryRun && $this->allowStub) {
            $this->createStubArchive($disk, $tmpDir, $manifest, $startedAt, 'SSH dry-run is enabled; generated local stub backup.');
            File::deleteDirectory($tmpDir);
            return;
        }

        try {
            $compose = $docker->dockerComposeCommand($server);
            $composePath = $docker->composePath($site);
            $project = $docker->projectName($site);
            [$dbService, $wpService] = $this->serviceNames($site);
            [$dbName, $dbUser, $dbPassword] = $this->dbCredentials($site);
            $dbNameEsc = $this->escapeForSh($dbName);
            $dbUserEsc = $this->escapeForSh($dbUser);
            $dbPassEsc = $this->escapeForSh($dbPassword);

            $dbDumpBase64 = $this->runRemote(
                $ssh,
                $server,
                $compose,
                $project,
                $composePath,
                $dbService,
                "MYSQL_PWD='{$dbPassEsc}' mysqldump -u'{$dbUserEsc}' '{$dbNameEsc}' | base64"
            );
            $filesBase64 = $this->runRemote(
                $ssh,
                $server,
                $compose,
                $project,
                $composePath,
                $wpService,
                "cd /var/www/html && tar cf - . | base64"
            );

            $dbPath = "{$tmpDir}/database.sql";
            $filesTarPath = "{$tmpDir}/files.tar";
            File::put($dbPath, $this->decodeBase64($dbDumpBase64));
            File::put($filesTarPath, $this->decodeBase64($filesBase64));

            $readmePath = "{$tmpDir}/README.txt";
            File::put($readmePath, "Backup for {$manifest['site']['domain']} on {$manifest['server']['name']}.");

            $manifestPath = "{$tmpDir}/manifest.json";
            File::put($manifestPath, json_encode($manifest, JSON_PRETTY_PRINT));

            $archivePath = "{$tmpDir}/archive.zip";
            $zip = new ZipArchive();
            if ($zip->open($archivePath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
                throw new \RuntimeException('Unable to create backup archive.');
            }

            $zip->addFile($manifestPath, 'manifest.json');
            $zip->addFile($dbPath, 'database.sql');
            $zip->addFile($filesTarPath, 'files.tar');
            $zip->addFile($readmePath, 'README.txt');
            $zip->close();

            $storagePath = "sites/{$this->backup->site_id}/" . $startedAt->format('Ymd_His') . "_{$this->backup->type}.zip";
            $disk->put($storagePath, File::get($archivePath));

            $size = $disk->size($storagePath);
            $dbSize = File::size($dbPath);

            $this->backup->update([
                'status' => 'completed',
                'archive_path' => $storagePath,
                'database_dump_path' => 'database.sql',
                'size' => $size,
                'db_size' => $dbSize,
                'finished_at' => now(),
                'duration_seconds' => $startedAt->diffInSeconds(now()),
                'metadata' => $manifest,
                'log' => 'Backup completed over SSH.',
            ]);

            $this->backup->site->update(['last_backup_at' => now()]);
        } catch (\Throwable $e) {
            if ($this->allowStub) {
                $this->createStubArchive(
                    $disk,
                    $tmpDir,
                    $manifest,
                    $startedAt,
                    'SSH backup failed: ' . Str::limit($e->getMessage(), 500)
                );
            } else {
                $this->markFailed(Str::limit($e->getMessage(), 2000), $startedAt);
            }
        } finally {
            File::deleteDirectory($tmpDir);
        }
    }

    protected function buildManifest(): array
    {
        return [
            'backup_id' => $this->backup->id,
            'site' => [
                'id' => $this->backup->site?->id,
                'domain' => $this->backup->site?->domain,
            ],
            'server' => [
                'id' => $this->backup->server?->id,
                'name' => $this->backup->server?->name,
                'host' => $this->backup->server?->host,
            ],
            'type' => $this->backup->type,
            'generated_at' => now()->toIso8601String(),
        ];
    }

    protected function runRemote(SshClient $ssh, Server $server, string $compose, string $project, string $composePath, string $service, string $innerCommand): string
    {
        $cmd = "{$compose} -p {$project} -f {$composePath} exec -T {$service} sh -c \"{$innerCommand}\"";
        $result = $ssh->run($server, $cmd);

        if (($result['exit_code'] ?? 1) !== 0) {
            throw new \RuntimeException("Remote command failed: {$result['output']}");
        }

        return (string) ($result['output'] ?? '');
    }

    protected function decodeBase64(string $data): string
    {
        $decoded = base64_decode($data, true);
        if ($decoded === false) {
            throw new \RuntimeException('Failed to decode base64 output from server.');
        }

        return $decoded;
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

    protected function markFailed(string $message, ?\DateTimeInterface $startedAt = null): void
    {
        $startedAt = $startedAt ?: $this->backup->started_at ?? now();

        $this->backup->update([
            'status' => 'failed',
            'log' => Str::limit($message, 2000),
            'finished_at' => now(),
            'duration_seconds' => $startedAt->diffInSeconds(now()),
        ]);
    }

    protected function escapeForSh(string $value): string
    {
        return str_replace("'", "'\"'\"'", $value);
    }

    protected function createStubArchive($disk, string $tmpDir, array $manifest, \DateTimeInterface $startedAt, string $note): void
    {
        $stubText = $note . ' Generated at ' . now()->toDateTimeString() . '.';

        $dbPath = "{$tmpDir}/database.sql";
        File::put($dbPath, "-- Stub backup\n-- {$stubText}\n\nCREATE TABLE example (id INT);\n");

        $stubFilesDir = "{$tmpDir}/files";
        File::ensureDirectoryExists($stubFilesDir);
        File::put("{$stubFilesDir}/README.txt", $stubText);
        File::put("{$stubFilesDir}/wp-config.php", "<?php\n// Stub wp-config for {$manifest['site']['domain']}\n");

        $filesTarPath = "{$tmpDir}/files.tar";
        try {
            $tar = new \PharData($filesTarPath);
            $tar->buildFromDirectory($stubFilesDir);
        } catch (\Throwable) {
            File::put($filesTarPath, "Stub files tar not available in this environment.");
        }

        $readmePath = "{$tmpDir}/README.txt";
        File::put($readmePath, $stubText);

        $manifestPath = "{$tmpDir}/manifest.json";
        File::put($manifestPath, json_encode(array_merge($manifest, [
            'mode' => 'stub',
            'note' => $note,
        ]), JSON_PRETTY_PRINT));

        $archivePath = "{$tmpDir}/archive.zip";
        $zip = new ZipArchive();
        if ($zip->open($archivePath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            $this->markFailed('Unable to create local stub backup archive.');
            return;
        }

        $zip->addFile($manifestPath, 'manifest.json');
        $zip->addFile($dbPath, 'database.sql');
        $zip->addFile($filesTarPath, 'files.tar');
        $zip->addFile($readmePath, 'README.txt');
        $zip->close();

        $storagePath = "sites/{$this->backup->site_id}/" . $startedAt->format('Ymd_His') . "_{$this->backup->type}.zip";
        $disk->put($storagePath, File::get($archivePath));

        $size = $disk->size($storagePath);
        $dbSize = File::exists($dbPath) ? File::size($dbPath) : null;

        $this->backup->update([
            'status' => 'completed',
            'archive_path' => $storagePath,
            'database_dump_path' => 'database.sql',
            'size' => $size,
            'db_size' => $dbSize,
            'finished_at' => now(),
            'duration_seconds' => $startedAt->diffInSeconds(now()),
            'metadata' => $manifest,
            'log' => $note,
        ]);

        $this->backup->site?->update(['last_backup_at' => now()]);
    }
}
