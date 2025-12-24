<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FastingPlan;
use Illuminate\Http\Request;

class PlanController extends Controller
{
    public function index()
    {
        // Return default plans + user custom plans
        // For MVP, just return defaults or seed data logic
        return FastingPlan::all();
    }
}
