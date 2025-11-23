<?php

namespace App\Http\Controllers;

use App\Models\Tool;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ToolController extends Controller
{
    /**
     * Display a listing of the user's tools.
     */
    public function index(Request $request)
    {
        $tools = $request->user()->tools()->latest()->get();
        return response()->json($tools);
    }

    /**
     * Store a newly created tool.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'version' => 'required|string|max:50',
            'image_url' => 'nullable|string|max:500',
            'roles' => 'required|array',
            'roles.*' => 'string',
        ]);

        $tool = $request->user()->tools()->create($validated);

        return response()->json($tool, 201);
    }

    /**
     * Display the specified tool.
     */
    public function show(Request $request, $id)
    {
        $tool = $request->user()->tools()->findOrFail($id);
        return response()->json($tool);
    }

    /**
     * Update the specified tool.
     */
    public function update(Request $request, $id)
    {
        $tool = $request->user()->tools()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'rating' => 'sometimes|required|integer|min:1|max:5',
            'version' => 'sometimes|required|string|max:50',
            'image_url' => 'nullable|string|max:500',
            'roles' => 'sometimes|required|array',
            'roles.*' => 'string',
        ]);

        $tool->update($validated);

        return response()->json($tool);
    }

    /**
     * Remove the specified tool.
     */
    public function destroy(Request $request, $id)
    {
        $tool = $request->user()->tools()->findOrFail($id);
        $tool->delete();

        return response()->json(['message' => 'Tool deleted successfully']);
    }
}
