<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class WeightController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->weights()
            ->orderBy('logged_at', 'desc')
            ->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'value' => 'required|numeric',
            'unit' => 'required|in:kg,lb',
            'logged_at' => 'required|date',
        ]);

        $weight = $request->user()->weights()->create($request->all());

        return response()->json($weight, 201);
    }
}
