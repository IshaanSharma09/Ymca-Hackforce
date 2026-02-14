import express from 'express'
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
