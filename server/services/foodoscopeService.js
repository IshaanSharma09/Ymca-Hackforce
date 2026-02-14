import axios from 'axios'

/**
 * Foodoscope API Service
 * SOLE source for all food & nutrition data
 * Base URL: http://cosylab.iiitd.edu.in:6969
 * Auth: Bearer token
 * Rate Limit: 25 requests per window
 */

const foodoscopeAPI = axios.create({
    baseURL: process.env.FOODOSCOPE_BASE_URL || 'http://cosylab.iiitd.edu.in:6969',
    headers: {
        'Authorization': `Bearer ${process.env.FOODOSCOPE_API_KEY}`,
        'Content-Type': 'application/json'
    },
    timeout: 15000
})

// ── RecipeDB Endpoints ──

/** Search recipes by name */
export const searchRecipes = async (query, page = 1, limit = 10) => {
    const res = await foodoscopeAPI.get('/recipe2-api/recipe/recipesinfo', {
        params: { search: query, page, limit }
    })
    return res.data
}

/** Get recipe of the day */
export const getRecipeOfDay = async () => {
    const res = await foodoscopeAPI.get('/recipe2-api/recipe/recipeofday')
    return res.data
}

/** Get recipe of the day with ingredients and categories */
export const getRecipeOfDayDetailed = async () => {
    const res = await foodoscopeAPI.get('/recipe2-api/recipe/recipe-day/with-ingredients-categories')
    return res.data
}

/** Get recipe by ID */
export const getRecipeById = async (recipeId) => {
    const res = await foodoscopeAPI.get('/recipe2-api/recipe/recipebyid', {
        params: { id: recipeId }
    })
    return res.data
}

/** Get recipes by category/region */
export const getRecipesByCategory = async (region, subRegion) => {
    const params = {}
    if (region) params.Region = region
    if (subRegion) params.Sub_region = subRegion
    const res = await foodoscopeAPI.get('/recipe2-api/recipe/recipebycategory', { params })
    return res.data
}

/** Get recipes by calorie range */
export const getRecipesByCalories = async (minCalories, maxCalories) => {
    const res = await foodoscopeAPI.get('/recipe2-api/recipe/recipebycalories', {
        params: { minCalories, maxCalories }
    })
    return res.data
}

/** Get recipes by protein range */
export const getRecipesByProtein = async (minProtein, maxProtein) => {
    const res = await foodoscopeAPI.get('/recipe2-api/recipe/recipebyproteinrange', {
        params: { minProtein, maxProtein }
    })
    return res.data
}

/** Get macro nutrition info for a recipe */
export const getNutritionInfo = async (recipeId) => {
    const res = await foodoscopeAPI.get('/recipe2-api/recipe-nutri/nutritioninfo', {
        params: { recipeId }
    })
    return res.data
}

/** Get micro nutrition info (vitamins, minerals, amino acids) */
export const getMicroNutritionInfo = async (recipeId) => {
    const res = await foodoscopeAPI.get('/recipe2-api/recipe-micronutri/micronutritioninfo', {
        params: { recipeId }
    })
    return res.data
}

/** Generate a meal plan */
export const generateMealPlan = async (preferences) => {
    const res = await foodoscopeAPI.post('/recipe2-api/recipe/recipemealplan', preferences)
    return res.data
}

export default foodoscopeAPI
