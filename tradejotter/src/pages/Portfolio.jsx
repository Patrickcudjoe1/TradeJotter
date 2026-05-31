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

    // Filter by time range
    const filteredTrades = trades.filter(trade => {
        if (timeRange === 'all') return true
        const tradeDate = new Date(trade.createdAt)
        const now = new Date()
        if (timeRange === 'week') {
            const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)
            return tradeDate >= weekAgo
        }
        if (timeRange === 'month') {
            const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000)
            return tradeDate >= monthAgo
        }
        return true
    })

    // Stats
    const totalTrades = filteredTrades.length
    const wins = filteredTrades.filter(t => t.result === 'win').length
    const losses = filteredTrades.filter(t => t.result === 'loss').length
    const winRate = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(1) : 0
    const totalPips = filteredTrades.reduce((sum, t) => sum + t.pips, 0).toFixed(1)
    const avgRR = totalTrades > 0
        ? (filteredTrades.reduce((sum, t) => sum + t.riskReward, 0) / totalTrades).toFixed(2)
        : 0

    // P&L by pair
    const pairStats = {}
    filteredTrades.forEach(trade => {
        if (!pairStats[trade.pair]) {
            pairStats[trade.pair] = { pair: trade.pair, trades: 0, wins: 0, pips: 0 }
        }
        pairStats[trade.pair].trades++
        pairStats[trade.pair].pips += trade.pips
        if (trade.result === 'win') pairStats[trade.pair].wins++
    })
    const pairList = Object.values(pairStats).sort((a, b) => b.trades - a.trades)

    // Best and worst trades
    const sortedByPips = [...filteredTrades].sort((a, b) => b.pips - a.pips)
    const bestTrade = sortedByPips[0]
    const worstTrade = sortedByPips[sortedByPips.length - 1]

    // Equity curve (cumulative pips)
    const equityCurve = []
    let cumulative = 0
        ;[...filteredTrades].reverse().forEach((trade, i) => {
            cumulative += trade.pips
            equityCurve.push({ index: i + 1, pips: cumulative })
        })

    return (
        <div style={{ maxWidth: 900, margin: '40px auto', padding: 24 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1>📊 Portfolio</h1>
                    <p style={{ color: 'gray', margin: 0 }}>Your trading performance overview</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <select
                        value={timeRange}
                        onChange={e => setTimeRange(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: 6 }}
                    >
                        <option value="all">All Time</option>
                        <option value="month">Last 30 Days</option>
                        <option value="week">Last 7 Days</option>
                    </select>
                    <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 16px' }}>
                        ← Dashboard
                    </button>
                </div>
            </div>

            {totalTrades === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, color: 'gray' }}>
                    <p style={{ fontSize: 18 }}>No trades found for this period.</p>
                    <button
                        onClick={() => navigate('/journal')}
                        style={{ padding: '10px 24px', background: '#22c55e', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                    >
                        Log trades in Journal →
                    </button>
                </div>
            ) : (
                <>
                    {/* Overview Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                        {[
                            { label: 'Total Trades', value: totalTrades },
                            { label: 'Win Rate', value: `${winRate}%` },
                            { label: 'Total Pips', value: totalPips },
                            { label: 'Wins', value: wins, color: '#22c55e' },
                            { label: 'Losses', value: losses, color: '#ef4444' },
                            { label: 'Avg R:R', value: avgRR },
                        ].map(stat => (
                            <div key={stat.label} style={{ padding: 16, border: '1px solid #ccc', borderRadius: 8, textAlign: 'center' }}>
                                <p style={{ color: 'gray', margin: 0, fontSize: 13 }}>{stat.label}</p>
                                <h3 style={{ margin: '6px 0', color: stat.color || 'inherit' }}>{stat.value}</h3>
                            </div>
                        ))}
                    </div>

                    {/* Equity Curve */}
                    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 20, marginBottom: 24 }}>
                        <h3 style={{ marginTop: 0 }}>Equity Curve (Pips)</h3>
                        {equityCurve.length > 1 ? (
                            <div style={{ position: 'relative', height: 120 }}>
                                <svg width="100%" height="120" viewBox={`0 0 ${equityCurve.length} 120`} preserveAspectRatio="none">
                                    {(() => {
                                        const maxPips = Math.max(...equityCurve.map(p => p.pips))
                                        const minPips = Math.min(...equityCurve.map(p => p.pips))
                                        const range = maxPips - minPips || 1
                                        const points = equityCurve.map((p, i) => {
                                            const x = i
                                            const y = 110 - ((p.pips - minPips) / range) * 100
                                            return `${x},${y}`
                                        }).join(' ')
                                        const lastPoint = equityCurve[equityCurve.length - 1]
                                        const lastY = 110 - ((lastPoint.pips - minPips) / range) * 100
                                        const color = lastPoint.pips >= 0 ? '#22c55e' : '#ef4444'
                                        return (
                                            <>
                                                <polyline
                                                    points={points}
                                                    fill="none"
                                                    stroke={color}
                                                    strokeWidth="0.5"
                                                />
                                            </>
                                        )
                                    })()}
                                </svg>
                            </div>
                        ) : (
                            <p style={{ color: 'gray' }}>Log more trades to see your equity curve.</p>
                        )}
                    </div>

                    {/* P&L by Pair */}
                    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 20, marginBottom: 24 }}>
                        <h3 style={{ marginTop: 0 }}>Performance by Pair</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {pairList.map(p => (
                                <div key={p.pair} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: '#33333311', borderRadius: 8 }}>
                                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                        <strong>{p.pair}</strong>
                                        <span style={{ color: 'gray', fontSize: 13 }}>{p.trades} trades</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                                        <span style={{ fontSize: 13, color: '#22c55e' }}>
                                            {((p.wins / p.trades) * 100).toFixed(0)}% WR
                                        </span>
                                        <span style={{ fontSize: 13, color: p.pips >= 0 ? '#22c55e' : '#ef4444' }}>
                                            {p.pips >= 0 ? '+' : ''}{p.pips.toFixed(1)} pips
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Best & Worst Trade */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        {bestTrade && (
                            <div style={{ border: '1px solid #22c55e', borderRadius: 8, padding: 20 }}>
                                <h3 style={{ marginTop: 0, color: '#22c55e' }}>🏆 Best Trade</h3>
                                <p style={{ margin: 0 }}><strong>{bestTrade.pair}</strong> · {bestTrade.direction.toUpperCase()}</p>
                                <p style={{ margin: '4px 0', color: '#22c55e', fontSize: 20 }}>+{bestTrade.pips} pips</p>
                                <p style={{ margin: 0, color: 'gray', fontSize: 13 }}>R:R {bestTrade.riskReward} · {new Date(bestTrade.createdAt).toLocaleDateString()}</p>
                            </div>
                        )}
                        {worstTrade && worstTrade.id !== bestTrade?.id && (
                            <div style={{ border: '1px solid #ef4444', borderRadius: 8, padding: 20 }}>
                                <h3 style={{ marginTop: 0, color: '#ef4444' }}>📉 Worst Trade</h3>
                                <p style={{ margin: 0 }}><strong>{worstTrade.pair}</strong> · {worstTrade.direction.toUpperCase()}</p>
                                <p style={{ margin: '4px 0', color: '#ef4444', fontSize: 20 }}>{worstTrade.pips} pips</p>
                                <p style={{ margin: 0, color: 'gray', fontSize: 13 }}>R:R {worstTrade.riskReward} · {new Date(worstTrade.createdAt).toLocaleDateString()}</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default Portfolio