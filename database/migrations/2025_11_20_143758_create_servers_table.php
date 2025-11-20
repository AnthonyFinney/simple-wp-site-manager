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
        Schema::create('servers', function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->string("host")->unique();
            $table->string("provider")->nullable();
            $table->string("region")->nullable();
            $table->string("status")->default("online");
            $table->string("os")->nullable();
            $table->string("memory")->nullable();
            $table->string("disk")->nullable();
            $table->json("ip_addresses")->nullable();
            $table->unsignedInteger("sites_count")->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('servers');
    }
};
