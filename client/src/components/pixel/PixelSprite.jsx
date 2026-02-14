import { useMemo } from 'react'
import './PixelSprite.css'

/**
 * Renders a pixel art sprite from a string matrix.
 * 
 * @param {string[]} data - Array of strings representing rows. Char = color key.
 * @param {Object} palette - Map of char keys to CSS colors.
 * @param {number} scale - Size of one "pixel" in css pixels (default 4).
 */
function PixelSprite({ data = [], palette = {}, scale = 4, className = '' }) {

    // Memoize the pixel grid generation for performance
    const pixels = useMemo(() => {
        const grid = []
        data.forEach((row, rowIndex) => {
            row.split('').forEach((char, colIndex) => {
                if (char === ' ' || char === '.') return // Transparent

                const color = palette[char] || 'transparent'
                grid.push(
                    <div
                        key={`${rowIndex}-${colIndex}`}
                        className="pixel-unit"
                        style={{
                            backgroundColor: color,
                            top: `${rowIndex * scale}px`,
                            left: `${colIndex * scale}px`,
                            width: `${scale}px`,
                            height: `${scale}px`
                        }}
                    />
                )
            })
        })
        return grid
    }, [data, palette, scale])

    const width = (data[0]?.length || 0) * scale
    const height = data.length * scale

    return (
        <div
            className={`pixel-sprite ${className}`}
            style={{ width, height }}
        >
            {pixels}
        </div>
    )
}

export default PixelSprite
