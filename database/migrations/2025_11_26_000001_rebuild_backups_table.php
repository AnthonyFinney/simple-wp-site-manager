<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('backups')) {
            return;
        }

        // If the table is already in the new shape, skip.
        if (Schema::hasColumn('backups', 'name') && Schema::hasColumn('backups', 'archive_path')) {
            return;
        }

        Schema::rename('backups', 'backups_old');

        Schema::create('backups', function (Blueprint $table) {
            $table->id();
            $table->foreignId("site_id")->constrained()->cascadeOnDelete();
            $table->foreignId("server_id")->constrained()->cascadeOnDelete();
            $table->string("name");
            $table->enum("type", ["full", "files", "database"])->default("full");
            $table->enum("status", ["queued", "running", "completed", "failed"])->default("queued");
            $table->string("archive_path")->nullable();
            $table->string("database_dump_path")->nullable();
            $table->unsignedBigInteger("size")->nullable();
            $table->unsignedBigInteger("db_size")->nullable();
            $table->timestamp('snapshot_at')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('finished_at')->nullable();
            $table->unsignedInteger('duration_seconds')->nullable();
            $table->json('metadata')->nullable();
            $table->text("log")->nullable();
            $table->foreignId("triggered_by")->nullable()->constrained("users")->nullOnDelete();
            $table->timestamps();
        });

        $oldRows = DB::table('backups_old')->get();

        foreach ($oldRows as $row) {
            $status = match ($row->status ?? 'pending') {
                'pending' => 'queued',
                'running' => 'running',
                'success' => 'completed',
                default => 'failed',
            };

            $snapshotAt = $row->started_at ?? $row->created_at;
            $name = $row->storage_path
                ? basename($row->storage_path, '.zip')
                : 'backup-' . ($row->id ?? uniqid());

            DB::table('backups')->insert([
                'id' => $row->id,
                'site_id' => $row->site_id,
                'server_id' => $row->server_id,
                'name' => $name,
                'type' => $row->type ?? 'full',
                'status' => $status,
                'archive_path' => $row->storage_path ?? null,
                'database_dump_path' => null,
                'size' => $row->size ?? null,
                'db_size' => null,
                'snapshot_at' => $snapshotAt,
                'started_at' => $row->started_at,
                'finished_at' => $row->finished_at,
                'duration_seconds' => null,
                'metadata' => null,
                'log' => $row->log ?? null,
                'triggered_by' => $row->triggered_by ?? null,
                'created_at' => $row->created_at ?? now(),
                'updated_at' => $row->updated_at ?? now(),
            ]);
        }

        Schema::drop('backups_old');
    }

    public function down(): void
    {
        // Intentionally left simple: drop the rebuilt table if it exists.
        if (Schema::hasTable('backups')) {
            Schema::drop('backups');
        }

        if (Schema::hasTable('backups_old')) {
            Schema::rename('backups_old', 'backups');
        }
    }
};
