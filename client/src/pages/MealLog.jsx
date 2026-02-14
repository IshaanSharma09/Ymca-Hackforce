import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useDailyLog } from '../context/DailyLogContext'
import {
    MdSearch, MdAdd, MdClose, MdRestaurantMenu,
    MdLocalFireDepartment, MdFavorite,
    MdFavoriteBorder, MdDelete, MdExpandMore, MdExpandLess,
    MdBreakfastDining, MdLunchDining, MdDinnerDining, MdCookie,
    MdMenuBook, MdTimer, MdPeople, MdWarning
} from 'react-icons/md'
import './MealLog.css'
import api from '../services/api'

// ── Nutrition data per 100g ──
const FOOD_DATABASE = [
    { id: 1, name: 'Chicken Breast (Grilled)', cal100: 165, p100: 31, c100: 0, f100: 3.6, category: 'Protein', tags: ['nonveg'] },
    { id: 2, name: 'Brown Rice (Cooked)', cal100: 112, p100: 2.6, c100: 23, f100: 0.9, category: 'Grains', tags: [] },
    { id: 3, name: 'Egg (Boiled/Scrambled)', cal100: 155, p100: 13, c100: 1.1, f100: 11, category: 'Protein', defaultG: 50, tags: ['egg', 'nonveg'] },
    { id: 4, name: 'Banana', cal100: 89, p100: 1.1, c100: 23, f100: 0.3, category: 'Fruits', defaultG: 120, tags: [] },
    { id: 5, name: 'Greek Yogurt', cal100: 59, p100: 10, c100: 3.6, f100: 0.4, category: 'Dairy', defaultG: 170, tags: ['dairy'] },
    { id: 6, name: 'Oatmeal (Cooked)', cal100: 68, p100: 2.4, c100: 12, f100: 1.4, category: 'Grains', defaultG: 240, tags: ['gluten'] },
    { id: 7, name: 'Salmon', cal100: 208, p100: 20, c100: 0, f100: 13, category: 'Protein', tags: ['nonveg', 'seafood'] },
    { id: 8, name: 'Avocado', cal100: 160, p100: 2, c100: 8.5, f100: 15, category: 'Fats', defaultG: 80, tags: [] },
    { id: 9, name: 'Sweet Potato', cal100: 86, p100: 1.6, c100: 20, f100: 0.1, category: 'Carbs', defaultG: 130, tags: [] },
    { id: 10, name: 'Broccoli', cal100: 34, p100: 2.8, c100: 7, f100: 0.4, category: 'Vegetables', tags: [] },
    { id: 11, name: 'Almonds', cal100: 579, p100: 21, c100: 22, f100: 50, category: 'Nuts', defaultG: 28, tags: ['nuts'] },
    { id: 12, name: 'Whole Wheat Bread', cal100: 247, p100: 13, c100: 43, f100: 3.4, category: 'Grains', defaultG: 28, tags: ['gluten'] },
    { id: 13, name: 'Apple', cal100: 52, p100: 0.3, c100: 14, f100: 0.2, category: 'Fruits', defaultG: 180, tags: [] },
    { id: 14, name: 'Peanut Butter', cal100: 588, p100: 25, c100: 20, f100: 50, category: 'Fats', defaultG: 32, tags: ['nuts'] },
    { id: 15, name: 'Cottage Cheese', cal100: 98, p100: 11, c100: 3.4, f100: 4.3, category: 'Dairy', tags: ['dairy'] },
    { id: 16, name: 'Tuna (Canned)', cal100: 116, p100: 26, c100: 0, f100: 1, category: 'Protein', tags: ['nonveg', 'seafood'] },
    { id: 17, name: 'Pasta (Cooked)', cal100: 131, p100: 5, c100: 25, f100: 1.1, category: 'Grains', defaultG: 150, tags: ['gluten'] },
    { id: 18, name: 'Spinach', cal100: 23, p100: 2.9, c100: 3.6, f100: 0.4, category: 'Vegetables', tags: [] },
    { id: 19, name: 'Whey Protein (Scoop)', cal100: 400, p100: 80, c100: 10, f100: 3, category: 'Supplement', defaultG: 30, tags: ['dairy'] },
    { id: 20, name: 'Mixed Berries', cal100: 57, p100: 0.7, c100: 14, f100: 0.3, category: 'Fruits', defaultG: 150, tags: [] },
    { id: 21, name: 'Paneer', cal100: 265, p100: 18, c100: 1.2, f100: 21, category: 'Protein', tags: ['dairy'] },
    { id: 22, name: 'Toor Dal (Cooked)', cal100: 120, p100: 8, c100: 20, f100: 1.3, category: 'Protein', defaultG: 150, tags: [] },
    { id: 23, name: 'Roti / Chapati', cal100: 297, p100: 11, c100: 56, f100: 3.7, category: 'Grains', defaultG: 30, tags: ['gluten'] },
    { id: 24, name: 'White Rice (Cooked)', cal100: 130, p100: 2.7, c100: 28, f100: 0.3, category: 'Grains', defaultG: 160, tags: [] },
    { id: 25, name: 'Chicken Curry', cal100: 150, p100: 14, c100: 5, f100: 8, category: 'Protein', defaultG: 200, tags: ['nonveg'] },
    { id: 26, name: 'Masala Dosa', cal100: 140, p100: 3.3, c100: 23, f100: 4, category: 'Grains', defaultG: 120, tags: [] },
    { id: 27, name: 'Idli', cal100: 129, p100: 3.5, c100: 28, f100: 0.4, category: 'Grains', defaultG: 40, tags: [] },
    { id: 28, name: 'Mixed Veg Curry', cal100: 85, p100: 2.5, c100: 11, f100: 3.6, category: 'Vegetables', defaultG: 170, tags: [] },
    { id: 29, name: 'Curd / Dahi', cal100: 61, p100: 3.5, c100: 4.7, f100: 3.3, category: 'Dairy', defaultG: 150, tags: ['dairy'] },
    { id: 30, name: 'Paratha', cal100: 260, p100: 6, c100: 36, f100: 10, category: 'Grains', defaultG: 60, tags: ['gluten'] },
    { id: 31, name: 'Rajma (Cooked)', cal100: 127, p100: 8.7, c100: 23, f100: 0.5, category: 'Protein', defaultG: 150, tags: [] },
    { id: 32, name: 'Poha', cal100: 130, p100: 2.5, c100: 26, f100: 2, category: 'Grains', defaultG: 200, tags: [] },
    { id: 33, name: 'Milk (Whole)', cal100: 62, p100: 3.2, c100: 4.8, f100: 3.3, category: 'Dairy', defaultG: 250, tags: ['dairy'] },
    { id: 34, name: 'Tofu', cal100: 76, p100: 8, c100: 1.9, f100: 4.8, category: 'Protein', tags: ['soy'] },
    { id: 35, name: 'Basmati Rice (Cooked)', cal100: 121, p100: 3.5, c100: 25, f100: 0.4, category: 'Grains', defaultG: 160, tags: [] },
]

// ── Helper: calc macros for given grams ──
const calcMacros = (food, grams) => ({
    calories: Math.round((food.cal100 / 100) * grams),
    protein: Math.round((food.p100 / 100) * grams * 10) / 10,
    carbs: Math.round((food.c100 / 100) * grams * 10) / 10,
    fat: Math.round((food.f100 / 100) * grams * 10) / 10,
})

// ── Recipes ──
const RECIPE_DATABASE = [
    {
        id: 'r1', name: 'Protein Oatmeal Bowl', time: '10 min', servings: 1, difficulty: 'Easy',
        calories: 380, protein: 32, carbs: 42, fat: 8,
        tags: ['dairy', 'gluten'],
        ingredients: ['1 cup oats', '1 scoop whey protein', '1 banana (sliced)', '1 tbsp honey', '1/2 cup milk'],
        steps: ['Cook oats with milk for 5 min.', 'Mix in protein powder while warm.', 'Top with banana slices and drizzle honey.']
    },
    {
        id: 'r2', name: 'Chicken Stir-Fry', time: '20 min', servings: 2, difficulty: 'Easy',
        calories: 320, protein: 35, carbs: 15, fat: 12,
        tags: ['nonveg', 'soy'],
        ingredients: ['200g chicken breast', '1 bell pepper', '1 cup broccoli', '2 tbsp soy sauce', '1 tbsp olive oil', '2 cloves garlic'],
        steps: ['Slice chicken into strips, season with salt & pepper.', 'Heat oil, cook chicken 5-6 min until golden.', 'Add garlic, bell pepper, broccoli — stir-fry 4 min.', 'Pour soy sauce, toss well, serve hot.']
    },
    {
        id: 'r3', name: 'Dal Tadka', time: '30 min', servings: 3, difficulty: 'Medium',
        calories: 180, protein: 12, carbs: 28, fat: 3,
        tags: [],
        ingredients: ['1 cup toor dal', '1 tomato (chopped)', '1 tsp cumin seeds', '2 cloves garlic', '1 tsp turmeric', 'Coriander', 'Salt'],
        steps: ['Wash dal, pressure cook with turmeric + 2 cups water for 3 whistles.', 'Heat oil, add cumin seeds till they splutter.', 'Add garlic, tomato — sauté 3 min.', 'Pour cooked dal in, add salt, simmer 5 min.', 'Garnish with coriander.']
    },
    {
        id: 'r4', name: 'Greek Yogurt Parfait', time: '5 min', servings: 1, difficulty: 'Easy',
        calories: 250, protein: 22, carbs: 30, fat: 5,
        tags: ['dairy', 'gluten'],
        ingredients: ['170g Greek yogurt', '1/2 cup mixed berries', '1/4 cup granola', '1 tsp honey'],
        steps: ['Layer yogurt in a glass.', 'Add berries on top.', 'Sprinkle granola.', 'Drizzle honey and enjoy!']
    },
    {
        id: 'r5', name: 'Paneer Bhurji', time: '15 min', servings: 2, difficulty: 'Easy',
        calories: 280, protein: 20, carbs: 8, fat: 19,
        tags: ['dairy'],
        ingredients: ['200g paneer (crumbled)', '1 onion (chopped)', '1 tomato (chopped)', '1 green chili', '1/2 tsp turmeric', 'Coriander leaves'],
        steps: ['Heat oil, sauté onion until golden.', 'Add green chili, tomato — cook 3 min.', 'Add turmeric and crumbled paneer.', 'Stir-fry 5 min on medium heat.', 'Garnish with coriander, serve with roti.']
    },
    {
        id: 'r6', name: 'Salmon & Avocado Bowl', time: '15 min', servings: 1, difficulty: 'Easy',
        calories: 450, protein: 30, carbs: 35, fat: 20,
        tags: ['nonveg', 'seafood', 'soy'],
        ingredients: ['100g salmon fillet', '1/2 avocado', '1 cup brown rice (cooked)', 'Soy sauce', 'Sesame seeds'],
        steps: ['Pan-sear salmon 4 min each side.', 'Flake salmon into a bowl with rice.', 'Add sliced avocado.', 'Drizzle soy sauce, top with sesame seeds.']
    },
    {
        id: 'r7', name: 'Masala Omelette', time: '8 min', servings: 1, difficulty: 'Easy',
        calories: 210, protein: 14, carbs: 4, fat: 15,
        tags: ['nonveg', 'egg'],
        ingredients: ['2 eggs', '1 small onion (diced)', '1 green chili', 'Pinch of turmeric', 'Coriander', 'Salt'],
        steps: ['Beat eggs with salt, turmeric, chili.', 'Mix in onion and coriander.', 'Pour into heated oiled pan.', 'Cook 2-3 min each side until golden.']
    },
    {
        id: 'r8', name: 'Smoothie Bowl', time: '5 min', servings: 1, difficulty: 'Easy',
        calories: 300, protein: 8, carbs: 52, fat: 6,
        tags: ['dairy'],
        ingredients: ['1 frozen banana', '1/2 cup frozen berries', '1/2 cup milk', 'Granola', 'Chia seeds', 'Sliced fruits'],
        steps: ['Blend banana, berries, and milk until thick.', 'Pour into bowl.', 'Top with granola, chia seeds, and fresh fruit slices.']
    }
]

const MEAL_TYPES = [
    { id: 'breakfast', label: 'Breakfast', icon: MdBreakfastDining, color: '#f59e0b' },
    { id: 'lunch', label: 'Lunch', icon: MdLunchDining, color: '#3b82f6' },
    { id: 'dinner', label: 'Dinner', icon: MdDinnerDining, color: '#8b5cf6' },
    { id: 'snack', label: 'Snack', icon: MdCookie, color: '#f97316' }
]

function MealLog() {
    const { user, getUserProfile } = useAuth()
    const { dailyData, saveDailyData } = useDailyLog()
    const profile = getUserProfile() || {}

    // Allergen detection from user profile
    const userAllergens = profile.allergies || []
    const customBlacklist = (profile.customBlacklist || []).map(b => b.toLowerCase().trim())
    const isVegetarian = profile.dietType === 'vegetarian' || profile.dietType === 'vegan'
    const isVegan = profile.dietType === 'vegan'

    // Check if a food/recipe is an allergen for this user
    const getFoodWarnings = (food) => {
        const warnings = []
        const tags = food.tags || []
        if (isVegetarian && tags.includes('nonveg')) warnings.push('🥩 Non-Veg')
        if (isVegan && tags.includes('dairy')) warnings.push('🥛 Dairy')
        if (isVegan && tags.includes('egg')) warnings.push('🥚 Egg')
        userAllergens.forEach(a => {
            if (tags.includes(a)) warnings.push(`⚠️ ${a.charAt(0).toUpperCase() + a.slice(1)}`)
        })
        return warnings
    }

    // Check recipe ingredients against custom blacklist
    const getBlacklistWarnings = (recipe) => {
        if (!recipe.ingredients || customBlacklist.length === 0) return []
        const warnings = []
        const ingredientText = recipe.ingredients.join(' ').toLowerCase()
        customBlacklist.forEach(item => {
            if (ingredientText.includes(item)) {
                warnings.push(`🚫 ${item.charAt(0).toUpperCase() + item.slice(1)}`)
            }
        })
        return warnings
    }

    // Get all warnings for a recipe (allergen tags + blacklist ingredients)
    const getRecipeWarnings = (recipe) => {
        return [...getFoodWarnings(recipe), ...getBlacklistWarnings(recipe)]
    }

    // Check if a specific ingredient line is an allergen/blacklisted
    const getIngredientWarning = (ingredientLine) => {
        const lower = ingredientLine.toLowerCase()
        const warnings = []
        // Check allergen keywords
        const allergenKeywords = {
            dairy: ['milk', 'yogurt', 'cheese', 'paneer', 'cream', 'butter', 'whey', 'curd', 'dahi', 'ghee'],
            nuts: ['almond', 'peanut', 'cashew', 'walnut', 'pistachio', 'nuts'],
            gluten: ['wheat', 'bread', 'oats', 'granola', 'flour', 'roti', 'chapati', 'pasta', 'noodle'],
            egg: ['egg'],
            soy: ['soy', 'tofu'],
            seafood: ['salmon', 'tuna', 'fish', 'shrimp', 'prawn', 'crab']
        }
        userAllergens.forEach(allergen => {
            const keywords = allergenKeywords[allergen] || [allergen]
            if (keywords.some(kw => lower.includes(kw))) {
                warnings.push(`⚠️ ${allergen}`)
            }
        })
        if (isVegetarian && ['chicken', 'mutton', 'lamb', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'shrimp', 'prawn'].some(w => lower.includes(w))) {
            warnings.push('🥩 Non-Veg')
        }
        if (isVegan && allergenKeywords.dairy.some(w => lower.includes(w))) {
            warnings.push('🥛 Dairy')
        }
        if (isVegan && lower.includes('egg')) {
            warnings.push('🥚 Egg')
        }
        // Check custom blacklist
        customBlacklist.forEach(item => {
            if (lower.includes(item)) warnings.push(`🚫 ${item}`)
        })
        return warnings
    }
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [selectedMealType, setSelectedMealType] = useState('breakfast')
    const [loggedMeals, setLoggedMeals] = useState([])
    const [favorites, setFavorites] = useState([])
    const [expandedMeal, setExpandedMeal] = useState(null)
    const [selectedFood, setSelectedFood] = useState(null)
    const [quantity, setQuantity] = useState(100)
    const [activeTab, setActiveTab] = useState('food')
    const [selectedRecipe, setSelectedRecipe] = useState(null)

    useEffect(() => {
        if (user) {
            const today = new Date().toISOString().split('T')[0]
            const saved = localStorage.getItem(`fitfuel-meals-${user.uid}-${today}`)
            if (saved) setLoggedMeals(JSON.parse(saved))
            const favs = localStorage.getItem(`fitfuel-favorites-${user.uid}`)
            if (favs) setFavorites(JSON.parse(favs))
        }
    }, [user])

    const saveMeals = (meals) => {
        const today = new Date().toISOString().split('T')[0]
        setLoggedMeals(meals)
        localStorage.setItem(`fitfuel-meals-${user.uid}-${today}`, JSON.stringify(meals))

        const totalCal = meals.reduce((s, m) => s + m.calories, 0)
        const totalPro = meals.reduce((s, m) => s + m.protein, 0)
        const totalCarbs = meals.reduce((s, m) => s + m.carbs, 0)
        const totalFat = meals.reduce((s, m) => s + m.fat, 0)

        saveDailyData({
            ...dailyData,
            caloriesConsumed: totalCal,
            protein: totalPro,
            carbs: totalCarbs,
            fat: totalFat
        })
    }

    // Fire-and-forget sync to backend (if saving a new meal)
    // Note: This simple logic syncs the whole list or just the last added one?
    // Ideally we should save specific meals. But for now let's just save the *last* meal added if this was an add operation.
    // Actually, let's just try to sync the latest meal if possible.
    // A better approach for "Connect" is to just log it.
    // Let's iterate and save unsaved meals? No, too complex.
    // Let's just save the meal when logMeal is called.


    const syncMealToBackend = async (meal) => {
        if (!user) return
        try {
            await api.post('/meals/save', {
                firebaseUid: user.uid,
                ...meal,
                date: new Date()
            })
            // console.log('✅ Meal synced to backend')
        } catch (err) {
            console.error('❌ Meal sync failed:', err)
        }
    }

    const handleSearch = (query) => {
        setSearchQuery(query)
        if (query.trim().length < 2) { setSearchResults([]); return }
        let results = FOOD_DATABASE.filter(f =>
            f.name.toLowerCase().includes(query.toLowerCase()) ||
            f.category.toLowerCase().includes(query.toLowerCase())
        )
        // Hide completely blocked foods (vegetarian sees no meat, user allergens hidden)
        results = results.filter(f => {
            const tags = f.tags || []
            if (isVegetarian && tags.includes('nonveg')) return false
            if (isVegan && (tags.includes('dairy') || tags.includes('egg'))) return false
            // Don't hide allergen foods, just warn — let user decide
            return true
        })
        setSearchResults(results)
    }

    // Open add-food modal with default quantity
    const selectFood = (food) => {
        setSelectedFood(food)
        setQuantity(food.defaultG || 100)
    }

    // Log meal with auto-calculated macros
    const logMeal = () => {
        if (!selectedFood) return
        const macros = calcMacros(selectedFood, quantity)
        const meal = {
            id: Date.now(),
            name: selectedFood.name,
            mealType: selectedMealType,
            quantity,
            ...macros,
            loggedAt: new Date().toISOString()
        }
        saveMeals([...loggedMeals, meal])
        syncMealToBackend(meal) // Sync
        setSelectedFood(null)
        setQuantity(100)
        setSearchQuery('')
        setSearchResults([])
    }

    const logRecipeAsMeal = (recipe) => {
        const meal = {
            id: Date.now(), name: recipe.name, mealType: selectedMealType,
            quantity: null,
            calories: recipe.calories, protein: recipe.protein,
            carbs: recipe.carbs, fat: recipe.fat,
            loggedAt: new Date().toISOString()
        }
    }
    saveMeals([...loggedMeals, meal])
    syncMealToBackend(meal) // Sync
    setSelectedRecipe(null)
}

const removeMeal = (mealId) => saveMeals(loggedMeals.filter(m => m.id !== mealId))

const toggleFavorite = (food) => {
    const isFav = favorites.some(f => f.id === food.id)
    const updated = isFav ? favorites.filter(f => f.id !== food.id) : [...favorites, food]
    setFavorites(updated)
    localStorage.setItem(`fitfuel-favorites-${user.uid}`, JSON.stringify(updated))
}

const totals = loggedMeals.reduce((acc, m) => ({
    calories: acc.calories + m.calories, protein: acc.protein + m.protein,
    carbs: acc.carbs + m.carbs, fat: acc.fat + m.fat
}), { calories: 0, protein: 0, carbs: 0, fat: 0 })

const mealsByType = MEAL_TYPES.map(type => ({
    ...type,
    meals: loggedMeals.filter(m => m.mealType === type.id),
    totalCal: loggedMeals.filter(m => m.mealType === type.id).reduce((s, m) => s + m.calories, 0)
}))

// Live macro calculation for selected food
const liveMacros = selectedFood ? calcMacros(selectedFood, quantity) : null

return (
    <div className="page animate-fade-in">
        <div className="page__header">
            <h1 className="heading-2">Meal Log 🍽️</h1>
            <p className="text-muted text-sm">Search food, enter quantity — we calculate everything</p>
        </div>

        {/* Daily Summary */}
        <div className="meal-summary-bar glass-card-static">
            <div className="meal-summary-stat">
                <MdLocalFireDepartment style={{ color: 'var(--success)' }} />
                <div><span className="meal-summary-number">{totals.calories}</span><span className="meal-summary-label">kcal</span></div>
            </div>
            <div className="meal-summary-divider" />
            <div className="meal-summary-stat">
                <span className="meal-macro-dot" style={{ background: '#ef4444' }} />
                <div><span className="meal-summary-number">{Math.round(totals.protein)}g</span><span className="meal-summary-label">Protein</span></div>
            </div>
            <div className="meal-summary-stat">
                <span className="meal-macro-dot" style={{ background: '#3b82f6' }} />
                <div><span className="meal-summary-number">{Math.round(totals.carbs)}g</span><span className="meal-summary-label">Carbs</span></div>
            </div>
            <div className="meal-summary-stat">
                <span className="meal-macro-dot" style={{ background: '#f59e0b' }} />
                <div><span className="meal-summary-number">{Math.round(totals.fat)}g</span><span className="meal-summary-label">Fat</span></div>
            </div>
        </div>

        <div className="meal-layout">
            {/* Left — Search & Recipes */}
            <div className="meal-column-main">
                <div className="meal-tabs">
                    <button className={`meal-tab ${activeTab === 'food' ? 'active' : ''}`} onClick={() => setActiveTab('food')}>
                        <MdRestaurantMenu /> Food Search
                    </button>
                    <button className={`meal-tab ${activeTab === 'recipes' ? 'active' : ''}`} onClick={() => setActiveTab('recipes')}>
                        <MdMenuBook /> Recipes
                    </button>
                </div>

                {activeTab === 'food' && (
                    <div className="glass-card-static meal-search-card">
                        <div className="meal-search-bar">
                            <MdSearch className="meal-search-icon" />
                            <input
                                className="input-field meal-search-input"
                                placeholder="Search food... (chicken, dal, rice, paneer)"
                                value={searchQuery}
                                onChange={e => handleSearch(e.target.value)}
                            />
                            {searchQuery && (
                                <button className="meal-search-clear" onClick={() => { setSearchQuery(''); setSearchResults([]) }}>
                                    <MdClose />
                                </button>
                            )}
                        </div>

                        {/* Meal Type */}
                        <div className="meal-type-selector">
                            {MEAL_TYPES.map(type => {
                                const Icon = type.icon
                                return (
                                    <button key={type.id} className={`meal-type-btn ${selectedMealType === type.id ? 'selected' : ''}`} style={{ '--type-color': type.color }} onClick={() => setSelectedMealType(type.id)}>
                                        <Icon /> {type.label}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                            <div className="meal-results animate-fade-in">
                                {searchResults.map(food => {
                                    const preview = calcMacros(food, food.defaultG || 100)
                                    const warnings = getFoodWarnings(food)
                                    return (
                                        <div key={food.id}
                                            className={`meal-result-card ${warnings.length > 0 ? 'meal-result-card--villain' : ''}`}
                                            onClick={() => selectFood(food)}>
                                            <div className="meal-result-info">
                                                <div className="meal-result-name">
                                                    {food.name}
                                                    {warnings.length > 0 && (
                                                        <span className="meal-villain-badge">
                                                            <MdWarning /> {warnings[0]}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="meal-result-meta">
                                                    <span className="text-xs text-muted">Per {food.defaultG || 100}g:</span>
                                                    <span className="badge badge-success">{preview.calories} kcal</span>
                                                </div>
                                                <div className="meal-result-macros">
                                                    <span style={{ color: '#ef4444' }}>P: {preview.protein}g</span>
                                                    <span style={{ color: '#3b82f6' }}>C: {preview.carbs}g</span>
                                                    <span style={{ color: '#f59e0b' }}>F: {preview.fat}g</span>
                                                </div>
                                            </div>
                                            <div className="meal-result-actions">
                                                <button className="btn-icon" onClick={e => { e.stopPropagation(); toggleFavorite(food) }}>
                                                    {favorites.some(f => f.id === food.id) ? <MdFavorite style={{ color: '#ef4444' }} /> : <MdFavoriteBorder />}
                                                </button>
                                                <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); selectFood(food) }}>
                                                    <MdAdd /> Add
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {searchQuery.length >= 2 && searchResults.length === 0 && (
                            <div className="meal-no-results">
                                <p className="text-muted text-sm">No results for "{searchQuery}"</p>
                            </div>
                        )}

                        {/* Quick Picks */}
                        {!searchQuery && (
                            <div className="meal-quick-picks">
                                <h4 className="text-sm text-muted" style={{ marginBottom: 'var(--space-3)' }}>
                                    {favorites.length > 0 ? '⭐ Your Favorites' : '🔥 Popular Foods'}
                                </h4>
                                <div className="meal-results">
                                    {(favorites.length > 0 ? favorites : FOOD_DATABASE.slice(0, 8)).map(food => {
                                        const preview = calcMacros(food, food.defaultG || 100)
                                        return (
                                            <div key={food.id} className="meal-result-card" onClick={() => selectFood(food)}>
                                                <div className="meal-result-info">
                                                    <div className="meal-result-name">{food.name}</div>
                                                    <div className="meal-result-meta">
                                                        <span className="text-xs text-muted">Per {food.defaultG || 100}g:</span>
                                                        <span className="badge badge-success">{preview.calories} kcal</span>
                                                    </div>
                                                </div>
                                                <div className="meal-result-actions">
                                                    <button className="btn-icon" onClick={e => { e.stopPropagation(); toggleFavorite(food) }}>
                                                        {favorites.some(f => f.id === food.id) ? <MdFavorite style={{ color: '#ef4444' }} /> : <MdFavoriteBorder />}
                                                    </button>
                                                    <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); selectFood(food) }}><MdAdd /></button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
<<<<<<< HEAD
                            )}

                            {searchQuery.length >= 2 && searchResults.length === 0 && (
                                <div className="meal-no-results">
                                    <p className="text-muted text-sm">No results for "{searchQuery}"</p>
                                </div>
                            )}

                            {/* Quick Picks */}
                            {!searchQuery && (
                                <div className="meal-quick-picks">
                                    <h4 className="text-sm text-muted" style={{ marginBottom: 'var(--space-3)' }}>
                                        {favorites.length > 0 ? '⭐ Your Favorites' : '🔥 Popular Foods'}
                                    </h4>
                                    <div className="meal-results">
                                        {(favorites.length > 0 ? favorites : FOOD_DATABASE.slice(0, 8)).map(food => {
                                            const preview = calcMacros(food, food.defaultG || 100)
                                            return (
                                                <div key={food.id} className="meal-result-card" onClick={() => selectFood(food)}>
                                                    <div className="meal-result-info">
                                                        <div className="meal-result-name">{food.name}</div>
                                                        <div className="meal-result-meta">
                                                            <span className="text-xs text-muted">Per {food.defaultG || 100}g:</span>
                                                            <span className="badge badge-success">{preview.calories} kcal</span>
                                                        </div>
                                                    </div>
                                                    <div className="meal-result-actions">
                                                        <button className="btn-icon" onClick={e => { e.stopPropagation(); toggleFavorite(food) }}>
                                                            {favorites.some(f => f.id === food.id) ? <MdFavorite style={{ color: '#ef4444' }} /> : <MdFavoriteBorder />}
                                                        </button>
                                                        <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); selectFood(food) }}><MdAdd /></button>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Recipes Tab */}
                    {activeTab === 'recipes' && (
                        <div className="glass-card-static meal-search-card">
                            <p className="text-sm text-muted">Browse recipes with step-by-step instructions 📖</p>
                            <div className="recipe-grid">
                                {RECIPE_DATABASE.map(recipe => {
                                    const recipeWarnings = getRecipeWarnings(recipe)
                                    const isBlacklisted = getBlacklistWarnings(recipe).length > 0
                                    return (
                                        <div key={recipe.id}
                                            className={`recipe-card ${recipeWarnings.length > 0 ? 'recipe-card--allergen' : ''} ${isBlacklisted ? 'recipe-card--blacklisted' : ''}`}
                                            onClick={() => setSelectedRecipe(recipe)}>
                                            {recipeWarnings.length > 0 && (
                                                <div className="recipe-allergen-badges">
                                                    {recipeWarnings.map((w, i) => (
                                                        <span key={i} className={`recipe-allergen-badge ${isBlacklisted ? 'recipe-allergen-badge--blacklist' : ''}`}>
                                                            {w}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="recipe-card-header">
                                                <h4 className="recipe-card-name">{recipe.name}</h4>
                                                <span className="badge badge-success">{recipe.calories} kcal</span>
                                            </div>
                                            <div className="recipe-card-meta">
                                                <span><MdTimer /> {recipe.time}</span>
                                                <span><MdPeople /> {recipe.servings}p</span>
                                                <span className="recipe-difficulty">{recipe.difficulty}</span>
                                            </div>
                                            <div className="recipe-card-macros">
                                                <span style={{ color: '#ef4444' }}>P: {recipe.protein}g</span>
                                                <span style={{ color: '#3b82f6' }}>C: {recipe.carbs}g</span>
                                                <span style={{ color: '#f59e0b' }}>F: {recipe.fat}g</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right — Today's Meals */}
                <div className="meal-column-side">
                    <div className="glass-card-static">
                        <h3 className="dash-card-title"><MdRestaurantMenu style={{ color: 'var(--success)' }} /> Today's Meals</h3>
                        {loggedMeals.length === 0 ? (
                            <p className="text-muted text-sm text-center" style={{ padding: 'var(--space-8) 0' }}>No meals logged yet 🍽️</p>
                        ) : (
                            <div className="meal-today-list">
                                {mealsByType.filter(t => t.meals.length > 0).map(type => {
                                    const Icon = type.icon
                                    return (
                                        <div key={type.id} className="meal-today-group">
                                            <button className="meal-today-group-header" onClick={() => setExpandedMeal(expandedMeal === type.id ? null : type.id)}>
                                                <div className="meal-today-group-left">
                                                    <Icon style={{ color: type.color }} /> <strong>{type.label}</strong>
                                                    <span className="text-xs text-muted">({type.meals.length})</span>
                                                </div>
                                                <div className="meal-today-group-right">
                                                    <span className="text-sm" style={{ color: 'var(--text-accent)' }}>{type.totalCal} kcal</span>
                                                    {expandedMeal === type.id ? <MdExpandLess /> : <MdExpandMore />}
                                                </div>
                                            </button>
                                            {expandedMeal === type.id && (
                                                <div className="meal-today-items animate-fade-in">
                                                    {type.meals.map(meal => (
                                                        <div key={meal.id} className="meal-today-item">
                                                            <div>
                                                                <span className="text-sm">{meal.name}</span>
                                                                {meal.quantity && <span className="text-xs text-muted"> · {meal.quantity}g</span>}
                                                            </div>
                                                            <div className="meal-today-item-right">
                                                                <span className="text-xs">{meal.calories} kcal</span>
                                                                <button className="btn-icon btn-icon-sm" onClick={() => removeMeal(meal.id)}>
                                                                    <MdDelete style={{ color: 'var(--danger)', fontSize: '0.9rem' }} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
=======
>>>>>>> f15db03d435d0ed89232ba014a6be6ecc8c56046
                            </div>
                        )}
                    </div>
                )}

                {/* Recipes Tab */}
                {activeTab === 'recipes' && (
                    <div className="glass-card-static meal-search-card">
                        <p className="text-sm text-muted">Browse recipes with step-by-step instructions 📖</p>
                        <div className="recipe-grid">
                            {RECIPE_DATABASE.map(recipe => (
                                <div key={recipe.id} className="recipe-card" onClick={() => setSelectedRecipe(recipe)}>
                                    <div className="recipe-card-header">
                                        <h4 className="recipe-card-name">{recipe.name}</h4>
                                        <span className="badge badge-success">{recipe.calories} kcal</span>
                                    </div>
                                    <div className="recipe-card-meta">
                                        <span><MdTimer /> {recipe.time}</span>
                                        <span><MdPeople /> {recipe.servings}p</span>
                                        <span className="recipe-difficulty">{recipe.difficulty}</span>
                                    </div>
                                    <div className="recipe-card-macros">
                                        <span style={{ color: '#ef4444' }}>P: {recipe.protein}g</span>
                                        <span style={{ color: '#3b82f6' }}>C: {recipe.carbs}g</span>
                                        <span style={{ color: '#f59e0b' }}>F: {recipe.fat}g</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Right — Today's Meals */}
            <div className="meal-column-side">
                <div className="glass-card-static">
                    <h3 className="dash-card-title"><MdRestaurantMenu style={{ color: 'var(--success)' }} /> Today's Meals</h3>
                    {loggedMeals.length === 0 ? (
                        <p className="text-muted text-sm text-center" style={{ padding: 'var(--space-8) 0' }}>No meals logged yet 🍽️</p>
                    ) : (
                        <div className="meal-today-list">
                            {mealsByType.filter(t => t.meals.length > 0).map(type => {
                                const Icon = type.icon
                                return (
                                    <div key={type.id} className="meal-today-group">
                                        <button className="meal-today-group-header" onClick={() => setExpandedMeal(expandedMeal === type.id ? null : type.id)}>
                                            <div className="meal-today-group-left">
                                                <Icon style={{ color: type.color }} /> <strong>{type.label}</strong>
                                                <span className="text-xs text-muted">({type.meals.length})</span>
                                            </div>
                                            <div className="meal-today-group-right">
                                                <span className="text-sm" style={{ color: 'var(--text-accent)' }}>{type.totalCal} kcal</span>
                                                {expandedMeal === type.id ? <MdExpandLess /> : <MdExpandMore />}
                                            </div>
                                        </button>
                                        {expandedMeal === type.id && (
                                            <div className="meal-today-items animate-fade-in">
                                                {type.meals.map(meal => (
                                                    <div key={meal.id} className="meal-today-item">
                                                        <div>
                                                            <span className="text-sm">{meal.name}</span>
                                                            {meal.quantity && <span className="text-xs text-muted"> · {meal.quantity}g</span>}
                                                        </div>
                                                        <div className="meal-today-item-right">
                                                            <span className="text-xs">{meal.calories} kcal</span>
                                                            <button className="btn-icon btn-icon-sm" onClick={() => removeMeal(meal.id)}>
                                                                <MdDelete style={{ color: 'var(--danger)', fontSize: '0.9rem' }} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
<<<<<<< HEAD
            )}

            {/* ── Recipe Modal ── */}
            {selectedRecipe && (
                <div className="meal-modal-overlay" onClick={() => setSelectedRecipe(null)}>
                    <div className="meal-modal recipe-modal glass-card-static animate-scale-in" onClick={e => e.stopPropagation()}>
                        <button className="meal-modal-close" onClick={() => setSelectedRecipe(null)}><MdClose /></button>
                        <h3 className="heading-4">{selectedRecipe.name}</h3>
                        {/* Allergen / Blacklist warnings banner */}
                        {(() => {
                            const rw = getRecipeWarnings(selectedRecipe)
                            return rw.length > 0 ? (
                                <div className="recipe-modal-warnings">
                                    <MdWarning /> <strong>Warning:</strong> {rw.join(', ')}
                                </div>
                            ) : null
                        })()}
                        <div className="recipe-detail-meta">
                            <span><MdTimer /> {selectedRecipe.time}</span>
                            <span><MdPeople /> {selectedRecipe.servings} serving{selectedRecipe.servings > 1 ? 's' : ''}</span>
                            <span className="recipe-difficulty">{selectedRecipe.difficulty}</span>
                        </div>
                        <div className="meal-modal-macros">
                            <div className="meal-modal-macro"><span className="meal-modal-macro-val">{selectedRecipe.calories}</span><span className="meal-modal-macro-label">kcal</span></div>
                            <div className="meal-modal-macro"><span className="meal-modal-macro-val" style={{ color: '#ef4444' }}>{selectedRecipe.protein}g</span><span className="meal-modal-macro-label">Protein</span></div>
                            <div className="meal-modal-macro"><span className="meal-modal-macro-val" style={{ color: '#3b82f6' }}>{selectedRecipe.carbs}g</span><span className="meal-modal-macro-label">Carbs</span></div>
                            <div className="meal-modal-macro"><span className="meal-modal-macro-val" style={{ color: '#f59e0b' }}>{selectedRecipe.fat}g</span><span className="meal-modal-macro-label">Fat</span></div>
                        </div>
                        <div className="recipe-detail-section">
                            <h5>🧂 Ingredients</h5>
                            <ul className="recipe-ingredients">
                                {selectedRecipe.ingredients.map((ing, i) => {
                                    const ingWarnings = getIngredientWarning(ing)
                                    return (
                                        <li key={i} className={ingWarnings.length > 0 ? 'ingredient--danger' : ''}>
                                            {ing}
                                            {ingWarnings.length > 0 && (
                                                <span className="ingredient-warning-badge">
                                                    <MdWarning /> {ingWarnings[0]}
                                                </span>
                                            )}
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                        <div className="recipe-detail-section">
                            <h5>👨‍🍳 Instructions</h5>
                            <ol className="recipe-steps">{selectedRecipe.steps.map((step, i) => <li key={i}>{step}</li>)}</ol>
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => logRecipeAsMeal(selectedRecipe)}>
                            <MdAdd /> Log as Meal
                        </button>
                    </div>
                </div>
            )}
=======
            </div>
>>>>>>> f15db03d435d0ed89232ba014a6be6ecc8c56046
        </div>

        {/* ── Add Food Modal — User enters quantity, we calculate everything ── */}
        {selectedFood && liveMacros && (
            <div className="meal-modal-overlay" onClick={() => setSelectedFood(null)}>
                <div className="meal-modal glass-card-static animate-scale-in" onClick={e => e.stopPropagation()}>
                    <button className="meal-modal-close" onClick={() => setSelectedFood(null)}><MdClose /></button>
                    <h3 className="heading-4">{selectedFood.name}</h3>
                    <p className="text-xs text-muted">
                        Per 100g: {selectedFood.cal100} kcal · P: {selectedFood.p100}g · C: {selectedFood.c100}g · F: {selectedFood.f100}g
                    </p>

                    {/* Quantity Input */}
                    <div className="quantity-section">
                        <label className="quantity-label">How much did you eat?</label>
                        <div className="quantity-input-row">
                            <button className="quantity-btn" onClick={() => setQuantity(Math.max(10, quantity - 25))}>−</button>
                            <div className="quantity-input-wrapper">
                                <input
                                    className="quantity-input"
                                    type="number"
                                    value={quantity}
                                    onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                                    autoFocus
                                />
                                <span className="quantity-unit">grams</span>
                            </div>
                            <button className="quantity-btn" onClick={() => setQuantity(quantity + 25)}>+</button>
                        </div>
                        {/* Quick preset buttons */}
                        <div className="quantity-presets">
                            {[50, 100, 150, 200, 250, 300].map(g => (
                                <button key={g} className={`quantity-preset ${quantity === g ? 'active' : ''}`} onClick={() => setQuantity(g)}>
                                    {g}g
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Live-calculated macros */}
                    <div className="meal-modal-macros">
                        <div className="meal-modal-macro highlight">
                            <span className="meal-modal-macro-val">{liveMacros.calories}</span>
                            <span className="meal-modal-macro-label">kcal</span>
                        </div>
                        <div className="meal-modal-macro">
                            <span className="meal-modal-macro-val" style={{ color: '#ef4444' }}>{liveMacros.protein}g</span>
                            <span className="meal-modal-macro-label">Protein</span>
                        </div>
                        <div className="meal-modal-macro">
                            <span className="meal-modal-macro-val" style={{ color: '#3b82f6' }}>{liveMacros.carbs}g</span>
                            <span className="meal-modal-macro-label">Carbs</span>
                        </div>
                        <div className="meal-modal-macro">
                            <span className="meal-modal-macro-val" style={{ color: '#f59e0b' }}>{liveMacros.fat}g</span>
                            <span className="meal-modal-macro-label">Fat</span>
                        </div>
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={logMeal}>
                        <MdAdd /> Log {quantity}g to {MEAL_TYPES.find(t => t.id === selectedMealType)?.label}
                    </button>
                </div>
            </div>
        )}

        {/* ── Recipe Modal ── */}
        {selectedRecipe && (
            <div className="meal-modal-overlay" onClick={() => setSelectedRecipe(null)}>
                <div className="meal-modal recipe-modal glass-card-static animate-scale-in" onClick={e => e.stopPropagation()}>
                    <button className="meal-modal-close" onClick={() => setSelectedRecipe(null)}><MdClose /></button>
                    <h3 className="heading-4">{selectedRecipe.name}</h3>
                    <div className="recipe-detail-meta">
                        <span><MdTimer /> {selectedRecipe.time}</span>
                        <span><MdPeople /> {selectedRecipe.servings} serving{selectedRecipe.servings > 1 ? 's' : ''}</span>
                        <span className="recipe-difficulty">{selectedRecipe.difficulty}</span>
                    </div>
                    <div className="meal-modal-macros">
                        <div className="meal-modal-macro"><span className="meal-modal-macro-val">{selectedRecipe.calories}</span><span className="meal-modal-macro-label">kcal</span></div>
                        <div className="meal-modal-macro"><span className="meal-modal-macro-val" style={{ color: '#ef4444' }}>{selectedRecipe.protein}g</span><span className="meal-modal-macro-label">Protein</span></div>
                        <div className="meal-modal-macro"><span className="meal-modal-macro-val" style={{ color: '#3b82f6' }}>{selectedRecipe.carbs}g</span><span className="meal-modal-macro-label">Carbs</span></div>
                        <div className="meal-modal-macro"><span className="meal-modal-macro-val" style={{ color: '#f59e0b' }}>{selectedRecipe.fat}g</span><span className="meal-modal-macro-label">Fat</span></div>
                    </div>
                    <div className="recipe-detail-section">
                        <h5>🧂 Ingredients</h5>
                        <ul className="recipe-ingredients">{selectedRecipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}</ul>
                    </div>
                    <div className="recipe-detail-section">
                        <h5>👨‍🍳 Instructions</h5>
                        <ol className="recipe-steps">{selectedRecipe.steps.map((step, i) => <li key={i}>{step}</li>)}</ol>
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => logRecipeAsMeal(selectedRecipe)}>
                        <MdAdd /> Log as Meal
                    </button>
                </div>
            </div>
        )}
    </div>
)
}

export default MealLog
