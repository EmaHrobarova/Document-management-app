<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    // GET - List all documents
    public function index(Request $request)
    {
        $documents = $request->user()->documents()->get();
        return response()->json($documents);
    }

    // POST - Upload a new document
    public function store(Request $request)
    {
        try {
            $validated_request = $request->validate([
                'name' => 'required|string|max:255',
                'file' => 'required|file|max:10240', // max 10MB
            ]);

            $user = $request->user();
            $path = $request->file('file')->store('documents');

            $document = $user->documents()->create([
                'name' => $validated_request['name'],
                'path' => $path,
            ]);

            return response()->json($document, 201);

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
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $document = $request->user()->documents()->findOrFail($id);
        $document->name = $request->input('name');
        $document->save();

        return response()->json(['message' => 'Document updated successfully.',
            'document' => $document,
        ]);
    }
}
