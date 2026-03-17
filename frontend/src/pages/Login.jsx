import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const { login } = useAuth()
    const navigate = useNavigate()

    const validate = () => {
        const errs = {}
        if (!email.trim()) errs.email = 'Email is required'
        if (!password) errs.password = 'Password is required'
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return
        setLoading(true)
        const success = await login(email, password)
        setLoading(false)
        if (success) navigate('/dashboard')
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f7f7f7] text-slate-900 antialiased" style={{ fontFamily: "'Work Sans', 'Inter', sans-serif" }}>
            {/* Background mesh gradient */}
            <div className="fixed inset-0 pointer-events-none -z-10"
                style={{
                    backgroundImage: 'radial-gradient(at 0% 0%, rgba(103,130,158,0.1) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(45,212,191,0.1) 0px, transparent 50%)'
                }}
            />

            <main className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20">
                <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    {/* Left Side — Feature Spotlight */}
                    <div className="flex flex-col gap-8 order-2 lg:order-1">
                        <div className="space-y-4">
                            <span className="inline-block px-3 py-1 rounded-full bg-teal-400/10 text-teal-500 text-xs font-bold uppercase tracking-wider">
                                Secure Access
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                                Welcome back to <span className="text-[#67829e]">TrustLens AI</span>.
                            </h1>
                            <p className="text-lg text-slate-600 max-w-md">
                                Access your dashboard, view past reports, and continue verifying device conditions with our AI-powered analysis.
                            </p>
                        </div>

                        {/* Recent Activity Snippet */}
                        <div className="bg-white/80 backdrop-blur-xl border border-white/30 p-6 rounded-xl shadow-2xl relative overflow-hidden group">
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#67829e]/5 rounded-full blur-3xl group-hover:bg-teal-400/5 transition-colors" />
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[#67829e]/10 flex items-center justify-center text-[#67829e]">
                                        <span className="material-symbols-outlined">analytics</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Your Dashboard</h4>
                                        <p className="text-xs text-slate-500">Reports & Analytics</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-teal-500 px-2 py-1 bg-teal-400/10 rounded">ACTIVE</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm text-center">
                                    <p className="text-xs text-slate-500 mb-1 uppercase tracking-tighter font-bold">Reports</p>
                                    <p className="text-2xl font-black text-slate-900">147</p>
                                    <div className="flex items-center justify-center gap-1 text-emerald-500 text-xs font-bold mt-1">
                                        <span className="material-symbols-outlined text-sm">trending_up</span>
                                        <span>+12 today</span>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm text-center">
                                    <p className="text-xs text-slate-500 mb-1 uppercase tracking-tighter font-bold">Scans</p>
                                    <p className="text-2xl font-black text-slate-900">892</p>
                                    <p className="text-[10px] text-slate-400 mt-1">Total images</p>
                                </div>
                                <div className="bg-[#67829e]/5 p-4 rounded-lg border border-[#67829e]/10 shadow-sm text-center">
                                    <p className="text-xs text-[#67829e]/80 mb-1 uppercase tracking-tighter font-bold">Saved</p>
                                    <p className="text-2xl font-black text-[#67829e]">₹2.4L</p>
                                    <p className="text-[10px] text-[#67829e]/60 mt-1">Estimated value</p>
                                </div>
                            </div>
                            {/* Mini chart */}
                            <div className="mt-6 h-16 w-full flex items-end gap-1">
                                {[35, 50, 40, 65, 55, 80, 70, 90, 75, 85].map((h, i) => (
                                    <div key={i} className="flex-1 rounded-t-sm"
                                        style={{ height: `${h}%`, backgroundColor: i >= 7 ? 'rgba(45,212,191,0.4)' : `rgba(103,130,158,${0.1 + i * 0.04})` }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Uptime</p>
                                <p className="text-2xl font-black text-slate-700">99.9%</p>
                            </div>
                            <div className="h-8 w-[1px] bg-slate-200" />
                            <div>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Secure Auth</p>
                                <p className="text-2xl font-black text-slate-700">JWT + AES</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side — Login Form */}
                    <div className="order-1 lg:order-2">
                        <div className="bg-white/80 backdrop-blur-xl border border-white/30 p-8 md:p-10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-slate-900">Sign in to your account</h2>
                                <p className="text-slate-500 text-sm mt-1">Access your TrustLens AI dashboard and reports.</p>
                            </div>

                            <div className="space-y-4">
                                {/* Divider */}
                                <div className="relative flex items-center justify-center py-2">
                                    <div className="w-full border-t border-slate-200" />
                                    <span className="absolute bg-white px-3 text-xs text-slate-400 font-bold uppercase tracking-widest">Sign in with email</span>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Email */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">Email Address</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-xl">mail</span>
                                            <input
                                                id="login-email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="john@company.com"
                                                className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-[#67829e] focus:border-transparent transition-all placeholder:text-slate-300 text-sm"
                                            />
                                        </div>
                                        {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">Password</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-xl">lock</span>
                                            <input
                                                id="login-password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full h-12 pl-10 pr-12 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-[#67829e] focus:border-transparent transition-all placeholder:text-slate-300 text-sm"
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                                                <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                            </button>
                                        </div>
                                        {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                                    </div>

                                    {/* Remember + Forgot */}
                                    <div className="flex items-center justify-between pt-1">
                                        <div className="flex items-center gap-2">
                                            <input className="rounded border-slate-300 text-[#67829e] focus:ring-[#67829e]" id="remember" type="checkbox" />
                                            <label className="text-xs text-slate-500" htmlFor="remember">Remember me</label>
                                        </div>
                                        <a className="text-xs text-[#67829e] font-bold hover:underline" href="#">Forgot password?</a>
                                    </div>

                                    <button
                                        id="login-submit"
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-12 rounded-lg bg-gradient-to-r from-[#67829e] to-teal-400 text-white font-bold text-base shadow-lg shadow-[#67829e]/20 hover:shadow-[#67829e]/40 transition-all flex items-center justify-center gap-2 group"
                                    >
                                        {loading ? (
                                            <LoadingSpinner size="sm" />
                                        ) : (
                                            <>
                                                <span>Sign In</span>
                                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>

                            <p className="mt-8 text-center text-sm text-slate-500">
                                Don't have an account? <Link className="text-[#67829e] font-bold hover:underline" to="/signup">Create one</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="p-8 text-center">
                <p className="text-xs text-slate-400 font-medium">© 2026 TrustLens AI.</p>
            </footer>
        </div>
    )
}
