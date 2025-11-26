<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
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
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('backups');
    }
};
