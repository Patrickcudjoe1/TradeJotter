import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import { supabase } from '../lib/supabase'

const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAuth()

    const links = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Journal', path: '/journal' },
        { label: 'Portfolio', path: '/portfolio' },
        { label: 'Risk', path: '/risk' },
        { label: 'AI', path: '/analysis' },
        { label: 'Community', path: '/community' },
        { label: 'Leaderboard', path: '/leaderboard' },
    ]

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/login')
    }

    if (!user) return null

    return (
        <nav style={{
            background: '#0d0d0d',
            borderBottom: '1px solid #1a1a1a',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 56,
            position: 'sticky',
            top: 0,
            zIndex: 100,
        }}>
            {/* Logo */}
            <div
                onClick={() => navigate('/dashboard')}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
            >
                <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.5px' }}>
                    <span style={{ color: '#00ff88' }}>Trade</span>
                    <span style={{ color: '#fff' }}>Jotter</span>
                </span>
            </div>

            {/* Nav links */}
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {links.map(link => {
                    const active = location.pathname === link.path
                    return (
                        <button
                            key={link.path}
                            onClick={() => navigate(link.path)}
                            style={{
                                padding: '6px 12px',
                                background: active ? '#00ff8815' : 'transparent',
                                border: active ? '1px solid #00ff8833' : '1px solid transparent',
                                color: active ? '#00ff88' : '#888',
                                borderRadius: 8,
                                fontSize: 13,
                                fontWeight: active ? 600 : 400,
                                cursor: 'pointer',
                            }}
                        >
                            {link.icon} {link.label}
                        </button>
                    )
                })}
            </div>

            {/* Right side */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                    onClick={() => navigate('/pricing')}
                    style={{
                        padding: '5px 12px',
                        background: '#ffbb0015',
                        border: '1px solid #ffbb0033',
                        color: '#ffbb00',
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer'
                    }}
                >
                    ⚡ UPGRADE
                </button>
                <button
                    onClick={() => navigate('/profile')}
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: '#00ff8820',
                        border: '1px solid #00ff8840',
                        color: '#00ff88',
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {user.email[0].toUpperCase()}
                </button>
            </div>
        </nav>
    )
}

export default Navbar