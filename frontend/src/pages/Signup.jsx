import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Signup() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const { signup } = useAuth()
    const navigate = useNavigate()

    const validate = () => {
        const errs = {}
        if (!name.trim()) errs.name = 'Name is required'
        if (!email.trim()) errs.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email'
        if (!password) errs.password = 'Password is required'
        else if (password.length < 6) errs.password = 'Minimum 6 characters'
        if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match'
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return
        setLoading(true)
        const success = await signup(name, email, password)
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
                                Enterprise Intelligence
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                                The standard in <span className="text-[#67829e]">Device Valuation</span>.
                            </h1>

                        </div>

                        {/* Valuation Report Snippet */}
                        <div className="bg-white/80 backdrop-blur-xl border border-white/30 p-6 rounded-xl shadow-2xl relative overflow-hidden group">
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#67829e]/5 rounded-full blur-3xl group-hover:bg-teal-400/5 transition-colors" />
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[#67829e]/10 flex items-center justify-center text-[#67829e]">
                                        <span className="material-symbols-outlined">smartphone</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">iPhone 15 Pro Max</h4>
                                        <p className="text-xs text-slate-500">Global ID: TL-8829-X</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-teal-500 px-2 py-1 bg-teal-400/10 rounded">LIVE FEED</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                                    <p className="text-xs text-slate-500 mb-1 uppercase tracking-tighter font-bold">Market Average</p>
                                    <p className="text-2xl font-black text-slate-900">₹1,09,900</p>
                                    <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold mt-1">
                                        <span className="material-symbols-outlined text-sm">trending_up</span>
                                        <span>+2.4% this week</span>
                                    </div>
                                </div>
                                <div className="bg-[#67829e]/5 p-4 rounded-lg border border-[#67829e]/10 shadow-sm">
                                    <p className="text-xs text-[#67829e]/80 mb-1 uppercase tracking-tighter font-bold">Trade-In Forecast</p>
                                    <p className="text-2xl font-black text-[#67829e]">₹94,550</p>
                                    <p className="text-[10px] text-[#67829e]/60 mt-1 italic leading-tight">Calculated with AI Damage Detection</p>
                                </div>
                            </div>
                            {/* Mini chart */}
                            <div className="mt-6 h-20 w-full flex items-end gap-1">
                                {[40, 55, 45, 70, 60, 85, 75, 95].map((h, i) => (
                                    <div key={i} className={`flex-1 rounded-t-sm ${i === 5 ? 'bg-teal-400/40' : `bg-[#67829e]/${Math.min(10 + i * 5, 50)}`}`}
                                        style={{ height: `${h}%`, backgroundColor: i === 5 ? 'rgba(45,212,191,0.4)' : `rgba(103,130,158,${0.1 + i * 0.05})` }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Accuracy</p>
                                <p className="text-2xl font-black text-slate-700">99.8%</p>
                            </div>
                            <div className="h-8 w-[1px] bg-slate-200" />
                            <div>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Analysis Speed</p>
                                <p className="text-2xl font-black text-slate-700">&lt; 0.4s</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side — Sign Up Form */}
                    <div className="order-1 lg:order-2">
                        <div className="bg-white/80 backdrop-blur-xl border border-white/30 p-8 md:p-10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
                                <p className="text-slate-500 text-sm mt-1">Start your free trial. No credit card required.</p>
                            </div>

                            <div className="space-y-4">
                                {/* Divider */}
                                <div className="relative flex items-center justify-center py-2">
                                    <div className="w-full border-t border-slate-200" />
                                    <span className="absolute bg-white px-3 text-xs text-slate-400 font-bold uppercase tracking-widest">Sign up with email</span>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Name */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">Full Name</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-xl">person</span>
                                            <input
                                                id="signup-name"
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="John Doe"
                                                className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-[#67829e] focus:border-transparent transition-all placeholder:text-slate-300 text-sm"
                                            />
                                        </div>
                                        {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">Email Address</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-xl">mail</span>
                                            <input
                                                id="signup-email"
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
                                                id="signup-password"
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
                                        <p className="text-[10px] text-slate-400">Must be at least 6 characters.</p>
                                        {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">Confirm Password</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-xl">lock</span>
                                            <input
                                                id="signup-confirm-password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-[#67829e] focus:border-transparent transition-all placeholder:text-slate-300 text-sm"
                                            />
                                        </div>
                                        {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
                                    </div>

                                    {/* Terms checkbox */}
                                    <div className="flex items-start gap-2 pt-2">
                                        <input className="mt-1 rounded border-slate-300 text-[#67829e] focus:ring-[#67829e]" id="terms" type="checkbox" />
                                        <label className="text-xs text-slate-500 leading-normal" htmlFor="terms">
                                            I agree to the <a className="text-[#67829e] hover:underline" href="#">Terms of Service</a> and <a className="text-[#67829e] hover:underline" href="#">Privacy Policy</a>.
                                        </label>
                                    </div>

                                    <button
                                        id="signup-submit"
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-12 rounded-lg bg-gradient-to-r from-[#67829e] to-teal-400 text-white font-bold text-base shadow-lg shadow-[#67829e]/20 hover:shadow-[#67829e]/40 transition-all flex items-center justify-center gap-2 group"
                                    >
                                        {loading ? (
                                            <LoadingSpinner size="sm" />
                                        ) : (
                                            <>
                                                <span>Create Account</span>
                                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>

                            <p className="mt-8 text-center text-sm text-slate-500">
                                Already have an account? <Link className="text-[#67829e] font-bold hover:underline" to="/login">Sign in</Link>
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
