import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthProvider'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const Leaderboard = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [traders, setTraders] = useState([])
    const [loading, setLoading] = useState(true)
    const [period, setPeriod] = useState('alltime')

    useEffect(() => {
        fetchLeaderboard()
    }, [period])

    const fetchLeaderboard = async () => {
        setLoading(true)

        // Build leaderboard from profiles + trades
        const { data: profiles, error } = await supabase
            .from('profiles')
            .select('id, username')

        if (error || !profiles) {
            setLoading(false)
            return
        }

        // Get all trades and compute stats per user
        const leaderboardData = []

        for (const profile of profiles) {
            let query = supabase
                .from('trades')
                .select('*')
                .eq('user_id', profile.id)

            if (period === 'weekly') {
                const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
                query = query.gte('created_at', weekAgo)
            } else if (period === 'monthly') {
                const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
                query = query.gte('created_at', monthAgo)
            }

            const { data: trades } = await query

            if (trades && trades.length > 0) {
                const wins = trades.filter(t => t.result === 'win').length
                const winRate = ((wins / trades.length) * 100).toFixed(1)
                const totalPips = trades.reduce((sum, t) => sum + (t.pips || 0), 0).toFixed(1)
                const avgRR = (trades.reduce((sum, t) => sum + (t.risk_reward || 0), 0) / trades.length).toFixed(2)

                leaderboardData.push({
                    id: profile.id,
                    username: profile.username || 'Anonymous',
                    totalTrades: trades.length,
                    winRate: parseFloat(winRate),
                    totalPips: parseFloat(totalPips),
                    avgRR: parseFloat(avgRR),
                    isCurrentUser: profile.id === user.id
                })
            }
        }

        // Sort by win rate
        leaderboardData.sort((a, b) => b.winRate - a.winRate)
        setTraders(leaderboardData)
        setLoading(false)
    }

    const getMedal = (index) => {
        if (index === 0) return '🥇'
        if (index === 1) return '🥈'
        if (index === 2) return '🥉'
        return `#${index + 1}`
    }

    return (
        <div style={{ maxWidth: 800, margin: '40px auto', padding: 24 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1>🏆 Leaderboard</h1>
                    <p style={{ color: 'gray', margin: 0 }}>Top traders ranked by win rate</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <select
                        value={period}
                        onChange={e => setPeriod(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: 6 }}
                    >
                        <option value="alltime">All Time</option>
                        <option value="monthly">This Month</option>
                        <option value="weekly">This Week</option>
                    </select>
                    <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 16px' }}>
                        ← Dashboard
                    </button>
                </div>
            </div>

            {/* Top 3 Podium */}
            {traders.length >= 3 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 32 }}>
                    {/* 2nd place */}
                    <div style={{ border: '1px solid #9ca3af', borderRadius: 8, padding: 20, textAlign: 'center', marginTop: 24 }}>
                        <p style={{ fontSize: 32, margin: 0 }}>🥈</p>
                        <p style={{ fontWeight: 'bold', margin: '8px 0 4px' }}>{traders[1]?.username}</p>
                        <p style={{ color: '#22c55e', margin: 0, fontSize: 18 }}>{traders[1]?.winRate}%</p>
                        <p style={{ color: 'gray', margin: '4px 0 0', fontSize: 12 }}>{traders[1]?.totalTrades} trades</p>
                    </div>
                    {/* 1st place */}
                    <div style={{ border: '2px solid #f59e0b', borderRadius: 8, padding: 20, textAlign: 'center', background: '#f59e0b11' }}>
                        <p style={{ fontSize: 40, margin: 0 }}>🥇</p>
                        <p style={{ fontWeight: 'bold', margin: '8px 0 4px', fontSize: 16 }}>{traders[0]?.username}</p>
                        <p style={{ color: '#22c55e', margin: 0, fontSize: 22, fontWeight: 'bold' }}>{traders[0]?.winRate}%</p>
                        <p style={{ color: 'gray', margin: '4px 0 0', fontSize: 12 }}>{traders[0]?.totalTrades} trades</p>
                    </div>
                    {/* 3rd place */}
                    <div style={{ border: '1px solid #cd7f32', borderRadius: 8, padding: 20, textAlign: 'center', marginTop: 40 }}>
                        <p style={{ fontSize: 28, margin: 0 }}>🥉</p>
                        <p style={{ fontWeight: 'bold', margin: '8px 0 4px' }}>{traders[2]?.username}</p>
                        <p style={{ color: '#22c55e', margin: 0, fontSize: 18 }}>{traders[2]?.winRate}%</p>
                        <p style={{ color: 'gray', margin: '4px 0 0', fontSize: 12 }}>{traders[2]?.totalTrades} trades</p>
                    </div>
                </div>
            )}

            {/* Full Rankings Table */}
            {loading ? (
                <p style={{ textAlign: 'center', color: 'gray' }}>Loading leaderboard...</p>
            ) : traders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 48, color: 'gray' }}>
                    <p style={{ fontSize: 18 }}>No traders ranked yet.</p>
                    <button
                        onClick={() => navigate('/journal')}
                        style={{ padding: '10px 24px', background: '#22c55e', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                    >
                        Log trades to appear here →
                    </button>
                </div>
            ) : (
                <div style={{ border: '1px solid #ccc', borderRadius: 8, overflow: 'hidden' }}>
                    {/* Table header */}
                    <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr repeat(4, 100px)', padding: '12px 16px', background: '#33333322', fontWeight: 'bold', fontSize: 13, color: 'gray' }}>
                        <span>Rank</span>
                        <span>Trader</span>
                        <span style={{ textAlign: 'center' }}>Win Rate</span>
                        <span style={{ textAlign: 'center' }}>Trades</span>
                        <span style={{ textAlign: 'center' }}>Pips</span>
                        <span style={{ textAlign: 'center' }}>Avg R:R</span>
                    </div>

                    {/* Table rows */}
                    {traders.map((trader, index) => (
                        <div
                            key={trader.id}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '50px 1fr repeat(4, 100px)',
                                padding: '14px 16px',
                                borderTop: '1px solid #ccc',
                                background: trader.isCurrentUser ? '#22c55e11' : 'transparent',
                                alignItems: 'center'
                            }}
                        >
                            <span style={{ fontWeight: 'bold', fontSize: 16 }}>{getMedal(index)}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: '50%',
                                    background: trader.isCurrentUser ? '#22c55e' : '#6b7280',
                                    display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', color: 'white',
                                    fontWeight: 'bold', fontSize: 13
                                }}>
                                    {trader.username[0].toUpperCase()}
                                </div>
                                <span style={{ fontWeight: trader.isCurrentUser ? 'bold' : 'normal' }}>
                                    {trader.username} {trader.isCurrentUser && '(you)'}
                                </span>
                            </div>
                            <span style={{ textAlign: 'center', color: '#22c55e', fontWeight: 'bold' }}>{trader.winRate}%</span>
                            <span style={{ textAlign: 'center', color: 'gray' }}>{trader.totalTrades}</span>
                            <span style={{ textAlign: 'center', color: trader.totalPips >= 0 ? '#22c55e' : '#ef4444' }}>
                                {trader.totalPips >= 0 ? '+' : ''}{trader.totalPips}
                            </span>
                            <span style={{ textAlign: 'center', color: 'gray' }}>{trader.avgRR}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Leaderboard