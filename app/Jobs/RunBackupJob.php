<?php

namespace App\Jobs;

use App\Models\Backup;
use Illuminate\Support\Facades\File;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class RunBackupJob implements ShouldQueue
{
    use Queueable, Dispatchable, InteractsWithQueue, SerializesModels;

    public function __construct(public Backup $backup)
    {
    }

    public function handle(): void
    {
        $startedAt = now();
        $this->backup->update([
            "status" => "running",
            "started_at" => $startedAt,
        ]);

        $disk = Storage::disk('backups');
        $tmpDir = storage_path('app/tmp/backups/' . $this->backup->id . '-' . Str::random(6));
        File::ensureDirectoryExists($tmpDir);

        try {
            $manifest = $this->buildManifest();
            $paths = $this->writeBackupArtifacts($tmpDir, $manifest);
            $archivePath = $this->compressArtifacts($tmpDir, $paths['files']);

            $storagePath = "sites/{$this->backup->site_id}/" . $startedAt->format('Ymd_His') . "_{$this->backup->type}.zip";
            $disk->put($storagePath, File::get($archivePath));

            $size = $disk->size($storagePath);
            $dbSize = File::exists($paths['database']) ? File::size($paths['database']) : null;

            $this->backup->update([
                'status' => 'completed',
                'archive_path' => $storagePath,
                'database_dump_path' => 'database.sql',
                'size' => $size,
                'db_size' => $dbSize,
                'finished_at' => now(),
                'duration_seconds' => $startedAt->diffInSeconds(now()),
                'metadata' => $manifest,
            ]);

            if ($this->backup->site) {
                $this->backup->site->update(['last_backup_at' => now()]);
            }
        } catch (\Throwable $e) {
            $this->backup->update([
                'status' => 'failed',
                'log' => Str::limit($e->getMessage(), 2000),
                'finished_at' => now(),
                'duration_seconds' => $startedAt->diffInSeconds(now()),
            ]);
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

    protected function writeBackupArtifacts(string $tmpDir, array $manifest): array
    {
        File::ensureDirectoryExists("{$tmpDir}/files");

        $manifestPath = "{$tmpDir}/manifest.json";
        $databasePath = "{$tmpDir}/database.sql";
        $readmePath = "{$tmpDir}/files/README.txt";

        File::put($manifestPath, json_encode($manifest, JSON_PRETTY_PRINT));
        File::put($databasePath, $this->fakeDatabaseDump($manifest));
        File::put($readmePath, "Backup for {$manifest['site']['domain']} on {$manifest['server']['name']}.");

        return [
            'manifest' => $manifestPath,
            'database' => $databasePath,
            'files' => [
                $manifestPath,
                $databasePath,
                $readmePath,
            ],
        ];
    }

    protected function compressArtifacts(string $tmpDir, array $files): string
    {
        $zipPath = "{$tmpDir}/archive.zip";
        $zip = new \ZipArchive();
        $zip->open($zipPath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE);

        foreach ($files as $file) {
            $localName = str_replace($tmpDir . '/', '', $file);
            $zip->addFile($file, $localName);
        }

        $zip->close();

        return $zipPath;
    }

    protected function fakeDatabaseDump(array $manifest): string
    {
        $site = $manifest['site']['domain'] ?? 'unknown-site.test';
        $server = $manifest['server']['name'] ?? 'unknown-server';
        $timestamp = now()->toDateTimeString();

        return "-- Database snapshot for {$site} @ {$server}\n" .
            "-- Generated {$timestamp}\n\n" .
            "CREATE DATABASE IF NOT EXISTS `{$site}`;\n" .
            "USE `{$site}`;\n" .
            "-- ... data would be here ...\n";
    }
}
