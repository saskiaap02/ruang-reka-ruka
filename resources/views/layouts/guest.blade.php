<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>RuKa. - Kolaborasi Tim</title>

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="font-sans text-gray-900 antialiased bg-[#07132B]">
        
        <div class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0">
            
            <div class="mb-8">
                <a href="/" class="flex items-center justify-center gap-1 no-underline">
                    <span class="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold text-3xl shadow-lg">Ru</span>
                    <span class="text-white font-bold text-3xl">Ka.</span>
                </a>
            </div>

            <div class="w-full sm:max-w-md px-8 py-10 bg-[#111C31] shadow-2xl overflow-hidden sm:rounded-2xl border-t-2 border-[#00d2ff]">
                
                {{ $slot }}
                
            </div>
            
        </div>
        
    </body>
</html>