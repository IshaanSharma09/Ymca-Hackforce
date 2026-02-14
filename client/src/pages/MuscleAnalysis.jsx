import { useState, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import {
    MdFitnessCenter, MdWarningAmber, MdAutoAwesome,
    MdRestaurant, MdCheckCircle, MdRefresh
} from 'react-icons/md'
import './MuscleAnalysis.css'

// ── Muscle groups with body positions for heatmap ──
const MUSCLE_MAP = {
    Chest: { x: 50, y: 28, side: 'front' },
    Shoulders: { x: 50, y: 22, side: 'front' },
    Biceps: { x: 28, y: 35, side: 'front' },
    Triceps: { x: 72, y: 35, side: 'back' },
    Core: { x: 50, y: 40, side: 'front' },
    Back: { x: 50, y: 32, side: 'back' },
    Quads: { x: 40, y: 60, side: 'front' },
    Hamstrings: { x: 60, y: 60, side: 'back' },
    Glutes: { x: 50, y: 52, side: 'back' },
    Calves: { x: 40, y: 78, side: 'front' },
    Forearms: { x: 25, y: 45, side: 'front' },
}

// Color intensity based on training frequency
const getHeatColor = (freq, maxFreq) => {
    if (freq === 0) return 'rgba(100, 116, 139, 0.3)'
    const intensity = freq / Math.max(maxFreq, 1)
    if (intensity > 0.7) return '#22c55e'
    if (intensity > 0.4) return '#f59e0b'
    return '#ef4444'
}

// ── Smart Workout Plan Templates ──
const WORKOUT_PLANS = {
    lose_fat: {
        name: 'Fat Loss Plan',
        description: '4 days/week — High rep, moderate weight + cardio',
        days: [
            {
                day: 'Mon', focus: 'Upper Body', exercises: [
                    { name: 'Bench Press', sets: 4, reps: 12, rest: '60s' },
                    { name: 'Barbell Row', sets: 4, reps: 12, rest: '60s' },
                    { name: 'Overhead Press', sets: 3, reps: 15, rest: '45s' },
                    { name: 'Barbell Curl', sets: 3, reps: 12, rest: '45s' },
                    { name: 'Tricep Pushdown', sets: 3, reps: 15, rest: '45s' },
                ]
            },
            {
                day: 'Tue', focus: 'Cardio + Core', exercises: [
                    { name: 'Running / Cycling', sets: 1, reps: 1, rest: '30 min' },
                    { name: 'Mountain Climbers', sets: 3, reps: 20, rest: '30s' },
                    { name: 'Plank', sets: 3, reps: 1, rest: '60s hold' },
                    { name: 'Crunches', sets: 3, reps: 20, rest: '30s' },
                    { name: 'Burpees', sets: 3, reps: 10, rest: '45s' },
                ]
            },
            {
                day: 'Thu', focus: 'Lower Body', exercises: [
                    { name: 'Barbell Squat', sets: 4, reps: 12, rest: '60s' },
                    { name: 'Leg Press', sets: 3, reps: 15, rest: '60s' },
                    { name: 'Romanian Deadlift', sets: 3, reps: 12, rest: '60s' },
                    { name: 'Leg Curl', sets: 3, reps: 15, rest: '45s' },
                    { name: 'Calf Raise', sets: 4, reps: 20, rest: '30s' },
                ]
            },
            {
                day: 'Fri', focus: 'Full Body HIIT', exercises: [
                    { name: 'Jump Rope', sets: 5, reps: 1, rest: '2 min rounds' },
                    { name: 'Push-Ups', sets: 3, reps: 15, rest: '30s' },
                    { name: 'Squats (Body)', sets: 3, reps: 20, rest: '30s' },
                    { name: 'Burpees', sets: 3, reps: 12, rest: '45s' },
                    { name: 'Plank', sets: 3, reps: 1, rest: '45s hold' },
                ]
            },
        ]
    },
    build_muscle: {
        name: 'Muscle Building Plan',
        description: '5 days/week — Progressive overload, higher weight',
        days: [
            {
                day: 'Mon', focus: 'Chest + Triceps', exercises: [
                    { name: 'Bench Press', sets: 4, reps: 8, rest: '90s' },
                    { name: 'Incline Dumbbell Press', sets: 4, reps: 10, rest: '75s' },
                    { name: 'Cable Fly', sets: 3, reps: 12, rest: '60s' },
                    { name: 'Skull Crusher', sets: 3, reps: 10, rest: '60s' },
                    { name: 'Tricep Pushdown', sets: 3, reps: 12, rest: '45s' },
                ]
            },
            {
                day: 'Tue', focus: 'Back + Biceps', exercises: [
                    { name: 'Deadlift', sets: 4, reps: 6, rest: '120s' },
                    { name: 'Barbell Row', sets: 4, reps: 8, rest: '90s' },
                    { name: 'Lat Pulldown', sets: 3, reps: 10, rest: '60s' },
                    { name: 'Barbell Curl', sets: 3, reps: 10, rest: '60s' },
                    { name: 'Hammer Curl', sets: 3, reps: 12, rest: '45s' },
                ]
            },
            {
                day: 'Wed', focus: 'Legs', exercises: [
                    { name: 'Barbell Squat', sets: 5, reps: 6, rest: '120s' },
                    { name: 'Leg Press', sets: 4, reps: 10, rest: '90s' },
                    { name: 'Romanian Deadlift', sets: 3, reps: 10, rest: '75s' },
                    { name: 'Leg Curl', sets: 3, reps: 12, rest: '60s' },
                    { name: 'Calf Raise', sets: 4, reps: 15, rest: '45s' },
                ]
            },
            {
                day: 'Thu', focus: 'Shoulders + Arms', exercises: [
                    { name: 'Overhead Press', sets: 4, reps: 8, rest: '90s' },
                    { name: 'Lateral Raise', sets: 4, reps: 15, rest: '45s' },
                    { name: 'Face Pull', sets: 3, reps: 15, rest: '45s' },
                    { name: 'Barbell Curl', sets: 3, reps: 10, rest: '60s' },
                    { name: 'Skull Crusher', sets: 3, reps: 10, rest: '60s' },
                ]
            },
            {
                day: 'Fri', focus: 'Upper Body Power', exercises: [
                    { name: 'Bench Press', sets: 5, reps: 5, rest: '120s' },
                    { name: 'Barbell Row', sets: 5, reps: 5, rest: '120s' },
                    { name: 'Pull-Ups', sets: 3, reps: 8, rest: '90s' },
                    { name: 'Dips', sets: 3, reps: 10, rest: '60s' },
                    { name: 'Plank', sets: 3, reps: 1, rest: '60s hold' },
                ]
            },
        ]
    },
    maintain: {
        name: 'Maintenance Plan',
        description: '3 days/week — Full body, moderate intensity',
        days: [
            {
                day: 'Mon', focus: 'Full Body A', exercises: [
                    { name: 'Barbell Squat', sets: 3, reps: 10, rest: '90s' },
                    { name: 'Bench Press', sets: 3, reps: 10, rest: '90s' },
                    { name: 'Barbell Row', sets: 3, reps: 10, rest: '75s' },
                    { name: 'Overhead Press', sets: 3, reps: 10, rest: '75s' },
                    { name: 'Plank', sets: 3, reps: 1, rest: '45s hold' },
                ]
            },
            {
                day: 'Wed', focus: 'Full Body B', exercises: [
                    { name: 'Deadlift', sets: 3, reps: 8, rest: '120s' },
                    { name: 'Incline Dumbbell Press', sets: 3, reps: 10, rest: '75s' },
                    { name: 'Lat Pulldown', sets: 3, reps: 12, rest: '60s' },
                    { name: 'Lunges', sets: 3, reps: 12, rest: '60s' },
                    { name: 'Barbell Curl', sets: 3, reps: 12, rest: '45s' },
                ]
            },
            {
                day: 'Fri', focus: 'Full Body C', exercises: [
                    { name: 'Leg Press', sets: 3, reps: 12, rest: '75s' },
                    { name: 'Cable Fly', sets: 3, reps: 12, rest: '60s' },
                    { name: 'Seated Cable Row', sets: 3, reps: 12, rest: '60s' },
                    { name: 'Lateral Raise', sets: 3, reps: 15, rest: '45s' },
                    { name: 'Tricep Pushdown', sets: 3, reps: 15, rest: '45s' },
                ]
            },
        ]
    }
}

// ── Meal Plan Templates ──
const MEAL_PLANS = {
    lose_fat: [
        { meal: 'Breakfast', items: 'Egg Whites + Oats + Black Coffee', cal: 350, p: 25, c: 40, f: 8 },
        { meal: 'Snack', items: 'Greek Yogurt + Berries', cal: 150, p: 15, c: 18, f: 3 },
        { meal: 'Lunch', items: 'Grilled Chicken + Brown Rice + Vegetables', cal: 450, p: 40, c: 45, f: 10 },
        { meal: 'Snack', items: 'Almonds (10) + Apple', cal: 180, p: 5, c: 25, f: 9 },
        { meal: 'Dinner', items: 'Fish (Grilled) + Sweet Potato + Salad', cal: 400, p: 35, c: 35, f: 12 },
    ],
    build_muscle: [
        { meal: 'Breakfast', items: 'Whole Eggs (3) + Toast + Banana + Peanut Butter', cal: 550, p: 30, c: 55, f: 22 },
        { meal: 'Snack', items: 'Protein Shake + Banana', cal: 350, p: 30, c: 40, f: 5 },
        { meal: 'Lunch', items: 'Chicken Breast + Rice + Dal + Roti', cal: 650, p: 45, c: 65, f: 15 },
        { meal: 'Snack', items: 'Paneer 100g + Nuts', cal: 300, p: 20, c: 8, f: 22 },
        { meal: 'Dinner', items: 'Mutton / Fish + Chapati + Salad + Curd', cal: 550, p: 40, c: 40, f: 20 },
        { meal: 'Pre-Bed', items: 'Milk + Casein / Paneer', cal: 200, p: 20, c: 12, f: 8 },
    ],
    maintain: [
        { meal: 'Breakfast', items: 'Eggs (2) + Toast + Tea + Fruit', cal: 400, p: 20, c: 45, f: 15 },
        { meal: 'Snack', items: 'Mixed Nuts + Chai', cal: 200, p: 6, c: 15, f: 14 },
        { meal: 'Lunch', items: 'Dal + Rice + Sabzi + Roti + Curd', cal: 550, p: 20, c: 70, f: 15 },
        { meal: 'Snack', items: 'Fruits + Buttermilk', cal: 150, p: 4, c: 30, f: 2 },
        { meal: 'Dinner', items: 'Chicken/Paneer + Chapati + Salad', cal: 500, p: 35, c: 40, f: 16 },
    ]
}

function MuscleAnalysis() {
    const { user, getUserProfile } = useAuth()
    const profile = getUserProfile() || {}
    const goal = profile.goal || 'maintain'

    const [activeSection, setActiveSection] = useState('heatmap') // heatmap, workout, meal
    const [expandedDay, setExpandedDay] = useState(null)

    // Load workout history to compute muscle frequency
    const muscleFrequency = useMemo(() => {
        if (!user) return {}
        const history = JSON.parse(localStorage.getItem(`fitfuel-workouts-${user.uid}`) || '[]')
        const freq = {}
        Object.keys(MUSCLE_MAP).forEach(m => freq[m] = 0)

        // Count from last 30 days
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
        history.forEach(w => {
            if (new Date(w.date).getTime() < thirtyDaysAgo) return
            w.exercises?.forEach(ex => {
                if (freq[ex.muscle] !== undefined) freq[ex.muscle]++
                ex.secondary?.forEach(s => {
                    if (freq[s] !== undefined) freq[s] += 0.5
                })
            })
        })
        return freq
    }, [user])

    const maxFreq = Math.max(...Object.values(muscleFrequency), 1)
    const totalSessions = Object.values(muscleFrequency).reduce((s, v) => s + v, 0)

    // Imbalance detection
    const imbalances = useMemo(() => {
        const issues = []
        const f = muscleFrequency
        if (totalSessions < 3) return [{ type: 'info', msg: 'Log more workouts for imbalance detection', muscles: [] }]

        // Push vs Pull
        const push = (f.Chest || 0) + (f.Shoulders || 0) + (f.Triceps || 0)
        const pull = (f.Back || 0) + (f.Biceps || 0)
        if (push > pull * 1.5 && pull > 0) issues.push({ type: 'warn', msg: 'Push muscles trained more than Pull — add more rows/pulls', muscles: ['Back', 'Biceps'] })
        if (pull > push * 1.5 && push > 0) issues.push({ type: 'warn', msg: 'Pull muscles trained more than Push — add chest/shoulder work', muscles: ['Chest', 'Shoulders'] })

        // Upper vs Lower
        const upper = push + pull
        const lower = (f.Quads || 0) + (f.Hamstrings || 0) + (f.Glutes || 0) + (f.Calves || 0)
        if (upper > lower * 2 && lower > 0) issues.push({ type: 'warn', msg: 'Upper body dominant — don\'t skip leg day!', muscles: ['Quads', 'Hamstrings', 'Glutes'] })

        // Neglected muscles
        const neglected = Object.entries(f).filter(([, v]) => v === 0).map(([k]) => k)
        if (neglected.length > 0 && totalSessions > 5) issues.push({ type: 'danger', msg: `Neglected muscles: ${neglected.join(', ')}`, muscles: neglected })

        // Quads vs Hamstrings
        if ((f.Quads || 0) > (f.Hamstrings || 0) * 2 && (f.Hamstrings || 0) > 0) issues.push({ type: 'warn', msg: 'Quad-dominant — add hamstring curls and RDLs', muscles: ['Hamstrings'] })

        if (issues.length === 0) issues.push({ type: 'success', msg: 'Good balance! Keep training consistently', muscles: [] })
        return issues
    }, [muscleFrequency, totalSessions])

    const plan = WORKOUT_PLANS[goal] || WORKOUT_PLANS.maintain
    const mealPlan = MEAL_PLANS[goal] || MEAL_PLANS.maintain
    const totalMealCal = mealPlan.reduce((s, m) => s + m.cal, 0)

    return (
        <div className="muscle-analysis animate-fade-in">
            {/* Section Toggle */}
            <div className="ma-section-tabs">
                <button className={`ma-tab ${activeSection === 'heatmap' ? 'active' : ''}`} onClick={() => setActiveSection('heatmap')}>
                    <MdFitnessCenter /> Muscle Map
                </button>
                <button className={`ma-tab ${activeSection === 'workout' ? 'active' : ''}`} onClick={() => setActiveSection('workout')}>
                    <MdAutoAwesome /> Workout Plan
                </button>
                <button className={`ma-tab ${activeSection === 'meal' ? 'active' : ''}`} onClick={() => setActiveSection('meal')}>
                    <MdRestaurant /> Meal Plan
                </button>
            </div>

            {/* ── Muscle Heatmap ── */}
            {activeSection === 'heatmap' && (
                <div className="ma-heatmap-section">
                    <div className="ma-heatmap-grid">
                        {/* Body SVG */}
                        <div className="glass-card-static ma-body-card">
                            <h3 className="dash-card-title">Muscle Heatmap (30 Days)</h3>
                            <div className="ma-body-svg-container">
                                <svg viewBox="0 0 100 100" className="ma-body-svg">
                                    {/* Simple body outline */}
                                    {/* Head */}
                                    <circle cx="50" cy="10" r="6" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                                    {/* Torso */}
                                    <path d="M38 17 L38 48 L62 48 L62 17" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                                    {/* Arms */}
                                    <path d="M38 20 L25 35 L22 50" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                                    <path d="M62 20 L75 35 L78 50" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                                    {/* Legs */}
                                    <path d="M42 48 L38 70 L36 90" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                                    <path d="M58 48 L62 70 L64 90" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />

                                    {/* Muscle hotspots */}
                                    {Object.entries(MUSCLE_MAP).map(([muscle, pos]) => {
                                        const freq = muscleFrequency[muscle] || 0
                                        const color = getHeatColor(freq, maxFreq)
                                        const radius = 4 + (freq / Math.max(maxFreq, 1)) * 3
                                        return (
                                            <g key={muscle}>
                                                <circle cx={pos.x} cy={pos.y} r={radius} fill={color} opacity="0.7"
                                                    style={{ transition: 'all 0.5s ease' }}>
                                                    <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3s" repeatCount="indefinite" />
                                                </circle>
                                                <text x={pos.x} y={pos.y + radius + 4} textAnchor="middle"
                                                    fill="rgba(255,255,255,0.7)" fontSize="2.5" fontWeight="600">
                                                    {muscle}
                                                </text>
                                            </g>
                                        )
                                    })}
                                </svg>
                            </div>
                            <div className="ma-heatmap-legend">
                                <span><span className="ma-legend-dot" style={{ background: '#ef4444' }}></span> Low</span>
                                <span><span className="ma-legend-dot" style={{ background: '#f59e0b' }}></span> Medium</span>
                                <span><span className="ma-legend-dot" style={{ background: '#22c55e' }}></span> High</span>
                                <span><span className="ma-legend-dot" style={{ background: 'rgba(100,116,139,0.3)' }}></span> None</span>
                            </div>
                        </div>

                        {/* Frequency list + Imbalances */}
                        <div className="ma-side-info">
                            {/* Frequency */}
                            <div className="glass-card-static">
                                <h3 className="dash-card-title">Training Frequency</h3>
                                <div className="ma-freq-list">
                                    {Object.entries(muscleFrequency)
                                        .sort(([, a], [, b]) => b - a)
                                        .map(([muscle, freq]) => (
                                            <div key={muscle} className="ma-freq-item">
                                                <span className="ma-freq-name">{muscle}</span>
                                                <div className="ma-freq-bar-bg">
                                                    <div className="ma-freq-bar" style={{
                                                        width: `${(freq / Math.max(maxFreq, 1)) * 100}%`,
                                                        background: getHeatColor(freq, maxFreq)
                                                    }} />
                                                </div>
                                                <span className="ma-freq-val">{Math.round(freq)}</span>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Imbalances */}
                            <div className="glass-card-static">
                                <h3 className="dash-card-title"><MdWarningAmber style={{ color: '#f59e0b' }} /> Balance Check</h3>
                                <div className="ma-imbalance-list">
                                    {imbalances.map((issue, i) => (
                                        <div key={i} className={`ma-imbalance-item ma-imbalance-${issue.type}`}>
                                            {issue.type === 'success' ? <MdCheckCircle /> : issue.type === 'danger' ? <MdWarningAmber /> : <MdWarningAmber />}
                                            <span>{issue.msg}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Smart Workout Plan ── */}
            {activeSection === 'workout' && (
                <div className="ma-plan-section">
                    <div className="glass-card-static ma-plan-header">
                        <div>
                            <h3 className="heading-4">{plan.name}</h3>
                            <p className="text-sm text-muted">{plan.description}</p>
                            <p className="text-xs text-muted" style={{ marginTop: '4px' }}>
                                Based on your goal: <strong style={{ color: 'var(--text-accent)' }}>{goal.replace('_', ' ')}</strong>
                            </p>
                        </div>
                    </div>

                    <div className="ma-plan-days">
                        {plan.days.map((d, i) => (
                            <div key={i} className="glass-card-static ma-plan-day">
                                <button className="ma-plan-day-header" onClick={() => setExpandedDay(expandedDay === i ? null : i)}>
                                    <div className="ma-plan-day-left">
                                        <span className="ma-plan-day-badge">{d.day}</span>
                                        <strong>{d.focus}</strong>
                                    </div>
                                    <span className="text-xs text-muted">{d.exercises.length} exercises</span>
                                </button>
                                {expandedDay === i && (
                                    <div className="ma-plan-exercises animate-fade-in">
                                        {d.exercises.map((ex, j) => (
                                            <div key={j} className="ma-plan-exercise">
                                                <span className="ma-plan-ex-num">{j + 1}</span>
                                                <div className="ma-plan-ex-info">
                                                    <strong className="text-sm">{ex.name}</strong>
                                                    <span className="text-xs text-muted">
                                                        {ex.sets}×{ex.reps} · Rest: {ex.rest}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Meal Plan ── */}
            {activeSection === 'meal' && (
                <div className="ma-plan-section">
                    <div className="glass-card-static ma-plan-header">
                        <div>
                            <h3 className="heading-4">Daily Meal Plan</h3>
                            <p className="text-sm text-muted">
                                Goal: <strong style={{ color: 'var(--text-accent)' }}>{goal.replace('_', ' ')}</strong> ·
                                Total: <strong>{totalMealCal} kcal</strong>
                            </p>
                        </div>
                    </div>

                    <div className="ma-meal-plan">
                        {mealPlan.map((m, i) => (
                            <div key={i} className="glass-card-static ma-meal-item">
                                <div className="ma-meal-header">
                                    <span className="ma-meal-type">{m.meal}</span>
                                    <span className="text-sm" style={{ color: '#22c55e', fontWeight: 700 }}>{m.cal} kcal</span>
                                </div>
                                <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{m.items}</p>
                                <div className="ma-meal-macros">
                                    <span style={{ color: '#ef4444' }}>P: {m.p}g</span>
                                    <span style={{ color: '#3b82f6' }}>C: {m.c}g</span>
                                    <span style={{ color: '#f59e0b' }}>F: {m.f}g</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="glass-card-static ma-meal-total">
                        <span className="text-sm">Daily Total</span>
                        <div className="ma-meal-macros" style={{ gap: 'var(--space-4)' }}>
                            <strong style={{ color: '#22c55e' }}>{totalMealCal} kcal</strong>
                            <span style={{ color: '#ef4444' }}>P: {mealPlan.reduce((s, m) => s + m.p, 0)}g</span>
                            <span style={{ color: '#3b82f6' }}>C: {mealPlan.reduce((s, m) => s + m.c, 0)}g</span>
                            <span style={{ color: '#f59e0b' }}>F: {mealPlan.reduce((s, m) => s + m.f, 0)}g</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MuscleAnalysis
