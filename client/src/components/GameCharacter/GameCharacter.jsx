import './GameCharacter.css'

/**
 * Pixel-art character that changes based on BMI and calorie status.
 *
 * BMI body types:
 *   underweight (< 18.5)  → very thin
 *   normal      (18.5–24) → fit / athletic
 *   overweight  (25–29)   → stocky
 *   obese       (30+)     → large / round
 *
 * Calorie expressions:
 *   stuffed   → ate too much  → bloated face
 *   exhausted → ate too little → tired face
 *   happy     → balanced       → energetic face
 */
function GameCharacter({ bmi, calorieStatus = 'happy', size = 120 }) {
    // Determine body type from BMI
    let bodyType = 'normal'
    if (bmi && bmi < 18.5) bodyType = 'underweight'
    else if (bmi && bmi >= 25 && bmi < 30) bodyType = 'overweight'
    else if (bmi && bmi >= 30) bodyType = 'obese'

    // Body dimensions based on type
    const bodies = {
        underweight: { w: 18, h: 30, headR: 10, legW: 4, armW: 3, color: '#9e9e9e', shirt: '#42a5f5' },
        normal: { w: 24, h: 28, headR: 11, legW: 6, armW: 5, color: '#ffb74d', shirt: '#42a5f5' },
        overweight: { w: 34, h: 26, headR: 12, legW: 8, armW: 6, color: '#ffb74d', shirt: '#9e9e9e' },
        obese: { w: 44, h: 24, headR: 13, legW: 10, armW: 7, color: '#ffb74d', shirt: '#9e9e9e' }
    }

    const b = bodies[bodyType]

    // Face expression
    const expressions = {
        happy: { mouth: 'smile', eyes: 'open', eyebrowY: 0 },
        stuffed: { mouth: 'bloat', eyes: 'squint', eyebrowY: 2 },
        exhausted: { mouth: 'frown', eyes: 'droopy', eyebrowY: -1 }
    }

    const expr = expressions[calorieStatus] || expressions.happy

    const cx = 50 // center x
    const groundY = 88
    const bodyTop = groundY - b.h - 14 // legs height = 14
    const headY = bodyTop - b.headR

    return (
        <div className={`game-char game-char--${bodyType} game-char--${calorieStatus}`}
            style={{ width: size, height: size }}>
            <svg viewBox="0 0 100 100" className="game-char__svg">
                {/* Shadow on ground */}
                <ellipse cx={cx} cy={groundY + 2} rx={b.w / 2 + 6} ry={3}
                    fill="rgba(0,0,0,0.2)" />

                {/* Legs */}
                <rect x={cx - b.legW - 2} y={groundY - 14} width={b.legW} height={14}
                    fill="#4a4a4a" rx={1} />
                <rect x={cx + 2} y={groundY - 14} width={b.legW} height={14}
                    fill="#4a4a4a" rx={1} />

                {/* Shoes */}
                <rect x={cx - b.legW - 3} y={groundY - 3} width={b.legW + 2} height={3}
                    fill="#1565c0" rx={1} />
                <rect x={cx + 1} y={groundY - 3} width={b.legW + 2} height={3}
                    fill="#1565c0" rx={1} />

                {/* Body / Shirt */}
                <rect x={cx - b.w / 2} y={bodyTop} width={b.w} height={b.h}
                    fill={b.shirt} rx={2} stroke="#333" strokeWidth={0.5} />

                {/* Arms */}
                {bodyType === 'normal' ? (
                    <>
                        {/* Muscular flex pose */}
                        <rect x={cx - b.w / 2 - b.armW - 1} y={bodyTop + 2} width={b.armW} height={b.h * 0.5}
                            fill={b.color} rx={1} className="game-char__arm-left" />
                        <rect x={cx + b.w / 2 + 1} y={bodyTop + 2} width={b.armW} height={b.h * 0.5}
                            fill={b.color} rx={1} className="game-char__arm-right" />
                    </>
                ) : (
                    <>
                        {/* Arms down */}
                        <rect x={cx - b.w / 2 - b.armW} y={bodyTop + 4} width={b.armW} height={b.h * 0.65}
                            fill={b.color} rx={1} />
                        <rect x={cx + b.w / 2} y={bodyTop + 4} width={b.armW} height={b.h * 0.65}
                            fill={b.color} rx={1} />
                    </>
                )}

                {/* Head */}
                <circle cx={cx} cy={headY} r={b.headR}
                    fill={b.color} stroke="#333" strokeWidth={0.5} />

                {/* Hair */}
                <rect x={cx - b.headR} y={headY - b.headR} width={b.headR * 2} height={5}
                    fill="#5d4037" rx={1} />
                <rect x={cx - b.headR + 1} y={headY - b.headR - 2} width={b.headR * 2 - 4} height={3}
                    fill="#5d4037" rx={1} />

                {/* Eyes */}
                {expr.eyes === 'open' ? (
                    <>
                        <rect x={cx - 4} y={headY - 2 + expr.eyebrowY} width={2.5} height={2.5} fill="#333" />
                        <rect x={cx + 2} y={headY - 2 + expr.eyebrowY} width={2.5} height={2.5} fill="#333" />
                    </>
                ) : expr.eyes === 'squint' ? (
                    <>
                        <line x1={cx - 5} y1={headY - 1} x2={cx - 1} y2={headY - 1} stroke="#333" strokeWidth={1.5} />
                        <line x1={cx + 1} y1={headY - 1} x2={cx + 5} y2={headY - 1} stroke="#333" strokeWidth={1.5} />
                    </>
                ) : (
                    /* droopy */
                    <>
                        <rect x={cx - 4} y={headY - 1} width={2.5} height={1.5} fill="#333" />
                        <rect x={cx + 2} y={headY - 1} width={2.5} height={1.5} fill="#333" />
                        <line x1={cx - 5} y1={headY - 2} x2={cx - 2} y2={headY - 3} stroke="#333" strokeWidth={0.5} />
                        <line x1={cx + 2} y1={headY - 3} x2={cx + 5} y2={headY - 2} stroke="#333" strokeWidth={0.5} />
                    </>
                )}

                {/* Mouth */}
                {expr.mouth === 'smile' ? (
                    <path d={`M${cx - 3} ${headY + 3} Q${cx} ${headY + 6} ${cx + 3} ${headY + 3}`}
                        stroke="#333" strokeWidth={1} fill="none" />
                ) : expr.mouth === 'bloat' ? (
                    <ellipse cx={cx} cy={headY + 4} rx={3} ry={2} fill="#795548" stroke="#333" strokeWidth={0.5} />
                ) : (
                    <path d={`M${cx - 3} ${headY + 5} Q${cx} ${headY + 3} ${cx + 3} ${headY + 5}`}
                        stroke="#333" strokeWidth={1} fill="none" />
                )}

                {/* Sweat drop for exhausted */}
                {calorieStatus === 'exhausted' && (
                    <path d={`M${cx + b.headR + 2} ${headY - 2} Q${cx + b.headR + 4} ${headY + 1} ${cx + b.headR + 2} ${headY + 3}`}
                        fill="#4fc3f7" stroke="#0288d1" strokeWidth={0.3} className="game-char__sweat" />
                )}

                {/* Bloat bubbles for stuffed */}
                {calorieStatus === 'stuffed' && (
                    <>
                        <circle cx={cx + b.headR + 3} cy={headY + 2} r={1.5}
                            fill="none" stroke="#81c784" strokeWidth={0.5} className="game-char__bubble1" />
                        <circle cx={cx + b.headR + 5} cy={headY - 1} r={1}
                            fill="none" stroke="#81c784" strokeWidth={0.5} className="game-char__bubble2" />
                    </>
                )}
            </svg>

            <div className="game-char__label">
                {bodyType === 'underweight' && '🏃 Underweight'}
                {bodyType === 'normal' && '💪 Fit'}
                {bodyType === 'overweight' && '⚡ Overweight'}
                {bodyType === 'obese' && '🎯 Obese'}
            </div>
        </div>
    )
}

export default GameCharacter
