import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            if (error.message.includes('Invalid login')) setError('Wrong email or password')
            else if (error.message.includes('Email not confirmed')) setError('Please confirm your email first')
            else setError('Something went wrong. Try again.')
        } else {
            navigate('/dashboard')
        }
        setLoading(false)
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a0a0a',
            padding: 24
        }}>
            <div style={{ width: '100%', maxWidth: 400 }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>
                        <span style={{ color: '#00ff88' }}>Trade</span>
                        <span style={{ color: '#fff' }}>Jotter</span>
                    </h1>
                    <p style={{ color: '#555', marginTop: 8, fontSize: 14 }}>
                        Your AI-powered trading journal
                    </p>
                </div>

                {/* Card */}
                <div style={{
                    background: '#111',
                    border: '1px solid #222',
                    borderRadius: 16,
                    padding: 32
                }}>
                    <h2 style={{ margin: '0 0 24px', fontSize: 20, fontWeight: 600 }}>Welcome back</h2>

                    {error && (
                        <div style={{
                            background: '#ff446615',
                            border: '1px solid #ff446633',
                            borderRadius: 8,
                            padding: '10px 14px',
                            color: '#ff4466',
                            fontSize: 13,
                            marginBottom: 20
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={{ display: 'block', color: '#888', fontSize: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
                            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: '#888', fontSize: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
                            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                            style={{ marginTop: 8, width: '100%' }}
                        >
                            {loading ? 'Signing in...' : 'Sign In →'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', color: '#555', marginTop: 24, fontSize: 13 }}>
                        No account?{' '}
                        <Link to="/signup" style={{ color: '#00ff88', textDecoration: 'none', fontWeight: 600 }}>
                            Create one free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login