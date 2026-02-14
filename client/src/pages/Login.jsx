import { MdLocalFireDepartment } from 'react-icons/md'
import './Login.css'

function Login() {
    return (
        <div className="login-page">
            <div className="login-card glass-card-static animate-scale-in">
                <div className="login-logo">
                    <div className="login-logo__icon">
                        <MdLocalFireDepartment />
                    </div>
                    <h1 className="login-logo__text text-gradient">FitFuel</h1>
                    <p className="text-muted text-sm">Your AI Health Companion</p>
                </div>

                <div className="login-form">
                    <div className="login-field">
                        <label className="login-label">Email</label>
                        <input type="email" className="input-field" placeholder="you@example.com" />
                    </div>
                    <div className="login-field">
                        <label className="login-label">Password</label>
                        <input type="password" className="input-field" placeholder="••••••••" />
                    </div>
                    <button className="btn btn-primary login-btn">Sign In</button>

                    <div className="login-divider">
                        <span>or</span>
                    </div>

                    <button className="btn btn-secondary login-btn login-google">
                        <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18Z" /><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17Z" /><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07Z" /><path fill="#EA4335" d="M8.98 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.9Z" /></svg>
                        Continue with Google
                    </button>
                </div>

                <p className="login-footer text-sm text-muted">
                    Don't have an account? <a href="#" className="text-gradient" style={{ fontWeight: 600 }}>Sign Up</a>
                </p>
            </div>

            {/* Decorative elements */}
            <div className="login-bg-orb login-bg-orb--1" />
            <div className="login-bg-orb login-bg-orb--2" />
            <div className="login-bg-orb login-bg-orb--3" />
        </div>
    )
}

export default Login
