import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import { supabase } from '../lib/supabase'
import useMediaQuery from '../hooks/useMediaQuery'

const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAuth()
    const { isMobile } = useMediaQuery()
    const [menuOpen, setMenuOpen] = useState(false)

    const links = [
        { label: 'Dashboard', path: '/dashboard', icon: '⚡' },
        { label: 'Journal', path: '/journal', icon: '📓' },
        { label: 'Portfolio', path: '/portfolio', icon: '📊' },
        { label: 'Risk', path: '/risk', icon: '⚖️' },
        { label: 'AI', path: '/analysis', icon: '🤖' },
        { label: 'Community', path: '/community', icon: '🌐' },
        { label: 'Leaderboard', path: '/leaderboard', icon: '🏆' },
    ]

    if (!user) return null

    return (
        <>
            <nav style={{
                background: '#0d0d0d',
                borderBottom: '1px solid #1a1a1a',
                padding: '0 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 56,
                position: 'sticky',
                top: 0,
                zIndex: 100,
            }}>
                {/* Logo */}
                <div onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
                    <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}>
                        <span style={{ color: '#00ff88' }}>Trade</span>
                        <span style={{ color: '#fff' }}>Jotter</span>
                    </span>
                </div>

                {/* Desktop links */}
                {!isMobile && (
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                        {links.map(link => {
                            const active = location.pathname === link.path
                            return (
                                <button key={link.path} onClick={() => navigate(link.path)} style={{
                                    padding: '6px 12px',
                                    background: active ? '#00ff8815' : 'transparent',
                                    border: active ? '1px solid #00ff8833' : '1px solid transparent',
                                    color: active ? '#00ff88' : '#888',
                                    borderRadius: 8, fontSize: 13,
                                    fontWeight: active ? 600 : 400, cursor: 'pointer',
                                }}>
                                    {link.icon} {link.label}
                                </button>
                            )
                        })}
                    </div>
                )}

                {/* Right side */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {!isMobile && (
                        <button onClick={() => navigate('/pricing')} style={{
                            padding: '5px 12px', background: '#ffbb0015',
                            border: '1px solid #ffbb0033', color: '#ffbb00',
                            borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: 'pointer'
                        }}>
                            ⚡ UPGRADE
                        </button>
                    )}
                    <button onClick={() => navigate('/profile')} style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: '#00ff8820', border: '1px solid #00ff8840',
                        color: '#00ff88', fontWeight: 700, fontSize: 13,
                        cursor: 'pointer', padding: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        {user.email[0].toUpperCase()}
                    </button>

                    {/* Hamburger */}
                    {isMobile && (
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            style={{ background: 'none', border: '1px solid #222', color: '#fff', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', fontSize: 16 }}
                        >
                            {menuOpen ? '✕' : '☰'}
                        </button>
                    )}
                </div>
            </nav>

            {/* Mobile menu */}
            {isMobile && menuOpen && (
                <div style={{
                    position: 'fixed', top: 56, left: 0, right: 0, bottom: 0,
                    background: '#0d0d0d', borderTop: '1px solid #1a1a1a',
                    zIndex: 99, padding: 20, display: 'flex', flexDirection: 'column', gap: 8,
                    overflowY: 'auto'
                }}>
                    {links.map(link => {
                        const active = location.pathname === link.path
                        return (
                            <button
                                key={link.path}
                                onClick={() => { navigate(link.path); setMenuOpen(false) }}
                                style={{
                                    padding: '14px 16px', textAlign: 'left',
                                    background: active ? '#00ff8815' : '#111',
                                    border: active ? '1px solid #00ff8833' : '1px solid #1a1a1a',
                                    color: active ? '#00ff88' : '#ccc',
                                    borderRadius: 10, fontSize: 15,
                                    fontWeight: active ? 600 : 400, cursor: 'pointer',
                                }}
                            >
                                {link.icon} {link.label}
                            </button>
                        )
                    })}
                    <button
                        onClick={() => { navigate('/pricing'); setMenuOpen(false) }}
                        style={{ padding: '14px 16px', background: '#ffbb0015', border: '1px solid #ffbb0033', color: '#ffbb00', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 8 }}
                    >
                        ⚡ Upgrade to Pro
                    </button>
                    <button
                        onClick={async () => { await supabase.auth.signOut(); navigate('/login') }}
                        style={{ padding: '14px 16px', background: '#ff446615', border: '1px solid #ff446630', color: '#ff4466', borderRadius: 10, fontSize: 15, cursor: 'pointer' }}
                    >
                        🚪 Logout
                    </button>
                </div>
            )}
        </>
    )
}

export default Navbar