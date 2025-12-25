<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CycleData;
use Illuminate\Http\Request;

class CycleDataController extends Controller
{
    public function show(Request $request)
    {
        $data = $request->user()->cycleData;

        if (!$data) {
            return response()->json([
                'last_period_start' => now()->toDateString(),
                'cycle_length' => 28,
                'period_duration' => 5,
            ]);
        }

        return response()->json($data);
    }

    public function store(Request $request)
    {
        $request->validate([
            'last_period_start' => 'required|date',
            'cycle_length' => 'required|integer|min:1',
            'period_duration' => 'required|integer|min:1',
        ]);

        $data = $request->user()->cycleData()->updateOrCreate(
            ['user_id' => $request->user()->id],
            $request->only(['last_period_start', 'cycle_length', 'period_duration'])
        );

        return response()->json($data);
    }
}
