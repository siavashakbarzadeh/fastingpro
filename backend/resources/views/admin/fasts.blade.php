@extends('layouts.admin')

@section('title', 'Fasting Sessions')

@section('content')
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="w-full text-left border-collapse">
            <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                    <th class="px-6 py-4 text-sm font-bold text-gray-700 uppercase">User</th>
                    <th class="px-6 py-4 text-sm font-bold text-gray-700 uppercase">Plan</th>
                    <th class="px-6 py-4 text-sm font-bold text-gray-700 uppercase">Status</th>
                    <th class="px-6 py-4 text-sm font-bold text-gray-700 uppercase">Duration (Min)</th>
                    <th class="px-6 py-4 text-sm font-bold text-gray-700 uppercase">Start Time</th>
                </tr>
            </thead>
            <tbody>
                @foreach($fasts as $fast)
                    <tr class="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                        <td class="px-6 py-4 text-gray-900 font-medium">{{ $fast->user->name }}</td>
                        <td class="px-6 py-4 text-gray-600">{{ $fast->plan->name ?? 'Custom' }}</td>
                        <td class="px-6 py-4">
                            <span
                                class="px-2 py-1 rounded-full text-xs font-bold {{ $fast->status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700' }}">
                                {{ ucfirst($fast->status) }}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-gray-600">{{ $fast->actual_duration_minutes ?? '-' }}</td>
                        <td class="px-6 py-4 text-gray-500">{{ $fast->start_time->toDayDateTimeString() }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
        <div class="p-6 border-t border-gray-200">
            {{ $fasts->links() }}
        </div>
    </div>
@endsection