import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AnalysisResult from './pages/AnalysisResult'
import PhonePrediction from './pages/PhonePrediction'

const HIDE_NAVBAR_ROUTES = ['/predict']

export default function App() {
    const location = useLocation()
    const hideNavbar = HIDE_NAVBAR_ROUTES.includes(location.pathname)

    return (
        <div className="min-h-screen bg-dark-950">
            {!hideNavbar && <Navbar />}
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/predict" element={<PhonePrediction />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/report/:id"
                    element={
                        <ProtectedRoute>
                            <AnalysisResult />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    )
}
