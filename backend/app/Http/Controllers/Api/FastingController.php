<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Fast;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class FastingController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->fasts()
            ->with('plan')
            ->orderBy('start_time', 'desc')
            ->paginate(20);
    }

    public function current(Request $request)
    {
        $activeFast = $request->user()->fasts()
            ->where('status', 'active')
            ->orderBy('start_time', 'desc')
            ->first();

        return response()->json($activeFast);
    }

    public function start(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:fasting_plans,id',
            'start_time' => 'required|date',
            'planned_duration_minutes' => 'required|integer|min:1',
        ]);

        // Check if already fasting
        $existing = $request->user()->fasts()->where('status', 'active')->first();
        if ($existing) {
            return response()->json(['message' => 'Already fasting'], 400);
        }

        $fast = $request->user()->fasts()->create([
            'plan_id' => $request->plan_id,
            'start_time' => Carbon::parse($request->start_time),
            'planned_duration_minutes' => $request->planned_duration_minutes,
            'status' => 'active',
        ]);

        return response()->json($fast, 201);
    }

    public function end(Request $request)
    {
        $fast = $request->user()->fasts()->where('status', 'active')->first();

        if (!$fast) {
            return response()->json(['message' => 'No active fast'], 404);
        }

        $endTime = $request->has('end_time') ? Carbon::parse($request->end_time) : Carbon::now();
        $startTime = $request->has('start_time') ? Carbon::parse($request->start_time) : Carbon::parse($fast->start_time);
        
        $duration = $endTime->diffInMinutes($startTime);

        $fast->update([
            'start_time' => $startTime,
            'end_time' => $endTime,
            'actual_duration_minutes' => $duration,
            'status' => 'completed',
        ]);

        return response()->json($fast);
    }

    public function update(Request $request, Fast $fast)
    {
        if ($request->user()->id !== $fast->user_id) {
            return abort(403);
        }

        $request->validate([
            'start_time' => 'sometimes|date',
            'end_time' => 'sometimes|date',
            'notes' => 'nullable|string',
        ]);

        // Recalculate duration if times change
        // Omitted for brevity in this MVP

        $fast->update($request->all());

        return response()->json($fast);
    }
}
