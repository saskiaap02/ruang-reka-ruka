<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            
            // 1. Data User yang Login
            'auth' => [
                'user' => $request->user(),
            ],

            // 2. Notifikasi Global untuk Dosen
            'notifications' => $request->user() && $request->user()->role === 'dosen'
                ? $request->user()->notifications()->take(10)->get()
                : [],

            // 3. Jumlah Notifikasi Belum Dibaca (Badge Merah di Lonceng)
            'unreadNotificationsCount' => $request->user() && $request->user()->role === 'dosen'
                ? $request->user()->unreadNotifications()->count()
                : 0,

            // 4. Flash Messages (Untuk memunculkan Alert Toast Sukses/Error)
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
                'info'    => fn () => $request->session()->get('info'),
            ],
        ];
    }
}