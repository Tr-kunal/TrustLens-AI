import { Link } from 'react-router-dom'

const features = [
    {
        icon: 'search',
        title: 'Damage Detection',
        desc: 'Real-time identification of screen cracks, dead pixels, and micro-damage using deep learning models trained on millions of images.',
    },
    {
        icon: 'bar_chart',
        title: 'Severity Scoring',
        desc: 'Automated grading of damage severity from minor cosmetic wear to critical structural compromise, using area-weighted class scoring.',
    },
    {
        icon: 'calculate',
        title: 'Smart Valuation',
        desc: 'AI-powered pricing based on damage severity with 5 discount tiers mapped against current market conditions.',
    },
]

const workflowSteps = [
    {
        icon: 'cloud_upload',
        title: 'Upload Image',
        desc: 'Submit photos of your device from any angle — up to 5 images for comprehensive analysis.',
    },
    {
        icon: 'precision_manufacturing',
        title: 'AI Detection',
        desc: 'Our YOLOv8 model scans every pixel for cracks, scratches, and stains.',
    },
    {
        icon: 'insights',
        title: 'Visual Insight',
        desc: 'Receive a comprehensive analysis with severity scoring and damage mapping.',
    },
    {
        icon: 'verified',
        title: 'Final Value',
        desc: 'Get an accurate, AI-backed price recommendation with detailed condition report.',
    },
]

export default function Landing() {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-slate-50 text-slate-900 antialiased" style={{ fontFamily: "'Work Sans', 'Inter', sans-serif" }}>
            {/* Custom Animations */}
            <style>{`
                @keyframes scan {
                    0%, 100% { transform: translateY(0); opacity: 0; }
                    5%, 95% { opacity: 1; }
                    50% { transform: translateY(260px); }
                }
                @keyframes pulse-box {
                    0% { transform: scale(1); opacity: 0.4; }
                    50% { transform: scale(1.02); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 0.4; }
                }
                @keyframes float-subtle {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }
                .scan-line {
                    animation: scan 4s ease-in-out infinite;
                }
                .pulse-box-anim {
                    animation: pulse-box 2s ease-in-out infinite;
                }
                .float-subtle {
                    animation: float-subtle 3s ease-in-out infinite;
                }
            `}</style>

            {/* ===== HERO ===== */}
            <main className="flex-1">
                <div className="px-6 md:px-20 py-16 md:py-24 max-w-[1280px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left — Text */}
                        <div className="flex flex-col gap-8 order-2 lg:order-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-700/10 text-teal-700 text-xs font-bold uppercase tracking-wider w-fit">
                                <span className="material-symbols-outlined text-sm">verified</span>
                                Enterprise-Grade Diagnostics
                            </div>

                            <div className="flex flex-col gap-4">
                                <h1 className="text-5xl md:text-6xl font-black leading-[1.1] tracking-tight">
                                    Precision AI for{' '}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-sky-700">
                                        Device Diagnostics
                                    </span>
                                </h1>
                                <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed max-w-[540px]">
                                    Instantly detect cracks, scratches, and functional issues with our advanced deep learning models powered by YOLOv8.
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                <Link
                                    to="/signup"
                                    className="flex min-w-[180px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-gradient-to-r from-teal-700 to-sky-700 text-white text-base font-bold shadow-xl shadow-teal-700/20 hover:scale-[1.02] transition-all"
                                >
                                    Get Started
                                </Link>
                                <Link
                                    to="/login"
                                    className="flex min-w-[180px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 border border-slate-200 bg-white text-slate-900 text-base font-bold hover:bg-slate-50 transition-all gap-2"
                                >
                                    <span className="material-symbols-outlined">play_circle</span>
                                    Watch Demo
                                </Link>
                            </div>

                            {/* Social proof */}
                            <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                                {/* <div className="flex -space-x-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center ${i === 2 ? 'bg-teal-200' : 'bg-slate-200'}`}>
                                            <span className="material-symbols-outlined text-sm text-slate-600">person</span>
                                        </div>
                                    ))}
                                </div> */}
                                {/* <p className="text-slate-500 text-sm font-medium">Trusted by 500+ global repair networks</p> */}
                            </div>
                        </div>

                        {/* Right — Scan Visualization */}
                        <div className="relative order-1 lg:order-2 flex items-center justify-center p-4 min-h-[500px]">
                            {/* Decorative background blur */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-teal-400/20 to-slate-200/50 rounded-[3rem] blur-3xl -z-10" />

                            <div className="relative w-[260px] h-[520px] sm:w-[300px] sm:h-[600px] bg-slate-900 rounded-[3rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border-[10px] border-slate-800 flex items-center justify-center overflow-hidden float-subtle z-10 box-border ring-1 ring-slate-700/50 group">
                                
                                {/* Dynamic Island / Notch */}
                                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] flex items-center justify-end pr-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#1a1a1a] shadow-[inset_0_0_2px_rgba(0,0,0,0.8)] border border-white/5" />
                                </div>
                                
                                {/* Phone screen with realistic cracked texture */}
                                <div className="absolute inset-0 bg-black z-0">
                                    <img src="/cracked_texture.png" alt="Cracked Screen" className="w-full h-full object-cover opacity-90 mix-blend-screen scale-105 group-hover:scale-100 transition-transform duration-1000" />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-teal-900/30 via-transparent to-transparent mix-blend-overlay" />
                                </div>

                                {/* Scan line wrapper for precise clipping */}
                                <div className="absolute inset-0 z-30 overflow-hidden pointer-events-none rounded-[2.2rem]">
                                    {/* Laser beam */}
                                    <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent scan-line shadow-[0_0_20px_rgba(45,212,191,1)]"
                                        style={{ top: '10px' }}
                                    />
                                    {/* Scan gradient trail */}
                                    <div className="absolute left-0 right-0 h-40 bg-gradient-to-b from-teal-500/10 to-transparent scan-line"
                                        style={{ top: '10px' }}
                                    />
                                </div>

                                {/* Glass Reflection */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none z-40 rounded-[2.2rem]" />

                                {/* Detection overlays */}
                                <div className="absolute top-[25%] left-[15%] w-24 h-16 border-2 border-red-500/80 rounded shadow-[0_0_15px_rgba(239,68,68,0.3)] pulse-box-anim z-30 bg-red-500/10 backdrop-blur-[1px]"
                                    style={{ animationDelay: '0s' }}
                                >
                                    <span className="absolute -bottom-6 left-0 text-[10px] px-2 py-0.5 bg-red-500 text-white rounded font-black tracking-wider shadow">CRACK</span>
                                </div>
                                
                                <div className="absolute top-[55%] right-[10%] w-16 h-12 border-2 border-amber-500/80 rounded shadow-[0_0_15px_rgba(245,158,11,0.3)] pulse-box-anim z-30 bg-amber-500/10 backdrop-blur-[1px]"
                                    style={{ animationDelay: '0.5s' }}
                                >
                                    <span className="absolute -bottom-6 left-0 text-[10px] px-2 py-0.5 bg-amber-500 text-white rounded font-black tracking-wider shadow">SCRATCH</span>
                                </div>
                                
                                <div className="absolute bottom-[20%] left-[20%] w-20 h-10 border-2 border-orange-500/80 rounded shadow-[0_0_15px_rgba(249,115,22,0.3)] pulse-box-anim z-30 bg-orange-500/10 backdrop-blur-[1px]"
                                    style={{ animationDelay: '1s' }}
                                >
                                    <span className="absolute -bottom-6 left-0 text-[10px] px-2 py-0.5 bg-orange-500 text-white rounded font-black tracking-wider shadow">STAIN</span>
                                </div>

                                {/* Side Buttons (CSS trick) */}
                                <div className="absolute top-24 -left-[14px] w-1 h-8 bg-slate-700/80 rounded-l-md pointer-events-none" />
                                <div className="absolute top-40 -left-[14px] w-1 h-12 bg-slate-700/80 rounded-l-md pointer-events-none" />
                                <div className="absolute top-56 -left-[14px] w-1 h-12 bg-slate-700/80 rounded-l-md pointer-events-none" />
                                <div className="absolute top-40 -right-[14px] w-1 h-16 bg-slate-700/80 rounded-r-md pointer-events-none" />
                            </div>

                            {/* Price badge hovering outside */}
                            <div className="absolute top-[10%] sm:right-0 right-4 bg-teal-800 text-teal-50 px-5 py-3 rounded-2xl text-lg font-black shadow-[0_10px_25px_rgba(13,148,136,0.4)] border border-teal-500/30 z-20 float-subtle backdrop-blur-md"
                                style={{ animationDelay: '1s' }}
                            >
                                ₹ 4,630
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== FEATURES ===== */}
                <div id="features" className="px-6 md:px-20 py-16 max-w-[1280px] mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
                        Damage Detection & Analysis
                    </h2>
                    <p className="text-slate-500 text-base max-w-2xl mb-12">
                        Our sophisticated AI provides granular insights into device condition using deep learning specifically tuned for electronics.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((f) => (
                            <div
                                key={f.title}
                                className="flex flex-col gap-3 p-6 rounded-2xl border border-slate-100 bg-white hover:shadow-lg hover:border-teal-200 transition-all duration-300 group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-teal-700/10 flex items-center justify-center group-hover:bg-teal-700 transition-colors">
                                    <span className="material-symbols-outlined text-teal-700 group-hover:text-white transition-colors">{f.icon}</span>
                                </div>
                                <h3 className="text-lg font-bold">{f.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ===== WORKFLOW ===== */}
                <div id="workflow" className="px-6 md:px-20 py-16 max-w-[1280px] mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
                            Seamless Experience Workflow
                        </h2>
                        <p className="text-slate-500 text-base max-w-xl mx-auto">
                            From first photo to final value in seconds.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {workflowSteps.map((step, i) => (
                            <div
                                key={step.title}
                                className="flex flex-col items-center text-center gap-3 p-5 group"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-700 to-sky-700 flex items-center justify-center shadow-lg shadow-teal-700/20 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-white text-2xl">{step.icon}</span>
                                </div>
                                <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">Step {i + 1}</div>
                                <h3 className="text-sm font-bold">{step.title}</h3>
                                <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ===== CTA ===== */}
                <div className="px-6 md:px-20 py-16 max-w-[1280px] mx-auto">
                    <div className="rounded-2xl bg-gradient-to-r from-teal-700 to-sky-700 p-12 text-center text-white relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-black mb-4">
                                Ready to Verify Your Devices?
                            </h2>
                            <p className="text-white/80 max-w-xl mx-auto mb-8 text-lg">
                                Join repair networks and resellers who trust TrustLens AI for accurate condition verification.
                            </p>
                            <Link
                                to="/signup"
                                className="inline-flex items-center justify-center rounded-xl h-14 px-10 bg-white text-teal-700 text-base font-bold shadow-xl hover:scale-[1.02] transition-all"
                            >
                                Get Started — It's Free
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            {/* ===== FOOTER ===== */}
            <footer className="border-t border-slate-200 px-6 md:px-20 py-10">
                <div className="max-w-[1280px] mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                        {/* Brand */}
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 text-teal-700 mb-3">
                                <span className="material-symbols-outlined text-2xl">lens_blur</span>
                                <span className="text-lg font-bold text-slate-900">TrustLens AI</span>
                            </div>
                            <p className="text-slate-500 text-xs leading-relaxed">
                                AI-powered device condition verification using computer vision and deep learning diagnostics.
                            </p>
                        </div>

                        {/* Product */}
                        <div>
                            <h4 className="text-sm font-bold mb-3">Product</h4>
                            <ul className="space-y-2 text-slate-500 text-xs">
                                <li><Link to="/signup" className="hover:text-teal-700 transition-colors">Damage Scan API</Link></li>
                                <li><Link to="/signup" className="hover:text-teal-700 transition-colors">Batch Processing</Link></li>
                                <li><Link to="/signup" className="hover:text-teal-700 transition-colors">Live Grading</Link></li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="text-sm font-bold mb-3">Company</h4>
                            <ul className="space-y-2 text-slate-500 text-xs">
                                <li><a href="#" className="hover:text-teal-700 transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-teal-700 transition-colors">Blog</a></li>
                                <li><a href="https://github.com/Tr-kunal/TrustLens-AI" target="_blank" rel="noreferrer" className="hover:text-teal-700 transition-colors">GitHub</a></li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 className="text-sm font-bold mb-3">Legal</h4>
                            <ul className="space-y-2 text-slate-500 text-xs">
                                <li><a href="#" className="hover:text-teal-700 transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-teal-700 transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-teal-700 transition-colors">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-slate-400 text-xs">© 2026 TrustLens AI. All rights reserved.</p>
                        <p className="text-slate-400 text-xs">Powered by YOLOv8 Computer Vision</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
