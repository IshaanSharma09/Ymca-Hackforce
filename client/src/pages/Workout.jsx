import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import {
    MdFitnessCenter, MdSearch, MdAdd, MdClose, MdDelete,
    MdExpandMore, MdExpandLess, MdLocalFireDepartment,
    MdTimer, MdDirectionsRun, MdSportsMartialArts,
    MdAccessibilityNew, MdPlayArrow, MdStop, MdHistory
} from 'react-icons/md'
import './Workout.css'

// ── Built-in Exercise Database with MET values ──
const EXERCISE_DATABASE = [
    // Gym — Chest
    { id: 'g1', name: 'Bench Press', muscle: 'Chest', secondary: ['Triceps', 'Shoulders'], type: 'gym', equipment: 'Barbell', met: 6 },
    { id: 'g2', name: 'Incline Dumbbell Press', muscle: 'Chest', secondary: ['Shoulders'], type: 'gym', equipment: 'Dumbbells', met: 5 },
    { id: 'g3', name: 'Cable Fly', muscle: 'Chest', secondary: [], type: 'gym', equipment: 'Cable', met: 4 },
    { id: 'g4', name: 'Dumbbell Fly', muscle: 'Chest', secondary: [], type: 'gym', equipment: 'Dumbbells', met: 4 },
    // Gym — Back
    { id: 'g5', name: 'Deadlift', muscle: 'Back', secondary: ['Hamstrings', 'Glutes'], type: 'gym', equipment: 'Barbell', met: 8 },
    { id: 'g6', name: 'Barbell Row', muscle: 'Back', secondary: ['Biceps'], type: 'gym', equipment: 'Barbell', met: 6 },
    { id: 'g7', name: 'Lat Pulldown', muscle: 'Back', secondary: ['Biceps'], type: 'gym', equipment: 'Cable', met: 5 },
    { id: 'g8', name: 'Seated Cable Row', muscle: 'Back', secondary: ['Biceps'], type: 'gym', equipment: 'Cable', met: 5 },
    // Gym — Shoulders
    { id: 'g9', name: 'Overhead Press', muscle: 'Shoulders', secondary: ['Triceps'], type: 'gym', equipment: 'Barbell', met: 6 },
    { id: 'g10', name: 'Lateral Raise', muscle: 'Shoulders', secondary: [], type: 'gym', equipment: 'Dumbbells', met: 3.5 },
    { id: 'g11', name: 'Face Pull', muscle: 'Shoulders', secondary: ['Back'], type: 'gym', equipment: 'Cable', met: 4 },
    // Gym — Arms
    { id: 'g12', name: 'Barbell Curl', muscle: 'Biceps', secondary: [], type: 'gym', equipment: 'Barbell', met: 4 },
    { id: 'g13', name: 'Hammer Curl', muscle: 'Biceps', secondary: ['Forearms'], type: 'gym', equipment: 'Dumbbells', met: 4 },
    { id: 'g14', name: 'Tricep Pushdown', muscle: 'Triceps', secondary: [], type: 'gym', equipment: 'Cable', met: 4 },
    { id: 'g15', name: 'Skull Crusher', muscle: 'Triceps', secondary: [], type: 'gym', equipment: 'Barbell', met: 4 },
    // Gym — Legs
    { id: 'g16', name: 'Barbell Squat', muscle: 'Quads', secondary: ['Glutes', 'Hamstrings'], type: 'gym', equipment: 'Barbell', met: 8 },
    { id: 'g17', name: 'Leg Press', muscle: 'Quads', secondary: ['Glutes'], type: 'gym', equipment: 'Machine', met: 6 },
    { id: 'g18', name: 'Romanian Deadlift', muscle: 'Hamstrings', secondary: ['Glutes', 'Back'], type: 'gym', equipment: 'Barbell', met: 6 },
    { id: 'g19', name: 'Leg Curl', muscle: 'Hamstrings', secondary: [], type: 'gym', equipment: 'Machine', met: 4 },
    { id: 'g20', name: 'Calf Raise', muscle: 'Calves', secondary: [], type: 'gym', equipment: 'Machine', met: 3 },
    // Bodyweight
    { id: 'b1', name: 'Push-Ups', muscle: 'Chest', secondary: ['Triceps', 'Shoulders'], type: 'bodyweight', equipment: 'None', met: 4 },
    { id: 'b2', name: 'Pull-Ups', muscle: 'Back', secondary: ['Biceps'], type: 'bodyweight', equipment: 'Pull-up Bar', met: 8 },
    { id: 'b3', name: 'Chin-Ups', muscle: 'Biceps', secondary: ['Back'], type: 'bodyweight', equipment: 'Pull-up Bar', met: 8 },
    { id: 'b4', name: 'Dips', muscle: 'Triceps', secondary: ['Chest', 'Shoulders'], type: 'bodyweight', equipment: 'Parallel Bars', met: 6 },
    { id: 'b5', name: 'Squats (Body)', muscle: 'Quads', secondary: ['Glutes'], type: 'bodyweight', equipment: 'None', met: 5 },
    { id: 'b6', name: 'Lunges', muscle: 'Quads', secondary: ['Glutes', 'Hamstrings'], type: 'bodyweight', equipment: 'None', met: 5 },
    { id: 'b7', name: 'Plank', muscle: 'Core', secondary: ['Shoulders'], type: 'bodyweight', equipment: 'None', met: 3.5 },
    { id: 'b8', name: 'Crunches', muscle: 'Core', secondary: [], type: 'bodyweight', equipment: 'None', met: 3.5 },
    { id: 'b9', name: 'Mountain Climbers', muscle: 'Core', secondary: ['Shoulders', 'Quads'], type: 'bodyweight', equipment: 'None', met: 8 },
    { id: 'b10', name: 'Burpees', muscle: 'Full Body', secondary: [], type: 'bodyweight', equipment: 'None', met: 10 },
    // Cardio
    { id: 'c1', name: 'Running', muscle: 'Legs', secondary: ['Core'], type: 'cardio', equipment: 'None', met: 9.8 },
    { id: 'c2', name: 'Jogging', muscle: 'Legs', secondary: ['Core'], type: 'cardio', equipment: 'None', met: 7 },
    { id: 'c3', name: 'Cycling', muscle: 'Legs', secondary: ['Core'], type: 'cardio', equipment: 'Bicycle', met: 7.5 },
    { id: 'c4', name: 'Jump Rope', muscle: 'Full Body', secondary: [], type: 'cardio', equipment: 'Rope', met: 12 },
    { id: 'c5', name: 'Treadmill Walk', muscle: 'Legs', secondary: [], type: 'cardio', equipment: 'Treadmill', met: 3.5 },
    { id: 'c6', name: 'Treadmill Run', muscle: 'Legs', secondary: ['Core'], type: 'cardio', equipment: 'Treadmill', met: 9 },
    { id: 'c7', name: 'Elliptical', muscle: 'Full Body', secondary: [], type: 'cardio', equipment: 'Elliptical', met: 5 },
    { id: 'c8', name: 'Stair Climber', muscle: 'Legs', secondary: ['Glutes'], type: 'cardio', equipment: 'Machine', met: 9 },
    { id: 'c9', name: 'Swimming', muscle: 'Full Body', secondary: [], type: 'cardio', equipment: 'Pool', met: 8 },
    { id: 'c10', name: 'Rowing Machine', muscle: 'Back', secondary: ['Arms', 'Legs'], type: 'cardio', equipment: 'Machine', met: 7 },
]

const MUSCLE_GROUPS = ['All', 'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Quads', 'Hamstrings', 'Glutes', 'Calves', 'Core', 'Full Body', 'Legs']
const WORKOUT_TYPES = [
    { id: 'all', label: 'All', icon: MdFitnessCenter, color: 'var(--success)' },
    { id: 'gym', label: 'Gym', icon: MdFitnessCenter, color: '#3b82f6' },
    { id: 'bodyweight', label: 'Bodyweight', icon: MdAccessibilityNew, color: '#8b5cf6' },
    { id: 'cardio', label: 'Cardio', icon: MdDirectionsRun, color: '#f59e0b' }
]

// MET calorie formula: calories = MET × weight(kg) × duration(hrs)
const calcCalories = (met, weightKg, durationMin) =>
    Math.round(met * weightKg * (durationMin / 60))

function Workout() {
    const { user, getUserProfile } = useAuth()
    const profile = getUserProfile() || {}
    const userWeight = profile.weight || 70 // kg

    // Tabs & filters
    const [activeTab, setActiveTab] = useState('log') // 'log' or 'history'
    const [filterType, setFilterType] = useState('all')
    const [filterMuscle, setFilterMuscle] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')

    // Current workout
    const [currentExercises, setCurrentExercises] = useState([])
    const [selectModal, setSelectModal] = useState(null) // selected exercise for adding
    const [setsInput, setSetsInput] = useState(3)
    const [repsInput, setRepsInput] = useState(10)
    const [weightInput, setWeightInput] = useState(0)
    const [durationInput, setDurationInput] = useState(30)

    // Workout timer
    const [timerActive, setTimerActive] = useState(false)
    const [timerStart, setTimerStart] = useState(null)
    const [elapsedMin, setElapsedMin] = useState(0)

    // History
    const [workoutHistory, setWorkoutHistory] = useState([])
    const [expandedHistory, setExpandedHistory] = useState(null)

    // Load history
    useEffect(() => {
        if (user) {
            const history = localStorage.getItem(`fitfuel-workouts-${user.uid}`)
            if (history) setWorkoutHistory(JSON.parse(history))
        }
    }, [user])

    // Timer tick
    useEffect(() => {
        let interval
        if (timerActive && timerStart) {
            interval = setInterval(() => {
                setElapsedMin(Math.floor((Date.now() - timerStart) / 60000))
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [timerActive, timerStart])

    // Filter exercises
    const filteredExercises = EXERCISE_DATABASE.filter(ex => {
        if (filterType !== 'all' && ex.type !== filterType) return false
        if (filterMuscle !== 'All' && ex.muscle !== filterMuscle && !ex.secondary.includes(filterMuscle)) return false
        if (searchQuery.length >= 2 && !ex.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
        return true
    })

    // Add exercise to current workout
    const addExercise = () => {
        if (!selectModal) return
        const ex = selectModal
        const isCardio = ex.type === 'cardio'
        const dur = isCardio ? durationInput : Math.round((setsInput * repsInput * 3) / 60) + 1 // estimate ~3s per rep
        const calBurned = calcCalories(ex.met, userWeight, dur)

        const entry = {
            id: Date.now(),
            exerciseId: ex.id,
            name: ex.name,
            muscle: ex.muscle,
            secondary: ex.secondary,
            type: ex.type,
            equipment: ex.equipment,
            met: ex.met,
            sets: isCardio ? null : setsInput,
            reps: isCardio ? null : repsInput,
            weight: isCardio ? null : weightInput,
            duration: dur,
            caloriesBurned: calBurned
        }

        setCurrentExercises([...currentExercises, entry])
        setSelectModal(null)
        setSetsInput(3)
        setRepsInput(10)
        setWeightInput(0)
        setDurationInput(30)
    }

    const removeExercise = (id) => setCurrentExercises(currentExercises.filter(e => e.id !== id))

    // Start/stop timer
    const toggleTimer = () => {
        if (timerActive) {
            setTimerActive(false)
        } else {
            setTimerStart(Date.now())
            setTimerActive(true)
            setElapsedMin(0)
        }
    }

    // Finish & save workout
    const finishWorkout = () => {
        if (currentExercises.length === 0) return

        const totalCal = currentExercises.reduce((s, e) => s + e.caloriesBurned, 0)
        const totalSets = currentExercises.reduce((s, e) => s + (e.sets || 0), 0)
        const totalReps = currentExercises.reduce((s, e) => s + ((e.sets || 0) * (e.reps || 0)), 0)
        const totalVolume = currentExercises.reduce((s, e) => s + ((e.sets || 0) * (e.reps || 0) * (e.weight || 0)), 0)
        const muscles = [...new Set(currentExercises.flatMap(e => [e.muscle, ...e.secondary]))]

        const workout = {
            id: Date.now(),
            date: new Date().toISOString(),
            exercises: currentExercises,
            totalCaloriesBurned: totalCal,
            totalSets,
            totalReps,
            totalVolume: Math.round(totalVolume),
            duration: timerActive ? elapsedMin : currentExercises.reduce((s, e) => s + e.duration, 0),
            musclesWorked: muscles
        }

        const updated = [workout, ...workoutHistory]
        setWorkoutHistory(updated)
        localStorage.setItem(`fitfuel-workouts-${user.uid}`, JSON.stringify(updated))

        // Sync to dashboard
        const today = new Date().toISOString().split('T')[0]
        const dailyKey = `fitfuel-daily-${user.uid}-${today}`
        const daily = JSON.parse(localStorage.getItem(dailyKey) || '{}')
        daily.caloriesBurned = (daily.caloriesBurned || 0) + totalCal
        daily.workoutsToday = (daily.workoutsToday || 0) + 1
        localStorage.setItem(dailyKey, JSON.stringify(daily))

        // Reset
        setCurrentExercises([])
        setTimerActive(false)
        setTimerStart(null)
        setElapsedMin(0)
        setActiveTab('history')
    }

    const currentTotalCal = currentExercises.reduce((s, e) => s + e.caloriesBurned, 0)
    const currentTotalSets = currentExercises.reduce((s, e) => s + (e.sets || 0), 0)

    return (
        <div className="page animate-fade-in">
            <div className="page__header">
                <div>
                    <h1 className="heading-2">Workout Tracker 🏋️</h1>
                    <p className="text-muted text-sm">Log exercises, track progress, burn calories</p>
                </div>
            </div>

            {/* Tab Switcher */}
            <div className="workout-tabs">
                <button className={`workout-tab ${activeTab === 'log' ? 'active' : ''}`} onClick={() => setActiveTab('log')}>
                    <MdFitnessCenter /> Log Workout
                </button>
                <button className={`workout-tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
                    <MdHistory /> History
                </button>
            </div>

            {activeTab === 'log' && (
                <>
                    {/* Workout Timer + Summary */}
                    <div className="workout-summary-bar glass-card-static">
                        <div className="workout-timer-section">
                            <button className={`workout-timer-btn ${timerActive ? 'active' : ''}`} onClick={toggleTimer}>
                                {timerActive ? <MdStop /> : <MdPlayArrow />}
                            </button>
                            <div className="workout-timer-display">
                                <span className="workout-timer-val">{String(Math.floor(elapsedMin / 60)).padStart(2, '0')}:{String(elapsedMin % 60).padStart(2, '0')}</span>
                                <span className="workout-timer-label">{timerActive ? 'Workout Active' : 'Start Timer'}</span>
                            </div>
                        </div>
                        <div className="workout-summary-divider" />
                        <div className="workout-summary-stat">
                            <span className="workout-summary-number">{currentExercises.length}</span>
                            <span className="workout-summary-label">exercises</span>
                        </div>
                        <div className="workout-summary-stat">
                            <span className="workout-summary-number">{currentTotalSets}</span>
                            <span className="workout-summary-label">sets</span>
                        </div>
                        <div className="workout-summary-stat">
                            <MdLocalFireDepartment style={{ color: '#ef4444' }} />
                            <span className="workout-summary-number">{currentTotalCal}</span>
                            <span className="workout-summary-label">kcal</span>
                        </div>
                        {currentExercises.length > 0 && (
                            <button className="btn btn-primary workout-finish-btn" onClick={finishWorkout}>
                                Finish Workout ✓
                            </button>
                        )}
                    </div>

                    <div className="workout-layout">
                        {/* Left — Exercise Library */}
                        <div className="workout-column-main">
                            <div className="glass-card-static workout-library">
                                <h3 className="dash-card-title">Exercise Library</h3>

                                {/* Search */}
                                <div className="workout-search-bar">
                                    <MdSearch className="workout-search-icon" />
                                    <input
                                        className="input-field workout-search-input"
                                        placeholder="Search exercises..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                    />
                                    {searchQuery && (
                                        <button className="workout-search-clear" onClick={() => setSearchQuery('')}>
                                            <MdClose />
                                        </button>
                                    )}
                                </div>

                                {/* Type Filter */}
                                <div className="workout-type-filter">
                                    {WORKOUT_TYPES.map(type => {
                                        const Icon = type.icon
                                        return (
                                            <button key={type.id} className={`workout-type-btn ${filterType === type.id ? 'selected' : ''}`} style={{ '--w-color': type.color }} onClick={() => setFilterType(type.id)}>
                                                <Icon /> {type.label}
                                            </button>
                                        )
                                    })}
                                </div>

                                {/* Muscle Filter */}
                                <div className="workout-muscle-filter">
                                    {MUSCLE_GROUPS.map(m => (
                                        <button key={m} className={`workout-muscle-btn ${filterMuscle === m ? 'active' : ''}`} onClick={() => setFilterMuscle(m)}>
                                            {m}
                                        </button>
                                    ))}
                                </div>

                                {/* Exercise List */}
                                <div className="workout-exercise-list">
                                    {filteredExercises.map(ex => (
                                        <div key={ex.id} className="workout-exercise-card" onClick={() => setSelectModal(ex)}>
                                            <div className="workout-exercise-info">
                                                <div className="workout-exercise-name">{ex.name}</div>
                                                <div className="workout-exercise-meta">
                                                    <span className={`badge badge-${ex.type === 'gym' ? 'info' : ex.type === 'bodyweight' ? 'warning' : 'success'}`}>
                                                        {ex.type}
                                                    </span>
                                                    <span className="text-xs text-muted">{ex.muscle}</span>
                                                    {ex.equipment !== 'None' && <span className="text-xs text-muted">· {ex.equipment}</span>}
                                                </div>
                                            </div>
                                            <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); setSelectModal(ex) }}>
                                                <MdAdd />
                                            </button>
                                        </div>
                                    ))}
                                    {filteredExercises.length === 0 && (
                                        <p className="text-muted text-sm text-center" style={{ padding: 'var(--space-6)' }}>No exercises match your filters</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right — Current Workout */}
                        <div className="workout-column-side">
                            <div className="glass-card-static">
                                <h3 className="dash-card-title"><MdFitnessCenter style={{ color: 'var(--info)' }} /> Current Workout</h3>
                                {currentExercises.length === 0 ? (
                                    <p className="text-muted text-sm text-center" style={{ padding: 'var(--space-8) 0' }}>
                                        Add exercises from the library 💪
                                    </p>
                                ) : (
                                    <div className="workout-current-list">
                                        {currentExercises.map((ex, i) => (
                                            <div key={ex.id} className="workout-current-item">
                                                <div className="workout-current-info">
                                                    <span className="workout-current-num">{i + 1}</span>
                                                    <div>
                                                        <div className="text-sm" style={{ fontWeight: 600 }}>{ex.name}</div>
                                                        <div className="text-xs text-muted">
                                                            {ex.sets ? `${ex.sets}×${ex.reps} @ ${ex.weight}kg` : `${ex.duration} min`}
                                                            <span style={{ color: '#ef4444', marginLeft: '8px' }}>🔥 {ex.caloriesBurned} kcal</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="btn-icon btn-icon-sm" onClick={() => removeExercise(ex.id)}>
                                                    <MdDelete style={{ color: 'var(--danger)', fontSize: '0.9rem' }} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
                <div className="workout-history">
                    {workoutHistory.length === 0 ? (
                        <div className="glass-card-static text-center" style={{ padding: 'var(--space-10)' }}>
                            <MdHistory style={{ fontSize: '3rem', color: 'var(--text-tertiary)', marginBottom: '8px' }} />
                            <p className="text-muted">No workouts logged yet</p>
                            <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => setActiveTab('log')}>Start a Workout</button>
                        </div>
                    ) : (
                        workoutHistory.map(w => (
                            <div key={w.id} className="glass-card-static workout-history-card">
                                <button className="workout-history-header" onClick={() => setExpandedHistory(expandedHistory === w.id ? null : w.id)}>
                                    <div className="workout-history-left">
                                        <strong>{new Date(w.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</strong>
                                        <span className="text-xs text-muted">{w.exercises.length} exercises · {w.duration} min</span>
                                    </div>
                                    <div className="workout-history-right">
                                        <span className="text-sm" style={{ color: '#ef4444', fontWeight: 600 }}>🔥 {w.totalCaloriesBurned} kcal</span>
                                        {expandedHistory === w.id ? <MdExpandLess /> : <MdExpandMore />}
                                    </div>
                                </button>
                                <div className="workout-history-stats">
                                    <span className="badge badge-info">{w.totalSets} sets</span>
                                    <span className="badge badge-warning">{w.totalReps} reps</span>
                                    {w.totalVolume > 0 && <span className="badge badge-success">{w.totalVolume.toLocaleString()} kg volume</span>}
                                    {w.musclesWorked.slice(0, 4).map(m => <span key={m} className="workout-muscle-tag">{m}</span>)}
                                </div>
                                {expandedHistory === w.id && (
                                    <div className="workout-history-exercises animate-fade-in">
                                        {w.exercises.map((ex, i) => (
                                            <div key={ex.id} className="workout-history-exercise">
                                                <span className="text-sm" style={{ fontWeight: 600 }}>{i + 1}. {ex.name}</span>
                                                <span className="text-xs text-muted">
                                                    {ex.sets ? `${ex.sets}×${ex.reps} @ ${ex.weight}kg` : `${ex.duration} min`}
                                                    {' · '}{ex.caloriesBurned} kcal
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* ── Add Exercise Modal ── */}
            {selectModal && (
                <div className="workout-modal-overlay" onClick={() => setSelectModal(null)}>
                    <div className="workout-modal glass-card-static animate-scale-in" onClick={e => e.stopPropagation()}>
                        <button className="workout-modal-close" onClick={() => setSelectModal(null)}><MdClose /></button>
                        <h3 className="heading-4">{selectModal.name}</h3>
                        <div className="workout-modal-meta">
                            <span className={`badge badge-${selectModal.type === 'gym' ? 'info' : selectModal.type === 'bodyweight' ? 'warning' : 'success'}`}>{selectModal.type}</span>
                            <span className="text-sm text-muted">{selectModal.muscle}</span>
                            {selectModal.secondary.length > 0 && <span className="text-xs text-muted">+ {selectModal.secondary.join(', ')}</span>}
                        </div>
                        <p className="text-xs text-muted">MET: {selectModal.met} · Equipment: {selectModal.equipment}</p>

                        {selectModal.type === 'cardio' ? (
                            /* Cardio: duration only */
                            <div className="workout-modal-inputs">
                                <div className="workout-modal-field">
                                    <label>Duration</label>
                                    <div className="workout-input-row">
                                        <button className="quantity-btn" onClick={() => setDurationInput(Math.max(5, durationInput - 5))}>−</button>
                                        <div className="quantity-input-wrapper">
                                            <input className="quantity-input" type="number" value={durationInput} onChange={e => setDurationInput(Math.max(1, parseInt(e.target.value) || 0))} />
                                            <span className="quantity-unit">min</span>
                                        </div>
                                        <button className="quantity-btn" onClick={() => setDurationInput(durationInput + 5)}>+</button>
                                    </div>
                                    <div className="workout-duration-presets">
                                        {[10, 15, 20, 30, 45, 60].map(d => (
                                            <button key={d} className={`quantity-preset ${durationInput === d ? 'active' : ''}`} onClick={() => setDurationInput(d)}>{d}m</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Gym / Bodyweight: sets, reps, weight */
                            <div className="workout-modal-inputs">
                                <div className="workout-modal-3col">
                                    <div className="workout-modal-field">
                                        <label>Sets</label>
                                        <div className="workout-stepper">
                                            <button onClick={() => setSetsInput(Math.max(1, setsInput - 1))}>−</button>
                                            <span>{setsInput}</span>
                                            <button onClick={() => setSetsInput(setsInput + 1)}>+</button>
                                        </div>
                                    </div>
                                    <div className="workout-modal-field">
                                        <label>Reps</label>
                                        <div className="workout-stepper">
                                            <button onClick={() => setRepsInput(Math.max(1, repsInput - 1))}>−</button>
                                            <span>{repsInput}</span>
                                            <button onClick={() => setRepsInput(repsInput + 1)}>+</button>
                                        </div>
                                    </div>
                                    <div className="workout-modal-field">
                                        <label>Weight (kg)</label>
                                        <div className="workout-stepper">
                                            <button onClick={() => setWeightInput(Math.max(0, weightInput - 2.5))}>−</button>
                                            <span>{weightInput}</span>
                                            <button onClick={() => setWeightInput(weightInput + 2.5)}>+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Calorie preview */}
                        <div className="workout-modal-cal-preview">
                            <MdLocalFireDepartment style={{ color: '#ef4444', fontSize: '1.3rem' }} />
                            <span>Estimated burn: </span>
                            <strong>
                                {selectModal.type === 'cardio'
                                    ? calcCalories(selectModal.met, userWeight, durationInput)
                                    : calcCalories(selectModal.met, userWeight, Math.round((setsInput * repsInput * 3) / 60) + 1)
                                } kcal
                            </strong>
                        </div>

                        <button className="btn btn-primary" style={{ width: '100%' }} onClick={addExercise}>
                            <MdAdd /> Add to Workout
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Workout
