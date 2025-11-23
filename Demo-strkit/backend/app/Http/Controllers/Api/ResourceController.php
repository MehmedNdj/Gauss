<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ResourceController extends Controller
{
    /**
     * Display a listing of the resources.
     */
    public function index(Request $request)
    {
        $query = Resource::with(['user', 'categories', 'tags', 'ratings'])
            ->where('status', 'published');

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('category')) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        if ($request->has('tag')) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->where('slug', $request->tag);
            });
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $resources = $query->latest()->paginate(12);

        return response()->json($resources);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|in:tool,library,app,documentation,article,other',
            'url' => 'nullable|url',
            'repository_url' => 'nullable|url',
            'image_url' => 'nullable|url',
            'status' => 'in:draft,published,archived',
            'categories' => 'array',
            'categories.*' => 'exists:categories,id',
            'tags' => 'array',
            'tags.*' => 'exists:tags,id',
        ]);

        $validated['slug'] = Str::slug($validated['title']);
        $validated['user_id'] = $request->user()->id ?? 1;

        $resource = Resource::create($validated);

        if (isset($validated['categories'])) {
            $resource->categories()->sync($validated['categories']);
        }

        if (isset($validated['tags'])) {
            $resource->tags()->sync($validated['tags']);
        }

        return response()->json($resource->load(['user', 'categories', 'tags']), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        $resource = Resource::with(['user', 'categories', 'tags', 'comments.user', 'ratings'])
            ->where('slug', $slug)
            ->firstOrFail();

        $resource->average_rating = $resource->averageRating();

        return response()->json($resource);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $resource = Resource::findOrFail($id);

        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'type' => 'in:tool,library,app,documentation,article,other',
            'url' => 'nullable|url',
            'repository_url' => 'nullable|url',
            'image_url' => 'nullable|url',
            'status' => 'in:draft,published,archived',
            'categories' => 'array',
            'categories.*' => 'exists:categories,id',
            'tags' => 'array',
            'tags.*' => 'exists:tags,id',
        ]);

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $resource->update($validated);

        if (isset($validated['categories'])) {
            $resource->categories()->sync($validated['categories']);
        }

        if (isset($validated['tags'])) {
            $resource->tags()->sync($validated['tags']);
        }

        return response()->json($resource->load(['user', 'categories', 'tags']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $resource = Resource::findOrFail($id);
        $resource->delete();

        return response()->json(['message' => 'Resource deleted successfully']);
    }
}
