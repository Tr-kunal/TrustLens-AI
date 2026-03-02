import { Link } from 'react-router-dom'
import { HiShieldCheck, HiCamera, HiChartBar, HiCurrencyDollar, HiLightningBolt, HiDocumentReport } from 'react-icons/hi'

const features = [
    {
        icon: HiCamera,
        title: 'Image Upload',
        desc: 'Upload up to 5 product images for instant AI-powered analysis.',
        gradient: 'from-blue-500 to-cyan-500',
    },
    {
        icon: HiShieldCheck,
        title: 'Damage Detection',
        desc: 'YOLOv8-powered detection identifies cracks, scratches, dents, and more.',
        gradient: 'from-primary-500 to-purple-500',
    },
    {
        icon: HiChartBar,
        title: 'Severity Scoring',
        desc: 'AI-computed severity score from 1–10 based on damage type and extent.',
        gradient: 'from-purple-500 to-pink-500',
    },
    {
        icon: HiCurrencyDollar,
        title: 'Price Recommendation',
        desc: 'Rule-based pricing engine suggests fair market value after damage assessment.',
        gradient: 'from-green-500 to-emerald-500',
    },
    {
        icon: HiLightningBolt,
        title: 'AI Explanation',
        desc: 'LLM-generated human-readable summary explains findings to buyers.',
        gradient: 'from-amber-500 to-orange-500',
    },
    {
        icon: HiDocumentReport,
        title: 'Report History',
        desc: 'All past reports saved and accessible from your personal dashboard.',
        gradient: 'from-rose-500 to-red-500',
    },
]

export default function Landing() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse-slow" />
                </div>

                <div className="section-container relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-8 animate-fade-in">
                            <HiShieldCheck className="w-4 h-4" />
                            AI-Powered Product Verification
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-slide-up">
                            Verify Product
                            <br />
                            <span className="gradient-text">Condition Instantly</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-dark-400 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            Upload product images and get an instant AI-powered damage assessment
                            with severity scoring, price recommendations, and detailed explanations.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <Link to="/signup" className="btn-primary text-lg !px-8 !py-4">
                                Start Free Analysis
                            </Link>
                            <Link to="/login" className="btn-secondary text-lg !px-8 !py-4">
                                Sign In
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 mt-20 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
                            {[
                                { value: '10K+', label: 'Reports Generated' },
                                { value: '99%', label: 'Detection Accuracy' },
                                { value: '<2s', label: 'Analysis Time' },
                            ].map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
                                    <div className="text-xs sm:text-sm text-dark-500 mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 relative">
                <div className="section-container">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Everything You Need for
                            <span className="gradient-text"> Product Verification</span>
                        </h2>
                        <p className="text-dark-400 max-w-2xl mx-auto">
                            Our AI pipeline combines computer vision, machine learning, and natural language processing
                            to deliver comprehensive product condition reports.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <div key={feature.title} className="glass-card-hover p-6 group" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                <p className="text-dark-400 text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="section-container">
                    <div className="glass-card p-12 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-pink-500/10" />
                        <div className="relative z-10">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                                Ready to Verify Your Products?
                            </h2>
                            <p className="text-dark-400 max-w-xl mx-auto mb-8">
                                Join thousands of users who trust TrustLens AI for accurate product condition verification.
                            </p>
                            <Link to="/signup" className="btn-primary text-lg !px-10 !py-4">
                                Get Started — It's Free
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-white/5">
                <div className="section-container flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <HiShieldCheck className="w-5 h-5 text-primary-500" />
                        <span className="text-sm text-dark-400">TrustLens AI © 2025</span>
                    </div>
                    <p className="text-xs text-dark-600">Built with AI-powered damage detection technology</p>
                </div>
            </footer>
        </div>
    )
}
