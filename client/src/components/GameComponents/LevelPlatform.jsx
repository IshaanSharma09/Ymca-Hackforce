import './LevelPlatform.css'

/**
 * Floating platform component for the platformer-style level view.
 *
 * Props:
 *   label      – milestone name (e.g. "Calories")
 *   progress   – 0-100 percentage
 *   icon       – emoji or text icon
 *   reached    – boolean, has the user reached this platform?
 *   index      – platform position (0 = leftmost, ground)
 *   total      – total number of platforms
 *   color      – accent color for the platform
 */
function LevelPlatform({ label, progress, icon, reached, index, total, color = '#4caf50' }) {
    // Stagger platform heights: higher index = higher platform
    const heightOffset = index * 60
    const leftOffset = (index / (total - 1 || 1)) * 70 + 5 // 5–75% from left

    return (
        <div
            className={`level-platform ${reached ? 'level-platform--reached' : 'level-platform--locked'}`}
            style={{
                bottom: `${30 + heightOffset}px`,
                left: `${leftOffset}%`,
            }}
        >
            {/* Platform island */}
            <div className="level-platform__island">
                {/* Grass top */}
                <div className="level-platform__grass" />
                {/* Dirt body */}
                <div className="level-platform__dirt" />
            </div>

            {/* Content on top of platform */}
            <div className="level-platform__content">
                {reached && (
                    <div className="level-platform__flag">⛳</div>
                )}
                <div className="level-platform__icon" style={{ color }}>{icon}</div>
                <div className="level-platform__label">{label}</div>
                <div className="level-platform__progress">
                    <div className="level-platform__progress-bar">
                        <div
                            className="level-platform__progress-fill"
                            style={{ width: `${Math.min(progress, 100)}%`, background: color }}
                        />
                    </div>
                    <span className="level-platform__pct">{Math.round(progress)}%</span>
                </div>
            </div>
        </div>
    )
}

export default LevelPlatform
