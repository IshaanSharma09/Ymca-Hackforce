import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'

const DailyLogContext = createContext()

// ── Helpers for date keys ──
function getDateKey(date = new Date()) {
    return date.toISOString().split('T')[0]
}

function getWeekKey(date = new Date()) {
    const d = new Date(date)
    d.setDate(d.getDate() - d.getDay()) // start of week (Sunday)
    return `W-${d.toISOString().split('T')[0]}`
}

function getMonthKey(date = new Date()) {
    return `M-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function getYearKey(date = new Date()) {
    return `Y-${date.getFullYear()}`
}

// ── Average/sum helper ──
function aggregateEntries(entries) {
    if (!entries.length) return null
    const n = entries.length
    return {
        caloriesConsumed: Math.round(entries.reduce((s, e) => s + (e.caloriesConsumed || 0), 0) / n),
        caloriesBurned: Math.round(entries.reduce((s, e) => s + (e.caloriesBurned || 0), 0) / n),
        protein: Math.round(entries.reduce((s, e) => s + (e.protein || 0), 0) / n),
        carbs: Math.round(entries.reduce((s, e) => s + (e.carbs || 0), 0) / n),
        fat: Math.round(entries.reduce((s, e) => s + (e.fat || 0), 0) / n),
        steps: Math.round(entries.reduce((s, e) => s + (e.steps || 0), 0) / n),
        water: Math.round(entries.reduce((s, e) => s + (e.water || 0), 0) / n),
        sleep: Math.round((entries.reduce((s, e) => s + (e.sleep || 0), 0) / n) * 10) / 10,
        workoutsToday: Math.round(entries.reduce((s, e) => s + (e.workoutsToday || 0), 0) / n),
        daysRecorded: n
    }
}

export function DailyLogProvider({ children }) {
    const { user } = useAuth()
    const [dailyData, setDailyData] = useState({
        caloriesConsumed: 0,
        caloriesBurned: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        steps: 0,
        water: 0,
        sleep: 0,
        workoutsToday: 0
    })

    // ── Life / Cheat-Day System ──
    const [livesRemaining, setLivesRemaining] = useState(3)
    const [isCheatDay, setIsCheatDay] = useState(false)
    const CHEAT_DAY_PENALTY = 20 // XP penalty for using a cheat day
    const TOTAL_LIVES = 3

    const prefix = user ? `fitfuel-daily-${user.uid}` : null

    // Helper to get current month key for lives
    function getLivesKey() {
        if (!user) return null
        const now = new Date()
        return `fitfuel-lives-${user.uid}-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    }

    // Helper to get cheat day key for today
    function getCheatDayKey() {
        if (!user) return null
        return `fitfuel-cheatday-${user.uid}-${getDateKey()}`
    }

    // Load data on user change + run aggregation
    useEffect(() => {
        if (!user) return
        const today = getDateKey()
        const saved = localStorage.getItem(`${prefix}-${today}`)
        if (saved) {
            setDailyData(JSON.parse(saved))
        } else {
            setDailyData({
                caloriesConsumed: 0, caloriesBurned: 0,
                protein: 0, carbs: 0, fat: 0,
                steps: 0, water: 0, sleep: 0, workoutsToday: 0
            })
        }

        // Load lives for this month
        const livesKey = `fitfuel-lives-${user.uid}-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
        const savedLives = localStorage.getItem(livesKey)
        if (savedLives !== null) {
            setLivesRemaining(parseInt(savedLives, 10))
        } else {
            // New month — reset to 3 lives
            setLivesRemaining(TOTAL_LIVES)
            localStorage.setItem(livesKey, String(TOTAL_LIVES))
        }

        // Load cheat day status for today
        const cheatKey = `fitfuel-cheatday-${user.uid}-${today}`
        setIsCheatDay(localStorage.getItem(cheatKey) === 'true')

        // Run aggregation check
        runAggregation(user.uid)
    }, [user])

    // ── Save today's data ──
    const saveDailyData = useCallback((newData) => {
        if (!user) return
        const today = getDateKey()
        setDailyData(newData)
        localStorage.setItem(`${prefix}-${today}`, JSON.stringify(newData))
    }, [user, prefix])

    // ── Quick actions ──
    const addWater = useCallback(() => {
        saveDailyData({ ...dailyData, water: (dailyData.water || 0) + 1 })
    }, [dailyData, saveDailyData])

    const logMeal = useCallback((calories, protein, carbs, fat) => {
        saveDailyData({
            ...dailyData,
            caloriesConsumed: dailyData.caloriesConsumed + calories,
            protein: dailyData.protein + protein,
            carbs: dailyData.carbs + carbs,
            fat: dailyData.fat + fat
        })
    }, [dailyData, saveDailyData])

    const logSteps = useCallback((steps) => {
        saveDailyData({
            ...dailyData,
            steps: dailyData.steps + steps,
            caloriesBurned: dailyData.caloriesBurned + Math.round(steps * 0.04)
        })
    }, [dailyData, saveDailyData])

    const logWorkout = useCallback((calories, duration) => {
        saveDailyData({
            ...dailyData,
            caloriesBurned: dailyData.caloriesBurned + calories,
            workoutsToday: dailyData.workoutsToday + 1
        })
    }, [dailyData, saveDailyData])

    const logSleep = useCallback((hours) => {
        saveDailyData({ ...dailyData, sleep: hours })
    }, [dailyData, saveDailyData])

    // ── Cheat Day Actions ──
    const useCheatDay = useCallback(() => {
        if (!user || livesRemaining <= 0 || isCheatDay) return false
        const livesKey = getLivesKey()
        const cheatKey = getCheatDayKey()
        if (!livesKey || !cheatKey) return false

        const newLives = livesRemaining - 1
        setLivesRemaining(newLives)
        setIsCheatDay(true)
        localStorage.setItem(livesKey, String(newLives))
        localStorage.setItem(cheatKey, 'true')
        return true
    }, [user, livesRemaining, isCheatDay])

    const getCheatDaysUsedThisMonth = useCallback(() => {
        return TOTAL_LIVES - livesRemaining
    }, [livesRemaining])

    // ──────────────────────────────────────────────
    //  DATA AGGREGATION: Daily → Weekly → Monthly → Yearly
    // ──────────────────────────────────────────────
    function runAggregation(uid) {
        const p = `fitfuel-daily-${uid}`
        const lastAgg = localStorage.getItem(`${p}-lastAgg`)
        const today = getDateKey()
        if (lastAgg === today) return // already ran today

        // Collect all daily entries from localStorage
        const allKeys = []
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key && key.startsWith(p + '-') && !key.includes('-W-') && !key.includes('-M-') && !key.includes('-Y-') && !key.includes('-lastAgg')) {
                const dateStr = key.replace(p + '-', '')
                if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                    allKeys.push({ key, date: dateStr })
                }
            }
        }

        // Sort by date
        allKeys.sort((a, b) => a.date.localeCompare(b.date))

        // Weekly aggregation: group by week
        const weekGroups = {}
        allKeys.forEach(({ key, date }) => {
            const d = new Date(date + 'T00:00:00')
            const wk = getWeekKey(d)
            if (!weekGroups[wk]) weekGroups[wk] = []
            try {
                const data = JSON.parse(localStorage.getItem(key))
                if (data) weekGroups[wk].push({ ...data, _date: date })
            } catch (e) { /* skip invalid */ }
        })

        const now = new Date()
        const currentWeek = getWeekKey(now)
        const currentMonth = getMonthKey(now)

        // Save weekly summaries (only for completed weeks, not current week)
        Object.entries(weekGroups).forEach(([wk, entries]) => {
            if (wk === currentWeek) return // don't aggregate current week
            if (entries.length >= 3) { // at least 3 days of data
                const agg = aggregateEntries(entries)
                localStorage.setItem(`${p}-${wk}`, JSON.stringify(agg))
            }
        })

        // Monthly aggregation: group weeks by month
        const monthGroups = {}
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key && key.startsWith(p + '-W-')) {
                const weekDate = key.replace(p + '-W-', '')
                const d = new Date(weekDate + 'T00:00:00')
                const mk = getMonthKey(d)
                if (!monthGroups[mk]) monthGroups[mk] = []
                try {
                    const data = JSON.parse(localStorage.getItem(key))
                    if (data) monthGroups[mk].push(data)
                } catch (e) { /* skip */ }
            }
        }

        Object.entries(monthGroups).forEach(([mk, entries]) => {
            if (mk === currentMonth) return
            if (entries.length >= 2) {
                const agg = aggregateEntries(entries)
                localStorage.setItem(`${p}-${mk}`, JSON.stringify(agg))
            }
        })

        // Yearly aggregation: group months by year
        const yearGroups = {}
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key && key.startsWith(p + '-M-')) {
                const monthStr = key.replace(p + '-M-', '')
                const year = monthStr.split('-')[0]
                const yk = `Y-${year}`
                if (!yearGroups[yk]) yearGroups[yk] = []
                try {
                    const data = JSON.parse(localStorage.getItem(key))
                    if (data) yearGroups[yk].push(data)
                } catch (e) { /* skip */ }
            }
        }

        const currentYear = getYearKey(now)
        Object.entries(yearGroups).forEach(([yk, entries]) => {
            if (yk === currentYear) return
            if (entries.length >= 6) {
                const agg = aggregateEntries(entries)
                localStorage.setItem(`${p}-${yk}`, JSON.stringify(agg))
            }
        })

        localStorage.setItem(`${p}-lastAgg`, today)
    }

    // ── Read aggregated data for Analysis ──
    const getWeeklyData = useCallback((weeks = 4) => {
        if (!user) return []
        const result = []
        const now = new Date()
        for (let i = weeks - 1; i >= 0; i--) {
            const d = new Date(now)
            d.setDate(d.getDate() - (i * 7))
            const wk = getWeekKey(d)
            const saved = localStorage.getItem(`${prefix}-${wk}`)
            result.push({
                key: wk,
                label: `Week ${weeks - i}`,
                data: saved ? JSON.parse(saved) : null
            })
        }
        return result
    }, [user, prefix])

    const getMonthlyData = useCallback((months = 6) => {
        if (!user) return []
        const result = []
        const now = new Date()
        for (let i = months - 1; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const mk = getMonthKey(d)
            const saved = localStorage.getItem(`${prefix}-${mk}`)
            result.push({
                key: mk,
                label: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                data: saved ? JSON.parse(saved) : null
            })
        }
        return result
    }, [user, prefix])

    return (
        <DailyLogContext.Provider value={{
            dailyData,
            setDailyData,
            saveDailyData,
            addWater,
            logMeal,
            logSteps,
            logWorkout,
            logSleep,
            getWeeklyData,
            getMonthlyData,
            // Life / Cheat-Day system
            livesRemaining,
            isCheatDay,
            useCheatDay,
            getCheatDaysUsedThisMonth,
            cheatDayPenalty: CHEAT_DAY_PENALTY,
            totalLives: TOTAL_LIVES
        }}>
            {children}
        </DailyLogContext.Provider>
    )
}

export function useDailyLog() {
    const context = useContext(DailyLogContext)
    if (!context) throw new Error('useDailyLog must be used within DailyLogProvider')
    return context
}
