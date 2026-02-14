import express from 'express'
import HealthLog from '../models/HealthLog.js'
import User from '../models/User.js'

const router = express.Router()

/**
 * Helper: find user by Firebase UID
 */
const findUser = async (firebaseUid) => {
    const user = await User.findOne({ firebaseUid })
    return user
}

/**
 * GET /api/health-log/today/:firebaseUid
 * Get today's health log for a user (creates one if it doesn't exist)
 */
router.get('/today/:firebaseUid', async (req, res) => {
    try {
        const user = await findUser(req.params.firebaseUid)
        if (!user) return res.status(404).json({ success: false, message: 'User not found' })

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        let log = await HealthLog.findOne({ userId: user._id, date: today })

        if (!log) {
            log = await HealthLog.create({
                userId: user._id,
                date: today,
                caloriesSummary: { burnedBMR: user.profile?.bmr || 0 }
            })
        }

        res.json({ success: true, log })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
})

/**
 * PUT /api/health-log/today/:firebaseUid
 * Update today's health log (steps, water, sleep, etc.)
 * Body: { steps, water, sleep, weight, calories, notes }
 */
router.put('/today/:firebaseUid', async (req, res) => {
    try {
        const user = await findUser(req.params.firebaseUid)
        if (!user) return res.status(404).json({ success: false, message: 'User not found' })

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const { steps, water, sleep, weight, calories, musclesWorked, notes } = req.body

        const update = {}
        if (steps !== undefined) {
            update.steps = steps
            update.stepsCalories = Math.round(steps * 0.04)
        }
        if (water !== undefined) update.waterIntake = water
        if (sleep !== undefined) update.sleepHours = sleep
        if (weight !== undefined) update.weight = weight
        if (notes !== undefined) update.notes = notes
        if (musclesWorked) update.musclesWorked = musclesWorked

        if (calories) {
            update['caloriesSummary.consumed'] = calories.consumed || 0
            update['caloriesSummary.burnedExercise'] = calories.burnedExercise || 0
            update['caloriesSummary.burnedSteps'] = update.stepsCalories || Math.round((steps || 0) * 0.04)
            update['caloriesSummary.burnedBMR'] = user.profile?.bmr || 0
            update['caloriesSummary.netBalance'] =
                (calories.consumed || 0) - (calories.burnedExercise || 0) - (update.stepsCalories || 0) - (user.profile?.bmr || 0)
        }

        // Calculate health score (0-100)
        const stepScore = Math.min(((update.steps || 0) / (user.dailyStepGoal || 10000)) * 25, 25)
        const waterScore = Math.min(((update.waterIntake || 0) / (user.waterGoal || 8)) * 25, 25)
        const sleepScore = Math.min(((update.sleepHours || 0) / 8) * 25, 25)
        const exerciseScore = calories?.burnedExercise > 0 ? 25 : 0
        update.healthScore = Math.round(stepScore + waterScore + sleepScore + exerciseScore)

        const log = await HealthLog.findOneAndUpdate(
            { userId: user._id, date: today },
            { $set: update },
            { new: true, upsert: true }
        )

        res.json({ success: true, log })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
})

/**
 * GET /api/health-log/history/:firebaseUid
 * Get last N days of health logs
 * Query: ?days=7
 */
router.get('/history/:firebaseUid', async (req, res) => {
    try {
        const user = await findUser(req.params.firebaseUid)
        if (!user) return res.status(404).json({ success: false, message: 'User not found' })

        const days = parseInt(req.query.days) || 7
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)
        startDate.setHours(0, 0, 0, 0)

        const logs = await HealthLog.find({
            userId: user._id,
            date: { $gte: startDate }
        }).sort({ date: -1 })

        res.json({ success: true, logs })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
})

/**
 * GET /api/health-log/stats/:firebaseUid
 * Get aggregated stats (weekly averages)
 */
router.get('/stats/:firebaseUid', async (req, res) => {
    try {
        const user = await findUser(req.params.firebaseUid)
        if (!user) return res.status(404).json({ success: false, message: 'User not found' })

        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        sevenDaysAgo.setHours(0, 0, 0, 0)

        const logs = await HealthLog.find({
            userId: user._id,
            date: { $gte: sevenDaysAgo }
        })

        const count = logs.length || 1
        const stats = {
            avgSteps: Math.round(logs.reduce((s, l) => s + l.steps, 0) / count),
            avgWater: Math.round(logs.reduce((s, l) => s + l.waterIntake, 0) / count * 10) / 10,
            avgSleep: Math.round(logs.reduce((s, l) => s + l.sleepHours, 0) / count * 10) / 10,
            avgCaloriesConsumed: Math.round(logs.reduce((s, l) => s + (l.caloriesSummary?.consumed || 0), 0) / count),
            avgCaloriesBurned: Math.round(logs.reduce((s, l) => s + (l.caloriesSummary?.burnedExercise || 0), 0) / count),
            avgHealthScore: Math.round(logs.reduce((s, l) => s + l.healthScore, 0) / count),
            totalWorkoutDays: logs.filter(l => (l.caloriesSummary?.burnedExercise || 0) > 0).length,
            streakDays: count
        }

        res.json({ success: true, stats, daysTracked: count })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
})

export default router
