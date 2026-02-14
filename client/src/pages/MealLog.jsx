import { MdRestaurantMenu } from 'react-icons/md'
import './PageStyles.css'

function MealLog() {
    return (
        <div className="page animate-fade-in">
            <div className="page__header">
                <div>
                    <h1 className="heading-2">Meal Log 🍽️</h1>
                    <p className="text-muted text-sm">Search and log your meals using Foodoscope API</p>
                </div>
            </div>
            <div className="coming-soon glass-card-static">
                <div className="coming-soon__icon">
                    <MdRestaurantMenu />
                </div>
                <h2 className="coming-soon__title">Meal Logging Coming in Stage 4</h2>
                <p className="coming-soon__desc">
                    Search 118,000+ recipes, browse by category, filter by calories/protein — all powered by Foodoscope API.
                </p>
                <div className="coming-soon__features">
                    <span className="badge badge-success">Search Recipes</span>
                    <span className="badge badge-info">Browse by Category</span>
                    <span className="badge badge-warning">Filter by Calories</span>
                    <span className="badge badge-success">Nutrition Detail</span>
                    <span className="badge badge-info">Meal History</span>
                </div>
            </div>
        </div>
    )
}

export default MealLog
