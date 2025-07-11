<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    // GET - List all available tags
    public function index(Request $request)
    {
        return response()->json(Tag::all());
    }

    // POST - Create a new tag
    public function store(Request $request)
    {
            $request->validate([
                'name' => 'required|string|max:255',
            ]);

            $tag = Tag::create([
                'name' => $request->input('name')
            ]);

            return response()->json($tag, 201);
    }

    // DELETE - Delete a tag
    public function destroy($id)
    {
        $tag = Tag::find($id);
        
        if (!$tag) {
            return response()->json(['message' => 'Tag not found'], 404);
        }

        $tag->delete();
        
        return response()->json(['message' => 'Tag deleted successfully'], 200);
    }
}
