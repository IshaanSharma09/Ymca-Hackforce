import mongoose from 'mongoose'

const exerciseEntrySchema = new mongoose.Schema({
    exerciseName: String,
    exerciseId: String,        // ExerciseDB ID
    targetMuscle: String,
    secondaryMuscles: [String],
    equipment: String,
    sets: Number,
    reps: Number,
    weight: Number,            // kg
    duration: Number,          // minutes (for cardio)
    met: Number,               // MET value
    caloriesBurned: Number
}, { _id: false })

const workoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        enum: ['gym', 'bodyweight', 'cardio', 'mixed'],
        required: true
    },
    exercises: [exerciseEntrySchema],
    totalCaloriesBurned: { type: Number, default: 0 },
    totalVolume: { type: Number, default: 0 },       // total kg lifted
    totalSets: { type: Number, default: 0 },
    totalReps: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },           // total minutes
    musclesWorked: [String],
    notes: String
}, {
    timestamps: true
})

workoutSchema.index({ userId: 1, date: -1 })

const Workout = mongoose.model('Workout', workoutSchema)
export default Workout
