import './GameCharacter.css'

/**
 * Modern SVG Avatar that changes based on BMI and calorie status.
 * Clean, rounded design with smooth gradients and animated aura.
 */
function GameCharacter({ bmi, calorieStatus = 'happy', size = 120 }) {
    let bodyType = 'normal'
    if (bmi && bmi < 18.5) bodyType = 'underweight'
    else if (bmi && bmi >= 25 && bmi < 30) bodyType = 'overweight'
    else if (bmi && bmi >= 30) bodyType = 'obese'

    const configs = {
        underweight: { bodyW: 22, bodyH: 34, headR: 16, skinGrad: 'skinThin', shirtColor: '#60a5fa', aura: '#60a5fa' },
        normal: { bodyW: 28, bodyH: 32, headR: 17, skinGrad: 'skinFit', shirtColor: '#00e5a0', aura: '#00e5a0' },
        overweight: { bodyW: 36, bodyH: 30, headR: 18, skinGrad: 'skinNorm', shirtColor: '#fbbf24', aura: '#fbbf24' },
        obese: { bodyW: 44, bodyH: 28, headR: 19, skinGrad: 'skinNorm', shirtColor: '#f87171', aura: '#f87171' }
    }

    const c = configs[bodyType]
    const cx = 50
    const groundY = 90
    const bodyTop = groundY - c.bodyH - 14
    const headY = bodyTop - c.headR + 4

    const statusEmoji = {
        happy: '💪',
        stuffed: '😵',
        exhausted: '😴'
    }

    const auraOpacity = calorieStatus === 'happy' ? 0.3 : calorieStatus === 'stuffed' ? 0.5 : 0.2

    return (
        <div className={`game-char game-char--${bodyType} game-char--${calorieStatus}`}
            style={{ width: size, height: size }}>
            <svg viewBox="0 0 100 100" className="game-char__svg">
                <defs>
                    <radialGradient id="auraGlow">
                        <stop offset="0%" stopColor={c.aura} stopOpacity={auraOpacity} />
                        <stop offset="100%" stopColor={c.aura} stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffcc80" />
                        <stop offset="100%" stopColor="#ffb74d" />
                    </linearGradient>
                    <linearGradient id="shirtGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={c.shirtColor} />
                        <stop offset="100%" stopColor={c.shirtColor} stopOpacity="0.7" />
                    </linearGradient>
                </defs>

                {/* Aura */}
                <circle cx={cx} cy={headY + 10} r={30} fill="url(#auraGlow)" className="game-char__aura" />

                {/* Shadow */}
                <ellipse cx={cx} cy={groundY + 2} rx={c.bodyW / 2 + 4} ry={3}
                    fill="rgba(0,0,0,0.15)" />

                {/* Legs */}
                <rect x={cx - 7} y={groundY - 14} width={6} height={14}
                    fill="#334155" rx={3} />
                <rect x={cx + 1} y={groundY - 14} width={6} height={14}
                    fill="#334155" rx={3} />

                {/* Shoes */}
                <rect x={cx - 8} y={groundY - 4} width={8} height={4}
                    fill="#1e293b" rx={2} />
                <rect x={cx} y={groundY - 4} width={8} height={4}
                    fill="#1e293b" rx={2} />

                {/* Body */}
                <rect x={cx - c.bodyW / 2} y={bodyTop} width={c.bodyW} height={c.bodyH}
                    fill="url(#shirtGrad)" rx={c.bodyW / 4} />

                {/* Arms */}
                <rect x={cx - c.bodyW / 2 - 5} y={bodyTop + 4} width={5} height={c.bodyH * 0.55}
                    fill="url(#skinGrad)" rx={2.5} className="game-char__arm-left" />
                <rect x={cx + c.bodyW / 2} y={bodyTop + 4} width={5} height={c.bodyH * 0.55}
                    fill="url(#skinGrad)" rx={2.5} className="game-char__arm-right" />

                {/* Head */}
                <circle cx={cx} cy={headY} r={c.headR}
                    fill="url(#skinGrad)" />

                {/* Hair */}
                <path d={`M${cx - c.headR + 2} ${headY - 4} Q${cx} ${headY - c.headR - 6} ${cx + c.headR - 2} ${headY - 4}`}
                    fill="#3f3f46" />

                {/* Eyes */}
                {calorieStatus === 'happy' ? (
                    <>
                        <circle cx={cx - 5} cy={headY - 1} r={2} fill="#1e293b" />
                        <circle cx={cx + 5} cy={headY - 1} r={2} fill="#1e293b" />
                        <circle cx={cx - 4.2} cy={headY - 1.8} r={0.7} fill="#fff" />
                        <circle cx={cx + 5.8} cy={headY - 1.8} r={0.7} fill="#fff" />
                    </>
                ) : calorieStatus === 'stuffed' ? (
                    <>
                        <line x1={cx - 7} y1={headY - 1} x2={cx - 3} y2={headY - 1} stroke="#1e293b" strokeWidth={1.5} strokeLinecap="round" />
                        <line x1={cx + 3} y1={headY - 1} x2={cx + 7} y2={headY - 1} stroke="#1e293b" strokeWidth={1.5} strokeLinecap="round" />
                    </>
                ) : (
                    <>
                        <circle cx={cx - 5} cy={headY} r={1.5} fill="#1e293b" />
                        <circle cx={cx + 5} cy={headY} r={1.5} fill="#1e293b" />
                        <line x1={cx - 7} y1={headY - 2} x2={cx - 3} y2={headY - 3} stroke="#1e293b" strokeWidth={0.8} strokeLinecap="round" />
                        <line x1={cx + 3} y1={headY - 3} x2={cx + 7} y2={headY - 2} stroke="#1e293b" strokeWidth={0.8} strokeLinecap="round" />
                    </>
                )}

                {/* Mouth */}
                {calorieStatus === 'happy' ? (
                    <path d={`M${cx - 4} ${headY + 4} Q${cx} ${headY + 8} ${cx + 4} ${headY + 4}`}
                        stroke="#1e293b" strokeWidth={1.2} fill="none" strokeLinecap="round" />
                ) : calorieStatus === 'stuffed' ? (
                    <ellipse cx={cx} cy={headY + 5} rx={3} ry={2.5} fill="#a3a3a3" opacity={0.5} />
                ) : (
                    <path d={`M${cx - 3} ${headY + 6} Q${cx} ${headY + 4} ${cx + 3} ${headY + 6}`}
                        stroke="#1e293b" strokeWidth={1} fill="none" strokeLinecap="round" />
                )}

                {/* Status effects */}
                {calorieStatus === 'exhausted' && (
                    <text x={cx + c.headR + 2} y={headY - 4} fontSize="6" className="game-char__zzz">Z</text>
                )}
                {calorieStatus === 'stuffed' && (
                    <>
                        <circle cx={cx + c.headR + 4} cy={headY} r={2} fill="none" stroke="#a3e635" strokeWidth={0.5} className="game-char__bubble1" />
                        <circle cx={cx + c.headR + 7} cy={headY - 4} r={1.5} fill="none" stroke="#a3e635" strokeWidth={0.5} className="game-char__bubble2" />
                    </>
                )}
            </svg>

            <div className="game-char__label">
                <span className="game-char__emoji">{statusEmoji[calorieStatus]}</span>
                <span className="game-char__type">
                    {bodyType === 'underweight' && 'Underweight'}
                    {bodyType === 'normal' && 'Fit'}
                    {bodyType === 'overweight' && 'Overweight'}
                    {bodyType === 'obese' && 'Obese'}
                </span>
            </div>
        </div>
    )
}

export default GameCharacter
