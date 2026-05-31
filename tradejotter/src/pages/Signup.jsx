import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'

const Signup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSignup = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        const { error } = await supabase.auth.signUp({
            email, password,
            options: { data: { username } }
        })
        if (error) {
            if (error.message.includes('already registered')) setError('Email already in use')
            else setError('Something went wrong. Try again.')
        } else {
            navigate('/dashboard')
        }
        setLoading(false)
    }

    const field = (label, props) => (
        <div>
            <label style={{ display: 'block', color: '#555', fontSize: 11, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</label>
            <input {...props} />
        </div>
    )

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', padding: 24 }}>
            <div style={{ width: '100%', maxWidth: 400 }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>
                        <span style={{ color: '#00ff88' }}>Trade</span><span style={{ color: '#fff' }}>Jotter</span>
                    </h1>
                    <p style={{ color: '#555', marginTop: 8, fontSize: 14 }}>Start journaling your trades today</p>
                </div>
                <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: 32 }}>
                    <h2 style={{ margin: '0 0 24px', fontSize: 20, fontWeight: 600 }}>Create account</h2>
                    {error && (
                        <div style={{ background: '#ff446615', border: '1px solid #ff446633', borderRadius: 8, padding: '10px 14px', color: '#ff4466', fontSize: 13, marginBottom: 20 }}>
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {field('Username', { type: 'text', placeholder: 'e.g. traderpaul', value: username, onChange: e => setUsername(e.target.value), required: true })}
                        {field('Email', { type: 'email', placeholder: 'you@example.com', value: email, onChange: e => setEmail(e.target.value), required: true })}
                        {field('Password', { type: 'password', placeholder: '••••••••', value: password, onChange: e => setPassword(e.target.value), required: true })}
                        <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: 8, width: '100%' }}>
                            {loading ? 'Creating account...' : 'Create Account →'}
                        </button>
                    </form>
                    <p style={{ textAlign: 'center', color: '#555', marginTop: 24, fontSize: 13 }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#00ff88', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Signup