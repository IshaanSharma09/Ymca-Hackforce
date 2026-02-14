import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import {
    MdLocalFireDepartment, MdRestaurantMenu, MdFitnessCenter,
    MdWaterDrop, MdDirectionsWalk, MdBedtime, MdAdd, MdTrendingUp,
    MdTrendingDown, MdArrowForward
} from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

function Dashboard() {
    const { user, getUserProfile } = useAuth()
    const profile = getUserProfile() || {}
    const navigate = useNavigate()

    // Simulated daily data (will be real in later stages)
    const [dailyData, setDailyData] = useState({
        caloriesConsumed: 0,
        caloriesBurned: 0,
        protein: 0, carbs: 0, fat: 0,
        steps: 0,
        water: 0,
        sleep: 0,
        workoutsToday: 0
    })

    // Load saved daily data
    useEffect(() => {
        if (user) {
            const today = new Date().toISOString().split('T')[0]
            const saved = localStorage.getItem(`fitfuel-daily-${user.uid}-${today}`)
            if (saved) setDailyData(JSON.parse(saved))
        }
    }, [user])

    // Save daily data
    const saveDailyData = (newData) => {
        const today = new Date().toISOString().split('T')[0]
        setDailyData(newData)
        localStorage.setItem(`fitfuel-daily-${user.uid}-${today}`, JSON.stringify(newData))
    }

    // Quick actions
    const addWater = () => {
        const newData = { ...dailyData, water: dailyData.water + 1 }
        saveDailyData(newData)
    }

    const addSteps = () => {
        const steps = parseInt(prompt('Enter steps:') || '0')
        if (steps > 0) {
            const caloriesFromSteps = Math.round(steps * 0.04)
            const newData = {
                ...dailyData,
                steps: dailyData.steps + steps,
                caloriesBurned: dailyData.caloriesBurned + caloriesFromSteps
            }
            saveDailyData(newData)
        }
    }

    const addSleep = () => {
        const hours = parseFloat(prompt('Hours slept last night:') || '0')
        if (hours > 0) {
            saveDailyData({ ...dailyData, sleep: hours })
        }
    }

    const quickLogCalories = () => {
        const cal = parseInt(prompt('Quick log — calories consumed:') || '0')
        const pro = parseInt(prompt('Protein (g):') || '0')
        const carb = parseInt(prompt('Carbs (g):') || '0')
        const fat = parseInt(prompt('Fat (g):') || '0')
        if (cal > 0) {
            const newData = {
                ...dailyData,
                caloriesConsumed: dailyData.caloriesConsumed + cal,
                protein: dailyData.protein + pro,
                carbs: dailyData.carbs + carb,
                fat: dailyData.fat + fat
            }
            saveDailyData(newData)
        }
    }

    // Calculations
    const calorieTarget = profile.dailyCalorieTarget || 2000
    const calorieProgress = Math.min((dailyData.caloriesConsumed / calorieTarget) * 100, 100)
    const netCalories = dailyData.caloriesConsumed - dailyData.caloriesBurned
    const stepsGoal = 10000
    const stepsProgress = Math.min((dailyData.steps / stepsGoal) * 100, 100)
    const waterGoal = 8
    const waterProgress = Math.min((dailyData.water / waterGoal) * 100, 100)

    // Macro targets (based on calorie target)
    const macroTargets = {
        protein: Math.round((calorieTarget * (profile.macroSplit?.protein || 40) / 100) / 4),
        carbs: Math.round((calorieTarget * (profile.macroSplit?.carbs || 30) / 100) / 4),
        fat: Math.round((calorieTarget * (profile.macroSplit?.fat || 30) / 100) / 9)
    }

    // SVG Calorie Ring
    const ringRadius = 90
    const ringCircumference = 2 * Math.PI * ringRadius
    const ringOffset = ringCircumference - (calorieProgress / 100) * ringCircumference

    // Greeting
    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'

    return (
        <div className="page animate-fade-in">
            {/* Header */}
            <div className="page__header dash-header">
                <div>
                    <h1 className="heading-2">{greeting}, {user?.displayName?.split(' ')[0] || 'Champion'} 👋</h1>
                    <p className="text-muted text-sm">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="dash-quick-actions stagger-children">
                <button className="dash-quick-btn" onClick={quickLogCalories}>
                    <div className="dash-quick-btn__icon" style={{ background: 'rgba(0, 212, 170, 0.12)', color: 'var(--success)' }}>
                        <MdRestaurantMenu />
                    </div>
                    <span>Log Meal</span>
                </button>
                <button className="dash-quick-btn" onClick={() => navigate('/workout')}>
                    <div className="dash-quick-btn__icon" style={{ background: 'rgba(59, 130, 246, 0.12)', color: 'var(--info)' }}>
                        <MdFitnessCenter />
                    </div>
                    <span>Log Exercise</span>
                </button>
                <button className="dash-quick-btn" onClick={addWater}>
                    <div className="dash-quick-btn__icon" style={{ background: 'rgba(0, 180, 216, 0.12)', color: '#00b4d8' }}>
                        <MdWaterDrop />
                    </div>
                    <span>Log Water</span>
                </button>
                <button className="dash-quick-btn" onClick={addSteps}>
                    <div className="dash-quick-btn__icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--warning)' }}>
                        <MdDirectionsWalk />
                    </div>
                    <span>Log Steps</span>
                </button>
                <button className="dash-quick-btn" onClick={addSleep}>
                    <div className="dash-quick-btn__icon" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>
                        <MdBedtime />
                    </div>
                    <span>Log Sleep</span>
                </button>
            </div>

            {/* Main Grid */}
            <div className="dash-grid">
                {/* Calorie Ring Card */}
                <div className="glass-card-static dash-calorie-card">
                    <h3 className="dash-card-title">
                        <MdLocalFireDepartment style={{ color: 'var(--success)' }} /> Calories Today
                    </h3>
                    <div className="dash-calorie-ring-wrapper">
                        <svg className="dash-calorie-ring" viewBox="0 0 200 200">
                            {/* Background track */}
                            <circle cx="100" cy="100" r={ringRadius} fill="none" stroke="var(--bg-tertiary)" strokeWidth="12" />
                            {/* Progress arc */}
                            <circle
                                cx="100" cy="100" r={ringRadius} fill="none"
                                stroke="url(#calorieGradient)"
                                strokeWidth="12" strokeLinecap="round"
                                strokeDasharray={ringCircumference}
                                strokeDashoffset={ringOffset}
                                transform="rotate(-90 100 100)"
                                className="dash-ring-progress"
                            />
                            <defs>
                                <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="var(--accent-start)" />
                                    <stop offset="100%" stopColor="var(--accent-end)" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="dash-calorie-ring-center">
                            <span className="dash-calorie-number">{dailyData.caloriesConsumed}</span>
                            <span className="dash-calorie-label">of {calorieTarget}</span>
                            <span className="dash-calorie-unit">kcal</span>
                        </div>
                    </div>
                    <div className="dash-calorie-footer">
                        <div className="dash-calorie-stat">
                            <MdTrendingUp style={{ color: 'var(--success)' }} />
                            <span>Consumed: <strong>{dailyData.caloriesConsumed}</strong></span>
                        </div>
                        <div className="dash-calorie-stat">
                            <MdTrendingDown style={{ color: 'var(--danger)' }} />
                            <span>Burned: <strong>{dailyData.caloriesBurned}</strong></span>
                        </div>
                        <div className="dash-calorie-stat">
                            <MdLocalFireDepartment style={{ color: 'var(--warning)' }} />
                            <span>Net: <strong className={netCalories > calorieTarget ? 'text-danger' : ''}>{netCalories}</strong></span>
                        </div>
                    </div>
                </div>

                {/* Macros Card */}
                <div className="glass-card-static dash-macros-card">
                    <h3 className="dash-card-title">📊 Macros</h3>
                    <div className="dash-macros-list">
                        <div className="dash-macro">
                            <div className="dash-macro-header">
                                <span className="dash-macro-name">Protein</span>
                                <span className="dash-macro-value">{dailyData.protein}g / {macroTargets.protein}g</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill dash-macro-protein" style={{ width: `${Math.min((dailyData.protein / macroTargets.protein) * 100, 100)}%` }} />
                            </div>
                        </div>
                        <div className="dash-macro">
                            <div className="dash-macro-header">
                                <span className="dash-macro-name">Carbs</span>
                                <span className="dash-macro-value">{dailyData.carbs}g / {macroTargets.carbs}g</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill dash-macro-carbs" style={{ width: `${Math.min((dailyData.carbs / macroTargets.carbs) * 100, 100)}%` }} />
                            </div>
                        </div>
                        <div className="dash-macro">
                            <div className="dash-macro-header">
                                <span className="dash-macro-name">Fat</span>
                                <span className="dash-macro-value">{dailyData.fat}g / {macroTargets.fat}g</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill dash-macro-fat" style={{ width: `${Math.min((dailyData.fat / macroTargets.fat) * 100, 100)}%` }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Steps Card */}
                <div className="glass-card-static dash-stat-card-large">
                    <h3 className="dash-card-title">
                        <MdDirectionsWalk style={{ color: 'var(--warning)' }} /> Steps
                    </h3>
                    <div className="dash-steps-display">
                        <span className="dash-steps-number">{dailyData.steps.toLocaleString()}</span>
                        <span className="text-muted text-sm">/ {stepsGoal.toLocaleString()} goal</span>
                    </div>
                    <div className="progress-bar" style={{ height: '10px' }}>
                        <div className="progress-fill" style={{ width: `${stepsProgress}%`, background: 'linear-gradient(135deg, #f59e0b, #f97316)' }} />
                    </div>
                    <p className="text-sm text-muted" style={{ marginTop: 'var(--space-2)' }}>
                        🔥 {Math.round(dailyData.steps * 0.04)} cal burned from walking
                    </p>
                </div>

                {/* Water Card */}
                <div className="glass-card-static dash-stat-card-large">
                    <h3 className="dash-card-title">
                        <MdWaterDrop style={{ color: '#00b4d8' }} /> Water
                    </h3>
                    <div className="dash-water-display">
                        <div className="dash-water-glasses">
                            {Array.from({ length: waterGoal }).map((_, i) => (
                                <button
                                    key={i}
                                    className={`dash-water-glass ${i < dailyData.water ? 'filled' : ''}`}
                                    onClick={() => {
                                        const newWater = i < dailyData.water ? i : i + 1
                                        saveDailyData({ ...dailyData, water: newWater })
                                    }}
                                >
                                    <MdWaterDrop />
                                </button>
                            ))}
                        </div>
                        <span className="text-sm text-muted">{dailyData.water} / {waterGoal} glasses</span>
                    </div>
                    <div className="progress-bar" style={{ height: '10px' }}>
                        <div className="progress-fill" style={{ width: `${waterProgress}%`, background: 'linear-gradient(135deg, #00b4d8, #0077b6)' }} />
                    </div>
                </div>

                {/* Sleep Card */}
                <div className="glass-card-static dash-stat-card-small">
                    <div className="dash-mini-stat">
                        <MdBedtime style={{ fontSize: '1.8rem', color: '#8b5cf6' }} />
                        <div>
                            <span className="dash-mini-number">{dailyData.sleep || '–'}</span>
                            <span className="dash-mini-label">hours sleep</span>
                        </div>
                    </div>
                </div>

                {/* Workouts Card */}
                <div className="glass-card-static dash-stat-card-small">
                    <div className="dash-mini-stat">
                        <MdFitnessCenter style={{ fontSize: '1.8rem', color: 'var(--info)' }} />
                        <div>
                            <span className="dash-mini-number">{dailyData.workoutsToday}</span>
                            <span className="dash-mini-label">workouts today</span>
                        </div>
                    </div>
                </div>

                {/* BMR/TDEE Card */}
                <div className="glass-card-static dash-stat-card-small">
                    <div className="dash-mini-stat">
                        <MdLocalFireDepartment style={{ fontSize: '1.8rem', color: 'var(--success)' }} />
                        <div>
                            <span className="dash-mini-number">{profile.bmr || '–'}</span>
                            <span className="dash-mini-label">BMR cal/day</span>
                        </div>
                    </div>
                </div>

                {/* Goal Card */}
                <div className="glass-card-static dash-stat-card-small">
                    <div className="dash-mini-stat">
                        <span style={{ fontSize: '1.8rem' }}>🎯</span>
                        <div>
                            <span className="dash-mini-number" style={{ textTransform: 'capitalize', fontSize: 'var(--font-lg)' }}>{profile.goal?.replace('_', ' ') || '–'}</span>
                            <span className="dash-mini-label">fitness goal</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
