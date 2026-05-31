import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthProvider'
import { supabase } from '../lib/supabase'

const Leaderboard = () => {
    const { user } = useAuth()
    const [traders, setTraders] = useState([])
    const [loading, setLoading] = useState(true)
    const [period, setPeriod] = useState('alltime')

    useEffect(() => { fetchLeaderboard() }, [period])

    const fetchLeaderboard = async () => {
        setLoading(true)
        const { data: profiles } = await supabase.from('profiles').select('id, username')
        if (!profiles) { setLoading(false); return }

        const data = []
        for (const p of profiles) {
            let q = supabase.from('trades').select('*').eq('user_id', p.id)
            if (period === 'weekly') q = q.gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString())
            if (period === 'monthly') q = q.gte('created_at', new Date(Date.now() - 30 * 86400000).toISOString())
            const { data: trades } = await q
            if (trades && trades.length > 0) {
                const wins = trades.filter(t => t.result === 'win').length
                data.push({
                    id: p.id,
                    username: p.username || 'Anonymous',
                    totalTrades: trades.length,
                    winRate: parseFloat(((wins / trades.length) * 100).toFixed(1)),
                    totalPips: parseFloat(trades.reduce((s, t) => s + (t.pips || 0), 0).toFixed(1)),
                    avgRR: parseFloat((trades.reduce((s, t) => s + (t.risk_reward || 0), 0) / trades.length).toFixed(2)),
                    isMe: p.id === user.id
                })
            }
        }
        data.sort((a, b) => b.winRate - a.winRate)
        setTraders(data)
        setLoading(false)
    }

    const medals = ['🥇', '🥈', '🥉']

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>🏆 Leaderboard</h1>
                    <p style={{ color: '#444', margin: '6px 0 0', fontSize: 13 }}>Top traders ranked by win rate</p>
                </div>
                <select value={period} onChange={e => setPeriod(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, width: 'auto' }}>
                    <option value="alltime">All Time</option>
                    <option value="monthly">This Month</option>
                    <option value="weekly">This Week</option>
                </select>
            </div>

            {/* Podium */}
            {traders.length >= 3 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 32 }}>
                    {[traders[1], traders[0], traders[2]].map((t, i) => {
                        const realIndex = i === 0 ? 1 : i === 1 ? 0 : 2
                        const heights = ['80px', '0px', '100px']
                        return (
                            <div key={t.id} style={{ background: '#111', border: `1px solid ${realIndex === 0 ? '#ffbb0040' : '#1e1e1e'}`, borderRadius: 12, padding: 20, textAlign: 'center', marginTop: heights[i] }}>
                                <p style={{ fontSize: realIndex === 0 ? 36 : 28, margin: '0 0 8px' }}>{medals[realIndex]}</p>
                                <p style={{ fontWeight: 700, margin: '0 0 4px', fontSize: 14 }}>{t.username}</p>
                                <p style={{ color: '#00ff88', fontFamily: 'JetBrains Mono, monospace', fontSize: realIndex === 0 ? 22 : 18, fontWeight: 700, margin: '0 0 4px' }}>{t.winRate}%</p>
                                <p style={{ color: '#333', fontSize: 11, margin: 0 }}>{t.totalTrades} trades</p>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Table */}
            {loading ? (
                <p style={{ textAlign: 'center', color: '#333', padding: 40 }}>Loading...</p>
            ) : traders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, background: '#111', border: '1px solid #1e1e1e', borderRadius: 12 }}>
                    <p style={{ color: '#333', fontSize: 40, margin: '0 0 12px' }}>🏆</p>
                    <p style={{ color: '#444' }}>No traders ranked yet. Log trades to appear here!</p>
                </div>
            ) : (
                <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr repeat(4, 90px)', padding: '10px 20px', borderBottom: '1px solid #1a1a1a' }}>
                        {['#', 'Trader', 'Win Rate', 'Trades', 'Pips', 'R:R'].map(h => (
                            <span key={h} style={{ color: '#333', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: h === 'Trader' || h === '#' ? 'left' : 'center' }}>{h}</span>
                        ))}
                    </div>
                    {traders.map((t, i) => (
                        <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '48px 1fr repeat(4, 90px)', padding: '14px 20px', borderBottom: '1px solid #161616', background: t.isMe ? '#00ff8808' : 'transparent', alignItems: 'center' }}>
                            <span style={{ fontWeight: 700, fontSize: 16 }}>{medals[i] || `#${i + 1}`}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 30, height: 30, borderRadius: '50%', background: t.isMe ? '#00ff8820' : '#1a1a1a', border: `1px solid ${t.isMe ? '#00ff8840' : '#2a2a2a'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.isMe ? '#00ff88' : '#555', fontWeight: 700, fontSize: 12 }}>
                                    {t.username[0].toUpperCase()}
                                </div>
                                <span style={{ fontWeight: t.isMe ? 700 : 400, color: t.isMe ? '#00ff88' : '#fff', fontSize: 14 }}>
                                    {t.username}{t.isMe && ' (you)'}
                                </span>
                            </div>
                            <span style={{ textAlign: 'center', color: '#00ff88', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>{t.winRate}%</span>
                            <span style={{ textAlign: 'center', color: '#444', fontFamily: 'JetBrains Mono, monospace' }}>{t.totalTrades}</span>
                            <span style={{ textAlign: 'center', color: t.totalPips >= 0 ? '#00ff88' : '#ff4466', fontFamily: 'JetBrains Mono, monospace' }}>{t.totalPips >= 0 ? '+' : ''}{t.totalPips}</span>
                            <span style={{ textAlign: 'center', color: '#ffbb00', fontFamily: 'JetBrains Mono, monospace' }}>{t.avgRR}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Leaderboard