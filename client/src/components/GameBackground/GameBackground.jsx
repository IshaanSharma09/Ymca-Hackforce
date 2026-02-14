import { useTheme } from '../../context/ThemeContext'
import { useMemo } from 'react'
import './GameBackground.css'

function GameBackground() {
    const { theme } = useTheme()

    // Theme drives the landscape: light = day, dark = night
    const isNight = theme === 'dark'
    const timeClass = isNight ? 'night' : 'day'

    // Memoize random positions so they don't shift on re-render
    const starPositions = useMemo(() =>
        Array.from({ length: 60 }).map(() => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 50}%`,
            delay: `${Math.random() * 4}s`,
            size: `${1 + Math.random() * 2}px`
        })), [])

    const particlePositions = useMemo(() =>
        Array.from({ length: 12 }).map(() => ({
            left: `${10 + Math.random() * 80}%`,
            top: `${40 + Math.random() * 40}%`,
            delay: `${Math.random() * 5}s`,
            duration: `${3 + Math.random() * 4}s`
        })), [])

    return (
        <div className={`landscape landscape--${timeClass}`}>
            {/* Sky gradient */}
            <div className="landscape__sky" />

            {/* Stars (night / dark mode only) */}
            {isNight && (
                <div className="landscape__stars">
                    {starPositions.map((star, i) => (
                        <div
                            key={i}
                            className="landscape__star"
                            style={{
                                left: star.left,
                                top: star.top,
                                animationDelay: star.delay,
                                width: star.size,
                                height: star.size
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Sun / Moon */}
            <div className="landscape__celestial">
                {isNight ? (
                    <div className="landscape__moon">
                        <div className="landscape__moon-crater landscape__moon-crater--1" />
                        <div className="landscape__moon-crater landscape__moon-crater--2" />
                        <div className="landscape__moon-crater landscape__moon-crater--3" />
                        <div className="landscape__moon-glow" />
                    </div>
                ) : (
                    <div className="landscape__sun">
                        <div className="landscape__sun-glow" />
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="landscape__sun-ray"
                                style={{ transform: `rotate(${i * 45}deg)` }} />
                        ))}
                    </div>
                )}
            </div>

            {/* Clouds */}
            <div className="landscape__clouds">
                <div className="landscape__cloud landscape__cloud--1" />
                <div className="landscape__cloud landscape__cloud--2" />
                <div className="landscape__cloud landscape__cloud--3" />
            </div>

            {/* Far mountains */}
            <svg className="landscape__mountains landscape__mountains--far" viewBox="0 0 1440 200" preserveAspectRatio="none">
                <path d="M0,200 L0,120 Q120,40 240,100 Q360,20 480,80 Q560,30 680,90 Q780,10 900,70 Q1020,25 1100,85 Q1200,35 1300,75 Q1380,50 1440,90 L1440,200 Z" />
            </svg>

            {/* Near mountains */}
            <svg className="landscape__mountains landscape__mountains--near" viewBox="0 0 1440 200" preserveAspectRatio="none">
                <path d="M0,200 L0,140 Q100,70 200,120 Q320,50 440,110 Q520,60 640,100 Q740,40 860,95 Q960,55 1060,105 Q1140,60 1240,95 Q1340,70 1440,110 L1440,200 Z" />
            </svg>

            {/* Hills with trees */}
            <svg className="landscape__hills" viewBox="0 0 1440 160" preserveAspectRatio="none">
                <path d="M0,160 L0,100 Q180,50 360,90 Q540,40 720,80 Q900,30 1080,75 Q1260,45 1440,85 L1440,160 Z" />
            </svg>

            {/* Trees silhouette */}
            <div className="landscape__trees">
                {[8, 15, 22, 35, 42, 55, 62, 70, 78, 88, 95].map((pos, i) => (
                    <div key={i} className={`landscape__tree landscape__tree--${i % 3 === 0 ? 'tall' : i % 3 === 1 ? 'medium' : 'short'}`}
                        style={{ left: `${pos}%` }} />
                ))}
            </div>

            {/* Ground */}
            <div className="landscape__ground" />

            {/* Fireflies (night) / Butterflies (day) */}
            <div className="landscape__particles">
                {particlePositions.map((p, i) => (
                    <div key={i}
                        className={`landscape__particle landscape__particle--${isNight ? 'firefly' : 'butterfly'}`}
                        style={{
                            left: p.left,
                            top: p.top,
                            animationDelay: p.delay,
                            animationDuration: p.duration
                        }} />
                ))}
            </div>

            {/* Atmospheric overlay */}
            <div className="landscape__atmosphere" />
        </div>
    )
}

export default GameBackground
