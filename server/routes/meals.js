import express from 'express'
import Meal from '../models/Meal.js'
import User from '../models/User.js'
import {
    searchRecipes,
    getRecipeOfDay,
    getRecipeOfDayDetailed,
    getRecipeById,
    getRecipesByCategory,
    getRecipesByCalories,
    getRecipesByProtein,
    getNutritionInfo,
    getMicroNutritionInfo,
    generateMealPlan
} from '../services/foodoscopeService.js'

const router = express.Router()

const findUser = async (firebaseUid) => await User.findOne({ firebaseUid })

// ── Meal persistence endpoints ──

/**
 * POST /api/meals/save
 * Log a meal to DB
 * Body: { firebaseUid, mealType, recipe, nutrition, notes }
 */
router.post('/save', async (req, res) => {
    try {
        const { firebaseUid, ...mealData } = req.body
        const user = await findUser(firebaseUid)
        if (!user) return res.status(404).json({ success: false, message: 'User not found' })

        const meal = await Meal.create({ userId: user._id, ...mealData })
        res.status(201).json({ success: true, meal })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
})

/**
 * GET /api/meals/today/:firebaseUid
 * Get today's meals
 */
router.get('/today/:firebaseUid', async (req, res) => {
    try {
        const user = await findUser(req.params.firebaseUid)
        if (!user) return res.status(404).json({ success: false, message: 'User not found' })

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const meals = await Meal.find({
            userId: user._id,
            date: { $gte: today }
        }).sort({ date: -1 })

        res.json({ success: true, meals })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
})

/**
 * GET /api/meals/history/:firebaseUid
 * Get meal history
 * Query: ?days=7
 */
router.get('/history/:firebaseUid', async (req, res) => {
    try {
        const user = await findUser(req.params.firebaseUid)
        if (!user) return res.status(404).json({ success: false, message: 'User not found' })

        const days = parseInt(req.query.days) || 7
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)

        const meals = await Meal.find({
            userId: user._id,
            date: { $gte: startDate }
        }).sort({ date: -1 })

        res.json({ success: true, meals })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
})

/**
 * DELETE /api/meals/:id
 */
router.delete('/:id', async (req, res) => {
    try {
        await Meal.findByIdAndDelete(req.params.id)
        res.json({ success: true, message: 'Meal deleted' })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
})

// ── Foodoscope API proxy endpoints ──

// Search recipes
router.get('/search', async (req, res) => {
    try {
        const { q, page, limit } = req.query
        const data = await searchRecipes(q, page, limit)
        res.json(data)
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.message })
    }
})

// Recipe of the day
router.get('/recipe-of-day', async (_req, res) => {
    try {
        const data = await getRecipeOfDayDetailed()
        res.json(data)
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.message })
    }
})

// Recipe by ID
router.get('/recipe/:id', async (req, res) => {
    try {
        const data = await getRecipeById(req.params.id)
        res.json(data)
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.message })
    }
})

// Recipes by category
router.get('/category', async (req, res) => {
    try {
        const { region, subRegion } = req.query
        const data = await getRecipesByCategory(region, subRegion)
        res.json(data)
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.message })
    }
})

// Recipes by calorie range
router.get('/by-calories', async (req, res) => {
    try {
        const { min, max } = req.query
        const data = await getRecipesByCalories(min, max)
        res.json(data)
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.message })
    }
})

// Recipes by protein range
router.get('/by-protein', async (req, res) => {
    try {
        const { min, max } = req.query
        const data = await getRecipesByProtein(min, max)
        res.json(data)
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.message })
    }
})

// Nutrition info
router.get('/nutrition/:id', async (req, res) => {
    try {
        const data = await getNutritionInfo(req.params.id)
        res.json(data)
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.message })
    }
})

// Micro nutrition info
router.get('/micro-nutrition/:id', async (req, res) => {
    try {
        const data = await getMicroNutritionInfo(req.params.id)
        res.json(data)
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.message })
    }
})

// Meal plan
router.post('/meal-plan', async (req, res) => {
    try {
        const data = await generateMealPlan(req.body)
        res.json(data)
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.message })
    }
})

export default router
