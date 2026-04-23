import { Link, Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

// Floating particle component
function Particle({ style }) {
    return <div className="particle" style={style} />;
}

export default function Welcome({ auth }) {
    const [scrollY, setScrollY] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        const handleMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('mousemove', handleMouse, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleMouse);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const particles = Array.from({ length: 20 }, (_, i) => ({
        width: `${Math.random() * 3 + 1}px`,
        height: `${Math.random() * 3 + 1}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 10 + 15}s`,
        animationDelay: `${Math.random() * 10}s`,
        opacity: Math.random() * 0.4 + 0.1,
    }));

    return (
        <>
            <Head title="Ruang Reka — Kolaborasi Tim Tanpa Beban" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,300&display=swap');

                * { box-sizing: border-box; margin: 0; padding: 0; }

                body { background: #050810; }

                .page {
                    font-family: 'DM Sans', sans-serif;
                    background: #050810;
                    color: #c8d4e8;
                    overflow-x: hidden;
                    min-height: 100vh;
                }

                /* GRID BACKGROUND */
                .page::before {
                    content: '';
                    position: fixed;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(99, 140, 255, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(99, 140, 255, 0.03) 1px, transparent 1px);
                    background-size: 60px 60px;
                    pointer-events: none;
                    z-index: 0;
                }

                /* PARTICLES */
                .particle {
                    position: absolute;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(99,140,255,0.8), transparent);
                    animation: float linear infinite;
                }
                @keyframes float {
                    0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
                }

                /* NAVBAR */
                .nav {
                    position: fixed;
                    top: 0; left: 0; right: 0;
                    z-index: 100;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.25rem 3rem;
                    background: rgba(5, 8, 16, 0.7);
                    backdrop-filter: blur(24px);
                    border-bottom: 1px solid rgba(99, 140, 255, 0.08);
                    transition: all 0.3s;
                }

                .logo {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    text-decoration: none;
                }

                .logo-badge {
                    background: linear-gradient(135deg, #3b82f6, #6366f1);
                    color: white;
                    padding: 5px 10px;
                    border-radius: 8px;
                    font-size: 1.1rem;
                    font-weight: 700;
                    letter-spacing: -0.04em;
                    box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
                }

                .logo-text {
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: white;
                    letter-spacing: -0.04em;
                }

                .nav-links {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .btn-ghost {
                    color: #94a3b8;
                    text-decoration: none;
                    font-size: 0.875rem;
                    font-weight: 500;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    transition: all 0.2s;
                }
                .btn-ghost:hover { color: white; background: rgba(255,255,255,0.05); }

                .btn-primary {
                    background: linear-gradient(135deg, #3b82f6, #6366f1);
                    color: white;
                    text-decoration: none;
                    font-size: 0.875rem;
                    font-weight: 600;
                    padding: 0.6rem 1.5rem;
                    border-radius: 100px;
                    transition: all 0.2s;
                    box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .btn-primary:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 0 30px rgba(99, 102, 241, 0.5);
                }

                /* HERO */
                .hero {
                    position: relative;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 8rem 2rem 6rem;
                    overflow: hidden;
                }

                .hero-particles {
                    position: absolute;
                    inset: 0;
                    overflow: hidden;
                    z-index: 0;
                }

                /* ORBS */
                .orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(100px);
                    pointer-events: none;
                }
                .orb-1 {
                    width: 700px; height: 700px;
                    background: radial-gradient(circle, rgba(59, 130, 246, 0.12), transparent 70%);
                    top: -200px; left: 50%; transform: translateX(-50%);
                }
                .orb-2 {
                    width: 500px; height: 500px;
                    background: radial-gradient(circle, rgba(99, 102, 241, 0.1), transparent 70%);
                    bottom: 0; right: -150px;
                }
                .orb-3 {
                    width: 400px; height: 400px;
                    background: radial-gradient(circle, rgba(16, 185, 129, 0.07), transparent 70%);
                    bottom: 100px; left: -100px;
                }

                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 0.4rem 1rem;
                    background: rgba(99, 140, 255, 0.06);
                    border: 1px solid rgba(99, 140, 255, 0.2);
                    border-radius: 100px;
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: #93b4ff;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    margin-bottom: 2.5rem;
                    position: relative;
                    z-index: 1;
                }

                .badge-dot {
                    width: 6px; height: 6px;
                    background: #4ade80;
                    border-radius: 50%;
                    box-shadow: 0 0 6px #4ade80;
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(0.8); }
                }

                .hero-headline {
                    font-family: 'Instrument Serif', serif;
                    font-size: clamp(3rem, 7vw, 6rem);
                    line-height: 1.05;
                    color: #f0f4ff;
                    letter-spacing: -0.02em;
                    margin-bottom: 1.5rem;
                    position: relative;
                    z-index: 1;
                    max-width: 900px;
                }

                .hero-headline em {
                    font-style: italic;
                    background: linear-gradient(135deg, #60a5fa, #a78bfa, #34d399);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .hero-sub {
                    font-size: 1.125rem;
                    color: #64748b;
                    max-width: 560px;
                    line-height: 1.75;
                    margin-bottom: 3rem;
                    position: relative;
                    z-index: 1;
                }

                .hero-cta {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    z-index: 1;
                    flex-wrap: wrap;
                }

                .cta-main {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: linear-gradient(135deg, #3b82f6, #6366f1);
                    color: white;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 0.9375rem;
                    padding: 0.875rem 2rem;
                    border-radius: 100px;
                    box-shadow: 0 0 40px rgba(99, 102, 241, 0.35), inset 0 1px 0 rgba(255,255,255,0.15);
                    transition: all 0.25s;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .cta-main:hover { transform: translateY(-2px); box-shadow: 0 0 60px rgba(99, 102, 241, 0.5), inset 0 1px 0 rgba(255,255,255,0.15); }

                .cta-secondary {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    color: #94a3b8;
                    text-decoration: none;
                    font-weight: 500;
                    font-size: 0.9375rem;
                    padding: 0.875rem 1.5rem;
                    border-radius: 100px;
                    border: 1px solid rgba(255,255,255,0.06);
                    transition: all 0.25s;
                }
                .cta-secondary:hover { color: white; border-color: rgba(255,255,255,0.12); background: rgba(255,255,255,0.03); }

                /* HERO STATS */
                .hero-stats {
                    display: flex;
                    gap: 3rem;
                    margin-top: 5rem;
                    position: relative;
                    z-index: 1;
                    flex-wrap: wrap;
                    justify-content: center;
                }

                .stat-item {
                    text-align: center;
                }
                .stat-number {
                    font-family: 'Instrument Serif', serif;
                    font-size: 2rem;
                    color: #e2e8f0;
                    display: block;
                }
                .stat-label {
                    font-size: 0.75rem;
                    color: #475569;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    font-weight: 500;
                }

                .stat-divider {
                    width: 1px;
                    height: 40px;
                    background: rgba(255,255,255,0.06);
                    align-self: center;
                }

                /* SCROLL INDICATOR */
                .scroll-hint {
                    position: absolute;
                    bottom: 2.5rem;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    color: #334155;
                    z-index: 1;
                    animation: bounce-slow 3s ease-in-out infinite;
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateX(-50%) translateY(0); }
                    50% { transform: translateX(-50%) translateY(6px); }
                }
                .scroll-hint span { font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; }

                /* BENTO SECTION */
                .section { position: relative; z-index: 1; padding: 8rem 2rem; max-width: 1200px; margin: 0 auto; }

                .section-eyebrow {
                    display: inline-block;
                    font-size: 0.7rem;
                    font-weight: 700;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    color: #6366f1;
                    margin-bottom: 1.25rem;
                    padding: 0.3rem 0.75rem;
                    background: rgba(99, 102, 241, 0.08);
                    border: 1px solid rgba(99, 102, 241, 0.15);
                    border-radius: 100px;
                }

                .section-title {
                    font-family: 'Instrument Serif', serif;
                    font-size: clamp(2.25rem, 4vw, 3.5rem);
                    color: #e2e8f0;
                    line-height: 1.1;
                    letter-spacing: -0.02em;
                    margin-bottom: 1rem;
                }

                .section-sub {
                    font-size: 1rem;
                    color: #475569;
                    line-height: 1.7;
                    max-width: 540px;
                }

                /* BENTO GRID */
                .bento {
                    display: grid;
                    grid-template-columns: repeat(12, 1fr);
                    gap: 1rem;
                    margin-top: 4rem;
                }

                .bento-card {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 20px;
                    padding: 2rem;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }

                .bento-card:hover {
                    border-color: rgba(255, 255, 255, 0.1);
                    background: rgba(255, 255, 255, 0.03);
                    transform: translateY(-2px);
                }

                .bento-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(99, 140, 255, 0.03), transparent 40%);
                    pointer-events: none;
                }

                .card-1 { grid-column: span 7; }
                .card-2 { grid-column: span 5; }
                .card-3 { grid-column: span 4; }
                .card-4 { grid-column: span 8; }
                .card-5 { grid-column: span 12; }

                @media (max-width: 768px) {
                    .card-1, .card-2, .card-3, .card-4, .card-5 { grid-column: span 12; }
                    .nav { padding: 1rem 1.5rem; }
                    .hero-stats { gap: 2rem; }
                    .stat-divider { display: none; }
                }

                .card-icon {
                    width: 40px; height: 40px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1.5rem;
                    font-size: 18px;
                }

                .icon-blue { background: rgba(59, 130, 246, 0.12); border: 1px solid rgba(59, 130, 246, 0.2); }
                .icon-green { background: rgba(52, 211, 153, 0.12); border: 1px solid rgba(52, 211, 153, 0.2); }
                .icon-red { background: rgba(248, 113, 113, 0.12); border: 1px solid rgba(248, 113, 113, 0.2); }
                .icon-purple { background: rgba(167, 139, 250, 0.12); border: 1px solid rgba(167, 139, 250, 0.2); }
                .icon-amber { background: rgba(251, 191, 36, 0.12); border: 1px solid rgba(251, 191, 36, 0.2); }

                .card-label {
                    font-size: 0.7rem;
                    font-weight: 700;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #475569;
                    margin-bottom: 0.5rem;
                }

                .card-title {
                    font-family: 'Instrument Serif', serif;
                    font-size: 1.625rem;
                    color: #e2e8f0;
                    line-height: 1.2;
                    margin-bottom: 0.875rem;
                    letter-spacing: -0.01em;
                }

                .card-text {
                    font-size: 0.9rem;
                    color: #475569;
                    line-height: 1.7;
                }

                /* MOCK UIs inside cards */
                .mock-kanban {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 8px;
                    margin-top: 1.5rem;
                }

                .mock-col {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 10px;
                    padding: 10px;
                }

                .mock-col-label {
                    font-size: 0.6rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: 8px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }

                .mock-task {
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 6px;
                    padding: 8px;
                    font-size: 0.65rem;
                    color: #64748b;
                    margin-bottom: 5px;
                }

                .mock-task-bar {
                    height: 3px;
                    border-radius: 100px;
                    margin-top: 6px;
                }

                .mock-heatmap {
                    display: grid;
                    grid-template-columns: repeat(14, 1fr);
                    gap: 4px;
                    margin-top: 1.5rem;
                }

                .mock-cell {
                    aspect-ratio: 1;
                    border-radius: 3px;
                }

                .mock-alert {
                    margin-top: 1.5rem;
                    background: rgba(239, 68, 68, 0.06);
                    border: 1px solid rgba(239, 68, 68, 0.15);
                    border-radius: 12px;
                    padding: 1rem;
                    display: flex;
                    gap: 12px;
                    align-items: flex-start;
                }

                .mock-grade {
                    margin-top: 1.5rem;
                    display: flex;
                    gap: 0.75rem;
                }

                .mock-grade-item {
                    flex: 1;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 10px;
                    padding: 0.875rem;
                }

                .mock-grade-val {
                    font-family: 'Instrument Serif', serif;
                    font-size: 1.75rem;
                    line-height: 1;
                }

                .mock-grade-lbl {
                    font-size: 0.6rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #334155;
                    margin-top: 4px;
                }

                /* PROCESS */
                .process {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 1px;
                    background: rgba(255,255,255,0.04);
                    border-radius: 20px;
                    overflow: hidden;
                    border: 1px solid rgba(255,255,255,0.04);
                    margin-top: 4rem;
                }

                .process-step {
                    background: #050810;
                    padding: 2rem;
                    position: relative;
                }

                .process-num {
                    font-family: 'Instrument Serif', serif;
                    font-size: 3.5rem;
                    color: rgba(99, 140, 255, 0.1);
                    line-height: 1;
                    margin-bottom: 1rem;
                    font-style: italic;
                }

                .process-title {
                    font-weight: 600;
                    color: #94a3b8;
                    font-size: 0.9rem;
                    margin-bottom: 0.5rem;
                }

                .process-text {
                    font-size: 0.8rem;
                    color: #334155;
                    line-height: 1.6;
                }

                /* CTA FINAL */
                .cta-section {
                    position: relative;
                    text-align: center;
                    padding: 10rem 2rem;
                    z-index: 1;
                    overflow: hidden;
                }

                .cta-glow {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(ellipse at 50% 60%, rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.05), transparent 70%);
                    pointer-events: none;
                }

                .cta-title {
                    font-family: 'Instrument Serif', serif;
                    font-size: clamp(2.5rem, 6vw, 5rem);
                    color: #f0f4ff;
                    line-height: 1.05;
                    letter-spacing: -0.02em;
                    margin-bottom: 1.5rem;
                }

                .cta-sub {
                    font-size: 1rem;
                    color: #475569;
                    max-width: 480px;
                    margin: 0 auto 3rem;
                    line-height: 1.7;
                }

                /* FOOTER */
                .footer {
                    border-top: 1px solid rgba(255,255,255,0.04);
                    padding: 2.5rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: relative;
                    z-index: 1;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .footer-copy {
                    font-size: 0.8rem;
                    color: #1e293b;
                }

                /* DIVIDER */
                .divider {
                    width: 100%;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(99, 140, 255, 0.15), transparent);
                    margin: 0 auto;
                    max-width: 1200px;
                }
            `}</style>

            <div className="page">
                {/* NAVBAR */}
                <nav className="nav">
                    <a href="#" className="logo">
                        <span className="logo-badge">Ru</span>
                        <span className="logo-text">Ka.</span>
                    </a>
                    <div className="nav-links">
                        {auth.user ? (
                            <Link
                                href={auth.user.role === 'dosen' ? route('dosen.dashboard') : route('mahasiswa.dashboard')}
                                className="btn-primary"
                            >
                                Buka Ruang {auth.user.role === 'dosen' ? 'Dosen' : 'Mahasiswa'}
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="btn-ghost">Masuk</Link>
                                <Link href={route('register')} className="btn-primary">Mulai Gratis →</Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* HERO */}
                <section className="hero">
                    <div className="orb orb-1"></div>
                    <div className="orb orb-2"></div>
                    <div className="orb orb-3"></div>

                    <div className="hero-particles">
                        {particles.map((p, i) => (
                            <div key={i} className="particle" style={p} />
                        ))}
                    </div>

                    <div className="hero-badge">
                        <span className="badge-dot"></span>
                        Sistem Manajemen Proyek Mahasiswa — v3.0
                    </div>

                    <h1 className="hero-headline">
                        Kolaborasi Nyata,<br />
                        <em>Jejak yang Valid.</em>
                    </h1>

                    <p className="hero-sub">
                        Minimalisir free-rider, visualisasi aktivitas tim secara real-time, dan nilai akhir yang benar-benar objektif.
                    </p>

                    {!auth.user ? (
                        <div className="hero-cta">
                            <Link href={route('register')} className="cta-main">
                                Mulai Ruang Baru
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                            <Link href={route('login')} className="cta-secondary">
                                Sudah punya akun
                            </Link>
                        </div>
                    ) : (
                        <div className="hero-cta">
                            <Link
                                href={auth.user.role === 'dosen' ? route('dosen.dashboard') : route('mahasiswa.dashboard')}
                                className="cta-main"
                            >
                                Lanjut ke Dashboard →
                            </Link>
                        </div>
                    )}

                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-number">100%</span>
                            <span className="stat-label">Transparan</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-number">Real-time</span>
                            <span className="stat-label">Activity Sync</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-number">AI</span>
                            <span className="stat-label">Auto-Grading</span>
                        </div>
                    </div>

                    <div className="scroll-hint">
                        <span>Jelajahi</span>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </section>

                {/* BENTO SECTION */}
                <div className="section">
                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        <span className="section-eyebrow">Platform</span>
                    </div>
                    <h2 className="section-title" style={{ textAlign: 'center', margin: '0 auto 1rem' }}>Satu platform.<br />Semua yang kamu butuhkan.</h2>
                    <p className="section-sub" style={{ textAlign: 'center', margin: '0 auto' }}>
                        Dari manajemen tugas hingga penilaian akhir — semuanya terintegrasi dan terdata secara otomatis.
                    </p>

                    <div className="bento">
                        {/* Card 1: Kanban */}
                        <div className="bento-card card-1">
                            <div className="card-icon icon-blue">
                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#60a5fa" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                                </svg>
                            </div>
                            <div className="card-label">Manajemen Tugas</div>
                            <div className="card-title">Kanban Board<br />Kolaboratif</div>
                            <div className="card-text">Kelola alur kerja tim dengan visual. Setiap pergerakan tugas tercatat sebagai log aktivitas otomatis.</div>

                            <div className="mock-kanban">
                                {[
                                    { label: 'Backlog', color: '#334155', tasks: ['Riset UI', 'Setup DB'] },
                                    { label: 'In Progress', color: '#3b82f6', tasks: ['Slicing'] },
                                    { label: 'Done', color: '#34d399', tasks: ['API Auth', 'Deploy'] }
                                ].map((col, ci) => (
                                    <div key={ci} className="mock-col">
                                        <div className="mock-col-label" style={{ color: col.color }}>{col.label}</div>
                                        {col.tasks.map((t, ti) => (
                                            <div key={ti} className="mock-task">
                                                {t}
                                                <div className="mock-task-bar" style={{ background: col.color, opacity: 0.4 }}></div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Card 2: Heatmap */}
                        <div className="bento-card card-2">
                            <div className="card-icon icon-green">
                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#34d399" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div className="card-label">Visualisasi</div>
                            <div className="card-title">Heatmap<br />Aktivitas</div>

                            <div className="mock-heatmap">
                                {Array.from({ length: 56 }, (_, i) => {
                                    const intensity = Math.random();
                                    const alpha = intensity > 0.6 ? 0.8 : intensity > 0.3 ? 0.4 : 0.08;
                                    return (
                                        <div key={i} className="mock-cell" style={{ background: `rgba(52, 211, 153, ${alpha})` }} />
                                    );
                                })}
                            </div>
                            <div style={{ marginTop: '0.75rem', fontSize: '0.65rem', color: '#1e293b', display: 'flex', justifyContent: 'space-between' }}>
                                <span>2 bulan lalu</span><span>Hari ini</span>
                            </div>
                        </div>

                        {/* Card 3: Alert */}
                        <div className="bento-card card-3">
                            <div className="card-icon icon-red">
                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#f87171" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="card-label">Intervensi Cerdas</div>
                            <div className="card-title">Peringatan<br />Otomatis</div>
                            <div className="card-text">Sistem deteksi kelompok stagnan & kirim "colekan" ke mahasiswa.</div>

                            <div className="mock-alert">
                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#f87171" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" />
                                    </svg>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#ef4444', marginBottom: 4 }}>4 hari tanpa aktivitas</div>
                                    <div style={{ fontSize: '0.6rem', color: '#475569' }}>Kelompok 2 — Ahmad Zaki</div>
                                    <div style={{ marginTop: 8, fontSize: '0.6rem', background: 'rgba(239,68,68,0.15)', color: '#f87171', padding: '4px 10px', borderRadius: 100, display: 'inline-block', fontWeight: 600 }}>Kirim Peringatan</div>
                                </div>
                            </div>
                        </div>

                        {/* Card 4: Grading */}
                        <div className="bento-card card-4">
                            <div className="card-icon icon-purple">
                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#a78bfa" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="card-label">Penilaian Objektif</div>
                            <div className="card-title">Auto-Grading berbasis AI & Aktivitas Nyata</div>
                            <div className="card-text">Nilai akhir dikalkulasi dari bobot dasar dosen, log audit sistem, dan peer review — tidak ada lagi nilai pukul rata.</div>

                            <div className="mock-grade">
                                {[
                                    { val: '78', lbl: 'Nilai Dasar', color: '#60a5fa' },
                                    { val: '+12', lbl: 'Bonus Audit', color: '#34d399' },
                                    { val: '-5', lbl: 'Peer Review', color: '#f87171' },
                                    { val: '85', lbl: 'Nilai Akhir', color: '#a78bfa' },
                                ].map((g, i) => (
                                    <div key={i} className="mock-grade-item">
                                        <div className="mock-grade-val" style={{ color: g.color }}>{g.val}</div>
                                        <div className="mock-grade-lbl">{g.lbl}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Card 5: How it works */}
                        <div className="bento-card card-5" style={{ padding: 0, overflow: 'hidden', background: 'transparent', border: 'none' }}>
                            <div className="process">
                                {[
                                    { num: '01', title: 'Buat Kelas', text: 'Dosen membuat ruang kelas dengan bobot penilaian yang dikustomisasi.' },
                                    { num: '02', title: 'Bergabung', text: 'Mahasiswa masuk menggunakan kode unik 6 karakter.' },
                                    { num: '03', title: 'AI Plotting', text: 'AI menempatkan mahasiswa ke tim berdasarkan riwayat performa.' },
                                    { num: '04', title: 'Kerja & Audit', text: 'Setiap aktivitas terekam otomatis sebagai log audit transparan.' },
                                    { num: '05', title: 'Nilai Objektif', text: 'Auto-grading menghasilkan nilai individual yang adil dan akurat.' },
                                ].map((step, i) => (
                                    <div key={i} className="process-step">
                                        <div className="process-num">{step.num}</div>
                                        <div className="process-title">{step.title}</div>
                                        <div className="process-text">{step.text}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="divider"></div>

                {/* CTA SECTION */}
                <div className="cta-section">
                    <div className="cta-glow"></div>
                    <div className="hero-badge" style={{ marginBottom: '2rem' }}>
                        <span className="badge-dot"></span>
                        Siap dipakai sekarang
                    </div>
                    <h2 className="cta-title">
                        Wujudkan kolaborasi<br />
                        <em>yang benar-benar adil.</em>
                    </h2>
                    <p className="cta-sub">
                        Bergabung dengan ratusan dosen dan mahasiswa yang sudah membuktikan transparansi kerja tim bersama RuKa.
                    </p>
                    {!auth.user ? (
                        <Link href={route('register')} className="cta-main" style={{ display: 'inline-flex' }}>
                            Daftar RuKa Sekarang
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    ) : (
                        <Link
                            href={auth.user.role === 'dosen' ? route('dosen.dashboard') : route('mahasiswa.dashboard')}
                            className="cta-main"
                            style={{ display: 'inline-flex' }}
                        >
                            Buka Dashboard →
                        </Link>
                    )}
                </div>

                {/* FOOTER */}
                <footer className="footer">
                    <a href="#" className="logo">
                        <span className="logo-badge" style={{ fontSize: '0.75rem', padding: '3px 7px' }}>Ru</span>
                        <span className="logo-text" style={{ fontSize: '1rem' }}>Ka.</span>
                    </a>
                    <p className="footer-copy">© 2026 Ruang Reka. Didesain untuk kolaborasi yang adil di kampus.</p>
                </footer>
            </div>
        </>
    );
}
