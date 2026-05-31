import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthProvider'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const Profile = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [profile, setProfile] = useState({ username: '', full_name: '' })
    const [plan, setPlan] = useState('free')
    const [credits, setCredits] = useState(0)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')
    const [activeTab, setActiveTab] = useState('profile')

    // Password change state
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
    const [passwordMsg, setPasswordMsg] = useState('')

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        setLoading(true)

        const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (profileData) setProfile(profileData)

        const { data: planData } = await supabase
            .from('user_plans')
            .select('plan, credits_remaining')
            .eq('user_id', user.id)
            .single()

        if (planData) {
            setPlan(planData.plan)
            setCredits(planData.credits_remaining)
        }

        setLoading(false)
    }

    const handleSaveProfile = async () => {
        setSaving(true)
        setMessage('')

        const { error } = await supabase
            .from('profiles')
            .update({
                username: profile.username,
                full_name: profile.full_name
            })
            .eq('id', user.id)

        if (error) {
            setMessage('❌ Failed to save. Username may already be taken.')
        } else {
            setMessage('✅ Profile updated successfully!')
        }

        setSaving(false)
    }

    const handleChangePassword = async () => {
        setPasswordMsg('')

        if (passwords.new !== passwords.confirm) {
            setPasswordMsg('❌ New passwords do not match')
            return
        }

        if (passwords.new.length < 6) {
            setPasswordMsg('❌ Password must be at least 6 characters')
            return
        }

        const { error } = await supabase.auth.updateUser({
            password: passwords.new
        })

        if (error) {
            setPasswordMsg('❌ ' + error.message)
        } else {
            setPasswordMsg('✅ Password changed successfully!')
            setPasswords({ current: '', new: '', confirm: '' })
        }
    }

    const handleResetPassword = async () => {
        const { error } = await supabase.auth.resetPasswordForEmail(user.email)
        if (error) {
            setMessage('❌ Failed to send reset email')
        } else {
            setMessage('✅ Password reset email sent!')
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/login')
    }

    const planColor = {
        free: '#6b7280',
        pro: '#3b82f6',
        premium: '#f59e0b'
    }

    if (loading) return <p style={{ textAlign: 'center', marginTop: 60 }}>Loading...</p>

    return (
        <div style={{ maxWidth: 700, margin: '40px auto', padding: 24 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1>👤 My Profile</h1>
                <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 16px' }}>
                    ← Dashboard
                </button>
            </div>

            {/* Plan Badge */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 24, padding: 20, border: '1px solid #ccc', borderRadius: 8, alignItems: 'center' }}>
                <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: planColor[plan],
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: 'white',
                    fontWeight: 'bold', fontSize: 20
                }}>
                    {profile.username?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                </div>
                <div>
                    <p style={{ margin: 0, fontWeight: 'bold', fontSize: 18 }}>
                        {profile.username || user.email}
                    </p>
                    <p style={{ margin: '4px 0 0', color: 'gray', fontSize: 13 }}>{user.email}</p>
                    <span style={{
                        display: 'inline-block', marginTop: 6,
                        padding: '2px 10px', borderRadius: 20,
                        background: planColor[plan] + '22',
                        color: planColor[plan],
                        fontSize: 12, fontWeight: 'bold'
                    }}>
                        {plan.toUpperCase()} PLAN
                    </span>
                </div>
                {plan === 'free' && (
                    <button
                        onClick={() => navigate('/pricing')}
                        style={{ marginLeft: 'auto', padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                    >
                        Upgrade ⚡
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 24, border: '1px solid #ccc', borderRadius: 8, overflow: 'hidden' }}>
                {['profile', 'security'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            flex: 1, padding: '12px 0',
                            background: activeTab === tab ? '#22c55e' : 'transparent',
                            color: activeTab === tab ? 'white' : 'gray',
                            border: 'none', cursor: 'pointer',
                            fontWeight: activeTab === tab ? 'bold' : 'normal',
                            fontSize: 14
                        }}
                    >
                        {tab === 'profile' ? '👤 Profile' : '🔒 Security'}
                    </button>
                ))}
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 24 }}>
                    <h3 style={{ marginTop: 0 }}>Profile Information</h3>

                    {message && (
                        <p style={{ color: message.includes('✅') ? '#22c55e' : '#ef4444', marginBottom: 16 }}>
                            {message}
                        </p>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: 4, color: 'gray', fontSize: 13 }}>
                                Username
                            </label>
                            <input
                                type="text"
                                value={profile.username || ''}
                                onChange={e => setProfile({ ...profile, username: e.target.value })}
                                style={{ width: '100%', padding: 10, borderRadius: 6 }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: 4, color: 'gray', fontSize: 13 }}>
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={profile.full_name || ''}
                                onChange={e => setProfile({ ...profile, full_name: e.target.value })}
                                style={{ width: '100%', padding: 10, borderRadius: 6 }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: 4, color: 'gray', fontSize: 13 }}>
                                Email
                            </label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                style={{ width: '100%', padding: 10, borderRadius: 6, opacity: 0.5 }}
                            />
                            <p style={{ color: 'gray', fontSize: 12, margin: '4px 0 0' }}>Email cannot be changed</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                        <button
                            onClick={handleSaveProfile}
                            disabled={saving}
                            style={{ flex: 1, padding: '10px 24px', background: '#22c55e', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            onClick={handleLogout}
                            style={{ padding: '10px 24px', background: '#ef444422', color: '#ef4444', border: '1px solid #ef4444', borderRadius: 6, cursor: 'pointer' }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
                <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 24 }}>
                    <h3 style={{ marginTop: 0 }}>Change Password</h3>

                    {passwordMsg && (
                        <p style={{ color: passwordMsg.includes('✅') ? '#22c55e' : '#ef4444', marginBottom: 16 }}>
                            {passwordMsg}
                        </p>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: 4, color: 'gray', fontSize: 13 }}>
                                New Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={passwords.new}
                                onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                                style={{ width: '100%', padding: 10, borderRadius: 6 }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: 4, color: 'gray', fontSize: 13 }}>
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={passwords.confirm}
                                onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                style={{ width: '100%', padding: 10, borderRadius: 6 }}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleChangePassword}
                        style={{ marginTop: 20, width: '100%', padding: '10px 24px', background: '#22c55e', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                    >
                        Change Password
                    </button>

                    <hr style={{ margin: '24px 0' }} />

                    <h3 style={{ marginTop: 0 }}>Reset Password via Email</h3>
                    <p style={{ color: 'gray', fontSize: 14 }}>We'll send a password reset link to {user.email}</p>
                    <button
                        onClick={handleResetPassword}
                        style={{ width: '100%', padding: '10px 24px', background: 'none', border: '1px solid #ccc', borderRadius: 6, cursor: 'pointer' }}
                    >
                        Send Reset Email
                    </button>
                </div>
            )}

            {/* Plan Info */}
            <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 20, marginTop: 24 }}>
                <h3 style={{ marginTop: 0 }}>Plan Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ padding: 12, background: '#33333311', borderRadius: 6 }}>
                        <p style={{ margin: 0, color: 'gray', fontSize: 13 }}>Current Plan</p>
                        <p style={{ margin: '4px 0 0', fontWeight: 'bold', color: planColor[plan] }}>{plan.toUpperCase()}</p>
                    </div>
                    <div style={{ padding: 12, background: '#33333311', borderRadius: 6 }}>
                        <p style={{ margin: 0, color: 'gray', fontSize: 13 }}>AI Credits</p>
                        <p style={{ margin: '4px 0 0', fontWeight: 'bold' }}>{credits} remaining</p>
                    </div>
                </div>
                {plan === 'free' && (
                    <button
                        onClick={() => navigate('/pricing')}
                        style={{ marginTop: 16, width: '100%', padding: '10px 24px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                    >
                        Upgrade to Pro — $9.99/mo ⚡
                    </button>
                )}
            </div>
        </div>
    )
}

export default Profile