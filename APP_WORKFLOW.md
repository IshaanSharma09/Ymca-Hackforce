<h1 align="center">📱 FitFuel — Complete App Workflow</h1>
<p align="center"><i>From Login to End-of-Day Health Report</i></p>

---

## Step 1 — 🔐 Sign Up / Login

User opens the FitFuel app (PWA or browser).

<details>
<summary><b>👤 New User — Onboarding Flow</b></summary>

1. Sign up with **Google** or **Email** via Firebase Auth
2. Onboarding wizard collects:
   - Name, Age, Gender
   - Height (cm), Weight (kg)
   - Activity level: `Sedentary` / `Light` / `Moderate` / `Active`
   - Goal: `Lose Fat` / `Build Muscle` / `Maintain` / `Rehab`
   - **Do you go to a gym?**
     - ✅ YES → select equipment your gym has (from checklist)
     - ❌ NO → bodyweight-only plans will be created
   - **Do you have a health watch?** Select: `Samsung` / `Apple` / `Google Fit` / `None`
3. App calculates **BMR, TDEE, daily calorie target, macro split**
4. Lands on the **Dashboard**

</details>

<details>
<summary><b>🔄 Returning User</b></summary>

1. Login with Google / Email → straight to **Dashboard**

</details>

---

## Step 2 — 🌅 Morning: Dashboard Overview

When the user opens the app each morning, they see:

```
┌── DASHBOARD ──────────────────────────────────────────────┐
│                                                            │
│  DAILY CALORIE TARGET:  2,200 kcal                        │
│  ┌────────────────────────────────────────┐               │
│  │ Eaten: 0 kcal     Burned: 0 kcal      │               │
│  │ Balance: 0 kcal   Goal: -300 kcal     │               │
│  └────────────────────────────────────────┘               │
│                                                            │
│  Macro Split:   Protein 40% | Carbs 30% | Fat 30%        │
│  Steps Today:   0 / 10,000                                │
│  Water Intake:  0 / 8 glasses                             │
│                                                            │
│  [+ LOG MEAL]   [+ LOG EXERCISE]   [+ LOG WATER]         │
│                                                            │
│  🍗 RECIPE OF THE DAY: "Tandoori Chicken" (280 kcal)     │
│  (fetched from Foodoscope: /recipe/recipeofday)           │
│                                                            │
└───────────────────────────────────────────────────────────┘
```

---

## Step 3 — 🍽️ Logging Meals (Breakfast / Lunch / Snack / Dinner)

User taps **`[+ LOG MEAL]`** → chooses meal type

### Option A: Search & Add Manually *(primary method)*

> This is how users **manually add any dish** — including items hidden from camera or home-cooked meals.

1. User types: **"Butter Chicken"**
2. App calls Foodoscope RecipeDB API:
   ```http
   GET /recipe2-api/recipe/recipesinfo?search=butter+chicken
   Authorization: Bearer <API_KEY>
   ```
3. Returns matching recipes:

   | Field | Value |
   |-------|-------|
   | Recipe_title | Butter Chicken |
   | Calories | 490 kcal (per serving) |
   | Protein | 38g |
   | Carbs | 12g |
   | Fat | 32g |
   | Servings | 4 |

4. User selects recipe, chooses portions → App logs: **490 kcal, 38g protein, 12g carbs, 32g fat**

5. For **full nutrition detail**, app also calls:
   ```http
   GET /recipe2-api/recipe-nutri/nutritioninfo?recipeId=<id>
   ```
   → Returns per-ingredient: calcium, iron, vitamins, sodium, cholesterol, fiber, sugar, fatty acids

6. For **micronutrients**:
   ```http
   GET /recipe2-api/recipe-micronutri/micronutritioninfo
   ```
   → Returns: amino acids, vitamins (A, B6, B12, C, D, E, K), minerals, phytosterols

### Option B: Browse by Category

```
User browses: Indian → North Indian → Vegetarian
```
```http
GET /recipe2-api/recipe/recipebycategory?Region=Indian
```
→ Shows filtered recipe list with calories → User picks and logs

### Option C: Calorie / Protein Filter

> *"Show me meals under 300 kcal with 20g+ protein"*

```http
GET /recipe2-api/recipe/recipebycalories?minCalories=0&maxCalories=300
GET /recipe2-api/recipe/recipebyproteinrange?minProtein=20
```
→ Shows matching healthy options → User picks and logs

**After logging, dashboard updates in real-time:**
> Eaten: 490 kcal | Protein: 38g | Carbs: 12g | Fat: 32g
> Balance: +490 kcal consumed, 0 burned → net +490

---

## Step 4 — 🚶 Step & Activity Tracking *(All Day, Automatic)*

Running in the background all day:

| Mode | How It Works |
|------|-------------|
| **⌚ With Health Watch** | Auto-syncs steps, heart rate, calories burned, SpO2, sleep from Samsung / Apple / Google Fit |
| **📱 Without Watch** | Phone's accelerometer counts steps. FitFuel estimates calories using MET formula: `Calories = MET × weight(kg) × time(hours)` |

**Dashboard updates:**
```
Steps: 6,500 / 10,000  ████████░░  65%
Calories Burned (walking): 260 kcal
```

---

## Step 5 — 🏋️ Gym / Exercise Logging

User taps **`[+ LOG EXERCISE]`** → picks workout type:

### Gym Workout

User selects exercises from library (powered by **ExerciseDB**):

| Exercise | Sets | Reps | Weight | MET | Cals Burned |
|----------|------|------|--------|-----|-------------|
| Bench Press | 4 | 10 | 60 kg | 6.0 | 120 kcal |
| Squats | 4 | 12 | 80 kg | 6.0 | 140 kcal |
| Bicep Curls | 3 | 15 | 12 kg | 3.5 | 45 kcal |
| Lat Pulldown | 3 | 10 | 50 kg | 4.5 | 60 kcal |
| **TOTAL** | **14** | **47** | | | **365 kcal** |

Each exercise maps to target muscles:
- Bench Press → **Chest** (primary), Triceps, Shoulders
- Squats → **Quads** (primary), Glutes, Hamstrings
- Bicep Curls → **Biceps** (primary)
- Lat Pulldown → **Back** (primary), Biceps

### Home / Bodyweight Workout
| Exercise | Sets × Reps | Cals Burned |
|----------|------------|-------------|
| Push-ups | 3 × 20 | 60 kcal |
| Sit-ups | 3 × 25 | 40 kcal |
| Burpees | 3 × 10 | 80 kcal |

### Cardio
| Activity | Duration | Cals Burned |
|----------|----------|-------------|
| Running | 30 min | 315 kcal (MET 9.8) |
| Cycling | 20 min | 180 kcal (MET 7.5) |

---

## Step 6 — 💪 Muscle Strength Analysis *(Automatic)*

After logging workouts over days/weeks, the app builds a muscle profile:

```
🔥 MUSCLE HEATMAP
──────────────────
  SHOULDERS   → ███████░░░  72% (moderate)
  CHEST       → █████████░  88% (STRONG) ✅
  BACK        → ████░░░░░░  45% (WEAK ⚠️)
  BICEPS      → ████████░░  80% (good)
  TRICEPS     → █████░░░░░  55% (below average)
  CORE        → ██████░░░░  60% (moderate)
  QUADS       → █████████░  85% (STRONG) ✅
  HAMSTRINGS  → ████░░░░░░  40% (WEAK ⚠️)
  CALVES      → ███░░░░░░░  35% (WEAK ⚠️)
```

> [!WARNING]
> **Imbalance Detected:**
> - Push (chest 88%) vs Pull (back 45%) — add more rows/pulls
> - Quads (85%) vs Hamstrings (40%) — add Romanian deadlifts

---

## Step 7 — 📋 Smart Workout Plan *(Personalised Weekly Plan)*

Based on: user's goal, weak muscles, gym equipment available

<details>
<summary><b>🏋️ With Gym Equipment — Sample Week 12</b></summary>

| Day | Focus | Exercises |
|-----|-------|-----------|
| **Monday** | Back & Biceps *(targeting weak area!)* | Barbell Row 4×10, Lat Pulldown 3×12, Seated Cable Row 3×12, Barbell Curl 3×12, Hammer Curl 3×15 |
| **Tuesday** | Legs *(focus: hamstrings & calves)* | Squats 4×10, Romanian Deadlift 4×10 ←*weak*, Leg Curl 3×12 ←*weak*, Calf Raises 4×15 ←*weak* |
| **Wednesday** | Rest | — |
| **Thursday** | Chest & Triceps | *customised exercises* |
| **Friday** | Shoulders & Core | *customised exercises* |
| **Saturday** | Full Body / Cardio | *customised exercises* |
| **Sunday** | Rest | — |

*Progressive overload: +2.5 kg on compounds next week*

</details>

<details>
<summary><b>🏠 No Gym Equipment — Bodyweight Plan</b></summary>

| Day | Focus | Exercises |
|-----|-------|-----------|
| **Monday** | Upper Body | Push-ups 4×20, Diamond Push-ups 3×15, Pike Push-ups 3×12, Superman 3×15 ←*weak back*, Inverted Rows 3×10 |
| **Tuesday** | Lower Body | BW Squats 4×20, Single-leg RDL 3×12 ←*weak hamstrings*, Wall Sit 3×45s, Calf Raises 4×25 ←*weak calves* |

</details>

---

## Step 8 — 🥗 Meal Planning *(Powered by Foodoscope)*

User can generate a meal plan to hit their nutrition targets:

```http
POST /recipe2-api/recipe/recipemealplan
Body: { calories, protein, carbs, fat, preferences }
```

| Meal | Food | Calories | Protein |
|------|------|----------|---------|
| **Breakfast** | Oatmeal with Banana + 2 Boiled Eggs | 500 kcal | 26g |
| **Lunch** | Grilled Chicken Rice Bowl + Side Salad | 700 kcal | 45g |
| **Snack** | Greek Yogurt + Almonds | 300 kcal | 18g |
| **Dinner** | Dal + Roti + Sabzi | 600 kcal | 25g |
| **TOTAL** | | **2,100 kcal** | **114g** |

> **Target: 2,200 kcal → Deficit of 100 kcal (on track! ✅)**

---

## Step 9 — 📊 End of Day: Daily Health Report

At end of day (or anytime), user views the **Daily Report**:

### 📊 Calorie Summary
| Metric | Value |
|--------|-------|
| Consumed | 2,050 kcal |
| Burned (steps) | 260 kcal |
| Burned (exercise) | 365 kcal |
| Burned (BMR) | 1,800 kcal |
| **NET BALANCE** | **-375 kcal (DEFICIT ✅)** |

### 🥩 Macro Breakdown
| Macro | Actual | Target | Status |
|-------|--------|--------|--------|
| Protein | 110g | 110g | ✅ 100% |
| Carbs | 200g | 165g | ⚠️ 121% |
| Fat | 58g | 73g | ✅ 79% |
| Sugar | 25g | — | ✅ within limit |
| Fiber | 22g | 25g | 88% |

### 💊 Micronutrient Check
| Nutrient | Actual | RDA | Status |
|----------|--------|-----|--------|
| Vitamin C | 85mg | 75mg | ✅ Good |
| Iron | 8mg | 18mg | ⚠️ Low — eat more spinach |
| Calcium | 600mg | 1000mg | ⚠️ Low — add dairy |
| Vitamin D | 10IU | 600IU | ⚠️ Low — sunlight/supplement |
| Sodium | 1,800mg | 2,300mg | ✅ Within limit |
| Cholesterol | 180mg | 300mg | ✅ Within limit |

### 🏃 Activity Summary
- **Steps:** 8,200 / 10,000 (82%)
- **Active minutes:** 75 min
- **Exercise:** Bench Press, Squats, Bicep Curls, Lat Pulldown
- **Total:** 14 sets | 47 reps | 3,020 kg volume

### 💪 Muscle Impact Today
- **Worked:** Chest ✅ Quads ✅ Biceps ✅ Back ✅
- **Missed:** Shoulders, Triceps, Core, Hamstrings, Calves
- **Weekly coverage:** 6/9 muscle groups

### 🎯 Recommendation
> *"Great job hitting your protein target! Tomorrow, focus on iron-rich foods (spinach, lentils) and add hamstring exercises (Romanian Deadlifts) to balance your leg strength."*

### Additional
- 💧 **Water:** 6 / 8 glasses (need 2 more)
- 😴 **Sleep:** 7.5 hrs — Good!
- 📈 **Health Score:** 78 / 100 | Nutrition: 82 | Activity: 75 | Recovery: 76

### 🎯 Calorie Recommendation for Perfect Body

> **Goal:** Lose Fat (target: 75 kg, current: 82 kg)
> **Need:** daily deficit of ~500 kcal
> **Today:** achieved -375 kcal → add 125 kcal more deficit tomorrow

**Options:**
- Walk 2,000 more steps (~80 kcal)
- OR swap dinner roti with salad (~100 kcal saved)

---

## Step 10 — 📈 Weekly / Monthly Trends

| Metric | This Week |
|--------|-----------|
| Weight | 82.0 → 81.6 kg (↓ 0.4 kg) |
| Avg Calories | 2,100 consumed / 2,500 burned |
| Avg Steps | 7,800 / day |
| Workout Volume | 12,500 kg total |

**Charts available:**
- 📉 Line graph: daily calories in vs out (7 days)
- 📊 Bar chart: macro split per day
- 📈 Stacked area: muscle groups trained per week
- ⭕ Progress ring: weekly goals completion

---

## 🔧 Foodoscope API — Technical Reference

| Config | Value |
|--------|-------|
| **Base URL** | `http://cosylab.iiitd.edu.in:6969` |
| **Auth** | `Authorization: Bearer <API_KEY>` |
| **Rate Limit** | 25 requests per window |

### RecipeDB Endpoints

| # | Method | Endpoint | Purpose |
|---|--------|----------|---------|
| 1 | `GET` | `/recipe2-api/recipe/recipesinfo` | Browse/search all 118K+ recipes |
| 2 | `GET` | `/recipe2-api/recipe/recipeofday` | Recipe of the day |
| 3 | `GET` | `/recipe2-api/recipe/recipe-day/with-ingredients-categories` | Recipe of day with filters |
| 4 | `GET` | `/recipe2-api/recipe-nutri/nutritioninfo` | Macro nutrition per ingredient |
| 5 | `GET` | `/recipe2-api/recipe-micronutri/micronutritioninfo` | Micro nutrition (vitamins, minerals, amino acids) |
| 6 | `GET` | `/recipe2-api/recipe/recipebycategory` | Filter by region/cuisine |
| 7 | `GET` | `/recipe2-api/recipe/recipebyid` | Get specific recipe |
| 8 | `GET` | `/recipe2-api/recipe/recipebyproteinrange` | Filter by protein range |
| 9 | `GET` | `/recipe2-api/recipe/recipebycalories` | Filter by calorie range |
| 10 | `POST` | `/recipe2-api/recipe/recipemealplan` | Generate meal plans |

### FlavorDB Endpoints

| # | Controller | Purpose |
|---|-----------|---------|
| 1 | Entity Controller | Get food entities and categories |
| 2 | Food Pairing | Suggest food pairings for variety |
| 3 | Molecule Controller | Flavor compound data |
| 4 | Property Controller | Taste properties of ingredients |

### Data Fields Per Recipe

- `Recipe_title`, `Calories`, `Protein (g)`, `Carbs (g)`, `Fat (g)`
- `cook_time`, `prep_time`, `total_time`, `servings`
- `Region`, `Sub_region`, `Continent`
- Ingredients list with individual nutrition
- 40+ micronutrients: vitamins A/B/C/D/E/K, iron, calcium, zinc, magnesium, sodium, cholesterol, fiber, sugar, fatty acids, amino acids, phytosterols
- `vegan` / `vegetarian` / `pescetarian` flags
- Utensils and Processes
