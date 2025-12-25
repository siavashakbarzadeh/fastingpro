<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Recipe;
use Illuminate\Http\Request;

class RecipeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Recipe::query();

        // Optional filtering from frontend params could go here
        if ($request->has('course')) {
            $query->where('course', $request->course);
        }

        // Simple search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('summary', 'like', "%{$search}%");
            });
        }

        return response()->json($query->get());
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return response()->json(Recipe::findOrFail($id));
    }
}
