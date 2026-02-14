import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'

const DailyLogContext = createContext()

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

    // Load data on user change
    useEffect(() => {
        if (user) {
            const today = new Date().toISOString().split('T')[0]
            const saved = localStorage.getItem(`fitfuel-daily-${user.uid}-${today}`)
            if (saved) {
                setDailyData(JSON.parse(saved))
            } else {
                setDailyData({
                    caloriesConsumed: 0, caloriesBurned: 0,
                    protein: 0, carbs: 0, fat: 0,
                    steps: 0, water: 0, sleep: 0, workoutsToday: 0
                })
            }
        }
    }, [user])

    const saveDailyData = useCallback((newData) => {
        if (!user) return
        const today = new Date().toISOString().split('T')[0]
        setDailyData(newData)
        localStorage.setItem(`fitfuel-daily-${user.uid}-${today}`, JSON.stringify(newData))
    }, [user])

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

    return (
        <DailyLogContext.Provider value={{
            dailyData,
            setDailyData,
            saveDailyData,
            addWater,
            logMeal,
            logSteps,
            logWorkout
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
