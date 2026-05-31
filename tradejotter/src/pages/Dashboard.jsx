import { useAuth } from '../context/AuthProvider'
import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const StatCard = ({ label, value, sub, color }) => (
    <div style={{
        background: '#111',
        border: '1px solid #1e1e1e',
        borderRadius: 12,
        padding: '20px 24px',
        transition: 'border-color 0.2s',
    }}
        onMouseEnter={e => e.currentTarget.style.borderColor = '#00ff8840'}
        onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e1e'}
    >
        <p style={{ color: '#555', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>
            {label}
        </p>
        <p style={{ fontSize: 28, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', margin: 0, color: color || '#fff' }}>
            {value}
        </p>
        {sub && <p style={{ color: '#444', fontSize: 12, margin: '6px 0 0' }}>{sub}</p>}
    </div>
)

const Dashboard = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [plan, setPlan] = useState('free')
    const [username, setUsername] = useState('')
    const [stats, setStats] = useState({ totalTrades: 0, winRate: 0, totalPips: 0, streak: 0 })
    const [trades, setTrades] = useState([])

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: profile } = await supabase
                .from('profiles').select('username').eq('id', user.id).single()
            if (profile) setUsername(profile.username)

            const { data: userPlan } = await supabase
                .from('user_plans').select('plan').eq('user_id', user.id).single()
            if (userPlan) setPlan(userPlan.plan)
        }

        const loadStats = () => {
            const saved = localStorage.getItem(`trades_${user.id}`)
            const trades = saved ? JSON.parse(saved) : []
            setTrades(trades.slice(0, 5))
            const total = trades.length
            const wins = trades.filter(t => t.result === 'win').length
            const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : 0
            const totalPips = trades.reduce((sum, t) => sum + t.pips, 0).toFixed(1)
            let streak = 0
            for (let i = 0; i < trades.length; i++) {
                if (trades[i].result === 'win') streak++
                else break
            }
            setStats({ totalTrades: total, winRate, totalPips, streak })
        }

        fetchUserData()
        loadStats()
    }, [user])

    const planColors = { free: '#555', pro: '#3b82f6', premium: '#ffbb00' }

    const quickLinks = [
        { label: 'Journal', path: '/journal', icon: '📓', desc: 'Log your trades' },
        { label: 'Portfolio', path: '/portfolio', icon: '📊', desc: 'Track performance' },
        { label: 'Risk Calc', path: '/risk', icon: '⚖️', desc: 'Calculate lot size' },
        { label: 'AI Analysis', path: '/analysis', icon: '🤖', desc: 'Analyze charts' },
        { label: 'Community', path: '/community', icon: '🌐', desc: 'Share ideas' },
        { label: 'Leaderboard', path: '/leaderboard', icon: '🏆', desc: 'Top traders' },
    ]

    return (
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
                        Welcome back, <span style={{ color: '#00ff88' }}>{username || user.email}</span> 👋
                    </h1>
                    <p style={{ color: '#444', margin: '8px 0 0', fontSize: 13 }}>
                        Here's your trading overview
                    </p>
                </div>
                <span style={{
                    padding: '5px 14px',
                    borderRadius: 20,
                    background: planColors[plan] + '20',
                    color: planColors[plan],
                    fontSize: 11,
                    fontWeight: 700,
                    border: `1px solid ${planColors[plan]}40`,
                    letterSpacing: '0.05em'
                }}>
                    {plan.toUpperCase()}
                </span>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
                <StatCard label="Total Trades" value={stats.totalTrades} sub="all time" />
                <StatCard
                    label="Win Rate"
                    value={`${stats.winRate}%`}
                    sub={`${trades.filter(t => t.result === 'win').length} wins`}
                    color={parseFloat(stats.winRate) >= 50 ? '#00ff88' : '#ff4466'}
                />
                <StatCard
                    label="Total Pips"
                    value={stats.totalPips}
                    sub="accumulated"
                    color={parseFloat(stats.totalPips) >= 0 ? '#00ff88' : '#ff4466'}
                />
                <StatCard label="Win Streak" value={`${stats.streak} 🔥`} sub="current" color="#ffbb00" />
            </div>

            {/* Recent Trades + Quick Links */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>

                {/* Recent Trades */}
                <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e1e1e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>Recent Trades</p>
                        <button
                            onClick={() => navigate('/journal')}
                            style={{ background: 'none', border: 'none', color: '#00ff88', fontSize: 12, cursor: 'pointer', padding: 0 }}
                        >
                            View all →
                        </button>
                    </div>
                    {trades.length === 0 ? (
                        <div style={{ padding: 32, textAlign: 'center' }}>
                            <p style={{ color: '#444', margin: '0 0 12px' }}>No trades yet</p>
                            <button
                                onClick={() => navigate('/journal')}
                                style={{ padding: '8px 16px', background: '#00ff8815', border: '1px solid #00ff8830', color: '#00ff88', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}
                            >
                                Log your first trade →
                            </button>
                        </div>
                    ) : (
                        trades.map(trade => (
                            <div key={trade.id} style={{ padding: '12px 20px', borderBottom: '1px solid #161616', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <span style={{ fontWeight: 600, fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>{trade.pair}</span>
                                    <span style={{
                                        padding: '2px 7px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                                        background: trade.direction === 'buy' ? '#00ff8815' : '#ff446615',
                                        color: trade.direction === 'buy' ? '#00ff88' : '#ff4466'
                                    }}>{trade.direction.toUpperCase()}</span>
                                    <span style={{
                                        padding: '2px 7px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                                        background: trade.result === 'win' ? '#00ff8815' : trade.result === 'loss' ? '#ff446615' : '#ffbb0015',
                                        color: trade.result === 'win' ? '#00ff88' : trade.result === 'loss' ? '#ff4466' : '#ffbb00'
                                    }}>{trade.result.toUpperCase()}</span>
                                </div>
                                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: trade.pips >= 0 ? '#00ff88' : '#ff4466' }}>
                                    {trade.pips >= 0 ? '+' : ''}{trade.pips}p
                                </span>
                            </div>
                        ))
                    )}
                </div>

                {/* Quick Links */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                    {quickLinks.map(item => (
                        <div
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            style={{
                                background: '#111',
                                border: '1px solid #1e1e1e',
                                borderRadius: 12,
                                padding: '16px 18px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = '#00ff8840'
                                e.currentTarget.style.background = '#00ff8808'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = '#1e1e1e'
                                e.currentTarget.style.background = '#111'
                            }}
                        >
                            <p style={{ fontSize: 20, margin: '0 0 6px' }}>{item.icon}</p>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: 13 }}>{item.label}</p>
                            <p style={{ margin: '2px 0 0', color: '#444', fontSize: 12 }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Upgrade banner for free users */}
            {plan === 'free' && (
                <div style={{
                    background: 'linear-gradient(135deg, #00ff8810, #3b82f610)',
                    border: '1px solid #00ff8825',
                    borderRadius: 12,
                    padding: '20px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>Unlock the full TradeJotter experience</p>
                        <p style={{ margin: '4px 0 0', color: '#555', fontSize: 13 }}>Upgrade to Pro for unlimited trades, AI analysis and more</p>
                    </div>
                    <button
                        onClick={() => navigate('/pricing')}
                        style={{ padding: '10px 20px', background: '#00ff88', color: '#000', fontWeight: 700, border: 'none', borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                        Upgrade → $9.99/mo
                    </button>
                </div>
            )}
        </div>
    )
}

export default Dashboard