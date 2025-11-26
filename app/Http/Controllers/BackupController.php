<?php

namespace App\Http\Controllers;

use App\Models\Site;
use App\Models\Backup;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Jobs\RunBackupJob;
use Illuminate\Support\Facades\Storage;

class BackupController extends Controller
{
    public function all()
    {
        $backups = Backup::with(['site', 'server'])
            ->orderByDesc('snapshot_at')
            ->orderByDesc('started_at')
            ->latest()
            ->get()
            ->map(fn(Backup $backup) => $this->presentBackup($backup, false));

        return Inertia::render('Backups/Index', [
            'site' => null,
            'backups' => $backups,
        ]);
    }

    public function index(Site $site)
    {
        $backups = $site->backups()
            ->with('server')
            ->orderByDesc('snapshot_at')
            ->orderByDesc('started_at')
            ->latest()
            ->get()
            ->map(fn(Backup $backup) => $this->presentBackup($backup));

        return Inertia::render('Backups/Index', [
            'site' => $site,
            'backups' => $backups,
        ]);
    }

    public function store(Request $request, Site $site)
    {
        $validated = $request->validate([
            'type' => 'sometimes|in:full,files,database',
        ]);

        $backup = $site->backups()->create([
            "server_id" => $site->server_id,
            "name" => "{$site->domain}-" . now()->format('Ymd_His'),
            "type" => $validated['type'] ?? "full",
            "status" => "queued",
            "snapshot_at" => now(),
            "triggered_by" => optional($request->user())->id,
        ]);

        RunBackupJob::dispatch($backup);
        return back()->with("success", "Backup queued and will start shortly.");
    }

    public function destroy(Site $site, Backup $backup)
    {
        abort_unless($backup->site_id === $site->id, 404);
        $this->deleteBackupFiles($backup);
        $backup->delete();
        return back()->with("success", "Backup removed..");
    }

    public function destroyAny(Backup $backup)
    {
        $this->deleteBackupFiles($backup);
        $backup->delete();
        return back()->with("success", "Backup removed..");
    }

    public function destroyFromRequest(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required_without:backup_id|nullable|integer|exists:backups,id',
            'backup_id' => 'required_without:id|nullable|integer|exists:backups,id',
        ]);

        $id = $validated['id'] ?? $validated['backup_id'] ?? null;
        abort_unless($id, 400, 'Backup id is required');

        $backup = Backup::findOrFail($id);

        return $this->destroyAny($backup);
    }

    public function download(Site $site, Backup $backup)
    {
        abort_unless($backup->site_id === $site->id, 404);
        $this->authorize("view", $backup);
        abort_unless($backup->archive_path, 404);
        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk('backups');
        return $disk->download($backup->archive_path);
    }

    protected function deleteBackupFiles(Backup $backup): void
    {
        if (!$backup->archive_path) {
            return;
        }

        $disk = Storage::disk('backups');
        if ($disk->exists($backup->archive_path)) {
            $disk->delete($backup->archive_path);
        }
    }

    protected function presentBackup(Backup $backup, bool $hasSiteContext = true): array
    {
        $backup->loadMissing(['site', 'server']);

        $downloadRoute = $backup->archive_path
            ? route('backups.download', ['site' => $backup->site_id, 'backup' => $backup->id])
            : null;

        $deleteRoute = $hasSiteContext
            ? route('backups.destroy', ['site' => $backup->site_id, 'backup' => $backup->id])
            : route('backups.destroyAny', ['backup' => $backup->id]);

        return array_merge(
            $backup->toArray(),
            [
                'site' => $backup->site,
                'server' => $backup->server,
                'download_url' => $downloadRoute,
                'delete_url' => $deleteRoute,
            ]
        );
    }
}
