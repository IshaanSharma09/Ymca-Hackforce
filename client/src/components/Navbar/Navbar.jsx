import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    MdMenu, MdSearch, MdNotifications, MdNotificationsNone,
    MdWaterDrop, MdDarkMode, MdLightMode, MdClose, MdCheckCircle,
    MdRestaurantMenu, MdDirectionsWalk
} from 'react-icons/md'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { useDailyLog } from '../../context/DailyLogContext'
import './Navbar.css'

function Navbar({ onMenuToggle }) {
    const { theme, toggleTheme } = useTheme()
    const { user } = useAuth()
    const { dailyData, addWater } = useDailyLog()
    const navigate = useNavigate()

    const [imgError, setImgError] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const noteRef = useRef(null)

    // Close notifications on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (noteRef.current && !noteRef.current.contains(event.target)) {
                setShowNotifications(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const getInitial = () => {
        const name = user?.displayName || user?.email || 'U'
        return name.charAt(0).toUpperCase()
    }

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            // Smart redirect based on query
            const q = searchQuery.toLowerCase()
            if (['push', 'pull', 'leg', 'sq', 'bench', 'dead', 'curl', 'press', 'fly'].some(k => q.includes(k))) {
                navigate(`/workout?q=${searchQuery}`)
            } else {
                navigate(`/meals?q=${searchQuery}`)
            }
            setSearchQuery('')
        }
    }

    // ── Smart Notifications Logic ──
    const getNotifications = () => {
        const notes = []
        const now = new Date()
        const hours = now.getHours()

        // Water Reminder
        if (dailyData.water < 8) {
            notes.push({
                id: 'water',
                icon: <MdWaterDrop style={{ color: '#06b6d4' }} />,
                title: 'Stay Hydrated!',
                msg: `You've drunk ${dailyData.water}/8 glasses. Time for another?`,
                action: <button className="note-btn" onClick={(e) => { e.stopPropagation(); addWater(); }}>+1 Cup</button>
            })
        }

        // Meal Reminders
        if (hours >= 11 && hours <= 14 && dailyData.caloriesConsumed < 400) {
            notes.push({ id: 'lunch', icon: <MdRestaurantMenu style={{ color: '#f59e0b' }} />, title: 'Lunch Time?', msg: 'Don\'t forget to log your lunch!', action: null })
        } else if (hours >= 18 && hours <= 21 && dailyData.caloriesConsumed < 1200) {
            notes.push({ id: 'dinner', icon: <MdRestaurantMenu style={{ color: '#ef4444' }} />, title: 'Dinner Reminder', msg: 'Have you logged your dinner yet?', action: null })
        }

        // Steps Goal
        if (dailyData.steps < 5000 && hours >= 18) {
            notes.push({ id: 'steps', icon: <MdDirectionsWalk style={{ color: '#3b82f6' }} />, title: 'Move a bit!', msg: `Only ${dailyData.steps} steps today. A short walk?`, action: null })
        }

        return notes
    }

    const notifications = getNotifications()
    const hasUnread = notifications.length > 0

    return (
        <header className="navbar">
            <div className="navbar__left">
                <button className="btn-icon navbar__menu-btn" onClick={onMenuToggle}>
                    <MdMenu />
                </button>
                <div className="navbar__search">
                    <MdSearch className="navbar__search-icon" />
                    <input
                        type="text"
                        className="navbar__search-input"
                        placeholder="Search meals (or exercises)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                    <span className="navbar__search-shortcut">Enter</span>
                </div>
            </div>

            <div className="navbar__right">
                <button
                    className="btn-icon navbar__action navbar__theme-toggle tooltip"
                    data-tooltip={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    onClick={toggleTheme}
                >
                    {theme === 'dark' ? <MdLightMode /> : <MdDarkMode />}
                </button>

                <button
                    className="btn-icon navbar__action tooltip"
                    data-tooltip="Quick Add Water"
                    onClick={addWater}
                >
                    <MdWaterDrop style={{ color: '#06b6d4' }} />
                </button>

                <div className="navbar__notify-wrapper" ref={noteRef}>
                    <button
                        className={`btn-icon navbar__action navbar__notification ${showNotifications ? 'active' : ''}`}
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        {hasUnread ? <MdNotifications style={{ color: 'var(--accent-start)' }} /> : <MdNotificationsNone />}
                        {hasUnread && <span className="navbar__notification-dot" />}
                    </button>

                    {showNotifications && (
                        <div className="navbar__notify-dropdown glass-card-static animate-scale-in">
                            <div className="notify-header">
                                <strong>Notifications</strong>
                                <span className="text-xs text-muted">{notifications.length} New</span>
                            </div>
                            <div className="notify-list">
                                {notifications.length === 0 ? (
                                    <div className="notify-empty">
                                        <MdCheckCircle style={{ color: '#22c55e', fontSize: '1.5rem' }} />
                                        <span>All caught up! Great job.</span>
                                    </div>
                                ) : (
                                    notifications.map(note => (
                                        <div key={note.id} className="notify-item">
                                            <div className="notify-icon">{note.icon}</div>
                                            <div className="notify-content">
                                                <div className="notify-title">{note.title}</div>
                                                <div className="notify-msg">{note.msg}</div>
                                                {note.action && <div className="notify-action">{note.action}</div>}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="navbar__profile" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
                    <div className="navbar__avatar tooltip" data-tooltip="My Profile">
                        {user?.photoURL && !imgError ? (
                            <img
                                src={user.photoURL}
                                alt="Avatar"
                                onError={() => setImgError(true)}
                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                            />
                        ) : (
                            <span>{getInitial()}</span>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar
