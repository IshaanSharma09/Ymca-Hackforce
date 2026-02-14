import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar/Sidebar'
import Navbar from './components/Navbar/Navbar'
import GameBackground from './components/GameBackground/GameBackground'
import Onboarding from './components/Onboarding/Onboarding'
import Dashboard from './pages/Dashboard'
import MealLog from './pages/MealLog'
import Workout from './pages/Workout'
import Analysis from './pages/Analysis'
import Profile from './pages/Profile'
import Login from './pages/Login'
import { useState } from 'react'

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner" />
                <p className="text-muted">Loading FitFuel...</p>
            </div>
        )
    }

    if (!user) return <Navigate to="/login" replace />
    return children
}

function AppLayout() {
    const [collapsed, setCollapsed] = useState(false)
    const { needsOnboarding } = useAuth()

    if (needsOnboarding) {
        return <Onboarding />
    }

    return (
        <div className="app-layout">
            <GameBackground />
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
            <div className={`main-wrapper ${collapsed ? 'collapsed' : ''}`}>
                <Navbar onMenuToggle={() => setCollapsed(!collapsed)} />
                <main className="page-content">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/meals" element={<MealLog />} />
                        <Route path="/workout" element={<Workout />} />
                        <Route path="/analysis" element={<Analysis />} />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </main>
            </div>
        </div>
    )
}

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                path="/*"
                element={
                    <ProtectedRoute>
                        <AppLayout />
                    </ProtectedRoute>
                }
            />
        </Routes>
    )
}

export default App
