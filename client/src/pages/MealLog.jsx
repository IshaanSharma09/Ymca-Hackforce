import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import {
    MdSearch, MdAdd, MdClose, MdRestaurantMenu,
    MdLocalFireDepartment, MdHistory, MdFavorite,
    MdFavoriteBorder, MdDelete, MdExpandMore, MdExpandLess,
    MdBreakfastDining, MdLunchDining, MdDinnerDining, MdCookie,
    MdMenuBook, MdTimer, MdPeople
} from 'react-icons/md'
import './MealLog.css'

// Built-in food database
const FOOD_DATABASE = [
    { id: 1, name: 'Grilled Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100g', category: 'Protein' },
    { id: 2, name: 'Brown Rice', calories: 216, protein: 5, carbs: 45, fat: 1.8, serving: '1 cup', category: 'Grains' },
    { id: 3, name: 'Scrambled Eggs (2)', calories: 182, protein: 12, carbs: 2, fat: 14, serving: '2 eggs', category: 'Protein' },
    { id: 4, name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, serving: '1 medium', category: 'Fruits' },
    { id: 5, name: 'Greek Yogurt', calories: 100, protein: 17, carbs: 6, fat: 0.7, serving: '170g', category: 'Dairy' },
    { id: 6, name: 'Oatmeal', calories: 150, protein: 5, carbs: 27, fat: 2.5, serving: '1 cup cooked', category: 'Grains' },
    { id: 7, name: 'Salmon Fillet', calories: 208, protein: 20, carbs: 0, fat: 13, serving: '100g', category: 'Protein' },
    { id: 8, name: 'Avocado', calories: 160, protein: 2, carbs: 9, fat: 15, serving: '1/2 avocado', category: 'Fats' },
    { id: 9, name: 'Sweet Potato', calories: 103, protein: 2.3, carbs: 24, fat: 0.1, serving: '1 medium', category: 'Carbs' },
    { id: 10, name: 'Broccoli', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, serving: '1 cup', category: 'Vegetables' },
    { id: 11, name: 'Almonds', calories: 164, protein: 6, carbs: 6, fat: 14, serving: '28g', category: 'Nuts' },
    { id: 12, name: 'Whole Wheat Bread', calories: 69, protein: 3.6, carbs: 12, fat: 1, serving: '1 slice', category: 'Grains' },
    { id: 13, name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, serving: '1 medium', category: 'Fruits' },
    { id: 14, name: 'Peanut Butter', calories: 188, protein: 7, carbs: 6, fat: 16, serving: '2 tbsp', category: 'Fats' },
    { id: 15, name: 'Cottage Cheese', calories: 110, protein: 12, carbs: 5, fat: 5, serving: '1/2 cup', category: 'Dairy' },
    { id: 16, name: 'Tuna (canned)', calories: 116, protein: 26, carbs: 0, fat: 1, serving: '100g', category: 'Protein' },
    { id: 17, name: 'Pasta (cooked)', calories: 200, protein: 7, carbs: 40, fat: 1.3, serving: '1 cup', category: 'Grains' },
    { id: 18, name: 'Spinach Salad', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, serving: '1 cup', category: 'Vegetables' },
    { id: 19, name: 'Protein Shake', calories: 120, protein: 24, carbs: 3, fat: 1, serving: '1 scoop + water', category: 'Supplement' },
    { id: 20, name: 'Mixed Berries', calories: 70, protein: 1, carbs: 17, fat: 0.4, serving: '1 cup', category: 'Fruits' },
    { id: 21, name: 'Paneer Tikka', calories: 250, protein: 18, carbs: 5, fat: 18, serving: '150g', category: 'Protein' },
    { id: 22, name: 'Dal (Lentil Curry)', calories: 180, protein: 12, carbs: 30, fat: 2, serving: '1 bowl', category: 'Protein' },
    { id: 23, name: 'Roti / Chapati', calories: 70, protein: 2.7, carbs: 15, fat: 0.4, serving: '1 piece', category: 'Grains' },
    { id: 24, name: 'White Rice', calories: 206, protein: 4.3, carbs: 45, fat: 0.4, serving: '1 cup', category: 'Grains' },
    { id: 25, name: 'Chicken Curry', calories: 240, protein: 22, carbs: 8, fat: 13, serving: '1 bowl', category: 'Protein' },
    { id: 26, name: 'Masala Dosa', calories: 170, protein: 4, carbs: 28, fat: 5, serving: '1 dosa', category: 'Grains' },
    { id: 27, name: 'Idli (2)', calories: 120, protein: 3, carbs: 26, fat: 0.5, serving: '2 idlis', category: 'Grains' },
    { id: 28, name: 'Mixed Veg Curry', calories: 140, protein: 4, carbs: 18, fat: 6, serving: '1 bowl', category: 'Vegetables' },
    { id: 29, name: 'Curd / Raita', calories: 60, protein: 3, carbs: 5, fat: 3, serving: '1 bowl', category: 'Dairy' },
    { id: 30, name: 'Paratha', calories: 150, protein: 4, carbs: 22, fat: 5, serving: '1 piece', category: 'Grains' },
]

// Built-in recipe database (brief instructions — Foodoscope-inspired)
const RECIPE_DATABASE = [
    {
        id: 'r1', name: 'Protein Oatmeal Bowl', time: '10 min', servings: 1, difficulty: 'Easy',
        calories: 380, protein: 32, carbs: 42, fat: 8,
        ingredients: ['1 cup oats', '1 scoop whey protein', '1 banana (sliced)', '1 tbsp honey', '1/2 cup milk'],
        steps: ['Cook oats with milk for 5 min.', 'Mix in protein powder while warm.', 'Top with banana slices and drizzle honey.']
    },
    {
        id: 'r2', name: 'Chicken Stir-Fry', time: '20 min', servings: 2, difficulty: 'Easy',
        calories: 320, protein: 35, carbs: 15, fat: 12,
        ingredients: ['200g chicken breast', '1 bell pepper', '1 cup broccoli', '2 tbsp soy sauce', '1 tbsp olive oil', '2 cloves garlic'],
        steps: ['Slice chicken into strips, season with salt & pepper.', 'Heat oil, cook chicken 5-6 min until golden.', 'Add garlic, bell pepper, broccoli — stir-fry 4 min.', 'Pour soy sauce, toss well, serve hot.']
    },
    {
        id: 'r3', name: 'Dal Tadka', time: '30 min', servings: 3, difficulty: 'Medium',
        calories: 180, protein: 12, carbs: 28, fat: 3,
        ingredients: ['1 cup toor dal', '1 tomato (chopped)', '1 tsp cumin seeds', '2 cloves garlic', '1 tsp turmeric', 'Fresh coriander', 'Salt to taste'],
        steps: ['Wash dal, pressure cook with turmeric and 2 cups water for 3 whistles.', 'Heat oil, add cumin seeds until they splutter.', 'Add garlic, tomato — sauté 3 min.', 'Pour cooked dal in, add salt, simmer 5 min.', 'Garnish with coriander.']
    },
    {
        id: 'r4', name: 'Greek Yogurt Parfait', time: '5 min', servings: 1, difficulty: 'Easy',
        calories: 250, protein: 22, carbs: 30, fat: 5,
        ingredients: ['170g Greek yogurt', '1/2 cup mixed berries', '1/4 cup granola', '1 tsp honey'],
        steps: ['Layer yogurt in a glass.', 'Add berries on top.', 'Sprinkle granola.', 'Drizzle honey and enjoy!']
    },
    {
        id: 'r5', name: 'Paneer Bhurji', time: '15 min', servings: 2, difficulty: 'Easy',
        calories: 280, protein: 20, carbs: 8, fat: 19,
        ingredients: ['200g paneer (crumbled)', '1 onion (chopped)', '1 tomato (chopped)', '1 green chili', '1/2 tsp turmeric', 'Coriander leaves'],
        steps: ['Heat oil, sauté onion until golden.', 'Add green chili, tomato — cook 3 min.', 'Add turmeric and crumbled paneer.', 'Stir-fry 5 min on medium heat.', 'Garnish with coriander, serve with roti.']
    },
    {
        id: 'r6', name: 'Salmon & Avocado Bowl', time: '15 min', servings: 1, difficulty: 'Easy',
        calories: 450, protein: 30, carbs: 35, fat: 20,
        ingredients: ['100g salmon fillet', '1/2 avocado', '1 cup brown rice (cooked)', 'Soy sauce', 'Sesame seeds'],
        steps: ['Pan-sear salmon 4 min each side.', 'Flake salmon into a bowl with rice.', 'Add sliced avocado.', 'Drizzle soy sauce, top with sesame seeds.']
    },
    {
        id: 'r7', name: 'Masala Omelette', time: '8 min', servings: 1, difficulty: 'Easy',
        calories: 210, protein: 14, carbs: 4, fat: 15,
        ingredients: ['2 eggs', '1 small onion (diced)', '1 green chili', 'Pinch of turmeric', 'Coriander', 'Salt'],
        steps: ['Beat eggs with salt, turmeric, chili.', 'Mix in onion and coriander.', 'Pour into heated oiled pan.', 'Cook 2-3 min each side until golden.']
    },
    {
        id: 'r8', name: 'Smoothie Bowl', time: '5 min', servings: 1, difficulty: 'Easy',
        calories: 300, protein: 8, carbs: 52, fat: 6,
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
    const { user } = useAuth()
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [selectedMealType, setSelectedMealType] = useState('breakfast')
    const [servings, setServings] = useState(1)
    const [loggedMeals, setLoggedMeals] = useState([])
    const [favorites, setFavorites] = useState([])
    const [expandedMeal, setExpandedMeal] = useState(null)
    const [selectedFood, setSelectedFood] = useState(null)
    const [showCustom, setShowCustom] = useState(false)
    const [customFood, setCustomFood] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' })
    const [activeTab, setActiveTab] = useState('food') // 'food' or 'recipes'
    const [selectedRecipe, setSelectedRecipe] = useState(null)

    // Load logged meals and favorites
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
        const dailyKey = `fitfuel-daily-${user.uid}-${today}`
        const daily = JSON.parse(localStorage.getItem(dailyKey) || '{}')
        daily.caloriesConsumed = totalCal
        daily.protein = totalPro
        daily.carbs = totalCarbs
        daily.fat = totalFat
        localStorage.setItem(dailyKey, JSON.stringify(daily))
    }

    const handleSearch = (query) => {
        setSearchQuery(query)
        if (query.trim().length < 2) { setSearchResults([]); return }
        const results = FOOD_DATABASE.filter(f =>
            f.name.toLowerCase().includes(query.toLowerCase()) ||
            f.category.toLowerCase().includes(query.toLowerCase())
        )
        setSearchResults(results)
    }

    const logMeal = (food) => {
        const meal = {
            ...food,
            id: Date.now(),
            originalId: food.id,
            mealType: selectedMealType,
            servings,
            calories: Math.round(food.calories * servings),
            protein: Math.round(food.protein * servings),
            carbs: Math.round(food.carbs * servings),
            fat: Math.round(food.fat * servings),
            loggedAt: new Date().toISOString()
        }
        saveMeals([...loggedMeals, meal])
        setSelectedFood(null)
        setServings(1)
        setSearchQuery('')
        setSearchResults([])
    }

    const logCustomFood = () => {
        if (!customFood.name || !customFood.calories) return
        const meal = {
            id: Date.now(),
            name: customFood.name,
            mealType: selectedMealType,
            servings: 1,
            calories: parseInt(customFood.calories) || 0,
            protein: parseInt(customFood.protein) || 0,
            carbs: parseInt(customFood.carbs) || 0,
            fat: parseInt(customFood.fat) || 0,
            loggedAt: new Date().toISOString()
        }
        saveMeals([...loggedMeals, meal])
        setCustomFood({ name: '', calories: '', protein: '', carbs: '', fat: '' })
        setShowCustom(false)
    }

    const logRecipeAsMeal = (recipe) => {
        const meal = {
            id: Date.now(),
            name: recipe.name,
            mealType: selectedMealType,
            servings: 1,
            calories: recipe.calories,
            protein: recipe.protein,
            carbs: recipe.carbs,
            fat: recipe.fat,
            loggedAt: new Date().toISOString()
        }
        saveMeals([...loggedMeals, meal])
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

    return (
        <div className="page animate-fade-in">
            <div className="page__header">
                <div>
                    <h1 className="heading-2">Meal Log 🍽️</h1>
                    <p className="text-muted text-sm">Search food, browse recipes, and track nutrition</p>
                </div>
            </div>

            {/* Daily Summary Bar */}
            <div className="meal-summary-bar glass-card-static">
                <div className="meal-summary-stat">
                    <MdLocalFireDepartment style={{ color: 'var(--success)' }} />
                    <div>
                        <span className="meal-summary-number">{totals.calories}</span>
                        <span className="meal-summary-label">kcal</span>
                    </div>
                </div>
                <div className="meal-summary-divider" />
                <div className="meal-summary-stat">
                    <span className="meal-macro-dot" style={{ background: '#ef4444' }} />
                    <div><span className="meal-summary-number">{totals.protein}g</span><span className="meal-summary-label">Protein</span></div>
                </div>
                <div className="meal-summary-stat">
                    <span className="meal-macro-dot" style={{ background: '#3b82f6' }} />
                    <div><span className="meal-summary-number">{totals.carbs}g</span><span className="meal-summary-label">Carbs</span></div>
                </div>
                <div className="meal-summary-stat">
                    <span className="meal-macro-dot" style={{ background: '#f59e0b' }} />
                    <div><span className="meal-summary-number">{totals.fat}g</span><span className="meal-summary-label">Fat</span></div>
                </div>
            </div>

            <div className="meal-layout">
                {/* Left — Search, Recipes & Log */}
                <div className="meal-column-main">
                    {/* Tabs: Food / Recipes */}
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
                            {/* Search + Custom Add */}
                            <div className="meal-search-row">
                                <div className="meal-search-bar">
                                    <MdSearch className="meal-search-icon" />
                                    <input
                                        type="text"
                                        className="input-field meal-search-input"
                                        placeholder="Search food... (chicken, dal, rice, pasta)"
                                        value={searchQuery}
                                        onChange={e => handleSearch(e.target.value)}
                                    />
                                    {searchQuery && (
                                        <button className="meal-search-clear" onClick={() => { setSearchQuery(''); setSearchResults([]) }}>
                                            <MdClose />
                                        </button>
                                    )}
                                </div>
                                <button className="btn btn-primary" onClick={() => setShowCustom(true)}>
                                    <MdAdd /> Custom
                                </button>
                            </div>

                            {/* Meal Type Selector */}
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

                            {/* Results */}
                            {searchResults.length > 0 && (
                                <div className="meal-results animate-fade-in">
                                    {searchResults.map(food => (
                                        <div key={food.id} className="meal-result-card">
                                            <div className="meal-result-info">
                                                <div className="meal-result-name">{food.name}</div>
                                                <div className="meal-result-meta">
                                                    <span className="badge badge-success">{food.calories} kcal</span>
                                                    <span className="text-xs text-muted">{food.serving}</span>
                                                </div>
                                                <div className="meal-result-macros">
                                                    <span style={{ color: '#ef4444' }}>P: {food.protein}g</span>
                                                    <span style={{ color: '#3b82f6' }}>C: {food.carbs}g</span>
                                                    <span style={{ color: '#f59e0b' }}>F: {food.fat}g</span>
                                                </div>
                                            </div>
                                            <div className="meal-result-actions">
                                                <button className="btn-icon" onClick={() => toggleFavorite(food)}>
                                                    {favorites.some(f => f.id === food.id) ? <MdFavorite style={{ color: '#ef4444' }} /> : <MdFavoriteBorder />}
                                                </button>
                                                <button className="btn btn-primary btn-sm" onClick={() => setSelectedFood(food)}>
                                                    <MdAdd /> Add
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {searchQuery.length >= 2 && searchResults.length === 0 && (
                                <div className="meal-no-results">
                                    <p className="text-muted text-sm">No results for "{searchQuery}"</p>
                                    <button className="btn btn-secondary btn-sm" onClick={() => { setShowCustom(true); setCustomFood(p => ({ ...p, name: searchQuery })) }}>
                                        <MdAdd /> Add "{searchQuery}" manually
                                    </button>
                                </div>
                            )}

                            {/* Quick Picks */}
                            {!searchQuery && (
                                <div className="meal-quick-picks">
                                    <h4 className="text-sm text-muted" style={{ marginBottom: 'var(--space-3)' }}>
                                        {favorites.length > 0 ? '⭐ Your Favorites' : '🔥 Popular Foods'}
                                    </h4>
                                    <div className="meal-results">
                                        {(favorites.length > 0 ? favorites : FOOD_DATABASE.slice(0, 8)).map(food => (
                                            <div key={food.id} className="meal-result-card">
                                                <div className="meal-result-info">
                                                    <div className="meal-result-name">{food.name}</div>
                                                    <div className="meal-result-meta">
                                                        <span className="badge badge-success">{food.calories} kcal</span>
                                                        <span className="text-xs text-muted">{food.serving}</span>
                                                    </div>
                                                </div>
                                                <div className="meal-result-actions">
                                                    <button className="btn-icon" onClick={() => toggleFavorite(food)}>
                                                        {favorites.some(f => f.id === food.id) ? <MdFavorite style={{ color: '#ef4444' }} /> : <MdFavoriteBorder />}
                                                    </button>
                                                    <button className="btn btn-primary btn-sm" onClick={() => setSelectedFood(food)}><MdAdd /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Recipes Tab */}
                    {activeTab === 'recipes' && (
                        <div className="glass-card-static meal-search-card">
                            <p className="text-sm text-muted">Browse healthy recipes with step-by-step instructions 📖</p>
                            <div className="recipe-grid">
                                {RECIPE_DATABASE.map(recipe => (
                                    <div key={recipe.id} className="recipe-card" onClick={() => setSelectedRecipe(recipe)}>
                                        <div className="recipe-card-header">
                                            <h4 className="recipe-card-name">{recipe.name}</h4>
                                            <span className="badge badge-success">{recipe.calories} kcal</span>
                                        </div>
                                        <div className="recipe-card-meta">
                                            <span><MdTimer /> {recipe.time}</span>
                                            <span><MdPeople /> {recipe.servings} serving{recipe.servings > 1 ? 's' : ''}</span>
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
                            <p className="text-muted text-sm text-center" style={{ padding: 'var(--space-8) 0' }}>
                                No meals logged yet 🍽️
                            </p>
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
                                                                {meal.servings > 1 && <span className="text-xs text-muted"> x{meal.servings}</span>}
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
                </div>
            </div>

            {/* ── Add Food Modal ── */}
            {selectedFood && (
                <div className="meal-modal-overlay" onClick={() => setSelectedFood(null)}>
                    <div className="meal-modal glass-card-static animate-scale-in" onClick={e => e.stopPropagation()}>
                        <button className="meal-modal-close" onClick={() => setSelectedFood(null)}><MdClose /></button>
                        <h3 className="heading-4">{selectedFood.name}</h3>
                        <p className="text-sm text-muted">{selectedFood.serving} per serving</p>
                        <div className="meal-modal-macros">
                            <div className="meal-modal-macro">
                                <span className="meal-modal-macro-val">{Math.round(selectedFood.calories * servings)}</span>
                                <span className="meal-modal-macro-label">kcal</span>
                            </div>
                            <div className="meal-modal-macro">
                                <span className="meal-modal-macro-val" style={{ color: '#ef4444' }}>{Math.round(selectedFood.protein * servings)}g</span>
                                <span className="meal-modal-macro-label">Protein</span>
                            </div>
                            <div className="meal-modal-macro">
                                <span className="meal-modal-macro-val" style={{ color: '#3b82f6' }}>{Math.round(selectedFood.carbs * servings)}g</span>
                                <span className="meal-modal-macro-label">Carbs</span>
                            </div>
                            <div className="meal-modal-macro">
                                <span className="meal-modal-macro-val" style={{ color: '#f59e0b' }}>{Math.round(selectedFood.fat * servings)}g</span>
                                <span className="meal-modal-macro-label">Fat</span>
                            </div>
                        </div>
                        <div className="meal-modal-servings">
                            <label className="text-sm">Servings</label>
                            <div className="meal-modal-servings-ctrl">
                                <button className="btn btn-secondary btn-sm" onClick={() => setServings(Math.max(0.5, servings - 0.5))}>−</button>
                                <span className="meal-modal-servings-val">{servings}</span>
                                <button className="btn btn-secondary btn-sm" onClick={() => setServings(servings + 0.5)}>+</button>
                            </div>
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => logMeal(selectedFood)}>
                            <MdAdd /> Log to {MEAL_TYPES.find(t => t.id === selectedMealType)?.label}
                        </button>
                    </div>
                </div>
            )}

            {/* ── Custom Food Modal ── */}
            {showCustom && (
                <div className="meal-modal-overlay" onClick={() => setShowCustom(false)}>
                    <div className="meal-modal glass-card-static animate-scale-in" onClick={e => e.stopPropagation()}>
                        <button className="meal-modal-close" onClick={() => setShowCustom(false)}><MdClose /></button>
                        <h3 className="heading-4">Quick Add Food</h3>
                        <p className="text-sm text-muted">Only name & calories are required</p>
                        <div className="custom-food-form">
                            <div className="custom-food-field">
                                <label>Food Name *</label>
                                <input className="input-field" placeholder="e.g. Protein Bar" value={customFood.name} onChange={e => setCustomFood(p => ({ ...p, name: e.target.value }))} />
                            </div>
                            <div className="custom-food-row">
                                <div className="custom-food-field">
                                    <label>Calories *</label>
                                    <input className="input-field" type="number" placeholder="200" value={customFood.calories} onChange={e => setCustomFood(p => ({ ...p, calories: e.target.value }))} />
                                </div>
                                <div className="custom-food-field">
                                    <label>Protein (g) <span className="text-xs text-muted">optional</span></label>
                                    <input className="input-field" type="number" placeholder="0" value={customFood.protein} onChange={e => setCustomFood(p => ({ ...p, protein: e.target.value }))} />
                                </div>
                            </div>
                            <div className="custom-food-row">
                                <div className="custom-food-field">
                                    <label>Carbs (g) <span className="text-xs text-muted">optional</span></label>
                                    <input className="input-field" type="number" placeholder="0" value={customFood.carbs} onChange={e => setCustomFood(p => ({ ...p, carbs: e.target.value }))} />
                                </div>
                                <div className="custom-food-field">
                                    <label>Fat (g) <span className="text-xs text-muted">optional</span></label>
                                    <input className="input-field" type="number" placeholder="0" value={customFood.fat} onChange={e => setCustomFood(p => ({ ...p, fat: e.target.value }))} />
                                </div>
                            </div>
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%' }} onClick={logCustomFood} disabled={!customFood.name || !customFood.calories}>
                            <MdAdd /> Log to {MEAL_TYPES.find(t => t.id === selectedMealType)?.label}
                        </button>
                    </div>
                </div>
            )}

            {/* ── Recipe Detail Modal ── */}
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
                            <ul className="recipe-ingredients">
                                {selectedRecipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                            </ul>
                        </div>

                        <div className="recipe-detail-section">
                            <h5>👨‍🍳 Instructions</h5>
                            <ol className="recipe-steps">
                                {selectedRecipe.steps.map((step, i) => <li key={i}>{step}</li>)}
                            </ol>
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
