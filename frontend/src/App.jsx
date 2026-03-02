import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import AnalysisResult from './pages/AnalysisResult'

export default function App() {
    return (
        <div className="min-h-screen bg-dark-950">
            <Navbar />
            <Routes>
                <Route path="/" element={<Landing />} />
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
                    path="/upload"
                    element={
                        <ProtectedRoute>
                            <Upload />
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
