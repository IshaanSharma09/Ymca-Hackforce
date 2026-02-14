import { useMemo } from 'react'
import './GameCharacter.css'

function GameCharacter({ bmi = 22, calorieStatus = 'happy', size = 140 }) {
    // Determine body type from BMI
    const bodyType = useMemo(() => {
        if (!bmi || bmi < 18.5) return 'slim'
        if (bmi < 25) return 'fit'
        if (bmi < 30) return 'bulky'
        return 'heavy'
    }, [bmi])

    // Expression & animation class
    const mood = calorieStatus === 'stuffed' ? 'stuffed' :
        calorieStatus === 'exhausted' ? 'tired' : 'happy'

    // Colors based on mood
    const skinColor = '#FFD5A8'
    const skinShadow = '#F0BE8A'
    const hairColor = '#3D2B1F'
    const shirtColor = mood === 'happy' ? '#00e5a0' : mood === 'stuffed' ? '#f59e0b' : '#94a3b8'
    const shirtDark = mood === 'happy' ? '#00c488' : mood === 'stuffed' ? '#d97706' : '#6b7a8d'
    const pantsColor = '#2d3748'

    return (
        <div className={`character character--${mood}`} style={{ width: size, height: size * 1.4 }}>
            {/* Glow / Aura */}
            <div className="character__aura" />

            <svg viewBox="0 0 100 140" className="character__svg">
                <defs>
                    {/* Body gradients */}
                    <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={skinColor} />
                        <stop offset="100%" stopColor={skinShadow} />
                    </linearGradient>
                    <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={shirtColor} />
                        <stop offset="100%" stopColor={shirtDark} />
                    </linearGradient>
                    <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={hairColor} />
                        <stop offset="100%" stopColor="#2A1D14" />
                    </linearGradient>
                    {/* Shadow */}
                    <radialGradient id="shadowGrad">
                        <stop offset="0%" stopColor="rgba(0,0,0,0.3)" />
                        <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                </defs>

                {/* Shadow on ground */}
                <ellipse cx="50" cy="136" rx="22" ry="4" fill="url(#shadowGrad)" className="character__shadow" />

                {/* ── LEGS ── */}
                <g className="character__legs">
                    {/* Left leg */}
                    <rect x="36" y="95" width="12" height="30" rx="6" fill={pantsColor} />
                    {/* Right leg */}
                    <rect x="52" y="95" width="12" height="30" rx="6" fill={pantsColor} />
                    {/* Shoes */}
                    <rect x="33" y="121" width="16" height="8" rx="4" fill="#1a1a2e" />
                    <rect x="51" y="121" width="16" height="8" rx="4" fill="#1a1a2e" />
                    {/* Shoe accent stripe */}
                    <rect x="35" y="124" width="10" height="2" rx="1" fill={shirtColor} />
                    <rect x="53" y="124" width="10" height="2" rx="1" fill={shirtColor} />
                </g>

                {/* ── BODY ── */}
                <g className="character__body">
                    {/* Torso */}
                    <rect x="32" y="55" width="36" height="42" rx="8" fill="url(#shirtGrad)" />
                    {/* Shirt v-neck */}
                    <path d="M44 55 L50 63 L56 55" fill="none" stroke={skinShadow} strokeWidth="1.5" />
                    {/* Shirt logo (small fire icon) */}
                    <circle cx="50" cy="72" r="5" fill="rgba(255,255,255,0.15)" />
                    <text x="50" y="75" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.5)">🔥</text>
                </g>

                {/* ── ARMS ── */}
                <g className="character__arms">
                    {/* Left arm */}
                    <rect x="22" y="58" width="12" height="28" rx="6" fill="url(#skinGrad)" className="character__arm--left" />
                    {/* Right arm */}
                    <rect x="66" y="58" width="12" height="28" rx="6" fill="url(#skinGrad)" className="character__arm--right" />
                    {/* Hands */}
                    <circle cx="28" cy="88" r="5" fill={skinColor} className="character__hand--left" />
                    <circle cx="72" cy="88" r="5" fill={skinColor} className="character__hand--right" />
                </g>

                {/* ── NECK ── */}
                <rect x="44" y="48" width="12" height="10" rx="4" fill="url(#skinGrad)" />

                {/* ── HEAD ── */}
                <g className="character__head">
                    {/* Face */}
                    <ellipse cx="50" cy="32" rx="20" ry="22" fill="url(#skinGrad)" />

                    {/* Hair */}
                    <ellipse cx="50" cy="20" rx="22" ry="14" fill="url(#hairGrad)" />
                    {/* Side hair */}
                    <rect x="28" y="18" width="6" height="18" rx="3" fill={hairColor} />
                    <rect x="66" y="18" width="6" height="18" rx="3" fill={hairColor} />
                    {/* Hair highlight */}
                    <ellipse cx="44" cy="15" rx="6" ry="3" fill="rgba(255,255,255,0.08)" />

                    {/* ── FACE FEATURES ── */}
                    {/* Eyebrows */}
                    <path d={mood === 'tired' ? "M37 27 Q40 29 43 28" : "M37 25 Q40 23 43 25"}
                        fill="none" stroke={hairColor} strokeWidth="1.2" strokeLinecap="round" />
                    <path d={mood === 'tired' ? "M57 27 Q60 29 63 28" : "M57 25 Q60 23 63 25"}
                        fill="none" stroke={hairColor} strokeWidth="1.2" strokeLinecap="round" />

                    {/* Eyes */}
                    {mood === 'tired' ? (
                        <>
                            <path d="M38 32 Q40.5 34 43 32" fill="none" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M57 32 Q59.5 34 62 32" fill="none" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round" />
                        </>
                    ) : (
                        <>
                            <ellipse cx="40" cy="32" rx="3.5" ry={mood === 'stuffed' ? 2.5 : 3.5} fill="#fff" />
                            <ellipse cx="60" cy="32" rx="3.5" ry={mood === 'stuffed' ? 2.5 : 3.5} fill="#fff" />
                            <circle cx="40" cy="32" r="2" fill="#2D2D2D">
                                <animate attributeName="cx" values="40;41;40;39;40" dur="4s" repeatCount="indefinite" />
                            </circle>
                            <circle cx="60" cy="32" r="2" fill="#2D2D2D">
                                <animate attributeName="cx" values="60;61;60;59;60" dur="4s" repeatCount="indefinite" />
                            </circle>
                            {/* Eye shine */}
                            <circle cx="41" cy="31" r="0.8" fill="#fff" />
                            <circle cx="61" cy="31" r="0.8" fill="#fff" />
                        </>
                    )}

                    {/* Nose */}
                    <path d="M49 36 Q50 38 51 36" fill="none" stroke={skinShadow} strokeWidth="0.8" />

                    {/* Mouth */}
                    {mood === 'happy' && (
                        <path d="M44 41 Q50 47 56 41" fill="none" stroke="#E57373" strokeWidth="1.5" strokeLinecap="round" />
                    )}
                    {mood === 'stuffed' && (
                        <ellipse cx="50" cy="42" rx="4" ry="3" fill="#E57373" />
                    )}
                    {mood === 'tired' && (
                        <path d="M45 43 Q50 40 55 43" fill="none" stroke="#999" strokeWidth="1.2" strokeLinecap="round" />
                    )}

                    {/* Rosy cheeks */}
                    <circle cx="35" cy="38" r="3" fill="rgba(255, 150, 150, 0.3)" />
                    <circle cx="65" cy="38" r="3" fill="rgba(255, 150, 150, 0.3)" />

                    {/* Headband */}
                    <rect x="29" y="22" width="42" height="3" rx="1.5" fill={shirtColor} />
                    <circle cx="50" cy="23.5" r="2.5" fill={shirtColor} stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                </g>

                {/* Status indicators */}
                {mood === 'happy' && (
                    <>
                        <text x="78" y="22" fontSize="8" className="character__sparkle">✨</text>
                        <text x="18" y="28" fontSize="6" className="character__sparkle" style={{ animationDelay: '0.5s' }}>⭐</text>
                    </>
                )}
                {mood === 'stuffed' && (
                    <>
                        <text x="75" y="25" fontSize="8" className="character__sweat">💦</text>
                        <text x="22" y="65" fontSize="6" className="character__sweat" style={{ animationDelay: '0.3s' }}>😵</text>
                    </>
                )}
                {mood === 'tired' && (
                    <>
                        <text x="65" y="18" fontSize="7" className="character__zzz">💤</text>
                        <text x="75" y="12" fontSize="5" className="character__zzz" style={{ animationDelay: '0.8s' }}>💤</text>
                    </>
                )}
            </svg>

            {/* Character label */}
            <div className="character__label">
                {mood === 'happy' ? '💪 Feeling Great!' : mood === 'stuffed' ? '🫃 Too Full!' : '😴 Low Energy'}
            </div>
        </div>
    )
}

export default GameCharacter
