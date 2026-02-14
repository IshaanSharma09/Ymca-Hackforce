import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        minlength: 6
    },
    firebaseUid: {
        type: String,
        unique: true,
        sparse: true
    },
    profile: {
        age: Number,
        gender: { type: String, enum: ['male', 'female', 'other'] },
        height: Number, // cm
        weight: Number, // kg
        activityLevel: {
            type: String,
            enum: ['sedentary', 'light', 'moderate', 'active']
        },
        goal: {
            type: String,
            enum: ['lose_fat', 'build_muscle', 'maintain', 'rehab']
        },
        targetWeight: Number,
        bmr: Number,
        tdee: Number,
        dailyCalorieTarget: Number,
        macroSplit: {
            protein: { type: Number, default: 40 },
            carbs: { type: Number, default: 30 },
            fat: { type: Number, default: 30 }
        }
    },
    gym: {
        hasGym: { type: Boolean, default: false },
        equipment: [String]
    },
    wearable: {
        type: { type: String, enum: ['samsung', 'apple', 'google_fit', 'none'], default: 'none' }
    },
    dailyStepGoal: { type: Number, default: 10000 },
    waterGoal: { type: Number, default: 8 }, // glasses
    avatar: String
}, {
    timestamps: true
})

// Calculate BMR using Mifflin-St Jeor equation
userSchema.methods.calculateBMR = function () {
    const { weight, height, age, gender } = this.profile
    if (!weight || !height || !age || !gender) return null

    let bmr
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }
    return Math.round(bmr)
}

// Calculate TDEE based on activity level
userSchema.methods.calculateTDEE = function () {
    const bmr = this.calculateBMR()
    if (!bmr) return null

    const multipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725
    }

    return Math.round(bmr * (multipliers[this.profile.activityLevel] || 1.2))
}

const User = mongoose.model('User', userSchema)
export default User
