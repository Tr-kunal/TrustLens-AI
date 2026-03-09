import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { HiShieldCheck, HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi'
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
        <div className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4">
            <div className="w-full max-w-md animate-slide-up">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/20">
                        <HiShieldCheck className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-dark-400">Sign in to your TrustLens AI account</p>
                </div>

                <div className="glass-card p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-dark-300 mb-1.5">Email Address</label>
                            <div className="relative">
                                <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500 w-5 h-5" />
                                <input
                                    id="login-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="john@example.com"
                                    className="input-field !pl-11"
                                />
                            </div>
                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-300 mb-1.5">Password</label>
                            <div className="relative">
                                <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500 w-5 h-5" />
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="input-field !pl-11 !pr-11"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300">
                                    {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                        </div>

                        <button id="login-submit" type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                            {loading ? <LoadingSpinner size="sm" /> : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center text-dark-400 text-sm mt-6">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-medium">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
