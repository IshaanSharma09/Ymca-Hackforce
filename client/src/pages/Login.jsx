import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdLocalFireDepartment, MdVisibility, MdVisibilityOff, MdEmail, MdLock, MdPerson } from 'react-icons/md'
import { useAuth } from '../context/AuthContext'
import './Login.css'

function Login() {
    const [isSignup, setIsSignup] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { loginWithEmail, signupWithEmail, loginWithGoogle } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            if (isSignup) {
                if (!name.trim()) {
                    setError('Please enter your name')
                    setLoading(false)
                    return
                }
                await signupWithEmail(email, password, name)
            } else {
                await loginWithEmail(email, password)
            }
            navigate('/')
        } catch (err) {
            const errorMessages = {
                'auth/user-not-found': 'No account found with this email',
                'auth/wrong-password': 'Incorrect password',
                'auth/email-already-in-use': 'Email already registered — try logging in',
                'auth/weak-password': 'Password must be at least 6 characters',
                'auth/invalid-email': 'Invalid email address',
                'auth/invalid-credential': 'Invalid email or password',
                'auth/too-many-requests': 'Too many attempts — try again later'
            }
            setError(errorMessages[err.code] || err.message)
        }
        setLoading(false)
    }

    const handleGoogleLogin = async () => {
        setError('')
        setLoading(true)
        try {
            await loginWithGoogle()
            navigate('/')
        } catch (err) {
            if (err.code !== 'auth/popup-closed-by-user') {
                setError('Google sign-in failed. Please try again.')
            }
        }
        setLoading(false)
    }

    return (
        <div className="login-page">
            <div className="login-card glass-card-static animate-scale-in">
                {/* Logo */}
                <div className="login-logo">
                    <div className="login-logo__icon">
                        <MdLocalFireDepartment />
                    </div>
                    <h1 className="login-logo__text text-gradient">FitFuel</h1>
                    <p className="text-muted text-sm">Your AI Health Companion</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="login-error animate-fade-in">
                        <span>⚠️ {error}</span>
                    </div>
                )}

                {/* Form */}
                <form className="login-form" onSubmit={handleSubmit}>
                    {isSignup && (
                        <div className="login-field animate-fade-in">
                            <label className="login-label">Full Name</label>
                            <div className="login-input-wrapper">
                                <MdPerson className="login-input-icon" />
                                <input
                                    type="text"
                                    className="input-field login-input-with-icon"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <div className="login-field">
                        <label className="login-label">Email</label>
                        <div className="login-input-wrapper">
                            <MdEmail className="login-input-icon" />
                            <input
                                type="email"
                                className="input-field login-input-with-icon"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="login-field">
                        <label className="login-label">Password</label>
                        <div className="login-input-wrapper">
                            <MdLock className="login-input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="input-field login-input-with-icon"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                className="login-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                            </button>
                        </div>
                    </div>

                    <button className="btn btn-primary login-btn" disabled={loading}>
                        {loading ? (
                            <span className="login-spinner" />
                        ) : (
                            isSignup ? 'Create Account' : 'Sign In'
                        )}
                    </button>

                    <div className="login-divider">
                        <span>or</span>
                    </div>

                    <button
                        type="button"
                        className="btn btn-secondary login-btn login-google"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18">
                            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18Z" />
                            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17Z" />
                            <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07Z" />
                            <path fill="#EA4335" d="M8.98 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.9Z" />
                        </svg>
                        Continue with Google
                    </button>
                </form>

                {/* Toggle */}
                <p className="login-footer text-sm text-muted">
                    {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                    <button
                        type="button"
                        className="login-toggle-link text-gradient"
                        onClick={() => { setIsSignup(!isSignup); setError('') }}
                    >
                        {isSignup ? 'Sign In' : 'Sign Up'}
                    </button>
                </p>
            </div>

            {/* Background orbs */}
            <div className="login-bg-orb login-bg-orb--1" />
            <div className="login-bg-orb login-bg-orb--2" />
            <div className="login-bg-orb login-bg-orb--3" />
        </div>
    )
}

export default Login
