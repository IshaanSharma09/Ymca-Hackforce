import { useTheme } from '../../context/ThemeContext'
import './GameBackground.css'

function GameBackground() {
    const { theme } = useTheme()
    const isNight = theme === 'dark'

    return (
        <div className={`game-bg ${isNight ? 'game-bg--night' : 'game-bg--day'}`}>
            {/* Gradient Mesh */}
            <div className="game-bg__mesh" />

            {/* Floating Orbs */}
            <div className="game-bg__orb game-bg__orb--1" />
            <div className="game-bg__orb game-bg__orb--2" />
            <div className="game-bg__orb game-bg__orb--3" />
            <div className="game-bg__orb game-bg__orb--4" />

            {/* Grid Overlay */}
            <div className="game-bg__grid" />

            {/* Particles */}
            {isNight && (
                <div className="game-bg__particles">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div
                            key={i}
                            className="game-bg__particle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 6}s`,
                                animationDuration: `${4 + Math.random() * 4}s`,
                                width: `${2 + Math.random() * 3}px`,
                                height: `${2 + Math.random() * 3}px`
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Noise Texture */}
            <div className="game-bg__noise" />
        </div>
    )
}

export default GameBackground
