import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { HiShieldCheck, HiUser, HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi'
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
        <div className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4">
            <div className="w-full max-w-md animate-slide-up">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/20">
                        <HiShieldCheck className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                    <p className="text-dark-400">Join TrustLens AI and start verifying products</p>
                </div>

                {/* Form */}
                <div className="glass-card p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-dark-300 mb-1.5">Full Name</label>
                            <div className="relative">
                                <HiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500 w-5 h-5" />
                                <input
                                    id="signup-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="input-field !pl-11"
                                />
                            </div>
                            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-dark-300 mb-1.5">Email Address</label>
                            <div className="relative">
                                <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500 w-5 h-5" />
                                <input
                                    id="signup-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="john@example.com"
                                    className="input-field !pl-11"
                                />
                            </div>
                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-dark-300 mb-1.5">Password</label>
                            <div className="relative">
                                <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500 w-5 h-5" />
                                <input
                                    id="signup-password"
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

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-dark-300 mb-1.5">Confirm Password</label>
                            <div className="relative">
                                <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500 w-5 h-5" />
                                <input
                                    id="signup-confirm-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="input-field !pl-11"
                                />
                            </div>
                            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                        </div>

                        <button id="signup-submit" type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                            {loading ? <LoadingSpinner size="sm" /> : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center text-dark-400 text-sm mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
