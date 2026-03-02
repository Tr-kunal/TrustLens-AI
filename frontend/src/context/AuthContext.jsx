import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('access_token')
        const savedUser = localStorage.getItem('user')
        if (token && savedUser) {
            setUser(JSON.parse(savedUser))
        }
        setLoading(false)
    }, [])

    const signup = async (name, email, password) => {
        try {
            const res = await api.post('/auth/signup', { name, email, password })
            localStorage.setItem('access_token', res.data.access_token)
            localStorage.setItem('refresh_token', res.data.refresh_token)

            // Fetch user profile
            const profileRes = await api.get('/auth/me')
            localStorage.setItem('user', JSON.stringify(profileRes.data))
            setUser(profileRes.data)
            toast.success('Account created successfully!')
            return true
        } catch (err) {
            const msg = err.response?.data?.detail || 'Signup failed'
            toast.error(msg)
            return false
        }
    }

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password })
            localStorage.setItem('access_token', res.data.access_token)
            localStorage.setItem('refresh_token', res.data.refresh_token)

            const profileRes = await api.get('/auth/me')
            localStorage.setItem('user', JSON.stringify(profileRes.data))
            setUser(profileRes.data)
            toast.success('Welcome back!')
            return true
        } catch (err) {
            const msg = err.response?.data?.detail || 'Login failed'
            toast.error(msg)
            return false
        }
    }

    const logout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        setUser(null)
        toast.success('Logged out')
    }

    return (
        <AuthContext.Provider value={{ user, loading, signup, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    )
}
