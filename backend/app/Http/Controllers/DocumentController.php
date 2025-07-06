<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $documents = $request->user()->documents()->get();
        return response()->json($documents);
    }

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
}
