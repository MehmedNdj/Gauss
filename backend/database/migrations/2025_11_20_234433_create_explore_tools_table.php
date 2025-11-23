<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('explore_tools', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->integer('rating')->default(5);
            $table->string('version');
            $table->string('image_url')->nullable();
            $table->json('roles'); // Array of roles this tool is suitable for
            $table->string('category')->default('general'); // frontend, backend, design, devops, testing, etc.
            $table->integer('popularity')->default(0); // How many users added this
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('explore_tools');
    }
};
