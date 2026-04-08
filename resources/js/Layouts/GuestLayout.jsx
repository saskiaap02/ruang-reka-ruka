import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-[#0b1120] text-slate-300 selection:bg-blue-500 selection:text-white">

            {/* Logo RuKa di atas Form */}
            <div>
                <Link href="/" className="flex items-center gap-1.5 justify-center mb-8 transform hover:scale-105 transition">
                    <span className="bg-blue-600 text-white px-3 py-1.5 rounded-xl text-3xl font-black tracking-tighter shadow-lg shadow-blue-600/30">Ru</span>
                    <span className="text-4xl font-bold text-white tracking-tight">Ka.</span>
                </Link>
            </div>

            {/* Kotak Form */}
            <div className="w-full sm:max-w-md mt-6 px-8 py-10 bg-[#0f172a] border border-slate-800 shadow-2xl overflow-hidden sm:rounded-3xl relative">
                {/* Aksen glow merah/biru tipis di atas kotak */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-emerald-500"></div>
                {children}
            </div>
        </div>
    );
}