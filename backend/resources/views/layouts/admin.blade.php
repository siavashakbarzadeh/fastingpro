<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - FastingPro</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        pink: {
                            50: '#fdf2f8',
                            100: '#fce7f3',
                            400: '#f472b6',
                            500: '#ec4899',
                        }
                    }
                }
            }
        }
    </script>
</head>

<body class="bg-gray-50 flex min-h-screen">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div class="h-16 flex items-center px-6 border-b border-gray-200">
            <span
                class="text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">FastingPro
                Admin</span>
        </div>
        <nav class="flex-1 p-4 space-y-2">
            <a href="{{ route('admin.dashboard') }}"
                class="flex items-center px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-500 rounded-lg transition-colors {{ request()->routeIs('admin.dashboard') ? 'bg-pink-50 text-pink-500 font-bold' : '' }}">
                <span class="mr-3">📊</span> Dashboard
            </a>
            <a href="{{ route('admin.users') }}"
                class="flex items-center px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-500 rounded-lg transition-colors {{ request()->routeIs('admin.users') ? 'bg-pink-50 text-pink-500 font-bold' : '' }}">
                <span class="mr-3">👥</span> Users
            </a>
            <a href="{{ route('admin.fasts') }}"
                class="flex items-center px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-500 rounded-lg transition-colors {{ request()->routeIs('admin.fasts') ? 'bg-pink-50 text-pink-500 font-bold' : '' }}">
                <span class="mr-3">⚡</span> Fasting Sessions
            </a>
        </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden">
        <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
            <h2 class="text-lg font-semibold text-gray-800">@yield('title')</h2>
            <div class="flex items-center space-x-4">
                <span class="text-sm text-gray-500">{{ now()->toFormattedDateString() }}</span>
            </div>
        </header>
        <div class="flex-1 overflow-y-auto p-8">
            @yield('content')
        </div>
    </main>
</body>

</html>