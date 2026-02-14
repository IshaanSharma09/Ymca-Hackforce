import express from 'express'
import Workout from '../models/Workout.js'
import User from '../models/User.js'

const router = express.Router()

const findUser = async (firebaseUid) => await User.findOne({ firebaseUid })

/**
 * POST /api/workouts/save
 * Save a completed workout
 * Body: { firebaseUid, type, exercises, totalCaloriesBurned, totalVolume, totalSets, totalReps, duration, musclesWorked, notes }
 */
router.post('/save', async (req, res) => {
    try {
        const { firebaseUid, ...workoutData } = req.body
        const user = await findUser(firebaseUid)
        if (!user) return res.status(404).json({ success: false, message: 'User not found' })

        const workout = await Workout.create({
            userId: user._id,
            ...workoutData
        })

        res.status(201).json({ success: true, workout })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
})

/**
 * GET /api/workouts/history/:firebaseUid
 * Get workout history (last N workouts)
 * Query: ?limit=20
 */
router.get('/history/:firebaseUid', async (req, res) => {
    try {
        const user = await findUser(req.params.firebaseUid)
        if (!user) return res.status(404).json({ success: false, message: 'User not found' })

        const limit = parseInt(req.query.limit) || 20
        const workouts = await Workout.find({ userId: user._id })
            .sort({ date: -1 })
            .limit(limit)

        res.json({ success: true, workouts })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
})

/**
 * GET /api/workouts/stats/:firebaseUid
 * Get workout stats (total workouts, volume, etc.)
 */
router.get('/stats/:firebaseUid', async (req, res) => {
    try {
        const user = await findUser(req.params.firebaseUid)
        if (!user) return res.status(404).json({ success: false, message: 'User not found' })

        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const workouts = await Workout.find({
            userId: user._id,
            date: { $gte: thirtyDaysAgo }
        })

        const stats = {
            totalWorkouts: workouts.length,
            totalCaloriesBurned: workouts.reduce((s, w) => s + w.totalCaloriesBurned, 0),
            totalVolume: workouts.reduce((s, w) => s + w.totalVolume, 0),
            totalMinutes: workouts.reduce((s, w) => s + w.duration, 0),
            muscleFrequency: {},
        }

        // Count muscle frequency
        workouts.forEach(w => {
            w.musclesWorked.forEach(m => {
                stats.muscleFrequency[m] = (stats.muscleFrequency[m] || 0) + 1
            })
        })

        res.json({ success: true, stats, period: '30 days' })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
})

/**
 * DELETE /api/workouts/:id
 * Delete a workout by ID
 */
router.delete('/:id', async (req, res) => {
    try {
        await Workout.findByIdAndDelete(req.params.id)
        res.json({ success: true, message: 'Workout deleted' })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
})

export default router
