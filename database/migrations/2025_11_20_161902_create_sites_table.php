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
        Schema::create('sites', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string("domain")->unique();
            $table->foreignId("server_id")->constrained()->cascadeOnDelete();
            $table->string("php_version")->nullable();
            $table->string("status")->default("running");
            $table->timestamp("last_backup_at")->nullable();
            $table->string("wp_admin_user")->nullable();
            $table->string("wp_admin_email")->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sites');
    }
};
