import { MdAnalytics } from 'react-icons/md'
import './PageStyles.css'

function Analysis() {
    return (
        <div className="page animate-fade-in">
            <div className="page__header">
                <div>
                    <h1 className="heading-2">Health Analysis 📊</h1>
                    <p className="text-muted text-sm">Daily reports, muscle analysis, and trend charts</p>
                </div>
            </div>
            <div className="coming-soon glass-card-static">
                <div className="coming-soon__icon">
                    <MdAnalytics />
                </div>
                <h2 className="coming-soon__title">Analysis Coming in Stage 7 & 8</h2>
                <p className="coming-soon__desc">
                    Comprehensive health reports, muscle strength heatmap, weekly trends, BMI/BMR/TDEE calculator, and health score.
                </p>
                <div className="coming-soon__features">
                    <span className="badge badge-success">Daily Report</span>
                    <span className="badge badge-info">Muscle Heatmap</span>
                    <span className="badge badge-warning">Trend Charts</span>
                    <span className="badge badge-success">Health Score</span>
                    <span className="badge badge-info">Smart Workout Plan</span>
                </div>
            </div>
        </div>
    )
}

export default Analysis
