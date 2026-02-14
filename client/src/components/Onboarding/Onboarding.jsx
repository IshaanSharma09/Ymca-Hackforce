import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
    MdPerson, MdFitnessCenter, MdFlag, MdWatch,
    MdArrowForward, MdArrowBack, MdCheck,
    MdMale, MdFemale, MdRestaurant, MdWarning
} from 'react-icons/md'
import './Onboarding.css'

const STEPS = [
    { id: 'profile', label: 'Profile', icon: MdPerson },
    { id: 'goals', label: 'Goals', icon: MdFlag },
    { id: 'diet', label: 'Diet', icon: MdRestaurant },
    { id: 'gym', label: 'Equipment', icon: MdFitnessCenter },
    { id: 'wearable', label: 'Wearable', icon: MdWatch }
]

const EQUIPMENT_LIST = [
    'Barbell', 'Dumbbells', 'Bench Press', 'Squat Rack', 'Pull-up Bar',
    'Cable Machine', 'Leg Press', 'Smith Machine', 'Treadmill', 'Rowing Machine',
    'Lat Pulldown', 'Leg Curl/Extension', 'Kettlebells', 'Resistance Bands',
    'Exercise Ball', 'Battle Ropes'
]

function Onboarding() {
    const { user, completeOnboarding } = useAuth()
    const [step, setStep] = useState(0)
    const [profile, setProfile] = useState({
        name: user?.displayName || '',
        age: '',
        gender: '',
        height: '',
        weight: '',
        activityLevel: '',
        goal: '',
        targetWeight: '',
        targetWeight: '',
        dietType: 'classic',
        allergies: [],
        customBlacklist: [],
        hasGym: null,
        equipment: [],
        wearable: 'none'
    })

    const [blacklistInput, setBlacklistInput] = useState('')

    const updateProfile = (key, value) => {
        setProfile(prev => ({ ...prev, [key]: value }))
    }

    const toggleEquipment = (item) => {
        setProfile(prev => ({
            ...prev,
            equipment: prev.equipment.includes(item)
                ? prev.equipment.filter(e => e !== item)
                : [...prev.equipment, item]
        }))
    }

    const toggleAllergy = (allergy) => {
        setProfile(prev => ({
            ...prev,
            allergies: prev.allergies.includes(allergy)
                ? prev.allergies.filter(a => a !== allergy)
                : [...prev.allergies, allergy]
        }))
    }

    const addBlacklistItem = () => {
        const item = blacklistInput.trim().toLowerCase()
        if (item && !profile.customBlacklist.includes(item)) {
            setProfile(prev => ({
                ...prev,
                customBlacklist: [...prev.customBlacklist, item]
            }))
        }
        setBlacklistInput('')
    }

    const removeBlacklistItem = (item) => {
        setProfile(prev => ({
            ...prev,
            customBlacklist: prev.customBlacklist.filter(b => b !== item)
        }))
    }

    const canProceed = () => {
        switch (step) {
            case 0: return profile.name && profile.age && profile.gender && profile.height && profile.weight
            case 1: return profile.activityLevel && profile.goal
            case 2: return true // Diet is optional (defaults to classic/none)
            case 3: return profile.hasGym !== null
            case 4: return true
            default: return false
        }
    }

    const handleFinish = () => {
        // Calculate BMR and TDEE
        const weight = parseFloat(profile.weight)
        const height = parseFloat(profile.height)
        const age = parseInt(profile.age)

        let bmr
        if (profile.gender === 'male') {
            bmr = Math.round(10 * weight + 6.25 * height - 5 * age + 5)
        } else {
            bmr = Math.round(10 * weight + 6.25 * height - 5 * age - 161)
        }

        const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 }
        const tdee = Math.round(bmr * multipliers[profile.activityLevel])

        let dailyCalorieTarget = tdee
        if (profile.goal === 'lose_fat') dailyCalorieTarget = tdee - 500
        if (profile.goal === 'build_muscle') dailyCalorieTarget = tdee + 300

        const finalProfile = {
            ...profile,
            bmr,
            tdee,
            dailyCalorieTarget,
            macroSplit: { protein: 40, carbs: 30, fat: 30 }
        }

        completeOnboarding(finalProfile)
    }

    return (
        <div className="onboarding-page">
            <div className="onboarding-card glass-card-static animate-scale-in">
                {/* Progress Steps */}
                <div className="onboarding-steps">
                    {STEPS.map((s, i) => {
                        const Icon = s.icon
                        return (
                            <div key={s.id} className={`onboarding-step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
                                <div className="onboarding-step__circle">
                                    {i < step ? <MdCheck /> : <Icon />}
                                </div>
                                <span className="onboarding-step__label">{s.label}</span>
                                {i < STEPS.length - 1 && <div className="onboarding-step__line" />}
                            </div>
                        )
                    })}
                </div>

                {/* Step Content */}
                <div className="onboarding-content animate-fade-in" key={step}>
                    {step === 0 && (
                        <>
                            <h2 className="heading-3">Tell us about yourself</h2>
                            <p className="text-muted text-sm">We'll use this to personalise your health plan</p>
                            <div className="onboarding-grid">
                                <div className="onboarding-field full-width">
                                    <label>Full Name</label>
                                    <input className="input-field" value={profile.name} onChange={e => updateProfile('name', e.target.value)} placeholder="Your name" />
                                </div>
                                <div className="onboarding-field">
                                    <label>Age</label>
                                    <input className="input-field" type="number" value={profile.age} onChange={e => updateProfile('age', e.target.value)} placeholder="25" min="10" max="100" />
                                </div>
                                <div className="onboarding-field">
                                    <label>Gender</label>
                                    <div className="onboarding-gender-btns">
                                        <button className={`onboarding-gender-btn ${profile.gender === 'male' ? 'selected' : ''}`} onClick={() => updateProfile('gender', 'male')}>
                                            <MdMale /> Male
                                        </button>
                                        <button className={`onboarding-gender-btn ${profile.gender === 'female' ? 'selected' : ''}`} onClick={() => updateProfile('gender', 'female')}>
                                            <MdFemale /> Female
                                        </button>
                                    </div>
                                </div>
                                <div className="onboarding-field">
                                    <label>Height (cm)</label>
                                    <input className="input-field" type="number" value={profile.height} onChange={e => updateProfile('height', e.target.value)} placeholder="175" min="100" max="250" />
                                </div>
                                <div className="onboarding-field">
                                    <label>Weight (kg)</label>
                                    <input className="input-field" type="number" value={profile.weight} onChange={e => updateProfile('weight', e.target.value)} placeholder="75" min="30" max="300" />
                                </div>
                            </div>
                        </>
                    )}

                    {step === 1 && (
                        <>
                            <h2 className="heading-3">What's your goal?</h2>
                            <p className="text-muted text-sm">We'll tailor your calorie targets and workout plans</p>
                            <div className="onboarding-options">
                                <label>Activity Level</label>
                                <div className="onboarding-option-grid">
                                    {[
                                        { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
                                        { value: 'light', label: 'Light', desc: '1-3 days/week' },
                                        { value: 'moderate', label: 'Moderate', desc: '3-5 days/week' },
                                        { value: 'active', label: 'Active', desc: '6-7 days/week' }
                                    ].map(opt => (
                                        <button key={opt.value} className={`onboarding-option ${profile.activityLevel === opt.value ? 'selected' : ''}`} onClick={() => updateProfile('activityLevel', opt.value)}>
                                            <strong>{opt.label}</strong>
                                            <span>{opt.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="onboarding-options">
                                <label>Fitness Goal</label>
                                <div className="onboarding-option-grid">
                                    {[
                                        { value: 'lose_fat', label: '🔥 Lose Fat', desc: 'Calorie deficit' },
                                        { value: 'build_muscle', label: '💪 Build Muscle', desc: 'Calorie surplus' },
                                        { value: 'maintain', label: '⚖️ Maintain', desc: 'Stay balanced' },
                                        { value: 'rehab', label: '🩹 Rehab', desc: 'Recovery focus' }
                                    ].map(opt => (
                                        <button key={opt.value} className={`onboarding-option ${profile.goal === opt.value ? 'selected' : ''}`} onClick={() => updateProfile('goal', opt.value)}>
                                            <strong>{opt.label}</strong>
                                            <span>{opt.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {profile.goal === 'lose_fat' && (
                                <div className="onboarding-field animate-fade-in">
                                    <label>Target Weight (kg)</label>
                                    <input className="input-field" type="number" value={profile.targetWeight} onChange={e => updateProfile('targetWeight', e.target.value)} placeholder="70" />
                                </div>
                            )}
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h2 className="heading-3">Any dietary preferences?</h2>
                            <p className="text-muted text-sm">We'll highlight allergens as 'Villains' to avoid!</p>

                            <div className="onboarding-options">
                                <label>Diet Type</label>
                                <div className="onboarding-option-grid">
                                    {[
                                        { value: 'classic', label: '🍖 Classic', desc: 'No restrictions' },
                                        { value: 'vegetarian', label: '🥦 Vegetarian', desc: 'No meat' },
                                        { value: 'vegan', label: '🌿 Vegan', desc: 'Plant-based only' },
                                    ].map(opt => (
                                        <button key={opt.value} className={`onboarding-option ${profile.dietType === opt.value ? 'selected' : ''}`} onClick={() => updateProfile('dietType', opt.value)}>
                                            <strong>{opt.label}</strong>
                                            <span>{opt.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="onboarding-equipment animate-fade-in">
                                <label>Allergies / Intolerances</label>
                                <div className="onboarding-equipment-grid">
                                    {['nuts', 'dairy', 'gluten', 'soy', 'egg', 'seafood'].map(item => (
                                        <button key={item} className={`onboarding-equip-chip ${profile.allergies.includes(item) ? 'selected' : ''}`} onClick={() => toggleAllergy(item)}>
                                            {profile.allergies.includes(item) && <MdWarning className="text-warning" />}
                                            {item.charAt(0).toUpperCase() + item.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="onboarding-equipment animate-fade-in">
                                <label>Custom Blacklist (specific ingredients to avoid)</label>
                                <p className="text-xs text-muted" style={{ marginBottom: 'var(--space-2)' }}>Type any ingredient you want to avoid — we'll flag recipes containing it</p>
                                <div className="onboarding-blacklist-input">
                                    <input
                                        className="input-field"
                                        placeholder="e.g. ajinomoto, palm oil, msg..."
                                        value={blacklistInput}
                                        onChange={e => setBlacklistInput(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addBlacklistItem() } }}
                                    />
                                    <button className="btn btn-primary btn-sm" onClick={addBlacklistItem} disabled={!blacklistInput.trim()}>+ Add</button>
                                </div>
                                {profile.customBlacklist.length > 0 && (
                                    <div className="onboarding-blacklist-chips">
                                        {profile.customBlacklist.map(item => (
                                            <span key={item} className="onboarding-blacklist-chip">
                                                🚫 {item}
                                                <button onClick={() => removeBlacklistItem(item)} className="onboarding-blacklist-remove">&times;</button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <h2 className="heading-3">Do you go to a gym?</h2>
                            <p className="text-muted text-sm">We'll customise workout plans based on available equipment</p>
                            <div className="onboarding-gym-toggle">
                                <button className={`onboarding-gym-btn ${profile.hasGym === true ? 'selected' : ''}`} onClick={() => updateProfile('hasGym', true)}>
                                    <span className="onboarding-gym-emoji">🏋️</span>
                                    <strong>Yes, I have gym access</strong>
                                    <span className="text-sm text-muted">Select your equipment below</span>
                                </button>
                                <button className={`onboarding-gym-btn ${profile.hasGym === false ? 'selected' : ''}`} onClick={() => { updateProfile('hasGym', false); updateProfile('equipment', []) }}>
                                    <span className="onboarding-gym-emoji">🏠</span>
                                    <strong>No gym — bodyweight only</strong>
                                    <span className="text-sm text-muted">We'll create equipment-free plans</span>
                                </button>
                            </div>
                            {profile.hasGym && (
                                <div className="onboarding-equipment animate-fade-in">
                                    <label>Select your gym equipment:</label>
                                    <div className="onboarding-equipment-grid">
                                        {EQUIPMENT_LIST.map(item => (
                                            <button key={item} className={`onboarding-equip-chip ${profile.equipment.includes(item) ? 'selected' : ''}`} onClick={() => toggleEquipment(item)}>
                                                {profile.equipment.includes(item) && <MdCheck />}
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {step === 4 && (
                        <>
                            <h2 className="heading-3">Do you have a health watch?</h2>
                            <p className="text-muted text-sm">We'll sync your real-time health data automatically</p>
                            <div className="onboarding-option-grid wearable-grid">
                                {[
                                    { value: 'samsung', label: '⌚ Samsung', desc: 'Galaxy Watch' },
                                    { value: 'apple', label: '⌚ Apple', desc: 'Apple Watch' },
                                    { value: 'google_fit', label: '⌚ Google Fit', desc: 'Wear OS' },
                                    { value: 'none', label: '📱 No Watch', desc: "Phone tracking" }
                                ].map(opt => (
                                    <button key={opt.value} className={`onboarding-option ${profile.wearable === opt.value ? 'selected' : ''}`} onClick={() => updateProfile('wearable', opt.value)}>
                                        <strong>{opt.label}</strong>
                                        <span>{opt.desc}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Summary Preview */}
                            <div className="onboarding-summary glass-card-static">
                                <h4 className="heading-4 text-gradient">Your Profile Summary</h4>
                                <div className="onboarding-summary-grid">
                                    <div><span className="text-muted">Name:</span> {profile.name}</div>
                                    <div><span className="text-muted">Age:</span> {profile.age}</div>
                                    <div><span className="text-muted">Height:</span> {profile.height} cm</div>
                                    <div><span className="text-muted">Weight:</span> {profile.weight} kg</div>
                                    <div><span className="text-muted">Activity:</span> {profile.activityLevel}</div>
                                    <div><span className="text-muted">Diet:</span> {profile.dietType}</div>
                                    <div><span className="text-muted">Allergies:</span> {profile.allergies.length ? profile.allergies.join(', ') : 'None'}</div>
                                    <div><span className="text-muted">Blacklist:</span> {profile.customBlacklist.length ? profile.customBlacklist.join(', ') : 'None'}</div>
                                    <div><span className="text-muted">Gym:</span> {profile.hasGym ? 'Yes' : 'No'}</div>
                                    <div><span className="text-muted">Watch:</span> {profile.wearable}</div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Navigation */}
                <div className="onboarding-nav">
                    {step > 0 && (
                        <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>
                            <MdArrowBack /> Back
                        </button>
                    )}
                    <div style={{ flex: 1 }} />
                    {step < STEPS.length - 1 ? (
                        <button className="btn btn-primary" onClick={() => setStep(s => s + 1)} disabled={!canProceed()}>
                            Next <MdArrowForward />
                        </button>
                    ) : (
                        <button className="btn btn-primary" onClick={handleFinish} disabled={!canProceed()}>
                            <MdCheck /> Start My Journey
                        </button>
                    )}
                </div>
            </div>

            <div className="login-bg-orb login-bg-orb--1" />
            <div className="login-bg-orb login-bg-orb--2" />
        </div>
    )
}

export default Onboarding
