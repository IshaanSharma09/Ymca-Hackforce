import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { DailyLogProvider } from './context/DailyLogContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider>
            <AuthProvider>
                <DailyLogProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </DailyLogProvider>
            </AuthProvider>
        </ThemeProvider>
    </React.StrictMode>
)
