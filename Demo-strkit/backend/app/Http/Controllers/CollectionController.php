<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use Illuminate\Http\Request;

class CollectionController extends Controller
{
    /**
     * Display a listing of the user's collections.
     */
    public function index(Request $request)
    {
        $collections = $request->user()->collections()
            ->with('tools')
            ->withCount('tools')
            ->latest()
            ->get();

        return response()->json($collections);
    }

    /**
     * Store a newly created collection.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'tool_ids' => 'sometimes|array',
            'tool_ids.*' => 'exists:tools,id',
        ]);

        $collection = $request->user()->collections()->create([
            'name' => $validated['name'],
            'is_default' => false,
        ]);

        // Attach tools if provided
        if (isset($validated['tool_ids'])) {
            $collection->tools()->attach($validated['tool_ids']);
        }

        return response()->json($collection->load('tools'), 201);
    }

    /**
     * Display the specified collection.
     */
    public function show(Request $request, $id)
    {
        $collection = $request->user()->collections()
            ->with('tools')
            ->findOrFail($id);

        return response()->json($collection);
    }

    /**
     * Update the specified collection.
     */
    public function update(Request $request, $id)
    {
        $collection = $request->user()->collections()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
        ]);

        $collection->update($validated);

        return response()->json($collection);
    }

    /**
     * Remove the specified collection.
     */
    public function destroy(Request $request, $id)
    {
        $collection = $request->user()->collections()->findOrFail($id);

        // Prevent deletion of default collections
        if ($collection->is_default) {
            return response()->json([
                'message' => 'Cannot delete default collections'
            ], 403);
        }

        $collection->delete();

        return response()->json(['message' => 'Collection deleted successfully']);
    }

    /**
     * Add tools to a collection.
     */
    public function addTools(Request $request, $id)
    {
        $collection = $request->user()->collections()->findOrFail($id);

        $validated = $request->validate([
            'tool_ids' => 'required|array',
            'tool_ids.*' => 'exists:tools,id',
        ]);

        // Only add tools that belong to the user
        $userToolIds = $request->user()->tools()->pluck('id')->toArray();
        $validToolIds = array_intersect($validated['tool_ids'], $userToolIds);

        $collection->tools()->syncWithoutDetaching($validToolIds);

        return response()->json([
            'message' => 'Tools added to collection',
            'collection' => $collection->load('tools')
        ]);
    }

    /**
     * Remove a tool from a collection.
     */
    public function removeTool(Request $request, $collectionId, $toolId)
    {
        $collection = $request->user()->collections()->findOrFail($collectionId);
        $collection->tools()->detach($toolId);

        return response()->json([
            'message' => 'Tool removed from collection'
        ]);
    }
}
