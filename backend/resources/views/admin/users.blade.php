@extends('layouts.admin')

@section('title', 'Users')

@section('content')
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="w-full text-left border-collapse">
            <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                    <th class="px-6 py-4 text-sm font-bold text-gray-700 uppercase">Name</th>
                    <th class="px-6 py-4 text-sm font-bold text-gray-700 uppercase">Email</th>
                    <th class="px-6 py-4 text-sm font-bold text-gray-700 uppercase">Joined</th>
                </tr>
            </thead>
            <tbody>
                @foreach($users as $user)
                    <tr class="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                        <td class="px-6 py-4 text-gray-900 font-medium">{{ $user->name }}</td>
                        <td class="px-6 py-4 text-gray-600">{{ $user->email }}</td>
                        <td class="px-6 py-4 text-gray-500">{{ $user->created_at->diffForHumans() }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
        <div class="p-6 border-t border-gray-200">
            {{ $users->links() }}
        </div>
    </div>
@endsection