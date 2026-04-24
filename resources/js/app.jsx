import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
// Import Toaster di sini
import { Toaster } from 'react-hot-toast';

const appName = import.meta.env.VITE_APP_NAME || 'Ruang Reka';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Bungkus komponen App bawaan Inertia dan tambahkan Toaster secara global
        root.render(
            <>
                <App {...props} />
                <Toaster position="top-right" />
            </>
        );
    },
    progress: {
        // PERBAIKAN: Warna progress bar diganti biru (sesuai branding RuKa)
        color: '#2563eb',
        showSpinner: true,
    },
});