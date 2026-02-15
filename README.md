<h1 align="center">🔥 FitFuel — Your AI Health Companion</h1>

<p align="center">
  <b>Track Calories · Count Steps · Crush Workouts · Analyse Health</b><br/>
  <i>Powered by the Foodoscope API</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white" />
</p>

---

| | |
|---|---|
| **Project** | FitFuel |
| **Team** | Ymca-Hackforce |
| **Category** | Health & Fitness |
| **Hackathon API** | Foodoscope API *(mandatory)* |

---

## 📖 Project Overview

FitFuel is an all-in-one **AI-powered health and fitness application** that helps users achieve their ideal body by intelligently tracking nutrition, physical activity, and gym performance — all wrapped in a **retro pixel-art game-themed UI** with gamification mechanics.

It leverages the **Foodoscope API as the SOLE source** for all food and nutrition data (calories, protein, macros, vitamins, minerals, etc.) as required by the hackathon, and combines it with exercise tracking, step counting, and personalised workout planning to deliver a complete health management experience.

> [!IMPORTANT]
> **Hackathon Rule:** ALL food & nutrition data (calories, protein, carbs, fat, etc.) MUST come exclusively from the Foodoscope API. No external nutrition APIs (Gemini, Google Vision, etc.) are used for food data. Other APIs are allowed for exercise tracking and non-food features only.

---

## ✨ Features

### 1. 🍽️ Calorie & Nutrition Tracking *(via Foodoscope API — Sole Data Source)*
- 35+ food items in the built-in database with per-100g nutrition data
- Search food by name or category with instant calorie + macro breakdown
- Manually add any food item — enter grams, and **all macros are auto-calculated live**
- Log meals by type: **Breakfast, Lunch, Dinner, Snack** with dedicated icons
- **Favourite meals** for quick re-logging
- Real-time daily summary bar showing total kcal, protein, carbs, and fat consumed
- 8 built-in recipes with step-by-step instructions and full nutritional breakdown
- Recipe browsing with calorie, protein, carbs, and fat info per recipe

### 2. 🛡️ Safety & Dietary Restrictions *(NEW)*
- **Allergen Highlighting:** Define your allergens (e.g., Dairy, Nuts, Gluten, Egg, Soy, Seafood) during onboarding — get instant visual warnings on search results and recipe cards
- **Custom Ingredient Blacklist:** Add specific ingredients to avoid (e.g., "palm oil", "msg") from your Profile page — any recipe containing them gets a red "BLACKLISTED" badge
- **Per-Ingredient Warnings:** Inside recipe modals, individual ingredients that match your allergens are highlighted with ⚠️ badges
- **Smart Filtering:** Vegetarian/vegan users automatically have non-veg items hidden from search results
- **Diet-Aware UI:** Visual red badges and highlighted cards ensure you never accidentally consume something unsafe

### 3. 🎮 Retro Game-Themed UI *(NEW)*
- **Pixel-Art Game Background:** Animated retro-style background with floating pixel elements across all pages
- **Game Character Avatar:** Pixel-art character on the Dashboard that reacts to your health status and progress
- **Pixel Hearts (Lives System):** RPG-style health hearts displayed on Analysis page — lose hearts for bad nutritional habits
- **Cheat Day System:** Spend a "life" to activate a cheat day (3 lives per month, 20 XP penalty per use)
- **Gamified Health Score:** Overall health score with XP and level system — dangerous nutritional habits deduct points
- **Glassmorphism + Dark Mode:** Premium glass-card UI with smooth animations throughout

### 4. 🚶 Step & Activity Tracking
- Manual step logging from the Dashboard with one-click submit
- Auto calorie-burn estimation: **0.04 kcal per step** based on user weight
- Daily step goals with visual progress tracking
- Steps feed directly into the unified calorie balance dashboard

### 5. 🏋️ Exercise & Workout Tracking
- **50+ exercises** in built-in database covering Gym, Bodyweight, and Cardio
- Log exercises with **sets, reps, weight, and duration**
- Auto-calculate calories burned per exercise using **MET** (Metabolic Equivalent of Task) formula: `Calories = MET × weight(kg) × duration(hrs)`
- Filter exercises by type (Gym / Bodyweight / Cardio) and muscle group (13 groups)
- **Built-in rest timer** with start/stop controls for workout sessions
- Workout summary with total sets, reps, volume (kg), and calories burned
- Workout history saved per day with expandable detail view
- Backend sync — workouts automatically saved to MongoDB

### 6. 💪 Muscle Strength Analysis *(NEW — Dedicated Page)*
- Analyse logged workouts to identify **strong vs. weak muscle groups**
- **Visual muscle heatmap** with colour intensity based on training frequency across 11 muscle groups
- Front/Back body view toggle to see targeted areas
- Detect **muscle imbalances** (e.g., push vs. pull, quads vs. hamstrings) and flag them as warnings
- **Smart Workout Plan Generator:** Pre-built plans for 3 goals:
  - 🔥 **Fat Loss** — 4 days/week, high rep + cardio
  - 💪 **Muscle Building** — 5 days/week, progressive overload
  - ⚖️ **Maintenance** — 3 days/week, full body
- Each plan includes exact exercises, sets, reps, and rest intervals
- **Smart Meal Plans:** Goal-specific daily meal suggestions with calorie and macro breakdowns

### 7. 📊 Comprehensive Health Data Analysis & Dashboard
- **Daily calorie balance:** Consumed vs. Burned with real-time surplus/deficit indicator
- **BMI Calculator** with category classification (Underweight / Normal / Overweight / Obese)
- **BMR Calculator** using Mifflin-St Jeor equation (gender-aware)
- **TDEE Calculator** with activity level multipliers (Sedentary to Very Active)
- **Macro target recommendations** — personalised protein, carbs, fat targets based on goal and TDEE
- **Interactive Charts** (powered by Chart.js):
  - 📈 Line chart: 7-day calorie trend (consumed vs. burned)
  - 📊 Bar chart: daily macro breakdown
  - 🍩 Doughnut chart: macro split visualisation
- **Smart Nutrition Alerts:** Real-time warnings for low protein, overeating, undereating, and low water intake
- **Data Aggregation Engine:** Automatic daily → weekly → monthly → yearly data rollup stored in localStorage
- **Gamified Health Score with Pixel Hearts:** Points deducted for dangerous habits (skipping protein, overeating, zero exercise)
- **Water intake tracking** with glass-by-glass counter
- **Sleep logging** with hours tracker

### 8. 👤 User Onboarding & Profile *(NEW — Multi-Step Wizard)*
- **5-step animated onboarding wizard** for new users:
  1. Basic info (name, age, gender)
  2. Body metrics (height, weight)
  3. Activity level selection
  4. Fitness goal selection (Lose Fat / Build Muscle / Maintain)
  5. Dietary preferences & allergen setup
- Profile page with:
  - Display name, email, and password management
  - Body stats display (height, weight, age, gender, activity level, goal)
  - **Allergen management** — add/remove allergens
  - **Custom blacklist management** — add/remove blacklisted ingredients
  - Account deletion and logout
- **Demo Mode:** App works without Firebase — local auth with localStorage for hackathon demos

### 9. 🔐 Authentication
- **Firebase Authentication** — Google OAuth and Email/Password sign-in
- **Demo Mode fallback** — when Firebase is not configured, the app runs a fully functional local auth system using localStorage (demo users, sessions, profiles)
- Protected routes — unauthenticated users are redirected to login
- User data synced to MongoDB backend via REST API

### 10. 🗃️ Backend API *(Express + MongoDB)*
- RESTful API with 4 route groups:
  - `/api/auth` — User sync and profile management
  - `/api/meals` — Meal logging, retrieval, and stats
  - `/api/workouts` — Workout session logging and history
  - `/api/health-log` — Daily health data (steps, water, sleep, vitals)
- Mongoose models: **User**, **Meal**, **Workout**, **HealthLog**
- **Foodoscope API integration** via dedicated service wrapper
- CORS configured for frontend origin
- Health check endpoint: `GET /api/health`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------:|
| **Frontend** | React 18 (Vite 6) · Chart.js · react-chartjs-2 · React Router v6 · react-icons |
| **Backend** | Node.js · Express.js · MongoDB (Mongoose) |
| **Auth** | Firebase Authentication (Google / Email) · Demo mode fallback |
| **Styling** | CSS3 — glassmorphism, dark mode, pixel-art animations, retro game theme |
| **API Testing** | Postman (Foodoscope collection) |
| **Food Data** | Foodoscope API (RecipeDB + FlavorDB) — **sole source** |
| **Deployment** | PWA-ready (manifest.json, service worker) |

---

## 🔌 APIs Used

| # | API | Purpose |
|---|-----|---------:|
| 1 | **Foodoscope API** *(mandatory)* | **SOLE source** for all food/nutrition data — recipe search, ingredient analysis, calorie/macro/micro breakdown |
| 2 | Nutritionix API | Exercise calorie-burn estimation only. **NOT** used for food data |
| 3 | ExerciseDB API | Database of 1,300+ exercises with target muscle, equipment, and GIF demos |
| 4 | Firebase Auth API | Secure user authentication (Google OAuth, email/password) |

---

## 📁 Project Structure

```
Ymca-Hackforce/
├── client/                          # React frontend (Vite)
│   ├── public/                      # Static assets, manifest.json, icons
│   ├── src/
│   │   ├── components/
│   │   │   ├── ErrorBoundary.jsx    # Global error boundary
│   │   │   ├── GameBackground/      # Animated pixel-art background
│   │   │   ├── GameCharacter/       # Interactive pixel avatar on Dashboard
│   │   │   ├── GameComponents/      # Shared game UI elements
│   │   │   ├── Navbar/              # Top navigation bar
│   │   │   ├── Onboarding/          # 5-step onboarding wizard
│   │   │   ├── PixelHearts/         # RPG-style health hearts
│   │   │   ├── Sidebar/             # Collapsible sidebar navigation
│   │   │   └── pixel/               # Pixel-art styled UI primitives
│   │   ├── config/                  # Firebase configuration
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Authentication (Firebase + Demo mode)
│   │   │   ├── DailyLogContext.jsx  # Daily health data + cheat-day system
│   │   │   └── ThemeContext.jsx     # Dark/light theme toggle
│   │   ├── pages/
│   │   │   ├── Login.jsx + .css     # Login / Signup page
│   │   │   ├── Dashboard.jsx + .css # Main dashboard with calorie balance
│   │   │   ├── MealLog.jsx + .css   # Food search, recipes, meal logging
│   │   │   ├── Workout.jsx + .css   # Exercise logging with timer
│   │   │   ├── Analysis.jsx + .css  # Health analytics + charts
│   │   │   ├── MuscleAnalysis.jsx   # Muscle heatmap + workout plans
│   │   │   ├── Profile.jsx + .css   # User settings + allergen manager
│   │   │   └── PageStyles.css       # Shared page styles
│   │   ├── services/
│   │   │   └── api.js               # Axios instance for backend API
│   │   ├── App.jsx                  # Root app with routing
│   │   ├── main.jsx                 # Entry point (React DOM render)
│   │   └── index.css                # Global design system + CSS variables
│   ├── index.html                   # HTML entry point
│   ├── vite.config.js               # Vite config (port 5173, proxy to :5000)
│   └── package.json
│
├── server/                          # Express backend
│   ├── config/
│   │   └── db.js                    # MongoDB connection (Mongoose)
│   ├── models/
│   │   ├── User.js                  # User schema (profile, goals, equipment)
│   │   ├── Meal.js                  # Meal log schema
│   │   ├── Workout.js               # Workout session schema
│   │   └── HealthLog.js             # Daily vitals schema
│   ├── routes/
│   │   ├── auth.js                  # Auth sync + profile endpoints
│   │   ├── meals.js                 # Meal CRUD endpoints
│   │   ├── workouts.js              # Workout CRUD endpoints
│   │   └── healthLog.js             # Health data endpoints
│   ├── services/
│   │   └── foodoscopeService.js     # Foodoscope API wrapper
│   ├── server.js                    # Express app entry point
│   └── package.json
│
├── .gitignore
├── APP_WORKFLOW.md                  # Full app workflow document
├── README.md                        # ← You are here
└── LICENSE                          # MIT License
```

---

## 🔐 Environment Variables

Create a `.env` file in both `/client` and `/server`:

```env
# Server .env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/fitfuel
JWT_SECRET=<random-secret-string>

# Foodoscope API (MANDATORY — sole source for food data)
FOODOSCOPE_API_KEY=<your-foodoscope-api-key>
FOODOSCOPE_BASE_URL=http://cosylab.iiitd.edu.in:6969

# Nutritionix (exercise calorie burn ONLY — NOT for food data)
NUTRITIONIX_APP_ID=<your-nutritionix-app-id>
NUTRITIONIX_API_KEY=<your-nutritionix-api-key>

# ExerciseDB
EXERCISEDB_API_KEY=<your-exercisedb-api-key>

# OpenAI (optional — health tips)
OPENAI_API_KEY=<your-openai-api-key>
```

```env
# Client .env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=<your-firebase-api-key>
VITE_FIREBASE_AUTH_DOMAIN=<your-project>.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=<your-project-id>
VITE_FIREBASE_STORAGE_BUCKET=<your-project>.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
VITE_FIREBASE_APP_ID=<your-app-id>
```

> [!TIP]
> **No Firebase?** No problem — leave the client `.env` empty and the app will run in **Demo Mode** with local authentication powered by localStorage.

---

## 🚀 How to Run Locally

**Prerequisites:** Node.js v18+ · npm · MongoDB Atlas account · Foodoscope API key

```bash
# 1. Clone the repository
git clone https://github.com/IshaanSharma09/Ymca-Hackforce.git
cd Ymca-Hackforce

# 2. Install server dependencies
cd server
npm install

# 3. Install client dependencies
cd ../client
npm install

# 4. Set up environment variables
# Copy .env.example to .env in both /server and /client
# Fill in your API keys and database URI

# 5. Start the backend (in one terminal)
cd server
npm run dev

# 6. Start the frontend (in another terminal)
cd client
npm run dev

# 7. Open http://localhost:5173 in your browser
```

---

## 👥 Team

| Team Name | Members |
|-----------|---------:|
| **Ymca-Hackforce** | *Ishaan Sharma + Team* |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
