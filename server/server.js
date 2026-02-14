import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'

// Load env vars
dotenv.config()

// Connect to MongoDB
connectDB()

const app = express()

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        app: 'FitFuel API',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    })
})

// Routes
import authRouter from './routes/auth.js'
import mealsRouter from './routes/meals.js'
import workoutsRouter from './routes/workouts.js'
import healthLogRouter from './routes/healthLog.js'

app.use('/api/auth', authRouter)
app.use('/api/meals', mealsRouter)
app.use('/api/workouts', workoutsRouter)
app.use('/api/health-log', healthLogRouter)

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message)
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`\n🔥 FitFuel API running on http://localhost:${PORT}`)
    console.log(`📋 Health check: http://localhost:${PORT}/api/health\n`)
})
