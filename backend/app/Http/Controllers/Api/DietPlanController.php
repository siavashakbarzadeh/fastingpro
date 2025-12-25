<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DietPlan;
use Illuminate\Http\Request;

class DietPlanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = DietPlan::query();

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        return response()->json($query->get());
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return response()->json(DietPlan::findOrFail($id));
    }
}
