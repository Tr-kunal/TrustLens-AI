import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { HiShieldCheck, HiMenu, HiX } from 'react-icons/hi'
import { useState } from 'react'

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-white/5">
            <div className="section-container">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow">
                            <HiShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold gradient-text">TrustLens AI</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-6">
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="text-dark-300 hover:text-white transition-colors text-sm font-medium">
                                    Dashboard
                                </Link>
                                <Link to="/upload" className="text-dark-300 hover:text-white transition-colors text-sm font-medium">
                                    Upload
                                </Link>
                                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <span className="text-sm text-dark-300">{user?.name}</span>
                                    <button onClick={handleLogout} className="text-sm text-dark-400 hover:text-red-400 transition-colors ml-2">
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-dark-300 hover:text-white transition-colors text-sm font-medium">
                                    Login
                                </Link>
                                <Link to="/signup" className="btn-primary text-sm !py-2 !px-4">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button className="md:hidden text-dark-300" onClick={() => setMobileOpen(!mobileOpen)}>
                        {mobileOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden py-4 border-t border-white/5 animate-slide-down">
                        {isAuthenticated ? (
                            <div className="flex flex-col gap-3">
                                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-dark-300 hover:text-white transition-colors py-2">Dashboard</Link>
                                <Link to="/upload" onClick={() => setMobileOpen(false)} className="text-dark-300 hover:text-white transition-colors py-2">Upload</Link>
                                <button onClick={() => { handleLogout(); setMobileOpen(false) }} className="text-left text-dark-400 hover:text-red-400 transition-colors py-2">Logout</button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-dark-300 hover:text-white py-2">Login</Link>
                                <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-primary text-center text-sm">Get Started</Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}
