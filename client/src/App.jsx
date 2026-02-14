import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar/Sidebar'
import Navbar from './components/Navbar/Navbar'
import Dashboard from './pages/Dashboard'
import MealLog from './pages/MealLog'
import Workout from './pages/Workout'
import Analysis from './pages/Analysis'
import Profile from './pages/Profile'
import Login from './pages/Login'

function App() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    const toggleSidebar = () => {
        setSidebarCollapsed(prev => !prev)
    }

    return (
        <div className="app-layout">
            <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
            <div className={`main-wrapper ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <Navbar onMenuToggle={toggleSidebar} />
                <main className="page-content">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/meals" element={<MealLog />} />
                        <Route path="/workout" element={<Workout />} />
                        <Route path="/analysis" element={<Analysis />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </main>
            </div>
        </div>
    )
}

export default App
