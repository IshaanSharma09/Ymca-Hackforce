import mongoose from 'mongoose'

const mealSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    mealType: {
        type: String,
        enum: ['breakfast', 'lunch', 'snack', 'dinner'],
        required: true
    },
    recipe: {
        recipeId: String,       // Foodoscope recipe ID
        title: String,
        servings: Number,
        portionsEaten: { type: Number, default: 1 }
    },
    nutrition: {
        calories: { type: Number, default: 0 },
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fat: { type: Number, default: 0 },
        sugar: { type: Number, default: 0 },
        fiber: { type: Number, default: 0 },
        sodium: { type: Number, default: 0 },
        cholesterol: { type: Number, default: 0 },
        saturatedFat: { type: Number, default: 0 },
        unsaturatedFat: { type: Number, default: 0 }
    },
    micronutrients: {
        vitaminA: Number,
        vitaminB6: Number,
        vitaminB12: Number,
        vitaminC: Number,
        vitaminD: Number,
        vitaminE: Number,
        vitaminK: Number,
        iron: Number,
        calcium: Number,
        zinc: Number,
        magnesium: Number
    },
    isFavourite: { type: Boolean, default: false },
    notes: String
}, {
    timestamps: true
})

// Index for efficient daily queries
mealSchema.index({ userId: 1, date: -1 })

const Meal = mongoose.model('Meal', mealSchema)
export default Meal
