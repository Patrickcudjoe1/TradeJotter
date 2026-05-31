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
    const [passwords, setPasswords] = useState({ new: '', confirm: '' })
    const [passwordMsg, setPasswordMsg] = useState('')

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
            if (p) setProfile(p)
            const { data: pl } = await supabase.from('user_plans').select('plan, credits_remaining').eq('user_id', user.id).single()
            if (pl) { setPlan(pl.plan); setCredits(pl.credits_remaining) }
            setLoading(false)
        }
        fetch()
    }, [user])

    const handleSave = async () => {
        setSaving(true); setMessage('')
        const { error } = await supabase.from('profiles').update({ username: profile.username, full_name: profile.full_name }).eq('id', user.id)
        setMessage(error ? '❌ Failed. Username may be taken.' : '✅ Profile updated!')
        setSaving(false)
    }

    const handleChangePassword = async () => {
        setPasswordMsg('')
        if (passwords.new !== passwords.confirm) return setPasswordMsg('❌ Passwords do not match')
        if (passwords.new.length < 6) return setPasswordMsg('❌ Minimum 6 characters')
        const { error } = await supabase.auth.updateUser({ password: passwords.new })
        setPasswordMsg(error ? '❌ ' + error.message : '✅ Password changed!')
        if (!error) setPasswords({ new: '', confirm: '' })
    }

    const planColors = { free: '#555', pro: '#3b82f6', premium: '#ffbb00' }
    const Label = ({ text }) => <label style={{ display: 'block', color: '#444', fontSize: 11, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{text}</label>

    if (loading) return <p style={{ textAlign: 'center', marginTop: 80, color: '#444' }}>Loading...</p>

    return (
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px' }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 32px' }}>👤 My Profile</h1>

            {/* Profile header card */}
            <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 24, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#00ff8820', border: '2px solid #00ff8840', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00ff88', fontWeight: 800, fontSize: 22, flexShrink: 0 }}>
                    {(profile.username || user.email)[0].toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>{profile.username || 'No username set'}</p>
                    <p style={{ margin: '2px 0 8px', color: '#444', fontSize: 13 }}>{user.email}</p>
                    <span style={{ padding: '3px 10px', borderRadius: 20, background: planColors[plan] + '20', color: planColors[plan], fontSize: 11, fontWeight: 700, border: `1px solid ${planColors[plan]}40` }}>
                        {plan.toUpperCase()}
                    </span>
                </div>
                {plan === 'free' && (
                    <button onClick={() => navigate('/pricing')} style={{ padding: '8px 16px', background: '#3b82f620', border: '1px solid #3b82f640', color: '#3b82f6', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                        Upgrade ⚡
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', background: '#111', border: '1px solid #1e1e1e', borderRadius: 10, padding: 4, marginBottom: 24, gap: 4 }}>
                {['profile', 'security'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: '8px 0', background: activeTab === tab ? '#1e1e1e' : 'transparent', border: activeTab === tab ? '1px solid #2a2a2a' : '1px solid transparent', color: activeTab === tab ? '#fff' : '#444', borderRadius: 7, cursor: 'pointer', fontWeight: activeTab === tab ? 600 : 400, fontSize: 13 }}>
                        {tab === 'profile' ? '👤 Profile' : '🔒 Security'}
                    </button>
                ))}
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 24 }}>
                    {message && <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 20, background: message.includes('✅') ? '#00ff8815' : '#ff446615', color: message.includes('✅') ? '#00ff88' : '#ff4466', fontSize: 13 }}>{message}</div>}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div><Label text="Username" /><input value={profile.username || ''} onChange={e => setProfile({ ...profile, username: e.target.value })} /></div>
                        <div><Label text="Full Name" /><input value={profile.full_name || ''} onChange={e => setProfile({ ...profile, full_name: e.target.value })} /></div>
                        <div><Label text="Email" /><input value={user.email} disabled /></div>
                    </div>
                    <button onClick={handleSave} disabled={saving} style={{ marginTop: 20, padding: '10px 24px', background: '#00ff88', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', width: '100%' }}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
                <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 24 }}>
                    <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 600 }}>Change Password</h3>
                    {passwordMsg && <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 20, background: passwordMsg.includes('✅') ? '#00ff8815' : '#ff446615', color: passwordMsg.includes('✅') ? '#00ff88' : '#ff4466', fontSize: 13 }}>{passwordMsg}</div>}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div><Label text="New Password" /><input type="password" placeholder="••••••••" value={passwords.new} onChange={e => setPasswords({ ...passwords, new: e.target.value })} /></div>
                        <div><Label text="Confirm Password" /><input type="password" placeholder="••••••••" value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} /></div>
                    </div>
                    <button onClick={handleChangePassword} style={{ marginTop: 20, padding: '10px 24px', background: '#00ff88', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', width: '100%' }}>
                        Change Password
                    </button>
                    <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #1a1a1a' }}>
                        <p style={{ color: '#444', fontSize: 13, margin: '0 0 12px' }}>Or send a reset link to {user.email}</p>
                        <button onClick={async () => { await supabase.auth.resetPasswordForEmail(user.email); setPasswordMsg('✅ Reset email sent!') }} style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid #1e1e1e', borderRadius: 8, color: '#555', cursor: 'pointer' }}>
                            Send Reset Email
                        </button>
                    </div>
                </div>
            )}

            {/* Plan info */}
            <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 20, marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: '#0d0d0d', borderRadius: 8, padding: '12px 16px' }}>
                    <p style={{ color: '#444', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>Current Plan</p>
                    <p style={{ fontWeight: 700, color: planColors[plan], margin: 0 }}>{plan.toUpperCase()}</p>
                </div>
                <div style={{ background: '#0d0d0d', borderRadius: 8, padding: '12px 16px' }}>
                    <p style={{ color: '#444', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>AI Credits</p>
                    <p style={{ fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', margin: 0 }}>{credits}</p>
                </div>
            </div>
        </div>
    )
}

export default Profile
