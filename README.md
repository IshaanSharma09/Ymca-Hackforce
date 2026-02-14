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

FitFuel is an all-in-one **AI-powered health and fitness application** that helps users achieve their ideal body by intelligently tracking nutrition, physical activity, and gym performance.

It leverages the **Foodoscope API as the SOLE source** for all food and nutrition data (calories, protein, macros, vitamins, minerals, etc.) as required by the hackathon, and combines it with exercise tracking, step counting, and personalised workout planning to deliver a complete health management experience.

> [!IMPORTANT]
> **Hackathon Rule:** ALL food & nutrition data (calories, protein, carbs, fat, etc.) MUST come exclusively from the Foodoscope API. No external nutrition APIs (Gemini, Google Vision, etc.) are used for food data. Other APIs are allowed for exercise tracking and non-food features only.

---

## ✨ Features

### 1. 🍽️ Calorie & Nutrition Tracking *(via Foodoscope API — Sole Data Source)*
- Search food / recipes via Foodoscope API and get calorie + nutrient data
- **ALL** nutrition data (calories, protein, carbs, fat, sugar, fiber, vitamins, minerals, cholesterol, sodium, etc.) fetched exclusively from Foodoscope API *(RecipeDB + FlavorDB)*
- **Manually add** any food item or dish by name — search 118,000+ recipes and get instant nutrition breakdown
- Useful when items are hidden from camera or eating a home-cooked dish — just type the name and log it
- Full health tracking: protein, sugar, saturated/unsaturated fats, cholesterol, sodium, fiber, vitamins (A, B, C, D, E, K), minerals (iron, calcium, zinc, magnesium)
- Track daily, weekly, and monthly nutrition intake with visual charts
- Meal history and favourite meals for quick re-logging

### 2. 🛡️ Safety & Dietary Restrictions
- **Allergy Highlighting:** Define your allergens (e.g., Dairy, Nuts, Gluten) and get instant warnings on recipes.
- **Custom Ingredient Blacklist:** Add specific ingredients to avoid (e.g., "palm oil", "msg"). Any recipe containing them is flagged as "BLACKLISTED".
- **Visual Warnings:** Red badges and highlighted ingredients ensure you never accidentally consume something unsafe.

### 3. 🚶 Step & Activity Tracking
- Real-time step counter using device sensors (accelerometer / pedometer)
- Automatic calorie-burn estimation based on steps, distance, pace, and user profile
- Daily step goals with progress ring and streak tracking
- Walk / run session logger with route summary

### 4. 🏋️ Exercise & Workout Tracking
- Log gym exercises with **sets, reps, and weight** for each movement
- Auto-calculate calories burned per exercise using **MET** (Metabolic Equivalent of Task) values
- Support for bodyweight exercises (push-ups, pull-ups, squats, etc.) and cardio machines
- Exercise history with personal-record tracking
- Timer / stopwatch for rest intervals

### 5. 💪 Muscle Strength Analysis
- Analyse logged workouts to identify **strong vs. weak muscle groups**
- Visual **muscle-map heatmap** showing relative strength across body parts
- Detect **muscle imbalances** (e.g., push vs. pull, quads vs. hamstrings) and flag them

### 6. 📋 Smart Workout Plan Generator
- Personalised weekly workout plans based on:
  - User's fitness goals (lose fat, build muscle, maintain, rehabilitate)
  - Current strength profile and weak-muscle areas
  - Available gym equipment (user selects from a checklist)
  - **"No Equipment" mode** — generates bodyweight-only plans
- Progressive overload suggestions (increase reps/weight over weeks)
- Rest-day scheduling and deload week recommendations

### 7. 📊 Comprehensive Health Data Analysis & Dashboard
- **Daily calorie balance:** Calories consumed vs. calories burned
- **Surplus / Deficit indicator:** tells you exactly how many calories to add or remove
- **BMI, BMR, and TDEE calculator** based on user profile
- Macro split recommendations (e.g., 40/30/30) adjusted to goals
- Weekly & monthly trend graphs for weight, calories, steps, and workout volume
- Health score / wellness index summarising overall progress
- Nutrient deficiency alerts (e.g., low iron, low protein)
- **Smart Nutrition Alerts:** Get real-time warnings for low protein, under-eating, or over-eating.
- **Gamified Health Score:** Dangerous nutritional habits deduct points from your health score and level.

### 8. 🤖 Personalised Recommendations
- AI-driven suggestions: *"Add 250 kcal of protein-rich food today to meet your muscle-building goal"*
- Food swap suggestions for healthier alternatives
- Hydration reminders and water-intake tracking
- Sleep-hour logging and its impact on recovery

### 9. ⌚ Health Watch & Wearable Integration
- Connect **Samsung Galaxy Watch**, **Apple Watch**, or **Google Fit** to automatically sync real-time health data (heart rate, steps, calories burned, sleep, SpO2)
- Supported platforms:

  | Platform | SDK |
  |----------|-----|
  | Samsung | Samsung Health SDK — Galaxy Watch & Samsung phones |
  | Apple | Apple HealthKit — Apple Watch & iPhone |
  | Google | Google Fit / Health Connect API — Wear OS & Android |

- **No wearable?** No problem — FitFuel's built-in tracking engine uses your phone's accelerometer and gyroscope to count steps, estimate calories burned, and track activity directly inside the app
- All data (wearable or built-in) feeds into the same unified dashboard

### 10. 👤 User Profile & Onboarding
- Profile setup: age, gender, height, weight, activity level, goals
- Gym equipment inventory: user checks off what their gym has
- "No Gym" toggle for home-workout-only plans
- Progress photo timeline (optional)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js (Vite) · Chart.js / Recharts · CSS3 (glassmorphism, dark mode, animations) |
| **Backend** | Node.js · Express.js · MongoDB (Mongoose) |
| **API Testing** | Postman (Foodoscope collection from hackathon organisers) |
| **Auth** | Firebase Authentication (Google / Email) · JWT tokens |
| **Wearables** | Samsung Health SDK · Apple HealthKit · Google Fit / Health Connect API |
| **Sensors** | Web Sensors API (Accelerometer / Gyroscope) for built-in tracking |
| **AI/ML** | TensorFlow.js / custom rules engine · OpenAI API *(optional, NOT for food data)* |
| **Deployment** | PWA (Progressive Web App) — installable on mobile, offline support |

---

## 🔌 APIs Used

| # | API | Purpose |
|---|-----|---------|
| 1 | **Foodoscope API** *(mandatory)* | **SOLE source** for all food/nutrition data — recipe search, ingredient analysis, calorie/macro/micro breakdown. Tested via Postman collection. |
| 2 | Nutritionix API | Exercise calorie-burn estimation only (natural language exercise endpoint). **NOT** used for food data. |
| 3 | ExerciseDB API | Database of 1,300+ exercises with target muscle, equipment needed, and GIF demos |
| 4 | Firebase Auth API | Secure user authentication (Google OAuth, email/password) |
| 5 | Samsung Health / Apple HealthKit / Google Fit | Sync real-time health data from connected wearables |
| 6 | OpenAI API *(optional)* | Natural-language health tips and workout advice |

---

## 📁 Project Structure

```
Ymca-Hackforce/
├── client/                     # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/             # Images, icons, fonts
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar/
│   │   │   ├── Dashboard/
│   │   │   ├── MealLogger/
│   │   │   ├── StepTracker/
│   │   │   ├── WorkoutLogger/
│   │   │   ├── MuscleMap/
│   │   │   ├── WorkoutPlan/
│   │   │   └── Charts/
│   │   ├── pages/              # Page-level views
│   │   │   ├── Home.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MealLog.jsx
│   │   │   ├── Workout.jsx
│   │   │   ├── Analysis.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Login.jsx
│   │   ├── services/           # API call helpers
│   │   ├── context/            # React context (auth, user data)
│   │   ├── utils/              # Helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Express backend
│   ├── config/                 # DB connection, env config
│   ├── controllers/            # Route handlers
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js
│   │   ├── Meal.js
│   │   ├── Workout.js
│   │   └── HealthLog.js
│   ├── routes/                 # API routes
│   ├── middleware/             # Auth middleware, error handlers
│   ├── services/               # Foodoscope, Nutritionix, ExerciseDB wrappers
│   ├── utils/                  # Calorie calculators, muscle scoring
│   ├── server.js
│   └── package.json
│
├── .env.example                # Environment variable template
├── README.md                   # ← You are here
├── APP_WORKFLOW.md             # Full app workflow document
└── LICENSE
```

---

## 🔐 Environment Variables

Create a `.env` file in both `/client` and `/server`:

```env
# Server .env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/fitfuel
FOODOSCOPE_API_KEY=<your-foodoscope-api-key>
FOODOSCOPE_BASE_URL=http://cosylab.iiitd.edu.in:6969
NUTRITIONIX_APP_ID=<your-nutritionix-app-id>
NUTRITIONIX_API_KEY=<your-nutritionix-api-key>
EXERCISEDB_API_KEY=<your-exercisedb-api-key>
OPENAI_API_KEY=<your-openai-api-key>       # optional
JWT_SECRET=<random-secret-string>

# Client .env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=<your-firebase-api-key>
VITE_FIREBASE_AUTH_DOMAIN=<your-project>.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=<your-project-id>
```

---

## 🚀 How to Run Locally

**Prerequisites:** Node.js v18+ · npm or yarn · MongoDB Atlas account · Foodoscope API key

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

# 5. Start the backend
cd ../server
npm run dev

# 6. Start the frontend (in a new terminal)
cd ../client
npm run dev

# 7. Open http://localhost:5173 in your browser
```

---

## 👥 Team

| Team Name | Members |
|-----------|---------|
| **Ymca-Hackforce** | *Add team members here* |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
