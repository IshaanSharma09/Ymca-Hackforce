import express from 'express'
import User from '../models/User.js'

const router = express.Router()

/**
 * POST /api/auth/sync
 * Sync Firebase user with MongoDB — called after login/signup
 * Body: { firebaseUid, email, name, profile? }
 */
router.post('/sync', async (req, res) => {
    try {
        const { firebaseUid, email, name, profile } = req.body
        if (!firebaseUid || !email) {
            return res.status(400).json({ success: false, message: 'firebaseUid and email required' })
        }

        // Find by firebaseUid or email, or create new
        let user = await User.findOne({ $or: [{ firebaseUid }, { email }] })

        if (user) {
            // Update existing
            user.firebaseUid = firebaseUid
            if (name) user.name = name
            if (profile) user.profile = { ...user.profile, ...profile }
            await user.save()
        } else {
            // Create new user
            user = await User.create({
                firebaseUid,
                email,
                name: name || email.split('@')[0],
                profile: profile || {}
            })
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                firebaseUid: user.firebaseUid,
                name: user.name,
                email: user.email,
                profile: user.profile,
                gym: user.gym,
                dailyStepGoal: user.dailyStepGoal,
                waterGoal: user.waterGoal
            }
        })
    } catch (err) {
        console.error('Auth sync error:', err)
        res.status(500).json({ success: false, message: err.message })
    }
})

/**
 * PUT /api/auth/profile
 * Update user profile / onboarding data
 * Body: { firebaseUid, profile, gym, wearable, dailyStepGoal, waterGoal }
 */
router.put('/profile', async (req, res) => {
    try {
        const { firebaseUid, profile, gym, wearable, dailyStepGoal, waterGoal } = req.body
        if (!firebaseUid) {
            return res.status(400).json({ success: false, message: 'firebaseUid required' })
        }

        const user = await User.findOne({ firebaseUid })
        if (!user) return res.status(404).json({ success: false, message: 'User not found' })

        if (profile) user.profile = { ...user.profile, ...profile }
        if (gym) user.gym = gym
        if (wearable) user.wearable = wearable
        if (dailyStepGoal !== undefined) user.dailyStepGoal = dailyStepGoal
        if (waterGoal !== undefined) user.waterGoal = waterGoal

        // Auto-calc BMR/TDEE
        const bmr = user.calculateBMR()
        const tdee = user.calculateTDEE()
        if (bmr) user.profile.bmr = bmr
        if (tdee) user.profile.tdee = tdee

        await user.save()
        res.json({ success: true, user })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
})

/**
 * GET /api/auth/user/:firebaseUid
 * Get user data by Firebase UID
 */
router.get('/user/:firebaseUid', async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.params.firebaseUid })
        if (!user) return res.status(404).json({ success: false, message: 'User not found' })
        res.json({ success: true, user })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
})

export default router
