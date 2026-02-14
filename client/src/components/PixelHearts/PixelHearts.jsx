import './PixelHearts.css'

/**
 * Modern XP/Health Bar — replaces pixel hearts.
 * Shows a gradient-filled bar with level badge and HP value.
 */
function PixelHearts({ score = 0 }) {
    const level = Math.floor(score / 25) + 1
    const clampedScore = Math.min(Math.max(score, 0), 100)

    const getBarColor = () => {
        if (clampedScore >= 75) return 'var(--accent-gradient)'
        if (clampedScore >= 50) return 'linear-gradient(135deg, #00e5a0, #fbbf24)'
        if (clampedScore >= 25) return 'linear-gradient(135deg, #fbbf24, #f87171)'
        return 'linear-gradient(135deg, #f87171, #ef4444)'
    }

    return (
        <div className="xp-bar-wrapper">
            <div className="xp-bar-level">
                <span className="xp-bar-level__badge">LVL {level}</span>
            </div>
            <div className="xp-bar-container">
                <div className="xp-bar-track">
                    <div
                        className="xp-bar-fill"
                        style={{ width: `${clampedScore}%`, background: getBarColor() }}
                    />
                </div>
                <span className="xp-bar-value">{clampedScore} HP</span>
            </div>
        </div>
    )
}

export default PixelHearts
