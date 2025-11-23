<?php

namespace App\Http\Controllers;

use App\Models\ExploreTool;
use App\Models\UserSettings;
use Illuminate\Http\Request;

class ExploreController extends Controller
{
    /**
     * Get personalized tool suggestions based on user's role
     * Returns 80% tools matching user's role + 20% random tools
     */
    public function personalized(Request $request)
    {
        $user = $request->user();

        // Get user's role from settings
        $settings = UserSettings::where('user_id', $user->id)->first();
        $userRole = $settings->role ?? 'frontend'; // Default to frontend if not set

        // Get total number of tools to return (let's say 40 tools total)
        $totalTools = 40;
        $matchingToolsCount = (int)($totalTools * 0.8); // 80% = 32 tools
        $randomToolsCount = $totalTools - $matchingToolsCount; // 20% = 8 tools

        // Get tools that match user's role
        $matchingTools = ExploreTool::whereJsonContains('roles', $userRole)
            ->inRandomOrder()
            ->limit($matchingToolsCount)
            ->get();

        // Get random tools (excluding already selected ones)
        $randomTools = ExploreTool::whereNotIn('id', $matchingTools->pluck('id'))
            ->inRandomOrder()
            ->limit($randomToolsCount)
            ->get();

        // Combine and shuffle
        $tools = $matchingTools->concat($randomTools)->shuffle();

        return response()->json($tools);
    }

    /**
     * Get all explore tools
     */
    public function all(Request $request)
    {
        $tools = ExploreTool::orderBy('popularity', 'desc')
            ->orderBy('rating', 'desc')
            ->get();

        return response()->json($tools);
    }
}
