import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    MdMenu, MdSearch, MdNotifications, MdNotificationsNone,
    MdWaterDrop, MdDarkMode, MdLightMode, MdClose, MdCheckCircle,
    MdRestaurantMenu, MdDirectionsWalk, MdAccessTime, MdBedtime,
    MdFitnessCenter
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

    // Periodic notification popup (every 30 min if water low)
    const [showReminder, setShowReminder] = useState(false)
    useEffect(() => {
        const timer = setInterval(() => {
            const hour = new Date().getHours()
            if (hour >= 8 && hour <= 22 && dailyData.water < 8) {
                setShowReminder(true)
                setTimeout(() => setShowReminder(false), 4000)
            }
        }, 30 * 60 * 1000) // every 30 min
        return () => clearInterval(timer)
    }, [dailyData.water])

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
            const q = searchQuery.toLowerCase()
            if (['push', 'pull', 'leg', 'sq', 'bench', 'dead', 'curl', 'press', 'fly'].some(k => q.includes(k))) {
                navigate(`/workout?q=${searchQuery}`)
            } else {
                navigate(`/meals?q=${searchQuery}`)
            }
            setSearchQuery('')
        }
    }

    const formatTime = () => {
        const now = new Date()
        return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    }

    // ── Smart Notifications Logic ──
    const getNotifications = () => {
        const notes = []
        const now = new Date()
        const hours = now.getHours()

        // Water Reminder — always show if below target
        if (dailyData.water < 8) {
            const glassesLeft = 8 - dailyData.water
            notes.push({
                id: 'water',
                icon: <MdWaterDrop style={{ color: '#06b6d4' }} />,
                title: '💧 Stay Hydrated!',
                msg: `${dailyData.water}/8 glasses today. ${glassesLeft} more to go!`,
                time: formatTime(),
                action: <button className="note-btn" onClick={(e) => { e.stopPropagation(); addWater(); }}>+1 Glass</button>
            })
        }

        // Breakfast reminder (7-10 AM, no food logged)
        if (hours >= 7 && hours < 10 && dailyData.caloriesConsumed === 0) {
            notes.push({
                id: 'breakfast',
                icon: <MdRestaurantMenu style={{ color: '#f59e0b' }} />,
                title: '🌅 Good Morning!',
                msg: "Don't skip breakfast! Log your first meal to start the day.",
                time: formatTime(),
                action: <button className="note-btn" onClick={(e) => { e.stopPropagation(); navigate('/meals'); setShowNotifications(false); }}>Log Meal</button>
            })
        }

        // Lunch Reminder (11 AM - 2 PM)
        if (hours >= 11 && hours <= 14 && dailyData.caloriesConsumed < 400) {
            notes.push({
                id: 'lunch',
                icon: <MdRestaurantMenu style={{ color: '#f59e0b' }} />,
                title: '🍽️ Lunch Time!',
                msg: "It's lunch time. Have you eaten? Log your meal!",
                time: formatTime(),
                action: <button className="note-btn" onClick={(e) => { e.stopPropagation(); navigate('/meals'); setShowNotifications(false); }}>Log Lunch</button>
            })
        }

        // Dinner Reminder (6-9 PM)
        if (hours >= 18 && hours <= 21 && dailyData.caloriesConsumed < 1200) {
            notes.push({
                id: 'dinner',
                icon: <MdRestaurantMenu style={{ color: '#ef4444' }} />,
                title: '🍲 Dinner Reminder',
                msg: "Have you logged your dinner yet?",
                time: formatTime(),
                action: <button className="note-btn" onClick={(e) => { e.stopPropagation(); navigate('/meals'); setShowNotifications(false); }}>Log Dinner</button>
            })
        }

        // Steps Goal (after 6 PM)
        if (dailyData.steps < 5000 && hours >= 18) {
            notes.push({
                id: 'steps',
                icon: <MdDirectionsWalk style={{ color: '#3b82f6' }} />,
                title: '🚶 Move More!',
                msg: `Only ${dailyData.steps.toLocaleString()} steps today. Take a short walk?`,
                time: formatTime(),
                action: null
            })
        }

        // Workout reminder (if none today, after 3 PM)
        if (dailyData.workoutsToday === 0 && hours >= 15) {
            notes.push({
                id: 'workout',
                icon: <MdFitnessCenter style={{ color: '#8b5cf6' }} />,
                title: '🏋️ Workout Time!',
                msg: "No workout logged today. Hit the gym?",
                time: formatTime(),
                action: <button className="note-btn" onClick={(e) => { e.stopPropagation(); navigate('/workout'); setShowNotifications(false); }}>Start Workout</button>
            })
        }

        // Sleep reminder (10 PM - 12 AM)
        if (hours >= 22 && dailyData.sleep === 0) {
            notes.push({
                id: 'sleep',
                icon: <MdBedtime style={{ color: '#a78bfa' }} />,
                title: '😴 Time to Rest',
                msg: "It's getting late! Log your sleep and rest well.",
                time: formatTime(),
                action: null
            })
        }

        // All goals met — celebration
        if (notes.length === 0) {
            notes.push({
                id: 'allgood',
                icon: <MdCheckCircle style={{ color: '#22c55e' }} />,
                title: '🎉 All Goals Met!',
                msg: "Amazing job today! Keep up the streak!",
                time: formatTime(),
                action: null
            })
        }

        return notes
    }

    const notifications = getNotifications()
    const hasUnread = notifications.some(n => n.id !== 'allgood')

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
                        placeholder="Search meals or exercises..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                </div>
            </div>

            <div className="navbar__right">
                {/* Water Quick-Add with counter */}
                <div className="navbar__water-quick tooltip" data-tooltip={`Water: ${dailyData.water}/8`}>
                    <button className="navbar__water-btn" onClick={addWater}>
                        <MdWaterDrop />
                        <span className="navbar__water-count">{dailyData.water}</span>
                    </button>
                    <div className="navbar__water-meter">
                        <div
                            className="navbar__water-fill"
                            style={{ width: `${Math.min((dailyData.water / 8) * 100, 100)}%` }}
                        />
                    </div>
                </div>

                <button
                    className="btn-icon navbar__action navbar__theme-toggle tooltip"
                    data-tooltip={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    onClick={toggleTheme}
                >
                    {theme === 'dark' ? <MdLightMode /> : <MdDarkMode />}
                </button>

                <div className="navbar__notify-wrapper" ref={noteRef}>
                    <button
                        className={`btn-icon navbar__action navbar__notification ${showNotifications ? 'active' : ''}`}
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        {hasUnread ? <MdNotifications style={{ color: 'var(--accent-start)' }} /> : <MdNotificationsNone />}
                        {hasUnread && <span className="navbar__notification-dot" />}
                        {hasUnread && <span className="navbar__badge-count">{notifications.filter(n => n.id !== 'allgood').length}</span>}
                    </button>

                    {showNotifications && (
                        <div className="navbar__notify-dropdown glass-card-static animate-scale-in">
                            <div className="notify-header">
                                <strong style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Notifications</strong>
                                <span className="text-xs text-muted">{notifications.filter(n => n.id !== 'allgood').length} Reminders</span>
                            </div>
                            <div className="notify-list">
                                {notifications.map(note => (
                                    <div key={note.id} className="notify-item">
                                        <div className="notify-icon">{note.icon}</div>
                                        <div className="notify-content">
                                            <div className="notify-title">{note.title}</div>
                                            <div className="notify-msg">{note.msg}</div>
                                            <div className="notify-meta">
                                                <MdAccessTime size={12} />
                                                <span>{note.time}</span>
                                            </div>
                                            {note.action && <div className="notify-action">{note.action}</div>}
                                        </div>
                                    </div>
                                ))}
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

            {/* Pop-up water reminder toast */}
            {showReminder && (
                <div className="navbar__toast animate-scale-in">
                    <MdWaterDrop style={{ color: '#06b6d4', fontSize: '1.3rem' }} />
                    <span>Drink water! {dailyData.water}/8 glasses</span>
                    <button className="note-btn" onClick={() => { addWater(); setShowReminder(false); }}>+1</button>
                </div>
            )}
        </header>
    )
}

export default Navbar
