================================================================================
                          FITFUEL — YOUR AI HEALTH COMPANION
================================================================================

Project Name  : FitFuel
Team          : Ymca-Hackforce
Category      : Health & Fitness
Hackathon API : Foodoscope API (mandatory)

================================================================================
                               PROJECT OVERVIEW
================================================================================

FitFuel is an all-in-one AI-powered health and fitness application that helps
users achieve their ideal body by intelligently tracking nutrition, physical
activity, and gym performance. It leverages the Foodoscope API as the SOLE
source for all food and nutrition data (calories, protein, macros, etc.) as
required by the hackathon, and combines it with exercise tracking, step
counting, and personalized workout planning to deliver a complete health
management experience.

  ┌─────────────────────────────────────────────────────────────────────┐
  │  IMPORTANT HACKATHON RULE:                                        │
  │  ALL food & nutrition data (calories, protein, carbs, fat, etc.)  │
  │  MUST come exclusively from the Foodoscope API.                   │
  │  No external nutrition APIs (Gemini, Google Vision, etc.) are     │
  │  used for food data. Other APIs are allowed for exercise tracking │
  │  and non-food features only.                                      │
  └─────────────────────────────────────────────────────────────────────┘

================================================================================
                                  FEATURES
================================================================================

1. CALORIE & NUTRITION TRACKING (via Foodoscope API — SOLE DATA SOURCE)
   ─────────────────────────────────────────────────────────────────────
   • Search food / recipes via Foodoscope API and get calorie + nutrient data.
   • ALL nutrition data (calories, protein, carbs, fat, fiber, vitamins,
     minerals) is fetched exclusively from the Foodoscope API.
   • Log meals manually by searching from the Foodoscope recipe & ingredient
     database.
   • Track daily, weekly, and monthly nutrition intake with visual charts.
   • Meal history and favourite meals for quick re-logging.

2. STEP & ACTIVITY TRACKING
   ──────────────────────────
   • Real-time step counter using device sensors (accelerometer / pedometer).
   • Automatic calorie-burn estimation based on steps, distance, pace, and
     user profile (age, weight, height).
   • Daily step goals with progress ring and streak tracking.
   • Walk / run session logger with route summary.

3. EXERCISE & WORKOUT TRACKING
   ─────────────────────────────
   • Log gym exercises with sets, reps, and weight for each movement.
   • Auto-calculate calories burned per exercise using MET (Metabolic
     Equivalent of Task) values.
   • Support for bodyweight exercises (push-ups, pull-ups, squats, etc.)
     and cardio machines.
   • Exercise history with personal-record tracking.
   • Timer / stopwatch for rest intervals.

4. MUSCLE STRENGTH ANALYSIS
   ──────────────────────────
   • Analyse logged workouts to identify strong vs. weak muscle groups.
   • Visual muscle-map heatmap showing relative strength across body parts
     (chest, back, shoulders, arms, core, legs).
   • Detect muscle imbalances (e.g., left vs. right, push vs. pull) and
     flag them for the user.

5. SMART WORKOUT PLAN GENERATOR
   ──────────────────────────────
   • Personalised weekly workout plans based on:
       - User's fitness goals (lose fat, build muscle, maintain, rehabilitate).
       - Current strength profile and weak-muscle areas.
       - Available gym equipment (user selects from a list of common machines
         and free weights).
       - "No Equipment" mode: generates plans using only bodyweight exercises.
   • Progressive overload suggestions (increase reps/weight over weeks).
   • Rest-day scheduling and deload week recommendations.

6. COMPREHENSIVE HEALTH DATA ANALYSIS & DASHBOARD
   ─────────────────────────────────────────────────
   • Daily calorie balance: Calories consumed vs. calories burned.
   • Surplus / Deficit indicator: tells the user exactly how many calories
     to add or remove to reach their goal (bulk, cut, or maintain).
   • BMI, BMR, and TDEE calculator based on user profile.
   • Macro split recommendations (e.g., 40/30/30) adjusted to goals.
   • Weekly & monthly trend graphs for weight, calories, steps, and
     workout volume.
   • Health score / wellness index summarising overall progress.
   • Nutrient deficiency alerts (e.g., low iron, low protein).

7. PERSONALISED RECOMMENDATIONS
   ──────────────────────────────
   • AI-driven suggestions: "Add 250 kcal of protein-rich food today to
     meet your muscle-building goal."
   • Food swap suggestions for healthier alternatives.
   • Hydration reminders and water-intake tracking.
   • Sleep-hour logging and its impact on recovery.

8. HEALTH WATCH & WEARABLE INTEGRATION
   ──────────────────────────────────────
   • Connect your Samsung Galaxy Watch, Apple Watch, or Google Fit account
     to automatically sync real-time health data (heart rate, steps, calories
     burned, sleep, SpO2).
   • Supported platforms:
       - Samsung Health SDK — Galaxy Watch & Samsung phones.
       - Apple HealthKit — Apple Watch & iPhone.
       - Google Fit / Health Connect API — Wear OS & Android devices.
   • NO WEARABLE? No problem — FitFuel's built-in tracking engine uses your
     phone's accelerometer and gyroscope to count steps, estimate calories
     burned, and track muscle-gain progress directly inside the app.
   • All data (wearable or built-in) feeds into the same unified dashboard
     so your calorie balance, activity stats, and health analysis are always
     up to date regardless of how data is captured.

9. USER PROFILE & ONBOARDING
   ───────────────────────────
   • Profile setup: age, gender, height, weight, activity level, goals.
   • Gym equipment inventory: user checks off what their gym has.
   • "No Gym" toggle for home-workout-only plans.
   • Progress photo timeline (optional).

================================================================================
                                TECH STACK
================================================================================

FRONTEND
────────
  • React.js (with Vite) — fast, component-based UI.
  • Chart.js / Recharts — interactive graphs and data visualisation.
  • CSS3 with modern design system — glassmorphism, dark mode, animations.

BACKEND
───────
  • Node.js with Express.js — RESTful API server.
  • MongoDB (with Mongoose) — NoSQL database for user data, meals, workouts.

API TESTING & DEVELOPMENT
─────────────────────────
  • Postman — used for testing and interacting with the Foodoscope API
    (Postman collection provided by hackathon organizers).
  • Postman environment variables for managing API keys and base URLs.

AUTHENTICATION
──────────────
  • Firebase Authentication — Google / Email sign-in.
  • JWT tokens for API authorization.

DEVICE & WEARABLE INTEGRATION
─────────────────────────────
  • Samsung Health SDK — sync data from Galaxy Watch.
  • Apple HealthKit — sync data from Apple Watch.
  • Google Fit / Health Connect API — sync data from Wear OS & Android.
  • Web Sensors API (Accelerometer / Gyroscope) — built-in step counting
    and activity detection when no wearable is connected.
  • PWA (Progressive Web App) — installable on mobile, offline support.

AI / ML
───────
  • TensorFlow.js or a custom rules engine — muscle-strength analysis and
    workout plan generation.
  • OpenAI API (optional) — natural-language health tips and workout advice
    (NOT used for food/nutrition data — that is Foodoscope only).

================================================================================
                              APIS USED
================================================================================

1. Foodoscope API  (MANDATORY — SOLE SOURCE FOR ALL FOOD/NUTRITION DATA)
   ────────────────
   Purpose : The ONLY source of food recognition, recipe search, ingredient
             analysis, and nutritional data in the entire app.
   Usage   :
     • Search food / recipes by name → get full nutritional breakdown.
     • Fetch ingredient-level data for manual meal logging.
     • All calorie, protein, carbs, fat, vitamin data comes from here.
   Docs    : https://cosylab.iiitd.edu.in/foodoscope/
   Tooling : Postman collection provided by hackathon judges is used to
             explore and test all Foodoscope endpoints before integration.

2. Nutritionix API  (EXERCISE TRACKING ONLY — NOT for food/nutrition data)
   ─────────────────
   Purpose : Exercise calorie-burn estimation using their Natural Language
             Exercise endpoint. NOT used for any food or nutrition data.
   Usage   :
     • "I ran for 30 minutes" → returns estimated calories burned.
     • "50 push-ups" → returns calories burned for that exercise.

3. ExerciseDB API  (free, via RapidAPI)
   ────────────────
   Purpose : Database of 1300+ exercises with target muscle, equipment
             needed, and GIF demonstrations.
   Usage   :
     • Populate exercise library.
     • Filter exercises by equipment available at user's gym.
     • Map exercises to muscle groups for strength analysis.

4. Firebase Auth API
   ──────────────────
   Purpose : Secure user authentication (Google OAuth, email/password).

5. Samsung Health SDK / Apple HealthKit / Google Fit API
   ──────────────────────────────────────────────────────
   Purpose : Sync real-time health data (heart rate, steps, calories,
             sleep) from connected wearables and health platforms.
   Usage   :
     • Pull step count, heart-rate, and calorie data from user's watch.
     • Read sleep and SpO2 data for recovery analysis.
     • Fall back to built-in phone sensors when no wearable is paired.

6. OpenAI API  (optional enhancement)
   ─────────────
   Purpose : Generate natural-language health advice, meal suggestions,
             and motivational messages.

================================================================================
                           PROJECT STRUCTURE
================================================================================

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
│   │   ├── utils/              # Helper functions (calorie math, etc.)
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
├── README.txt                  # ← You are here
└── LICENSE

================================================================================
                         ENVIRONMENT VARIABLES
================================================================================

Create a `.env` file in both /client and /server with the following:

  # Server .env
  PORT=5000
  MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/fitfuel
  FOODOSCOPE_API_KEY=<your-foodoscope-api-key>
  FOODOSCOPE_BASE_URL=https://cosylab.iiitd.edu.in/foodoscope/api
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

================================================================================
                          HOW TO RUN LOCALLY
================================================================================

Prerequisites:
  • Node.js v18+
  • npm or yarn
  • MongoDB Atlas account (or local MongoDB instance)
  • Foodoscope API key

Steps:

  1. Clone the repository
     > git clone https://github.com/your-org/Ymca-Hackforce.git
     > cd Ymca-Hackforce

  2. Install server dependencies
     > cd server
     > npm install

  3. Install client dependencies
     > cd ../client
     > npm install

  4. Set up environment variables
     Copy .env.example to .env in both /server and /client and fill in your
     API keys and database URI.

  5. Start the backend
     > cd server
     > npm run dev

  6. Start the frontend (in a new terminal)
     > cd client
     > npm run dev

  7. Open the app
     Navigate to http://localhost:5173 in your browser.

================================================================================
                             TEAM
================================================================================

  Team Name : Ymca-Hackforce
  Members   : <Add team members here>

================================================================================
                            LICENSE
================================================================================

  This project is licensed under the MIT License — see the LICENSE file for
  details.

================================================================================
