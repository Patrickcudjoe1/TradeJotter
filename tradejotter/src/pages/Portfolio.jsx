import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthProvider'
import { useNavigate } from 'react-router-dom'

const Portfolio = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [trades, setTrades] = useState([])
    const [timeRange, setTimeRange] = useState('all')

    useEffect(() => {
        const saved = localStorage.getItem(`trades_${user.id}`)
        if (saved) setTrades(JSON.parse(saved))
    }, [user])

    const filtered = trades.filter(t => {
        if (timeRange === 'all') return true
        const d = new Date(t.createdAt)
        const now = new Date()
        if (timeRange === 'week') return d >= new Date(now - 7 * 86400000)
        if (timeRange === 'month') return d >= new Date(now - 30 * 86400000)
        return true
    })

    const total = filtered.length
    const wins = filtered.filter(t => t.result === 'win').length
    const losses = filtered.filter(t => t.result === 'loss').length
    const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : 0
    const totalPips = filtered.reduce((sum, t) => sum + t.pips, 0).toFixed(1)
    const avgRR = total > 0 ? (filtered.reduce((sum, t) => sum + t.riskReward, 0) / total).toFixed(2) : 0

    const pairMap = {}
    filtered.forEach(t => {
        if (!pairMap[t.pair]) pairMap[t.pair] = { pair: t.pair, trades: 0, wins: 0, pips: 0 }
        pairMap[t.pair].trades++
        pairMap[t.pair].pips += t.pips
        if (t.result === 'win') pairMap[t.pair].wins++
    })
    const pairs = Object.values(pairMap).sort((a, b) => b.trades - a.trades)

    const sorted = [...filtered].sort((a, b) => b.pips - a.pips)
    const best = sorted[0]
    const worst = sorted[sorted.length - 1]

    // Equity curve
    let cum = 0
    const equity = [...filtered].reverse().map((t, i) => { cum += t.pips; return { i: i + 1, v: cum } })

    const StatCard = ({ label, value, color }) => (
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: '18px 20px' }}>
            <p style={{ color: '#444', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>{label}</p>
            <p style={{ fontSize: 24, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', margin: 0, color: color || '#fff' }}>{value}</p>
        </div>
    )

    return (
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>📊 Portfolio</h1>
                    <p style={{ color: '#444', margin: '6px 0 0', fontSize: 13 }}>Your trading performance overview</p>
                </div>
                <select value={timeRange} onChange={e => setTimeRange(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, width: 'auto' }}>
                    <option value="all">All Time</option>
                    <option value="month">Last 30 Days</option>
                    <option value="week">Last 7 Days</option>
                </select>
            </div>

            {total === 0 ? (
                <div style={{ textAlign: 'center', padding: 80, background: '#111', border: '1px solid #1e1e1e', borderRadius: 12 }}>
                    <p style={{ color: '#333', fontSize: 40, margin: '0 0 12px' }}>📭</p>
                    <p style={{ color: '#444', margin: '0 0 20px' }}>No trades for this period</p>
                    <button onClick={() => navigate('/journal')} style={{ padding: '10px 24px', background: '#00ff88', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                        Log trades in Journal →
                    </button>
                </div>
            ) : (
                <>
                    {/* Stats grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                        <StatCard label="Total Trades" value={total} />
                        <StatCard label="Win Rate" value={`${winRate}%`} color={parseFloat(winRate) >= 50 ? '#00ff88' : '#ff4466'} />
                        <StatCard label="Total Pips" value={totalPips} color={parseFloat(totalPips) >= 0 ? '#00ff88' : '#ff4466'} />
                        <StatCard label="Wins" value={wins} color="#00ff88" />
                        <StatCard label="Losses" value={losses} color="#ff4466" />
                        <StatCard label="Avg R:R" value={avgRR} color="#ffbb00" />
                    </div>

                    {/* Equity curve */}
                    <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 24, marginBottom: 24 }}>
                        <p style={{ color: '#444', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px' }}>Equity Curve</p>
                        {equity.length > 1 ? (
                            <svg width="100%" height="100" viewBox={`0 0 ${equity.length} 100`} preserveAspectRatio="none">
                                {(() => {
                                    const max = Math.max(...equity.map(p => p.v))
                                    const min = Math.min(...equity.map(p => p.v))
                                    const range = max - min || 1
                                    const pts = equity.map(p => `${p.i - 1},${90 - ((p.v - min) / range) * 80}`).join(' ')
                                    const last = equity[equity.length - 1]
                                    const color = last.v >= 0 ? '#00ff88' : '#ff4466'
                                    return <polyline points={pts} fill="none" stroke={color} strokeWidth="0.8" />
                                })()}
                            </svg>
                        ) : (
                            <p style={{ color: '#333', textAlign: 'center', padding: 20 }}>Log more trades to see your equity curve</p>
                        )}
                    </div>

                    {/* Pair performance */}
                    <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
                        <div style={{ padding: '14px 20px', borderBottom: '1px solid #1a1a1a' }}>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>Performance by Pair</p>
                        </div>
                        {pairs.map(p => (
                            <div key={p.pair} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid #161616' }}>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <span style={{ fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', fontSize: 14 }}>{p.pair}</span>
                                    <span style={{ color: '#333', fontSize: 12 }}>{p.trades} trades</span>
                                </div>
                                <div style={{ display: 'flex', gap: 20 }}>
                                    <span style={{ color: '#00ff88', fontSize: 13, fontFamily: 'JetBrains Mono, monospace' }}>{((p.wins / p.trades) * 100).toFixed(0)}% WR</span>
                                    <span style={{ color: p.pips >= 0 ? '#00ff88' : '#ff4466', fontSize: 13, fontFamily: 'JetBrains Mono, monospace' }}>{p.pips >= 0 ? '+' : ''}{p.pips.toFixed(1)}p</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Best & worst */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        {best && (
                            <div style={{ background: '#111', border: '1px solid #00ff8830', borderRadius: 12, padding: 20 }}>
                                <p style={{ color: '#00ff88', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>🏆 Best Trade</p>
                                <p style={{ fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', margin: '0 0 4px', fontSize: 15 }}>{best.pair}</p>
                                <p style={{ color: '#00ff88', fontSize: 28, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', margin: '0 0 6px' }}>+{best.pips}p</p>
                                <p style={{ color: '#333', fontSize: 12, margin: 0 }}>R:R {best.riskReward} · {new Date(best.createdAt).toLocaleDateString()}</p>
                            </div>
                        )}
                        {worst && worst.id !== best?.id && (
                            <div style={{ background: '#111', border: '1px solid #ff446630', borderRadius: 12, padding: 20 }}>
                                <p style={{ color: '#ff4466', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>📉 Worst Trade</p>
                                <p style={{ fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', margin: '0 0 4px', fontSize: 15 }}>{worst.pair}</p>
                                <p style={{ color: '#ff4466', fontSize: 28, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', margin: '0 0 6px' }}>{worst.pips}p</p>
                                <p style={{ color: '#333', fontSize: 12, margin: 0 }}>R:R {worst.riskReward} · {new Date(worst.createdAt).toLocaleDateString()}</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default Portfolio