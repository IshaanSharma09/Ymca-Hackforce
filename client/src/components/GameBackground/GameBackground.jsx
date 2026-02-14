import { useTheme } from '../../context/ThemeContext'
import './GameBackground.css'

function GameBackground() {
    const { theme } = useTheme()
    const isNight = theme === 'dark'

    return (
        <div className={`game-bg ${isNight ? 'game-bg--night' : 'game-bg--day'}`}>
            {/* Sky */}
            <div className="game-bg__sky" />

            {/* Stars (night only) */}
            {isNight && (
                <div className="game-bg__stars">
                    {Array.from({ length: 30 }).map((_, i) => (
                        <div
                            key={i}
                            className="game-bg__star"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 40}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                width: `${2 + Math.random() * 3}px`,
                                height: `${2 + Math.random() * 3}px`
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Clouds */}
            <div className="game-bg__clouds">
                <div className="game-bg__cloud game-bg__cloud--1" />
                <div className="game-bg__cloud game-bg__cloud--2" />
                <div className="game-bg__cloud game-bg__cloud--3" />
                <div className="game-bg__cloud game-bg__cloud--4" />
            </div>

            {/* Distant trees */}
            <div className="game-bg__trees-far">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="game-bg__tree-far" style={{ left: `${i * 8.5}%` }} />
                ))}
            </div>

            {/* Near trees */}
            <div className="game-bg__trees-near">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="game-bg__tree-near" style={{ left: `${5 + i * 13}%` }} />
                ))}
            </div>

            {/* Ground: grass + dirt */}
            <div className="game-bg__ground">
                <div className="game-bg__grass" />
                <div className="game-bg__dirt" />
            </div>
        </div>
    )
}

export default GameBackground
