import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const scrollToSection = (id) => {
        setMobileOpen(false)
        if (location.pathname !== '/') {
            navigate('/')
            setTimeout(() => {
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
            }, 300)
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
        }
    }
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200" style={{ fontFamily: "'Work Sans', 'Inter', sans-serif" }}>
            <div className="max-w-[1280px] mx-auto px-6 md:px-20">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2 group">
                            <span className="material-symbols-outlined text-teal-700 text-3xl">lens_blur</span>
                            <span className="text-xl font-bold text-slate-900 tracking-tight">TrustLens AI</span>
                        </Link>

                        {/* Nav links */}
                        <div className="hidden md:flex items-center gap-8">
                            {isAuthenticated ? (
                                <>
                                    <Link to="/dashboard" className="text-slate-600 text-sm font-medium hover:text-teal-700 transition-colors">
                                        Dashboard
                                    </Link>
                                    <Link to="/predict" className="text-slate-600 text-sm font-medium hover:text-teal-700 transition-colors">
                                        Price Predict
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => scrollToSection('features')} className="text-slate-600 text-sm font-medium hover:text-teal-700 transition-colors">
                                        Features
                                    </button>
                                    <button onClick={() => scrollToSection('workflow')} className="text-slate-600 text-sm font-medium hover:text-teal-700 transition-colors">
                                        Workflow
                                    </button>
                                    <Link to="/predict" className="text-slate-600 text-sm font-medium hover:text-teal-700 transition-colors">
                                        Price Predict
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="hidden md:flex items-center gap-3">
                        {isAuthenticated ? (
                            <>
                                <div className="flex items-center gap-3 mr-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-600 to-sky-600 flex items-center justify-center text-xs font-bold text-white">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">{user?.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center justify-center rounded-xl h-10 px-4 text-slate-600 text-sm font-bold hover:bg-slate-100 transition-all"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="flex items-center justify-center rounded-xl h-10 px-4 text-slate-700 text-sm font-bold hover:bg-slate-100 transition-all"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="flex items-center justify-center rounded-xl h-10 px-4 border border-teal-700/20 bg-teal-700/10 text-teal-700 text-sm font-bold hover:bg-teal-700/20 transition-all"
                                >
                                    Sign Up
                                </Link>
                                <Link
                                    to="/signup"
                                    className="flex items-center justify-center rounded-xl h-10 w-10 bg-gradient-to-r from-teal-700 to-sky-700 text-white shadow-lg shadow-teal-700/20 hover:opacity-90 transition-all"
                                >
                                    <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button className="md:hidden text-slate-600" onClick={() => setMobileOpen(!mobileOpen)}>
                        <span className="material-symbols-outlined text-2xl">
                            {mobileOpen ? 'close' : 'menu'}
                        </span>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden py-4 border-t border-slate-200">
                        {isAuthenticated ? (
                            <div className="flex flex-col gap-3">
                                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-slate-600 hover:text-teal-700 transition-colors py-2 text-sm font-medium">Dashboard</Link>
                                <Link to="/predict" onClick={() => setMobileOpen(false)} className="text-slate-600 hover:text-teal-700 transition-colors py-2 text-sm font-medium">Price Predict</Link>
                                <div className="flex items-center gap-3 py-2 border-t border-slate-100 mt-2 pt-4">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-600 to-sky-600 flex items-center justify-center text-xs font-bold text-white">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">{user?.name}</span>
                                </div>
                                <button onClick={() => { handleLogout(); setMobileOpen(false) }} className="text-left text-sm text-slate-500 hover:text-red-500 transition-colors py-2">Logout</button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <button onClick={() => scrollToSection('features')} className="text-left text-slate-600 hover:text-teal-700 py-2 text-sm font-medium">Features</button>
                                <button onClick={() => scrollToSection('workflow')} className="text-left text-slate-600 hover:text-teal-700 py-2 text-sm font-medium">Workflow</button>
                                <Link to="/predict" onClick={() => setMobileOpen(false)} className="text-slate-600 hover:text-teal-700 py-2 text-sm font-medium">Price Predict</Link>
                                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-slate-600 hover:text-teal-700 py-2 text-sm font-medium">Login</Link>
                                <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex items-center justify-center rounded-xl h-10 px-4 bg-gradient-to-r from-teal-700 to-sky-700 text-white text-sm font-bold mt-2">Get Started</Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}
