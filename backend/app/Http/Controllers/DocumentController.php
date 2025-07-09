<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    // GET - List all documents
    public function index(Request $request)
    {
        $documents = $request->user()->documents()->with('tags')->get();
        return response()->json($documents);
    }

    // POST - Upload a new document
    public function store(Request $request)
    {
        try {
            $validated_request = $request->validate([
                'display_name' => 'required|string|max:255',
                'file' => 'required|file|max:10240',
                'tags' => 'array',
                'tags.*' => 'string|max:255',
            ]);

            $user = $request->user();
            $path = $request->file('file')->store('documents');

            $document = $user->documents()->create([
                'display_name' => $validated_request['display_name'],
                'name' => $request->file('file')->getClientOriginalName(),
                'path' => $path,
            ]);

            $tags = $request->input('tags', []);
            $tagsIds = [];
            foreach ($tags as $tagName) {
                $tag = Tag::firstOrCreate(['name' => $tagName]);
                $tagsIds[] = $tag->id;
            }
            $document->tags()->syncWithoutDetaching($tagsIds);

            return response()->json($document->load('tags'), 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to upload document.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // GET a single document’s details
    public function show(Request $request, $id)
    {
        $document = $request->user()->documents()->findOrFail($id);
        return response()->json($document);
    }

    // GET - Download a file
    public function download(Request $request, $id)
    {
        $document = $request->user()->documents()->findOrFail($id);
        return Storage::download($document->path, $document->name);
    }

    // DELETE - Delete a file
    public function delete(Request $request, $id)
    {
        $document = $request->user()->documents()->findOrFail($id);
        Storage::delete($document->path);
        $document->delete();

        return response()->json(['message' => 'Document deleted successfully.']);
    }

    // PUT - Update (rename) a file
    // rename for now, try to replace file later
    public function update(Request $request, $id)
    {
        $validated_request = $request->validate([
            'display_name' => 'required|string|max:255',
            'tags' => 'array',
            'tags.*' => 'string|max:255',
        ]);

        $document = $request->user()->documents()->findOrFail($id);
        $document->display_name = $validated_request['display_name'];
        $document->save();

        $tags = $request->input('tags', []);
        $tagsIds = [];
        foreach ($tags as $tagName) {
            $tag = Tag::firstOrCreate(['name' => $tagName]);
            $tagsIds[] = $tag->id;
        }
        $document->tags()->syncWithoutDetaching($tagsIds);

        return response()->json(['message' => 'Document updated successfully.',
            'document' => $document->load('tags'),
        ]);
    }

    // GET a single document’s tags
    public function tags(Request $request, $id)
    {
        $document = $request->user()->documents()->findOrFail($id);
        return response()->json($document->tags);
    }

    // POST - Add tag to an existing document
    public function addTag(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $document = $request->user()->documents()->findOrFail($id);

        $tag = Tag::firstOrCreate(['name' => $request->input('name')]);

        // Attach the tag to the document
        $document->tags()->syncWithoutDetaching([$tag->id]);

        return response()->json(['message' => 'Tag added successfully.']);
    }

    // DELETE - Remove tag from existing document
    public function deleteTag(Request $request, $document_id, $tag_id)
    {
        $document = $request->user()->documents()->findOrFail($document_id);
        $document->tags()->detach($tag_id);

        return response()->json(['message' => 'Tag deleted successfully.']);
    }
}
