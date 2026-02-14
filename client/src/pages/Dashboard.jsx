import {
    MdLocalFireDepartment,
    MdTrendingUp,
    MdDirectionsRun,
    MdWaterDrop
} from 'react-icons/md'
import './PageStyles.css'

function Dashboard() {
    const stats = [
        { icon: MdLocalFireDepartment, label: 'Calories', value: '0', target: '2,200 kcal', color: '#00d4aa', progress: 0 },
        { icon: MdTrendingUp, label: 'Protein', value: '0g', target: '110g', color: '#3b82f6', progress: 0 },
        { icon: MdDirectionsRun, label: 'Steps', value: '0', target: '10,000', color: '#f59e0b', progress: 0 },
        { icon: MdWaterDrop, label: 'Water', value: '0', target: '8 glasses', color: '#00b4d8', progress: 0 }
    ]

    return (
        <div className="page animate-fade-in">
            <div className="page__header">
                <div>
                    <h1 className="heading-2">Good Morning! 👋</h1>
                    <p className="text-muted text-sm">Here's your health overview for today</p>
                </div>
                <div className="page__header-actions">
                    <button className="btn btn-primary">+ Log Meal</button>
                    <button className="btn btn-secondary">+ Log Exercise</button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid stagger-children">
                {stats.map((stat, i) => {
                    const Icon = stat.icon
                    return (
                        <div className="stat-card glass-card" key={i}>
                            <div className="stat-card__header">
                                <div className="stat-card__icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                                    <Icon />
                                </div>
                                <span className="stat-card__label">{stat.label}</span>
                            </div>
                            <div className="stat-card__value">{stat.value}</div>
                            <div className="stat-card__target">of {stat.target}</div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${stat.progress}%`, background: stat.color }} />
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-grid">
                {/* Calorie Ring */}
                <div className="glass-card-static calorie-card">
                    <h3 className="heading-4">Daily Calorie Balance</h3>
                    <div className="calorie-ring">
                        <svg viewBox="0 0 200 200" className="calorie-ring__svg">
                            <circle cx="100" cy="100" r="85" fill="none" stroke="var(--bg-tertiary)" strokeWidth="12" />
                            <circle
                                cx="100" cy="100" r="85"
                                fill="none"
                                stroke="url(#calorieGradient)"
                                strokeWidth="12"
                                strokeLinecap="round"
                                strokeDasharray="534"
                                strokeDashoffset="534"
                                transform="rotate(-90 100 100)"
                            />
                            <defs>
                                <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="var(--accent-start)" />
                                    <stop offset="100%" stopColor="var(--accent-end)" />
                                </linearGradient>
                            </defs>
                            <text x="100" y="90" textAnchor="middle" fill="var(--text-primary)" fontSize="32" fontWeight="800">0</text>
                            <text x="100" y="115" textAnchor="middle" fill="var(--text-tertiary)" fontSize="13">of 2,200 kcal</text>
                        </svg>
                    </div>
                    <div className="calorie-stats">
                        <div className="calorie-stat">
                            <span className="calorie-stat__dot" style={{ background: '#00d4aa' }} />
                            <span className="text-sm text-muted">Eaten</span>
                            <span className="calorie-stat__val">0</span>
                        </div>
                        <div className="calorie-stat">
                            <span className="calorie-stat__dot" style={{ background: '#ef4444' }} />
                            <span className="text-sm text-muted">Burned</span>
                            <span className="calorie-stat__val">0</span>
                        </div>
                        <div className="calorie-stat">
                            <span className="calorie-stat__dot" style={{ background: '#3b82f6' }} />
                            <span className="text-sm text-muted">Remaining</span>
                            <span className="calorie-stat__val">2,200</span>
                        </div>
                    </div>
                </div>

                {/* Macros */}
                <div className="glass-card-static macros-card">
                    <h3 className="heading-4">Macro Split</h3>
                    <div className="macro-bars">
                        {[
                            { label: 'Protein', current: 0, target: 110, unit: 'g', color: '#3b82f6' },
                            { label: 'Carbs', current: 0, target: 165, unit: 'g', color: '#f59e0b' },
                            { label: 'Fat', current: 0, target: 73, unit: 'g', color: '#ef4444' }
                        ].map((macro, i) => (
                            <div className="macro-bar" key={i}>
                                <div className="macro-bar__header">
                                    <span className="macro-bar__label">{macro.label}</span>
                                    <span className="macro-bar__values text-sm text-muted">{macro.current}/{macro.target}{macro.unit}</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${(macro.current / macro.target) * 100}%`, background: macro.color }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="macro-target-label">
                        <span className="badge badge-info">Target: 40% P / 30% C / 30% F</span>
                    </div>
                </div>

                {/* Recipe of the Day */}
                <div className="glass-card recipe-of-day">
                    <div className="recipe-of-day__badge">
                        <span className="badge badge-success">🍗 Recipe of the Day</span>
                    </div>
                    <h3 className="heading-4">Loading...</h3>
                    <p className="text-sm text-muted" style={{ marginTop: 'var(--space-2)' }}>
                        Fetching today's recipe from Foodoscope API
                    </p>
                    <div className="recipe-of-day__placeholder">
                        <div className="recipe-placeholder-shimmer" />
                    </div>
                    <button className="btn btn-primary" style={{ marginTop: 'var(--space-4)', width: '100%' }}>
                        View Recipe
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
