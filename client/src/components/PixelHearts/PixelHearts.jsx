import './PixelHearts.css'

/**
 * Health score displayed as pixel hearts (like retro game HP).
 * 4 hearts = 100 points. Each heart = 25 points.
 * Full heart: ❤️  |  Half: 💔  |  Empty: 🖤
 */
function PixelHearts({ score = 0, maxHearts = 4 }) {
    const pointsPerHeart = 100 / maxHearts  // 25

    const hearts = Array.from({ length: maxHearts }, (_, i) => {
        const heartMin = i * pointsPerHeart
        const heartMax = heartMin + pointsPerHeart

        if (score >= heartMax) return 'full'
        if (score > heartMin) return 'half'
        return 'empty'
    })

    return (
        <div className="pixel-hearts">
            {hearts.map((state, i) => (
                <div key={i} className={`pixel-heart pixel-heart--${state}`}>
                    <svg viewBox="0 0 16 16" className="pixel-heart__svg">
                        {/* Pixel heart shape using rects */}
                        <rect x="2" y="2" width="4" height="4" />
                        <rect x="10" y="2" width="4" height="4" />
                        <rect x="0" y="4" width="4" height="4" />
                        <rect x="4" y="4" width="4" height="4" />
                        <rect x="8" y="4" width="4" height="4" />
                        <rect x="12" y="4" width="4" height="4" />
                        <rect x="0" y="8" width="4" height="4" />
                        <rect x="4" y="8" width="4" height="4" />
                        <rect x="8" y="8" width="4" height="4" />
                        <rect x="12" y="8" width="4" height="4" />
                        <rect x="2" y="10" width="4" height="4" />
                        <rect x="6" y="10" width="4" height="4" />
                        <rect x="10" y="10" width="4" height="4" />
                        <rect x="4" y="12" width="4" height="4" />
                        <rect x="8" y="12" width="4" height="4" />
                        <rect x="6" y="14" width="4" height="2" />
                    </svg>
                </div>
            ))}
        </div>
    )
}

export default PixelHearts
