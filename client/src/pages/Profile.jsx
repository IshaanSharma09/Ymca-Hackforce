import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateProfile, updateEmail, updatePassword, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { auth } from '../config/firebase'
import { useAuth } from '../context/AuthContext'
import {
    MdPerson, MdEmail, MdLock, MdLogout, MdDeleteForever,
    MdEdit, MdSave, MdClose, MdFitnessCenter, MdFlag,
    MdWatch, MdScale, MdHeight, MdCake, MdCheck, MdWarning, MdAdd
} from 'react-icons/md'
import './Profile.css'

function Profile() {
    const { user, logout, getUserProfile } = useAuth()
    const navigate = useNavigate()
    const profile = getUserProfile() || {}

    // Editable states
    const [editingName, setEditingName] = useState(false)
    const [editingEmail, setEditingEmail] = useState(false)
    const [changingPassword, setChangingPassword] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const [newName, setNewName] = useState(user?.displayName || '')
    const [newEmail, setNewEmail] = useState(user?.email || '')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [message, setMessage] = useState({ text: '', type: '' })
    const [loading, setLoading] = useState(false)
    const [blacklistInput, setBlacklistInput] = useState('')
    const [localBlacklist, setLocalBlacklist] = useState(profile.customBlacklist || [])

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type })
        setTimeout(() => setMessage({ text: '', type: '' }), 4000)
    }

    // Save blacklist to profile in localStorage
    const syncBlacklist = (newList) => {
        setLocalBlacklist(newList)
        const profileKey = `fitfuel-profile-${user.uid}`
        const stored = JSON.parse(localStorage.getItem(profileKey) || '{}')
        stored.customBlacklist = newList
        localStorage.setItem(profileKey, JSON.stringify(stored))
    }

    const addBlacklistItem = () => {
        const item = blacklistInput.trim().toLowerCase()
        if (item && !localBlacklist.includes(item)) {
            syncBlacklist([...localBlacklist, item])
            showMessage(`"${item}" added to blacklist`)
        }
        setBlacklistInput('')
    }

    const removeBlacklistItem = (item) => {
        syncBlacklist(localBlacklist.filter(b => b !== item))
        showMessage(`"${item}" removed from blacklist`)
    }

    // Update display name
    const handleUpdateName = async () => {
        if (!newName.trim()) return
        setLoading(true)
        try {
            await updateProfile(auth.currentUser, { displayName: newName })
            setEditingName(false)
            showMessage('Name updated successfully!')
        } catch (err) {
            showMessage(err.message, 'error')
        }
        setLoading(false)
    }

    // Update email
    const handleUpdateEmail = async () => {
        if (!newEmail.trim()) return
        setLoading(true)
        try {
            await updateEmail(auth.currentUser, newEmail)
            setEditingEmail(false)
            showMessage('Email updated successfully!')
        } catch (err) {
            if (err.code === 'auth/requires-recent-login') {
                showMessage('Please log out and log back in to change email', 'error')
            } else {
                showMessage(err.message, 'error')
            }
        }
        setLoading(false)
    }

    // Change password
    const handleChangePassword = async () => {
        if (newPassword.length < 6) {
            showMessage('Password must be at least 6 characters', 'error')
            return
        }
        if (newPassword !== confirmPassword) {
            showMessage('Passwords do not match', 'error')
            return
        }
        setLoading(true)
        try {
            // Re-authenticate first
            const credential = EmailAuthProvider.credential(user.email, currentPassword)
            await reauthenticateWithCredential(auth.currentUser, credential)
            await updatePassword(auth.currentUser, newPassword)
            setChangingPassword(false)
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
            showMessage('Password changed successfully!')
        } catch (err) {
            if (err.code === 'auth/wrong-password') {
                showMessage('Current password is incorrect', 'error')
            } else if (err.code === 'auth/requires-recent-login') {
                showMessage('Please log out and log back in first', 'error')
            } else {
                showMessage(err.message, 'error')
            }
        }
        setLoading(false)
    }

    // Logout
    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    // Delete account
    const handleDeleteAccount = async () => {
        setLoading(true)
        try {
            await deleteUser(auth.currentUser)
            localStorage.removeItem(`fitfuel-onboarded-${user.uid}`)
            localStorage.removeItem(`fitfuel-profile-${user.uid}`)
            navigate('/login')
        } catch (err) {
            if (err.code === 'auth/requires-recent-login') {
                showMessage('Please log out and log back in to delete account', 'error')
            } else {
                showMessage(err.message, 'error')
            }
        }
        setLoading(false)
        setShowDeleteConfirm(false)
    }

    // Get user initial
    const getInitial = () => {
        const name = user?.displayName || user?.email || 'U'
        return name.charAt(0).toUpperCase()
    }

    return (
        <div className="page animate-fade-in">
            <div className="page__header">
                <div>
                    <h1 className="heading-2">Profile 👤</h1>
                    <p className="text-muted text-sm">Manage your account and fitness settings</p>
                </div>
            </div>

            {/* Status Message */}
            {message.text && (
                <div className={`profile-message profile-message--${message.type} animate-fade-in`}>
                    {message.type === 'success' ? <MdCheck /> : '⚠️'} {message.text}
                </div>
            )}

            <div className="profile-layout">
                {/* Left Column — Account */}
                <div className="profile-column">
                    {/* Avatar Card */}
                    <div className="glass-card-static profile-avatar-card">
                        <div className="profile-avatar-large">
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="Avatar" className="profile-avatar-img" />
                            ) : (
                                <span>{getInitial()}</span>
                            )}
                        </div>
                        <h3 className="heading-4">{user?.displayName || 'User'}</h3>
                        <p className="text-muted text-sm">{user?.email}</p>
                        <span className="badge badge-success">Active</span>
                    </div>

                    {/* Account Settings */}
                    <div className="glass-card-static profile-section">
                        <h4 className="profile-section__title">Account Settings</h4>

                        {/* Name */}
                        <div className="profile-row">
                            <div className="profile-row__icon"><MdPerson /></div>
                            <div className="profile-row__content">
                                <span className="profile-row__label">Display Name</span>
                                {editingName ? (
                                    <div className="profile-row__edit">
                                        <input className="input-field" value={newName} onChange={e => setNewName(e.target.value)} />
                                        <button className="btn-icon" onClick={handleUpdateName} disabled={loading}><MdSave /></button>
                                        <button className="btn-icon" onClick={() => setEditingName(false)}><MdClose /></button>
                                    </div>
                                ) : (
                                    <div className="profile-row__value">
                                        <span>{user?.displayName || 'Not set'}</span>
                                        <button className="btn-icon" onClick={() => setEditingName(true)}><MdEdit /></button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="profile-row">
                            <div className="profile-row__icon"><MdEmail /></div>
                            <div className="profile-row__content">
                                <span className="profile-row__label">Email</span>
                                {editingEmail ? (
                                    <div className="profile-row__edit">
                                        <input className="input-field" type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
                                        <button className="btn-icon" onClick={handleUpdateEmail} disabled={loading}><MdSave /></button>
                                        <button className="btn-icon" onClick={() => setEditingEmail(false)}><MdClose /></button>
                                    </div>
                                ) : (
                                    <div className="profile-row__value">
                                        <span>{user?.email}</span>
                                        <button className="btn-icon" onClick={() => setEditingEmail(true)}><MdEdit /></button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Password */}
                        <div className="profile-row">
                            <div className="profile-row__icon"><MdLock /></div>
                            <div className="profile-row__content">
                                <span className="profile-row__label">Password</span>
                                {changingPassword ? (
                                    <div className="profile-password-form animate-fade-in">
                                        <input className="input-field" type="password" placeholder="Current password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                                        <input className="input-field" type="password" placeholder="New password (min 6 chars)" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                                        <input className="input-field" type="password" placeholder="Confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                                        <div className="profile-password-actions">
                                            <button className="btn btn-primary" onClick={handleChangePassword} disabled={loading}>
                                                <MdSave /> Save
                                            </button>
                                            <button className="btn btn-secondary" onClick={() => { setChangingPassword(false); setCurrentPassword(''); setNewPassword(''); setConfirmPassword('') }}>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="profile-row__value">
                                        <span>••••••••</span>
                                        <button className="btn-icon" onClick={() => setChangingPassword(true)}><MdEdit /></button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="glass-card-static profile-section profile-danger">
                        <h4 className="profile-section__title">Danger Zone</h4>
                        <div className="profile-danger-actions">
                            <button className="btn btn-secondary profile-logout-btn" onClick={handleLogout}>
                                <MdLogout /> Log Out
                            </button>
                            {showDeleteConfirm ? (
                                <div className="profile-delete-confirm animate-fade-in">
                                    <p className="text-sm">Are you sure? This cannot be undone.</p>
                                    <div className="profile-delete-actions">
                                        <button className="btn profile-delete-btn" onClick={handleDeleteAccount} disabled={loading}>
                                            <MdDeleteForever /> Yes, Delete My Account
                                        </button>
                                        <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <button className="btn profile-delete-btn" onClick={() => setShowDeleteConfirm(true)}>
                                    <MdDeleteForever /> Delete Account
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column — Fitness Profile */}
                <div className="profile-column">
                    <div className="glass-card-static profile-section">
                        <h4 className="profile-section__title">
                            <MdFitnessCenter /> Fitness Profile
                        </h4>
                        <div className="profile-stats-grid">
                            <div className="profile-stat">
                                <MdCake className="profile-stat__icon" />
                                <div>
                                    <span className="profile-stat__label">Age</span>
                                    <span className="profile-stat__value">{profile.age || '–'} years</span>
                                </div>
                            </div>
                            <div className="profile-stat">
                                <MdPerson className="profile-stat__icon" />
                                <div>
                                    <span className="profile-stat__label">Gender</span>
                                    <span className="profile-stat__value">{profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : '–'}</span>
                                </div>
                            </div>
                            <div className="profile-stat">
                                <MdHeight className="profile-stat__icon" />
                                <div>
                                    <span className="profile-stat__label">Height</span>
                                    <span className="profile-stat__value">{profile.height || '–'} cm</span>
                                </div>
                            </div>
                            <div className="profile-stat">
                                <MdScale className="profile-stat__icon" />
                                <div>
                                    <span className="profile-stat__label">Weight</span>
                                    <span className="profile-stat__value">{profile.weight || '–'} kg</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card-static profile-section">
                        <h4 className="profile-section__title">
                            <MdFlag /> Goals & Targets
                        </h4>
                        <div className="profile-stats-grid">
                            <div className="profile-stat">
                                <span className="profile-stat__emoji">🎯</span>
                                <div>
                                    <span className="profile-stat__label">Goal</span>
                                    <span className="profile-stat__value">{profile.goal?.replace('_', ' ') || '–'}</span>
                                </div>
                            </div>
                            <div className="profile-stat">
                                <span className="profile-stat__emoji">⚡</span>
                                <div>
                                    <span className="profile-stat__label">Activity</span>
                                    <span className="profile-stat__value">{profile.activityLevel ? profile.activityLevel.charAt(0).toUpperCase() + profile.activityLevel.slice(1) : '–'}</span>
                                </div>
                            </div>
                            <div className="profile-stat">
                                <span className="profile-stat__emoji">🔥</span>
                                <div>
                                    <span className="profile-stat__label">BMR</span>
                                    <span className="profile-stat__value">{profile.bmr || '–'} cal</span>
                                </div>
                            </div>
                            <div className="profile-stat">
                                <span className="profile-stat__emoji">📊</span>
                                <div>
                                    <span className="profile-stat__label">TDEE</span>
                                    <span className="profile-stat__value">{profile.tdee || '–'} cal</span>
                                </div>
                            </div>
                            <div className="profile-stat full-width">
                                <span className="profile-stat__emoji">🍽️</span>
                                <div>
                                    <span className="profile-stat__label">Daily Calorie Target</span>
                                    <span className="profile-stat__value profile-stat__value--accent">{profile.dailyCalorieTarget || '–'} cal/day</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card-static profile-section">
                        <h4 className="profile-section__title">
                            <MdFitnessCenter /> Gym & Equipment
                        </h4>
                        <p className="text-sm" style={{ marginBottom: 'var(--space-3)' }}>
                            {profile.hasGym ? '🏋️ Gym access — using equipment' : '🏠 No gym — bodyweight workouts'}
                        </p>
                        {profile.equipment && profile.equipment.length > 0 && (
                            <div className="profile-equipment-chips">
                                {profile.equipment.map(item => (
                                    <span key={item} className="badge badge-success">{item}</span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="glass-card-static profile-section">
                        <h4 className="profile-section__title">
                            <MdWatch /> Wearable
                        </h4>
                        <p className="text-sm">
                            {profile.wearable === 'samsung' && '⌚ Samsung Galaxy Watch'}
                            {profile.wearable === 'apple' && '⌚ Apple Watch'}
                            {profile.wearable === 'google_fit' && '⌚ Google Fit / Wear OS'}
                            {profile.wearable === 'none' && '📱 No watch — phone tracking'}
                            {!profile.wearable && '–'}
                        </p>
                    </div>

                    {/* Blacklist Management */}
                    <div className="glass-card-static profile-section">
                        <h4 className="profile-section__title">
                            <MdWarning /> My Ingredient Blacklist
                        </h4>
                        <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-3)' }}>
                            Recipes containing these ingredients will be flagged 🚫
                        </p>
                        <div className="profile-blacklist-input">
                            <input
                                className="input-field"
                                placeholder="e.g. ajinomoto, palm oil..."
                                value={blacklistInput}
                                onChange={e => setBlacklistInput(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addBlacklistItem() } }}
                            />
                            <button className="btn btn-primary btn-sm" onClick={addBlacklistItem} disabled={!blacklistInput.trim()}>
                                <MdAdd /> Add
                            </button>
                        </div>
                        {localBlacklist.length > 0 ? (
                            <div className="profile-blacklist-chips">
                                {localBlacklist.map(item => (
                                    <span key={item} className="profile-blacklist-chip">
                                        🚫 {item}
                                        <button onClick={() => removeBlacklistItem(item)} className="profile-blacklist-remove">&times;</button>
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-muted" style={{ marginTop: 'var(--space-2)' }}>No blacklisted ingredients yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
