<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('servers', function (Blueprint $table) {
            $table->string('ssh_user')->default('root')->after('host');
            $table->unsignedSmallInteger('ssh_port')->default(22)->after('ssh_user');
            $table->enum('ssh_auth_type', ['key', 'password'])->default('key')->after('ssh_port');
            $table->text('ssh_private_key')->nullable()->after('ssh_auth_type');
            $table->text('ssh_password')->nullable()->after('ssh_private_key');
            $table->boolean('requires_sudo')->default(true)->after('ssh_password');
            $table->string('docker_bin_path')->nullable()->after('requires_sudo');
        });

        Schema::table('sites', function (Blueprint $table) {
            $table->string('container_name')->nullable()->after('domain');
            $table->string('project_path')->nullable()->after('container_name');
            $table->string('docker_image')->nullable()->after('project_path');
            $table->string('db_name')->nullable()->after('php_version');
            $table->string('db_user')->nullable()->after('db_name');
            $table->string('db_password')->nullable()->after('db_user');
            $table->string('db_host')->nullable()->after('db_password');
            $table->unsignedSmallInteger('db_port')->nullable()->after('db_host');
            $table->json('env_overrides')->nullable()->after('db_port');
            $table->timestamp('last_health_check_at')->nullable()->after('last_backup_at');
        });
    }

    public function down(): void
    {
        Schema::table('servers', function (Blueprint $table) {
            $table->dropColumn([
                'ssh_user',
                'ssh_port',
                'ssh_auth_type',
                'ssh_private_key',
                'ssh_password',
                'requires_sudo',
                'docker_bin_path',
            ]);
        });

        Schema::table('sites', function (Blueprint $table) {
            $table->dropColumn([
                'container_name',
                'project_path',
                'docker_image',
                'db_name',
                'db_user',
                'db_password',
                'db_host',
                'db_port',
                'env_overrides',
                'last_health_check_at',
            ]);
        });
    }
};
