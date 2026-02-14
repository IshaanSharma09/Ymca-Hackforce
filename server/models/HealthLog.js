import mongoose from 'mongoose'

const healthLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    steps: { type: Number, default: 0 },
    stepsCalories: { type: Number, default: 0 },
    waterIntake: { type: Number, default: 0 },      // glasses
    sleepHours: { type: Number, default: 0 },
    weight: Number,                                   // daily weigh-in
    heartRate: {
        resting: Number,
        average: Number,
        max: Number
    },
    healthScore: { type: Number, default: 0 },
    caloriesSummary: {
        consumed: { type: Number, default: 0 },
        burnedExercise: { type: Number, default: 0 },
        burnedSteps: { type: Number, default: 0 },
        burnedBMR: { type: Number, default: 0 },
        netBalance: { type: Number, default: 0 }
    },
    musclesWorked: [String],
    notes: String
}, {
    timestamps: true
})

healthLogSchema.index({ userId: 1, date: -1 }, { unique: true })

const HealthLog = mongoose.model('HealthLog', healthLogSchema)
export default HealthLog
