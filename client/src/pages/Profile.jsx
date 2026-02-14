import { MdPerson } from 'react-icons/md'
import './PageStyles.css'

function Profile() {
    return (
        <div className="page animate-fade-in">
            <div className="page__header">
                <div>
                    <h1 className="heading-2">Profile 👤</h1>
                    <p className="text-muted text-sm">Your fitness profile, goals, and settings</p>
                </div>
            </div>
            <div className="coming-soon glass-card-static">
                <div className="coming-soon__icon">
                    <MdPerson />
                </div>
                <h2 className="coming-soon__title">Profile Coming in Stage 2</h2>
                <p className="coming-soon__desc">
                    Set up your fitness profile with goals, activity level, gym equipment, and wearable preferences.
                </p>
                <div className="coming-soon__features">
                    <span className="badge badge-success">User Profile</span>
                    <span className="badge badge-info">Fitness Goals</span>
                    <span className="badge badge-warning">Equipment List</span>
                    <span className="badge badge-success">Wearable Sync</span>
                </div>
            </div>
        </div>
    )
}

export default Profile
