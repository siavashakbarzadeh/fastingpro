<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Fast;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'total_fasts' => Fast::count(),
            'active_fasts' => Fast::where('status', 'active')->count(),
        ];
        return view('admin.dashboard', compact('stats'));
    }

    public function users()
    {
        $users = User::latest()->paginate(10);
        return view('admin.users', compact('users'));
    }

    public function fasts()
    {
        $fasts = Fast::with(['user', 'plan'])->latest()->paginate(15);
        return view('admin.fasts', compact('fasts'));
    }
}
