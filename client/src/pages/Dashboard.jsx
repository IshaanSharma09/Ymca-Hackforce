import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useDailyLog } from '../context/DailyLogContext'
import GameCharacter from '../components/GameCharacter/GameCharacter'
import PixelHearts from '../components/PixelHearts/PixelHearts'
import {
    MdLocalFireDepartment, MdRestaurantMenu, MdFitnessCenter,
    MdWaterDrop, MdDirectionsWalk, MdBedtime, MdTrendingUp,
    MdTrendingDown, MdFavorite, MdFavoriteBorder, MdWarning
} from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

function Dashboard() {
    const { user, getUserProfile } = useAuth()
    const {
        dailyData, saveDailyData, addWater,
        livesRemaining, isCheatDay, useCheatDay, cheatDayPenalty, totalLives
    } = useDailyLog()
    const profile = getUserProfile() || {}
    const navigate = useNavigate()
    const [showCheatConfirm, setShowCheatConfirm] = useState(false)

    const [showStepsModal, setShowStepsModal] = useState(false)
    const [showSleepModal, setShowSleepModal] = useState(false)
    const [stepsInput, setStepsInput] = useState('')
    const [sleepInput, setSleepInput] = useState('')

    const submitSteps = () => {
        const steps = parseInt(stepsInput) || 0
        if (steps > 0) {
            saveDailyData({
                ...dailyData,
                steps: dailyData.steps + steps,
                caloriesBurned: dailyData.caloriesBurned + Math.round(steps * 0.04)
            })
        }
        setStepsInput('')
        setShowStepsModal(false)
    }

    const submitSleep = () => {
        const hours = parseFloat(sleepInput) || 0
        if (hours > 0) saveDailyData({ ...dailyData, sleep: hours })
        setSleepInput('')
        setShowSleepModal(false)
    }

    // Calculations
    const calorieTarget = profile.dailyCalorieTarget || 2000
    const calorieProgress = Math.min((dailyData.caloriesConsumed / calorieTarget) * 100, 100)
    const netCalories = dailyData.caloriesConsumed - dailyData.caloriesBurned
    const stepsGoal = 10000
    const stepsProgress = Math.min((dailyData.steps / stepsGoal) * 100, 100)
    const waterGoal = 8
    const waterProgress = Math.min((dailyData.water / waterGoal) * 100, 100)
    const macroTargets = {
        protein: Math.round(calorieTarget * 0.3 / 4),
        carbs: Math.round(calorieTarget * 0.4 / 4),
        fat: Math.round(calorieTarget * 0.3 / 9)
    }

    // Calorie ratio for alerts and character expression
    const calorieRatio = dailyData.caloriesConsumed / calorieTarget

    // ── Nutrition Alerts ──
    const currentHour = new Date().getHours()
    const nutritionAlerts = []

    // Low protein alert: protein < 50% of target
    const proteinRatio = dailyData.protein / macroTargets.protein
    if (proteinRatio < 0.5) {
        nutritionAlerts.push({
            id: 'low-protein',
            type: proteinRatio < 0.25 ? 'error' : 'warning',
            icon: '💪',
            title: 'Low Protein',
            message: `Only ${Math.round(dailyData.protein)}g / ${macroTargets.protein}g consumed`,
            penalty: proteinRatio < 0.25 ? 5 : 3
        })
    }

    // Low calories alert: after noon and calories < 40% of target
    if (currentHour >= 12 && calorieRatio < 0.4) {
        nutritionAlerts.push({
            id: 'low-calories',
            type: calorieRatio < 0.2 ? 'error' : 'warning',
            icon: '🔥',
            title: 'Under-Eating!',
            message: `Only ${dailyData.caloriesConsumed} / ${calorieTarget} kcal — you need more fuel`,
            penalty: calorieRatio < 0.2 ? 5 : 3
        })
    }

    // High calories on non-cheat day: > 120% of target
    if (!isCheatDay && calorieRatio > 1.2) {
        nutritionAlerts.push({
            id: 'high-calories',
            type: calorieRatio > 1.5 ? 'error' : 'warning',
            icon: '⚠️',
            title: 'Over-Eating!',
            message: `${dailyData.caloriesConsumed} / ${calorieTarget} kcal — ${Math.round((calorieRatio - 1) * 100)}% over target`,
            penalty: calorieRatio > 1.5 ? 5 : 3
        })
    }

    // Total nutrition penalty
    const nutritionPenalty = nutritionAlerts.reduce((sum, a) => sum + (a.type === 'error' ? a.penalty : 1), 0)

    // SVG Calorie Ring
    const ringRadius = 90
    const ringCircumference = 2 * Math.PI * ringRadius
    const ringOffset = ringCircumference - (calorieProgress / 100) * ringCircumference

    // BMI calculation
    const heightM = (profile.height || 170) / 100
    const bmi = (profile.weight || 70) / (heightM * heightM)

    // Calorie status for character expression
    let calorieStatusText = ''
    let calorieStatus = 'happy'
    if (calorieRatio > 1.3) {
        calorieStatus = 'stuffed'
        calorieStatusText = '⚠️ TOO MANY CALORIES! Your hero feels stuffed!'
    } else if (calorieRatio > 0 && calorieRatio < 0.4 && dailyData.protein < macroTargets.protein * 0.3) {
        // Only show exhausted if late in day logic is handled in GameCharacter, but we can pass text here
        // We'll let GameCharacter handle the visual state logic
    }

    // Health score for hearts (0-100), with cheat day penalty AND nutrition penalty
    const rawHealthScore = Math.min(100, Math.round(
        (Math.min(calorieProgress, 100) * 0.3) +
        (stepsProgress * 0.25) +
        (waterProgress * 0.25) +
        (Math.min((dailyData.sleep || 0) / 8 * 100, 100) * 0.2)
    ))
    const healthScore = Math.max(0,
        isCheatDay
            ? rawHealthScore - (cheatDayPenalty || 20) - nutritionPenalty
            : rawHealthScore - nutritionPenalty
    )

    // Level & XP Logic
    const currentLevel = Math.max(1, Math.floor(healthScore / 20) + 1)
    const xpTowardsNext = healthScore % 20
    const xpPercent = (xpTowardsNext / 20) * 100

    // Handle cheat day activation
    const handleUseCheatDay = () => {
        useCheatDay()
        setShowCheatConfirm(false)
    }

    return (
        <div className="page animate-fade-in dashboard-game-mode">
            {/* ── Game HUD Header ── */}
            <div className="game-hud">
                <div className="game-hud__profile">
                    <div className="game-hud__avatar-frame">
                        <div className="game-hud__level-badge">LV.{currentLevel}</div>
                        <div className="game-hud__avatar-placeholder">
                            {user?.displayName?.[0] || 'P'}
                        </div>
                    </div>
                    <div className="game-hud__info">
                        <h1 className="game-hud__name">{user?.displayName?.split(' ')[0] || 'Player 1'}</h1>
                        <div className="game-hud__xp-container">
                            <div className="game-hud__xp-label">XP</div>
                            <div className="game-hud__xp-track">
                                <div className="game-hud__xp-fill" style={{ width: `${xpPercent}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="game-hud__stats">
                    <div className="game-hud__hearts">
                        <PixelHearts score={healthScore} />
                    </div>
                    <div className="game-hud__lives">
                        {Array.from({ length: totalLives }).map((_, i) => (
                            i < livesRemaining
                                ? <MdFavorite key={i} className="life-icon life-icon--full" />
                                : <MdFavoriteBorder key={i} className="life-icon life-icon--empty" />
                        ))}
                        <span className="life-label">Lives</span>
                    </div>
                    <div className="game-hud__currency">
                        <span>🪙 {dailyData.steps.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* ── Cheat Day Banner ── */}
            {isCheatDay && (
                <div className="cheat-day-banner animate-fade-in">
                    <span className="cheat-day-banner__icon">🍕</span>
                    <div className="cheat-day-banner__text">
                        <strong>CHEAT DAY ACTIVE</strong>
                        <span>Enjoy your food! Data is still tracked. Level & XP reduced by {cheatDayPenalty}.</span>
                    </div>
                </div>
            )}

            {/* ── Use Cheat Day Button ── */}
            {!isCheatDay && (
                <div className="cheat-day-section">
                    <button
                        className="cheat-day-btn"
                        onClick={() => setShowCheatConfirm(true)}
                        disabled={livesRemaining <= 0}
                    >
                        🍕 Use Cheat Day ({livesRemaining}/{totalLives} left)
                    </button>
                </div>
            )}

            {/* ── Character Stage ── */}
            <div className="dash-game-stage">
                <GameCharacter showStatus={true} />
                {calorieStatusText && (
                    <div className={`dash-villain-alert dash-villain-alert--${calorieStatus}`}>
                        <span className="pixel-font">{calorieStatusText}</span>
                    </div>
                )}
            </div>

            {/* ── Action Menu (NES Style) ── */}
            <div className="game-menu-grid stagger-children">
                <button className="game-menu-btn" onClick={() => navigate('/meals')}>
                    <MdRestaurantMenu /> <span>LOG FOOD</span>
                </button>
                <button className="game-menu-btn" onClick={() => navigate('/workout')}>
                    <MdFitnessCenter /> <span>TRAIN</span>
                </button>
                <button className="game-menu-btn" onClick={addWater}>
                    <MdWaterDrop /> <span>DRINK</span>
                </button>
                <button className="game-menu-btn" onClick={() => setShowStepsModal(true)}>
                    <MdDirectionsWalk /> <span>EXPLORE</span>
                </button>
            </div>

            {/* ── Main Grid ── */}
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
                    <h3 className="dash-card-title">📊 Stats (Macros)</h3>
                    <div className="dash-macros-list">
                        <div className="dash-macro">
                            <div className="dash-macro-header">
                                <span className="dash-macro-name">Protein</span>
                                <span className="dash-macro-value">{Math.round(dailyData.protein)}g / {macroTargets.protein}g</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill dash-macro-protein" style={{ width: `${Math.min((dailyData.protein / macroTargets.protein) * 100, 100)}%` }} />
                            </div>
                        </div>
                        <div className="dash-macro">
                            <div className="dash-macro-header">
                                <span className="dash-macro-name">Carbs</span>
                                <span className="dash-macro-value">{Math.round(dailyData.carbs)}g / {macroTargets.carbs}g</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill dash-macro-carbs" style={{ width: `${Math.min((dailyData.carbs / macroTargets.carbs) * 100, 100)}%` }} />
                            </div>
                        </div>
                        <div className="dash-macro">
                            <div className="dash-macro-header">
                                <span className="dash-macro-name">Fat</span>
                                <span className="dash-macro-value">{Math.round(dailyData.fat)}g / {macroTargets.fat}g</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill dash-macro-fat" style={{ width: `${Math.min((dailyData.fat / macroTargets.fat) * 100, 100)}%` }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nutrition Alerts Panel */}
                {nutritionAlerts.length > 0 && (
                    <div className="glass-card-static dash-nutrition-alerts">
                        <h3 className="dash-card-title">
                            <MdWarning style={{ color: '#ef4444' }} /> Nutrition Alerts
                            <span className="dash-alert-count">{nutritionAlerts.length}</span>
                        </h3>
                        <div className="dash-alerts-list">
                            {nutritionAlerts.map(alert => (
                                <div key={alert.id} className={`dash-alert dash-alert--${alert.type}`}>
                                    <div className="dash-alert__dot" />
                                    <span className="dash-alert__icon">{alert.icon}</span>
                                    <div className="dash-alert__content">
                                        <strong className="dash-alert__title">{alert.title}</strong>
                                        <span className="dash-alert__message">{alert.message}</span>
                                    </div>
                                    <span className="dash-alert__penalty">-{alert.penalty} pts</span>
                                </div>
                            ))}
                        </div>
                        <p className="dash-alert-total">
                            Total Penalty: <strong>-{nutritionPenalty} pts</strong> from health score
                        </p>
                    </div>
                )}

                {/* Steps Card */}
                <div className="glass-card-static dash-stat-card-large">
                    <h3 className="dash-card-title">
                        <MdDirectionsWalk style={{ color: 'var(--warning)' }} /> Quest: Steps
                    </h3>
                    <div className="dash-steps-display">
                        <span className="dash-steps-number">{dailyData.steps.toLocaleString()}</span>
                        <span className="text-muted text-sm">/ {stepsGoal.toLocaleString()}</span>
                    </div>
                    <div className="progress-bar" style={{ height: '10px' }}>
                        <div className="progress-fill" style={{ width: `${stepsProgress}%`, background: 'linear-gradient(135deg, #f59e0b, #f97316)' }} />
                    </div>
                    <p className="text-sm text-muted" style={{ marginTop: 'var(--space-2)' }}>
                        🔥 {Math.round(dailyData.steps * 0.04)}XP gained
                    </p>
                </div>

                {/* Water Card */}
                <div className="glass-card-static dash-stat-card-large">
                    <h3 className="dash-card-title">
                        <MdWaterDrop style={{ color: '#00b4d8' }} /> Quest: Hydration
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
                        <span className="text-sm text-muted">{dailyData.water} / {waterGoal} potions</span>
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
                            <span className="dash-mini-label">hours rested</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showStepsModal && (
                <div className="modal-overlay animate-fade-in" onClick={() => setShowStepsModal(false)}>
                    <div className="glass-card modal-content" onClick={e => e.stopPropagation()}>
                        <h3 className="heading-3">Log Steps</h3>
                        <input
                            type="number"
                            className="input-field"
                            value={stepsInput}
                            onChange={e => setStepsInput(e.target.value)}
                            placeholder="Enter steps count"
                            autoFocus
                        />
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowStepsModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={submitSteps}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {showSleepModal && (
                <div className="modal-overlay animate-fade-in" onClick={() => setShowSleepModal(false)}>
                    <div className="glass-card modal-content" onClick={e => e.stopPropagation()}>
                        <h3 className="heading-3">Log Sleep</h3>
                        <input
                            type="number"
                            className="input-field"
                            value={sleepInput}
                            onChange={e => setSleepInput(e.target.value)}
                            placeholder="Hours of sleep"
                            step="0.5"
                            autoFocus
                        />
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowSleepModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={submitSleep}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cheat Day Confirm Modal */}
            {showCheatConfirm && (
                <div className="modal-overlay animate-fade-in" onClick={() => setShowCheatConfirm(false)}>
                    <div className="glass-card modal-content cheat-modal" onClick={e => e.stopPropagation()}>
                        <div className="cheat-modal__icon">🍕</div>
                        <h3 className="heading-3">Use Cheat Day?</h3>
                        <p className="text-sm text-muted" style={{ textAlign: 'center', lineHeight: 1.6 }}>
                            You have <strong>{livesRemaining}</strong> {livesRemaining === 1 ? 'life' : 'lives'} left this month.<br />
                            Using a cheat day will reduce your level & XP by <strong>{cheatDayPenalty}</strong> points.<br />
                            You can still eat anything, but you must log your food!
                        </p>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowCheatConfirm(false)}>Cancel</button>
                            <button className="btn cheat-confirm-btn" onClick={handleUseCheatDay}>🍕 Use Cheat Day</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard
