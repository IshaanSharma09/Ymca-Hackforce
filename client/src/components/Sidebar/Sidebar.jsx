import { NavLink, useLocation } from 'react-router-dom'
import {
    MdDashboard,
    MdRestaurantMenu,
    MdFitnessCenter,
    MdAnalytics,
    MdPerson,
    MdKeyboardDoubleArrowLeft,
    MdKeyboardDoubleArrowRight,
    MdLocalFireDepartment
} from 'react-icons/md'
import './Sidebar.css'

const navItems = [
    { path: '/', icon: MdDashboard, label: 'Dashboard' },
    { path: '/meals', icon: MdRestaurantMenu, label: 'Meals' },
    { path: '/workout', icon: MdFitnessCenter, label: 'Workout' },
    { path: '/analysis', icon: MdAnalytics, label: 'Analysis' },
    { path: '/profile', icon: MdPerson, label: 'Profile' }
]

function Sidebar({ collapsed, onToggle }) {
    const location = useLocation()

    return (
        <>
            {/* Mobile overlay */}
            {!collapsed && (
                <div className="sidebar-overlay" onClick={onToggle} />
            )}

            <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
                {/* Logo */}
                <div className="sidebar__logo">
                    <div className="sidebar__logo-icon">
                        <MdLocalFireDepartment />
                    </div>
                    {!collapsed && (
                        <div className="sidebar__logo-text">
                            <span className="sidebar__logo-name">FitFuel</span>
                            <span className="sidebar__logo-tagline">AI Health Companion</span>
                        </div>
                    )}
                </div>

                <div className="sidebar__divider" />

                {/* Navigation */}
                <nav className="sidebar__nav">
                    {navItems.map(item => {
                        const Icon = item.icon
                        const isActive = location.pathname === item.path
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
                            >
                                <div className="sidebar__link-indicator" />
                                <Icon className="sidebar__link-icon" />
                                {!collapsed && <span className="sidebar__link-label">{item.label}</span>}
                                {collapsed && (
                                    <span className="sidebar__tooltip">{item.label}</span>
                                )}
                            </NavLink>
                        )
                    })}
                </nav>

                {/* Bottom section */}
                <div className="sidebar__bottom">
                    <div className="sidebar__divider" />
                    {!collapsed && (
                        <div className="sidebar__version">
                            <span>v1.0.0</span>
                            <span className="badge badge-success">Beta</span>
                        </div>
                    )}
                    <button className="sidebar__toggle" onClick={onToggle}>
                        {collapsed ? <MdKeyboardDoubleArrowRight /> : <MdKeyboardDoubleArrowLeft />}
                        {!collapsed && <span>Collapse</span>}
                    </button>
                </div>
            </aside>
        </>
    )
}

export default Sidebar
