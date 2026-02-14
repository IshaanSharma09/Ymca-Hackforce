import React from 'react'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        console.error('FitFuel Error:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#0b0f19',
                    color: '#f1f5f9',
                    fontFamily: 'Inter, sans-serif',
                    gap: '1rem',
                    padding: '2rem'
                }}>
                    <div style={{
                        width: 56,
                        height: 56,
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, #00e5a0, #00b4ff)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.8rem'
                    }}>
                        🔥
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Something went wrong</h1>
                    <p style={{ color: '#94a3b8', maxWidth: 400, textAlign: 'center', lineHeight: 1.6 }}>
                        FitFuel encountered an error. This usually means the Firebase configuration isn't set up yet.
                    </p>
                    <details style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 12,
                        padding: '1rem',
                        maxWidth: 500,
                        width: '100%',
                        color: '#f87171',
                        fontSize: '0.85rem'
                    }}>
                        <summary style={{ cursor: 'pointer', color: '#94a3b8', marginBottom: '0.5rem' }}>Error Details</summary>
                        <code style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                            {this.state.error?.toString()}
                        </code>
                    </details>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '0.5rem',
                            padding: '0.75rem 2rem',
                            borderRadius: 999,
                            border: 'none',
                            background: 'linear-gradient(135deg, #00e5a0, #00b4ff)',
                            color: '#0b0f19',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            cursor: 'pointer'
                        }}
                    >
                        Reload Page
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
