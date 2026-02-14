import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import {
    MdSearch, MdAdd, MdClose, MdRestaurantMenu,
    MdLocalFireDepartment, MdHistory, MdFavorite,
    MdFavoriteBorder, MdDelete, MdExpandMore, MdExpandLess,
    MdBreakfastDining, MdLunchDining, MdDinnerDining, MdCookie
} from 'react-icons/md'
import './MealLog.css'

// Built-in food database (works offline, no API key needed)
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
    { id: 11, name: 'Almonds', calories: 164, protein: 6, carbs: 6, fat: 14, serving: '28g (23 almonds)', category: 'Nuts' },
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
    const [showHistory, setShowHistory] = useState(false)
    const [expandedMeal, setExpandedMeal] = useState(null)
    const [selectedFood, setSelectedFood] = useState(null)

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

    // Save meals to localStorage
    const saveMeals = (meals) => {
        const today = new Date().toISOString().split('T')[0]
        setLoggedMeals(meals)
        localStorage.setItem(`fitfuel-meals-${user.uid}-${today}`, JSON.stringify(meals))

        // Also update dashboard daily data
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

    // Search foods
    const handleSearch = (query) => {
        setSearchQuery(query)
        if (query.trim().length < 2) {
            setSearchResults([])
            return
        }
        const results = FOOD_DATABASE.filter(f =>
            f.name.toLowerCase().includes(query.toLowerCase()) ||
            f.category.toLowerCase().includes(query.toLowerCase())
        )
        setSearchResults(results)
    }

    // Log a meal
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
        const updated = [...loggedMeals, meal]
        saveMeals(updated)
        setSelectedFood(null)
        setServings(1)
        setSearchQuery('')
        setSearchResults([])
    }

    // Remove a meal
    const removeMeal = (mealId) => {
        const updated = loggedMeals.filter(m => m.id !== mealId)
        saveMeals(updated)
    }

    // Toggle favorite
    const toggleFavorite = (food) => {
        const isFav = favorites.some(f => f.id === food.id)
        const updated = isFav ? favorites.filter(f => f.id !== food.id) : [...favorites, food]
        setFavorites(updated)
        localStorage.setItem(`fitfuel-favorites-${user.uid}`, JSON.stringify(updated))
    }

    // Calculate totals
    const totals = loggedMeals.reduce((acc, m) => ({
        calories: acc.calories + m.calories,
        protein: acc.protein + m.protein,
        carbs: acc.carbs + m.carbs,
        fat: acc.fat + m.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 })

    // Group meals by type
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
                    <p className="text-muted text-sm">Search food, log meals, and track your nutrition</p>
                </div>
                <button className="btn btn-secondary" onClick={() => setShowHistory(!showHistory)}>
                    <MdHistory /> {showHistory ? 'Hide History' : 'Meal History'}
                </button>
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
                    <div>
                        <span className="meal-summary-number">{totals.protein}g</span>
                        <span className="meal-summary-label">Protein</span>
                    </div>
                </div>
                <div className="meal-summary-stat">
                    <span className="meal-macro-dot" style={{ background: '#3b82f6' }} />
                    <div>
                        <span className="meal-summary-number">{totals.carbs}g</span>
                        <span className="meal-summary-label">Carbs</span>
                    </div>
                </div>
                <div className="meal-summary-stat">
                    <span className="meal-macro-dot" style={{ background: '#f59e0b' }} />
                    <div>
                        <span className="meal-summary-number">{totals.fat}g</span>
                        <span className="meal-summary-label">Fat</span>
                    </div>
                </div>
            </div>

            <div className="meal-layout">
                {/* Left — Search & Log */}
                <div className="meal-column-main">
                    {/* Search */}
                    <div className="glass-card-static meal-search-card">
                        <div className="meal-search-bar">
                            <MdSearch className="meal-search-icon" />
                            <input
                                type="text"
                                className="input-field meal-search-input"
                                placeholder="Search food... (e.g. chicken, rice, dal, pasta)"
                                value={searchQuery}
                                onChange={e => handleSearch(e.target.value)}
                            />
                            {searchQuery && (
                                <button className="meal-search-clear" onClick={() => { setSearchQuery(''); setSearchResults([]) }}>
                                    <MdClose />
                                </button>
                            )}
                        </div>

                        {/* Meal Type Selector */}
                        <div className="meal-type-selector">
                            {MEAL_TYPES.map(type => {
                                const Icon = type.icon
                                return (
                                    <button
                                        key={type.id}
                                        className={`meal-type-btn ${selectedMealType === type.id ? 'selected' : ''}`}
                                        style={{ '--type-color': type.color }}
                                        onClick={() => setSelectedMealType(type.id)}
                                    >
                                        <Icon /> {type.label}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Search Results */}
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
                                <p className="text-muted text-sm">No results for "{searchQuery}". Try different keywords.</p>
                            </div>
                        )}

                        {/* Quick Picks (when not searching) */}
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
                                                <button className="btn btn-primary btn-sm" onClick={() => setSelectedFood(food)}>
                                                    <MdAdd />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right — Today's Meals */}
                <div className="meal-column-side">
                    <div className="glass-card-static">
                        <h3 className="dash-card-title"><MdRestaurantMenu style={{ color: 'var(--success)' }} /> Today's Meals</h3>
                        {loggedMeals.length === 0 ? (
                            <p className="text-muted text-sm text-center" style={{ padding: 'var(--space-8) 0' }}>
                                No meals logged yet. Search and add food from the left! 🍽️
                            </p>
                        ) : (
                            <div className="meal-today-list">
                                {mealsByType.filter(t => t.meals.length > 0).map(type => {
                                    const Icon = type.icon
                                    return (
                                        <div key={type.id} className="meal-today-group">
                                            <button className="meal-today-group-header" onClick={() => setExpandedMeal(expandedMeal === type.id ? null : type.id)}>
                                                <div className="meal-today-group-left">
                                                    <Icon style={{ color: type.color }} />
                                                    <strong>{type.label}</strong>
                                                    <span className="text-xs text-muted">({type.meals.length} items)</span>
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

            {/* Add Food Modal */}
            {selectedFood && (
                <div className="meal-modal-overlay" onClick={() => setSelectedFood(null)}>
                    <div className="meal-modal glass-card-static animate-scale-in" onClick={e => e.stopPropagation()}>
                        <button className="meal-modal-close" onClick={() => setSelectedFood(null)}>
                            <MdClose />
                        </button>
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

                        <div className="meal-modal-type">
                            <label className="text-sm">Meal Type</label>
                            <div className="meal-type-selector compact">
                                {MEAL_TYPES.map(type => {
                                    const Icon = type.icon
                                    return (
                                        <button
                                            key={type.id}
                                            className={`meal-type-btn ${selectedMealType === type.id ? 'selected' : ''}`}
                                            style={{ '--type-color': type.color }}
                                            onClick={() => setSelectedMealType(type.id)}
                                        >
                                            <Icon />
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => logMeal(selectedFood)}>
                            <MdAdd /> Log {selectedFood.name}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MealLog
