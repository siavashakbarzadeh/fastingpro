@extends('layouts.admin')

@section('title', 'Dashboard')

@section('content')
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div class="text-gray-500 text-sm font-medium mb-1">Total Users</div>
            <div class="text-3xl font-bold text-gray-900">{{ $stats['total_users'] }}</div>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div class="text-gray-500 text-sm font-medium mb-1">Total Fasts</div>
            <div class="text-3xl font-bold text-gray-900">{{ $stats['total_fasts'] }}</div>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div class="text-gray-500 text-sm font-medium mb-1">Active Now</div>
            <div class="text-3xl font-bold text-pink-500">{{ $stats['active_fasts'] }}</div>
        </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Welcome to FastingPro Admin</h3>
        <p class="text-gray-600 leading-relaxed">
            This panel allows you to monitor user activity and manage health data across the platform. Use the sidebar to
            navigate between different resources.
        </p>
    </div>
@endsection