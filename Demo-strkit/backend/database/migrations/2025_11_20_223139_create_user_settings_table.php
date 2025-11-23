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
        Schema::create('user_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade')->unique();
            $table->string('view_mode')->default('comfortable');
            $table->integer('cards_per_page')->default(12);
            $table->string('default_collection')->default('All');
            $table->boolean('email_notifications')->default(true);
            $table->boolean('tool_updates')->default(true);
            $table->boolean('workshop_reminders')->default(false);
            $table->boolean('weekly_digest')->default(true);
            $table->boolean('public_collections')->default(false);
            $table->boolean('public_profile')->default(true);
            $table->boolean('share_tool_history')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_settings');
    }
};
