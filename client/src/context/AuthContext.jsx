import { createContext, useContext, useState, useEffect } from 'react'
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile
} from 'firebase/auth'
import { auth, googleProvider } from '../config/firebase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [needsOnboarding, setNeedsOnboarding] = useState(false)

    useEffect(() => {
        // If Firebase auth is not configured, go straight to demo mode
        if (!auth) {
            console.warn('Firebase not configured — running in demo mode')
            setLoading(false)
            return
        }

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL
                })
                // Check if user has completed onboarding
                const onboarded = localStorage.getItem(`fitfuel-onboarded-${firebaseUser.uid}`)
                setNeedsOnboarding(!onboarded)
            } else {
                setUser(null)
                setNeedsOnboarding(false)
            }
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    const loginWithEmail = async (email, password) => {
        if (!auth) throw new Error('Firebase not configured')
        const result = await signInWithEmailAndPassword(auth, email, password)
        return result.user
    }

    const signupWithEmail = async (email, password, name) => {
        if (!auth) throw new Error('Firebase not configured')
        const result = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(result.user, { displayName: name })
        setUser(prev => ({ ...prev, displayName: name }))
        setNeedsOnboarding(true)
        return result.user
    }

    const loginWithGoogle = async () => {
        if (!auth) throw new Error('Firebase not configured')
        const result = await signInWithPopup(auth, googleProvider)
        const onboarded = localStorage.getItem(`fitfuel-onboarded-${result.user.uid}`)
        setNeedsOnboarding(!onboarded)
        return result.user
    }

    const logout = async () => {
        if (auth) {
            await signOut(auth)
        }
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
