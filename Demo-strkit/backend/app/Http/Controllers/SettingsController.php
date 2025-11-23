<?php

namespace App\Http\Controllers;

use App\Models\UserSettings;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    /**
     * Get user settings (or create default if not exists).
     */
    public function show(Request $request)
    {
        $settings = $request->user()->settings;

        // Create default settings if they don't exist
        if (!$settings) {
            $settings = $request->user()->settings()->create([]);
        }

        return response()->json($settings);
    }

    /**
     * Update user settings.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'view_mode' => 'sometimes|string|in:compact,comfortable,spacious',
            'cards_per_page' => 'sometimes|integer|in:6,12,24,48',
            'default_collection' => 'sometimes|string|max:255',
            'email_notifications' => 'sometimes|boolean',
            'tool_updates' => 'sometimes|boolean',
            'workshop_reminders' => 'sometimes|boolean',
            'weekly_digest' => 'sometimes|boolean',
            'public_collections' => 'sometimes|boolean',
            'public_profile' => 'sometimes|boolean',
            'share_tool_history' => 'sometimes|boolean',
        ]);

        $settings = $request->user()->settings;

        if (!$settings) {
            $settings = $request->user()->settings()->create($validated);
        } else {
            $settings->update($validated);
        }

        return response()->json($settings);
    }
}
