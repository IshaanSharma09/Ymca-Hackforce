import { createContext, useContext, useState, useEffect } from 'react'
import { auth, googleProvider } from '../config/firebase'

const AuthContext = createContext()

// ── Local demo auth helpers ──
function getDemoUsers() {
    const saved = localStorage.getItem('fitfuel-demo-users')
    return saved ? JSON.parse(saved) : {}
}

function saveDemoUsers(users) {
    localStorage.setItem('fitfuel-demo-users', JSON.stringify(users))
}

function getDemoSession() {
    const saved = localStorage.getItem('fitfuel-demo-session')
    return saved ? JSON.parse(saved) : null
}

function saveDemoSession(user) {
    if (user) {
        localStorage.setItem('fitfuel-demo-session', JSON.stringify(user))
    } else {
        localStorage.removeItem('fitfuel-demo-session')
    }
}

// ── Firebase imports (only used when auth is available) ──
let onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
    signInWithPopup, signOut, updateProfile

async function loadFirebaseAuth() {
    try {
        const mod = await import('firebase/auth')
        onAuthStateChanged = mod.onAuthStateChanged
        signInWithEmailAndPassword = mod.signInWithEmailAndPassword
        createUserWithEmailAndPassword = mod.createUserWithEmailAndPassword
        signInWithPopup = mod.signInWithPopup
        signOut = mod.signOut
        updateProfile = mod.updateProfile
        return true
    } catch {
        return false
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [needsOnboarding, setNeedsOnboarding] = useState(false)
    const isFirebaseReady = !!auth

    useEffect(() => {
        if (!isFirebaseReady) {
            // Demo mode — restore session from localStorage
            const session = getDemoSession()
            if (session) {
                setUser(session)
                const onboarded = localStorage.getItem(`fitfuel-onboarded-${session.uid}`)
                setNeedsOnboarding(!onboarded)
            }
            setLoading(false)
            return
        }

        // Firebase mode
        let unsubscribe
        loadFirebaseAuth().then(() => {
            unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
                if (firebaseUser) {
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName,
                        photoURL: firebaseUser.photoURL
                    })
                    const onboarded = localStorage.getItem(`fitfuel-onboarded-${firebaseUser.uid}`)
                    setNeedsOnboarding(!onboarded)
                } else {
                    setUser(null)
                    setNeedsOnboarding(false)
                }
                setLoading(false)
            })
        })

        return () => { if (unsubscribe) unsubscribe() }
    }, [isFirebaseReady])

    const loginWithEmail = async (email, password) => {
        if (!isFirebaseReady) {
            // Demo mode login
            const users = getDemoUsers()
            const existing = users[email.toLowerCase()]
            if (!existing) throw { code: 'auth/user-not-found' }
            if (existing.password !== password) throw { code: 'auth/wrong-password' }
            const demoUser = { uid: existing.uid, email: existing.email, displayName: existing.displayName, photoURL: null }
            setUser(demoUser)
            saveDemoSession(demoUser)
            const onboarded = localStorage.getItem(`fitfuel-onboarded-${demoUser.uid}`)
            setNeedsOnboarding(!onboarded)
            return demoUser
        }
        await loadFirebaseAuth()
        const result = await signInWithEmailAndPassword(auth, email, password)
        return result.user
    }

    const signupWithEmail = async (email, password, name) => {
        if (!isFirebaseReady) {
            // Demo mode signup
            const users = getDemoUsers()
            if (users[email.toLowerCase()]) throw { code: 'auth/email-already-in-use' }
            if (password.length < 6) throw { code: 'auth/weak-password' }
            const uid = 'demo-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8)
            const newUser = { uid, email: email.toLowerCase(), displayName: name, password }
            users[email.toLowerCase()] = newUser
            saveDemoUsers(users)
            const demoUser = { uid, email: email.toLowerCase(), displayName: name, photoURL: null }
            setUser(demoUser)
            saveDemoSession(demoUser)
            setNeedsOnboarding(true)
            return demoUser
        }
        await loadFirebaseAuth()
        const result = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(result.user, { displayName: name })
        setUser(prev => ({ ...prev, displayName: name }))
        setNeedsOnboarding(true)
        return result.user
    }

    const loginWithGoogle = async () => {
        if (!isFirebaseReady) {
            // Demo mode — simulate a Google user
            const uid = 'google-demo-' + Date.now()
            const demoUser = { uid, email: 'demo@gmail.com', displayName: 'Demo User', photoURL: null }
            setUser(demoUser)
            saveDemoSession(demoUser)
            setNeedsOnboarding(true)
            return demoUser
        }
        await loadFirebaseAuth()
        const result = await signInWithPopup(auth, googleProvider)
        const onboarded = localStorage.getItem(`fitfuel-onboarded-${result.user.uid}`)
        setNeedsOnboarding(!onboarded)
        return result.user
    }

    const logout = async () => {
        if (isFirebaseReady && auth) {
            await loadFirebaseAuth()
            await signOut(auth)
        }
        saveDemoSession(null)
        setUser(null)
    }

    const completeOnboarding = (profileData) => {
        localStorage.setItem(`fitfuel-onboarded-${user.uid}`, 'true')
        localStorage.setItem(`fitfuel-profile-${user.uid}`, JSON.stringify(profileData))
        setNeedsOnboarding(false)
    }

    const getUserProfile = () => {
        if (!user) return null
        const saved = localStorage.getItem(`fitfuel-profile-${user.uid}`)
        return saved ? JSON.parse(saved) : null
    }

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            needsOnboarding,
            loginWithEmail,
            signupWithEmail,
            loginWithGoogle,
            logout,
            completeOnboarding,
            getUserProfile
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}
