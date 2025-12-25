<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class WaterController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->waterLogs()
            ->orderBy('logged_at', 'desc')
            ->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'amount_ml' => 'required|integer|min:1',
        ]);

        $log = $request->user()->waterLogs()->create([
            'amount_ml' => $request->amount_ml,
            'logged_at' => now(),
        ]);

        return response()->json($log, 201);
    }
}
