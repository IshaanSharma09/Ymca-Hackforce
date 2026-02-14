import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import {
    MdAnalytics, MdLocalFireDepartment, MdFitnessCenter,
    MdDirectionsWalk, MdWaterDrop, MdBedtime, MdTrendingUp,
    MdMonitorWeight, MdFavorite, MdSpeed, MdRestaurant,
    MdSportsMartialArts
} from 'react-icons/md'
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, ArcElement, Filler, Tooltip, Legend
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import MuscleAnalysis from './MuscleAnalysis'
import './Analysis.css'

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, ArcElement, Filler, Tooltip, Legend
)

// ── Health score helpers ──
const calcBMI = (weight, heightCm) => {
    if (!weight || !heightCm) return null
    const heightM = heightCm / 100
    return Math.round((weight / (heightM * heightM)) * 10) / 10
}

const getBMICategory = (bmi) => {
    if (!bmi) return { label: '—', color: 'var(--text-muted)' }
    if (bmi < 18.5) return { label: 'Underweight', color: '#3b82f6' }
    if (bmi < 25) return { label: 'Normal', color: '#22c55e' }
    if (bmi < 30) return { label: 'Overweight', color: '#f59e0b' }
    return { label: 'Obese', color: '#ef4444' }
}

const calcBMR = (weight, heightCm, age, gender) => {
    if (!weight || !heightCm || !age) return null
    if (gender === 'female') return Math.round(10 * weight + 6.25 * heightCm - 5 * age - 161)
    return Math.round(10 * weight + 6.25 * heightCm - 5 * age + 5)
}

const calcTDEE = (bmr, activityLevel) => {
    if (!bmr) return null
    const m = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 }
    return Math.round(bmr * (m[activityLevel] || 1.2))
}

const CHART_OPTIONS = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            titleColor: '#fff',
            bodyColor: '#94a3b8',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 10
        }
    },
    scales: {
        x: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: '#64748b', font: { size: 11 } }
        },
        y: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: '#64748b', font: { size: 11 } },
            beginAtZero: true
        }
    }
}

function Analysis() {
    const { user, getUserProfile } = useAuth()
    const profile = getUserProfile() || {}
    const [period, setPeriod] = useState(7) // 7 or 30 days
    const [analysisTab, setAnalysisTab] = useState('health') // 'health' or 'muscles'

    // Load historical daily data from localStorage
    const [dailyHistory, setDailyHistory] = useState([])

    useEffect(() => {
        if (!user) return
        const history = []
        const now = new Date()
        for (let i = period - 1; i >= 0; i--) {
            const d = new Date(now)
            d.setDate(d.getDate() - i)
            const key = d.toISOString().split('T')[0]
            const stored = JSON.parse(localStorage.getItem(`fitfuel-daily-${user.uid}-${key}`) || '{}')
            history.push({
                date: key,
                label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                shortLabel: d.toLocaleDateString('en-US', { weekday: 'short' }),
                calories: stored.calories || 0,
                protein: stored.protein || 0,
                carbs: stored.carbs || 0,
                fat: stored.fat || 0,
                steps: stored.steps || 0,
                water: stored.water || 0,
                sleep: stored.sleep || 0,
                caloriesBurned: stored.caloriesBurned || 0
            })
        }
        setDailyHistory(history)
    }, [user, period])

    // Calculate averages
    const avgs = useMemo(() => {
        const count = dailyHistory.filter(d => d.calories > 0 || d.steps > 0).length || 1
        return {
            calories: Math.round(dailyHistory.reduce((s, d) => s + d.calories, 0) / count),
            protein: Math.round(dailyHistory.reduce((s, d) => s + d.protein, 0) / count),
            carbs: Math.round(dailyHistory.reduce((s, d) => s + d.carbs, 0) / count),
            fat: Math.round(dailyHistory.reduce((s, d) => s + d.fat, 0) / count),
            steps: Math.round(dailyHistory.reduce((s, d) => s + d.steps, 0) / count),
            water: Math.round(dailyHistory.reduce((s, d) => s + d.water, 0) / count * 10) / 10,
            sleep: Math.round(dailyHistory.reduce((s, d) => s + d.sleep, 0) / count * 10) / 10,
            burned: Math.round(dailyHistory.reduce((s, d) => s + d.caloriesBurned, 0) / count)
        }
    }, [dailyHistory])

    // Today's data
    const today = dailyHistory[dailyHistory.length - 1] || {}
    const calorieTarget = profile.dailyCalorieTarget || 2000

    // BMI / BMR / TDEE
    const bmi = calcBMI(profile.weight, profile.height)
    const bmiCat = getBMICategory(bmi)
    const bmr = calcBMR(profile.weight, profile.height, profile.age, profile.gender)
    const tdee = calcTDEE(bmr, profile.activityLevel)

    // Health Score (0-100) based on today
    const healthScore = useMemo(() => {
        let score = 0
        // Calories near target: 25 pts
        if (today.calories > 0) {
            const ratio = today.calories / calorieTarget
            score += Math.max(0, 25 - Math.abs(1 - ratio) * 50)
        }
        // Steps (10k = 25 pts)
        score += Math.min((today.steps / 10000) * 25, 25)
        // Water (8 glasses = 25 pts)
        score += Math.min((today.water / 8) * 25, 25)
        // Sleep (7-9hrs = 25 pts)
        if (today.sleep >= 7 && today.sleep <= 9) score += 25
        else if (today.sleep > 0) score += Math.max(0, 25 - Math.abs(8 - today.sleep) * 5)
        return Math.round(score)
    }, [today, calorieTarget])

    const scoreColor = healthScore >= 75 ? '#22c55e' : healthScore >= 50 ? '#f59e0b' : '#ef4444'

    // ─── Chart Data ───
    const labels = dailyHistory.map(d => d.shortLabel)

    const calorieChartData = {
        labels,
        datasets: [
            {
                label: 'Consumed',
                data: dailyHistory.map(d => d.calories),
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: '#22c55e'
            },
            {
                label: 'Burned',
                data: dailyHistory.map(d => d.caloriesBurned),
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: '#ef4444'
            }
        ]
    }

    const macroChartData = {
        labels: ['Protein', 'Carbs', 'Fat'],
        datasets: [{
            data: [today.protein || 0, today.carbs || 0, today.fat || 0],
            backgroundColor: ['#ef4444', '#3b82f6', '#f59e0b'],
            borderWidth: 0,
            cutout: '65%'
        }]
    }

    const stepsChartData = {
        labels,
        datasets: [{
            label: 'Steps',
            data: dailyHistory.map(d => d.steps),
            backgroundColor: dailyHistory.map(d => d.steps >= 10000 ? 'rgba(34, 197, 94, 0.6)' : 'rgba(59, 130, 246, 0.5)'),
            borderRadius: 6,
            borderSkipped: false
        }]
    }

    const sleepChartData = {
        labels,
        datasets: [{
            label: 'Sleep (hrs)',
            data: dailyHistory.map(d => d.sleep),
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: '#8b5cf6'
        }]
    }

    const calorieChartOptions = {
        ...CHART_OPTIONS,
        plugins: {
            ...CHART_OPTIONS.plugins,
            legend: { display: true, position: 'top', labels: { color: '#94a3b8', boxWidth: 12, padding: 15 } }
        }
    }

    return (
        <div className="page animate-fade-in">
            <div className="page__header">
                <div>
                    <h1 className="heading-2">Health Analysis 📊</h1>
                    <p className="text-muted text-sm">Track your progress, analyze trends, optimize your health</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                    <div className="analysis-period-toggle">
                        <button className={`analysis-period-btn ${analysisTab === 'health' ? 'active' : ''}`} onClick={() => setAnalysisTab('health')}><MdTrendingUp /> Health</button>
                        <button className={`analysis-period-btn ${analysisTab === 'muscles' ? 'active' : ''}`} onClick={() => setAnalysisTab('muscles')}><MdSportsMartialArts /> Muscles & Plans</button>
                    </div>
                    {analysisTab === 'health' && (
                        <div className="analysis-period-toggle">
                            <button className={`analysis-period-btn ${period === 7 ? 'active' : ''}`} onClick={() => setPeriod(7)}>7D</button>
                            <button className={`analysis-period-btn ${period === 30 ? 'active' : ''}`} onClick={() => setPeriod(30)}>30D</button>
                        </div>
                    )}
                </div>
            </div>

            {analysisTab === 'muscles' ? (
                <MuscleAnalysis />
            ) : (
                <>
                    {/* ── Health Score + Body Stats Row ── */}
                    <div className="analysis-top-row">
                        {/* Health Score Ring */}
                        <div className="glass-card-static analysis-score-card">
                            <h3 className="dash-card-title"><MdFavorite style={{ color: scoreColor }} /> Health Score</h3>
                            <div className="analysis-score-ring">
                                <svg viewBox="0 0 120 120" className="analysis-ring-svg">
                                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                                    <circle cx="60" cy="60" r="50" fill="none" stroke={scoreColor} strokeWidth="10"
                                        strokeDasharray={`${(healthScore / 100) * 314} 314`}
                                        strokeLinecap="round" transform="rotate(-90 60 60)"
                                        style={{ transition: 'stroke-dasharray 1s ease' }} />
                                </svg>
                                <div className="analysis-score-center">
                                    <span className="analysis-score-val" style={{ color: scoreColor }}>{healthScore}</span>
                                    <span className="analysis-score-label">/ 100</span>
                                </div>
                            </div>
                            <div className="analysis-score-breakdown">
                                <div className="analysis-score-item">
                                    <MdRestaurant style={{ color: '#22c55e' }} />
                                    <span>Nutrition</span>
                                    <span style={{ color: today.calories > 0 ? '#22c55e' : 'var(--text-tertiary)' }}>{today.calories > 0 ? '✓' : '—'}</span>
                                </div>
                                <div className="analysis-score-item">
                                    <MdDirectionsWalk style={{ color: '#3b82f6' }} />
                                    <span>Steps</span>
                                    <span style={{ color: today.steps >= 10000 ? '#22c55e' : 'var(--text-tertiary)' }}>{today.steps >= 10000 ? '✓' : `${today.steps}`}</span>
                                </div>
                                <div className="analysis-score-item">
                                    <MdWaterDrop style={{ color: '#06b6d4' }} />
                                    <span>Water</span>
                                    <span style={{ color: today.water >= 8 ? '#22c55e' : 'var(--text-tertiary)' }}>{today.water >= 8 ? '✓' : `${today.water}/8`}</span>
                                </div>
                                <div className="analysis-score-item">
                                    <MdBedtime style={{ color: '#8b5cf6' }} />
                                    <span>Sleep</span>
                                    <span style={{ color: today.sleep >= 7 ? '#22c55e' : 'var(--text-tertiary)' }}>{today.sleep >= 7 ? '✓' : `${today.sleep}h`}</span>
                                </div>
                            </div>
                        </div>

                        {/* BMI / BMR / TDEE */}
                        <div className="glass-card-static analysis-body-card">
                            <h3 className="dash-card-title"><MdMonitorWeight style={{ color: '#3b82f6' }} /> Body Stats</h3>
                            <div className="analysis-body-grid">
                                <div className="analysis-body-stat">
                                    <span className="analysis-body-val" style={{ color: bmiCat.color }}>{bmi || '—'}</span>
                                    <span className="analysis-body-label">BMI</span>
                                    <span className="analysis-body-tag" style={{ color: bmiCat.color }}>{bmiCat.label}</span>
                                </div>
                                <div className="analysis-body-stat">
                                    <span className="analysis-body-val">{bmr || '—'}</span>
                                    <span className="analysis-body-label">BMR</span>
                                    <span className="analysis-body-tag">kcal/day</span>
                                </div>
                                <div className="analysis-body-stat">
                                    <span className="analysis-body-val">{tdee || '—'}</span>
                                    <span className="analysis-body-label">TDEE</span>
                                    <span className="analysis-body-tag">kcal/day</span>
                                </div>
                                <div className="analysis-body-stat">
                                    <span className="analysis-body-val">{profile.weight || '—'}</span>
                                    <span className="analysis-body-label">Weight</span>
                                    <span className="analysis-body-tag">kg</span>
                                </div>
                            </div>
                            <div className="analysis-bmi-bar">
                                <div className="analysis-bmi-zones">
                                    <span style={{ background: '#3b82f6', flex: 18.5 }}>Under</span>
                                    <span style={{ background: '#22c55e', flex: 6.5 }}>Normal</span>
                                    <span style={{ background: '#f59e0b', flex: 5 }}>Over</span>
                                    <span style={{ background: '#ef4444', flex: 10 }}>Obese</span>
                                </div>
                                {bmi && (
                                    <div className="analysis-bmi-marker" style={{ left: `${Math.min(Math.max(((bmi - 15) / 25) * 100, 0), 100)}%` }}>
                                        ▲
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Period Averages */}
                        <div className="glass-card-static analysis-avg-card">
                            <h3 className="dash-card-title"><MdTrendingUp style={{ color: '#f59e0b' }} /> {period}-Day Averages</h3>
                            <div className="analysis-avg-list">
                                <div className="analysis-avg-item">
                                    <MdLocalFireDepartment style={{ color: '#22c55e' }} />
                                    <span>Calories</span>
                                    <strong>{avgs.calories} kcal</strong>
                                </div>
                                <div className="analysis-avg-item">
                                    <MdFitnessCenter style={{ color: '#ef4444' }} />
                                    <span>Protein</span>
                                    <strong>{avgs.protein}g</strong>
                                </div>
                                <div className="analysis-avg-item">
                                    <MdDirectionsWalk style={{ color: '#3b82f6' }} />
                                    <span>Steps</span>
                                    <strong>{avgs.steps.toLocaleString()}</strong>
                                </div>
                                <div className="analysis-avg-item">
                                    <MdWaterDrop style={{ color: '#06b6d4' }} />
                                    <span>Water</span>
                                    <strong>{avgs.water} glasses</strong>
                                </div>
                                <div className="analysis-avg-item">
                                    <MdBedtime style={{ color: '#8b5cf6' }} />
                                    <span>Sleep</span>
                                    <strong>{avgs.sleep} hrs</strong>
                                </div>
                                <div className="analysis-avg-item">
                                    <MdLocalFireDepartment style={{ color: '#ef4444' }} />
                                    <span>Burned</span>
                                    <strong>{avgs.burned} kcal</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Charts Row ── */}
                    <div className="analysis-charts-row">
                        {/* Calorie Trend */}
                        <div className="glass-card-static analysis-chart-card analysis-chart-wide">
                            <h3 className="dash-card-title"><MdLocalFireDepartment style={{ color: '#22c55e' }} /> Calorie Trend</h3>
                            <div className="analysis-chart-container">
                                <Line data={calorieChartData} options={calorieChartOptions} />
                            </div>
                        </div>

                        {/* Today's Macros */}
                        <div className="glass-card-static analysis-chart-card">
                            <h3 className="dash-card-title"><MdRestaurant style={{ color: '#ef4444' }} /> Today's Macros</h3>
                            <div className="analysis-chart-container analysis-donut-container">
                                <Doughnut data={macroChartData} options={{ ...CHART_OPTIONS, scales: undefined, plugins: { ...CHART_OPTIONS.plugins, legend: { display: false } } }} />
                            </div>
                            <div className="analysis-macro-legend">
                                <div className="analysis-macro-item">
                                    <span className="analysis-macro-dot" style={{ background: '#ef4444' }}></span>
                                    <span>Protein</span>
                                    <strong>{today.protein || 0}g</strong>
                                </div>
                                <div className="analysis-macro-item">
                                    <span className="analysis-macro-dot" style={{ background: '#3b82f6' }}></span>
                                    <span>Carbs</span>
                                    <strong>{today.carbs || 0}g</strong>
                                </div>
                                <div className="analysis-macro-item">
                                    <span className="analysis-macro-dot" style={{ background: '#f59e0b' }}></span>
                                    <span>Fat</span>
                                    <strong>{today.fat || 0}g</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Steps + Sleep Charts ── */}
                    <div className="analysis-charts-row">
                        <div className="glass-card-static analysis-chart-card">
                            <h3 className="dash-card-title"><MdDirectionsWalk style={{ color: '#3b82f6' }} /> Steps</h3>
                            <div className="analysis-chart-container">
                                <Bar data={stepsChartData} options={{ ...CHART_OPTIONS, plugins: { ...CHART_OPTIONS.plugins, legend: { display: false } } }} />
                            </div>
                            <p className="text-xs text-muted text-center" style={{ marginTop: '8px' }}>
                                <span style={{ color: '#22c55e' }}>■</span> 10k+ reached &nbsp; <span style={{ color: '#3b82f6' }}>■</span> Below goal
                            </p>
                        </div>

                        <div className="glass-card-static analysis-chart-card">
                            <h3 className="dash-card-title"><MdBedtime style={{ color: '#8b5cf6' }} /> Sleep</h3>
                            <div className="analysis-chart-container">
                                <Line data={sleepChartData} options={{ ...CHART_OPTIONS, plugins: { ...CHART_OPTIONS.plugins, legend: { display: false } } }} />
                            </div>
                            <p className="text-xs text-muted text-center" style={{ marginTop: '8px' }}>
                                Ideal: 7-9 hours per night
                            </p>
                        </div>
                    </div>

                    {/* ── Calorie Balance Card ── */}
                    <div className="glass-card-static analysis-balance-card">
                        <h3 className="dash-card-title"><MdSpeed style={{ color: '#06b6d4' }} /> Today's Calorie Balance</h3>
                        <div className="analysis-balance-row">
                            <div className="analysis-balance-block">
                                <span className="analysis-balance-val" style={{ color: '#22c55e' }}>{today.calories || 0}</span>
                                <span className="analysis-balance-label">Consumed</span>
                            </div>
                            <span className="analysis-balance-op">−</span>
                            <div className="analysis-balance-block">
                                <span className="analysis-balance-val" style={{ color: '#ef4444' }}>{(today.caloriesBurned || 0) + (bmr || 0)}</span>
                                <span className="analysis-balance-label">Total Burned</span>
                            </div>
                            <span className="analysis-balance-op">=</span>
                            <div className="analysis-balance-block">
                                <span className="analysis-balance-val" style={{
                                    color: ((today.calories || 0) - (today.caloriesBurned || 0) - (bmr || 0)) > 0 ? '#f59e0b' : '#22c55e'
                                }}>
                                    {(today.calories || 0) - (today.caloriesBurned || 0) - (bmr || 0)}
                                </span>
                                <span className="analysis-balance-label">
                                    {((today.calories || 0) - (today.caloriesBurned || 0) - (bmr || 0)) > 0 ? 'Surplus' : 'Deficit'}
                                </span>
                            </div>
                        </div>
                        <div className="analysis-balance-breakdown">
                            <span className="text-xs text-muted">BMR: {bmr || '—'} kcal</span>
                            <span className="text-xs text-muted">Exercise: {today.caloriesBurned || 0} kcal</span>
                            <span className="text-xs text-muted">Target: {calorieTarget} kcal</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Analysis
