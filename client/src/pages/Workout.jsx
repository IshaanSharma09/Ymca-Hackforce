import { MdFitnessCenter } from 'react-icons/md'
import './PageStyles.css'

function Workout() {
    return (
        <div className="page animate-fade-in">
            <div className="page__header">
                <div>
                    <h1 className="heading-2">Workout Tracker 🏋️</h1>
                    <p className="text-muted text-sm">Log exercises, track sets & reps, and burn calories</p>
                </div>
            </div>
            <div className="coming-soon glass-card-static">
                <div className="coming-soon__icon">
                    <MdFitnessCenter />
                </div>
                <h2 className="coming-soon__title">Exercise Tracking Coming in Stage 5</h2>
                <p className="coming-soon__desc">
                    Log gym workouts with sets, reps, and weight. Track bodyweight exercises and cardio with MET-based calorie burn.
                </p>
                <div className="coming-soon__features">
                    <span className="badge badge-success">Gym Exercises</span>
                    <span className="badge badge-info">Bodyweight</span>
                    <span className="badge badge-warning">Cardio</span>
                    <span className="badge badge-success">Calorie Burn</span>
                    <span className="badge badge-info">Workout History</span>
                </div>
            </div>
        </div>
    )
}

export default Workout
