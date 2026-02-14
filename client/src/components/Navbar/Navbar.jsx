import { MdMenu, MdSearch, MdNotificationsNone, MdWaterDrop, MdDarkMode, MdLightMode } from 'react-icons/md'
import { useTheme } from '../../context/ThemeContext'
import './Navbar.css'

function Navbar({ onMenuToggle }) {
    const { theme, toggleTheme } = useTheme()

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
                        placeholder="Search meals, exercises, recipes..."
                    />
                    <span className="navbar__search-shortcut">⌘K</span>
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
                <button className="btn-icon navbar__action tooltip" data-tooltip="Log Water">
                    <MdWaterDrop />
                </button>
                <button className="btn-icon navbar__action navbar__notification tooltip" data-tooltip="Notifications">
                    <MdNotificationsNone />
                    <span className="navbar__notification-dot" />
                </button>
                <div className="navbar__profile">
                    <div className="navbar__avatar">
                        <span>U</span>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar
