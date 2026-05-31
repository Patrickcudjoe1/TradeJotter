import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthProvider'
import { useNavigate } from 'react-router-dom'

const Journal = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const storageKey = `trades_${user.id}`

    const [trades, setTrades] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({
        pair: '',
        direction: 'buy',
        result: 'win',
        pips: '',
        riskReward: '',
        lesson: '',
        tags: ''
    })

    // Load trades from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(storageKey)
        if (saved) setTrades(JSON.parse(saved))
    }, [storageKey])

    // Save trades to localStorage
    const saveTrades = (updatedTrades) => {
        localStorage.setItem(storageKey, JSON.stringify(updatedTrades))
        setTrades(updatedTrades)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (trades.length >= 20) {
            alert('Free plan limit: 20 trades. Upgrade to Pro for unlimited.')
            return
        }

        const newTrade = {
            id: Date.now(),
            pair: form.pair.toUpperCase(),
            direction: form.direction,
            result: form.result,
            pips: parseFloat(form.pips) || 0,
            riskReward: parseFloat(form.riskReward) || 0,
            lesson: form.lesson,
            tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
            createdAt: new Date().toISOString()
        }

        const updated = [newTrade, ...trades]
        saveTrades(updated)
        setShowForm(false)
        setForm({ pair: '', direction: 'buy', result: 'win', pips: '', riskReward: '', lesson: '', tags: '' })
    }

    const deleteTrade = (id) => {
        if (window.confirm('Delete this trade?')) {
            saveTrades(trades.filter(t => t.id !== id))
        }
    }

    // Stats
    const wins = trades.filter(t => t.result === 'win').length
    const winRate = trades.length > 0 ? ((wins / trades.length) * 100).toFixed(1) : 0
    const totalPips = trades.reduce((sum, t) => sum + t.pips, 0).toFixed(1)

    return (
        <div style={{ maxWidth: 900, margin: '40px auto', padding: 24 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1>📓 Trade Journal</h1>
                    <p style={{ color: 'gray', margin: 0 }}>
                        {trades.length}/20 trades (Free plan)
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 16px' }}>
                        ← Dashboard
                    </button>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        style={{ padding: '8px 16px', background: '#22c55e', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                    >
                        {showForm ? 'Cancel' : '+ Log Trade'}
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                <div style={{ padding: 16, border: '1px solid #ccc', borderRadius: 8, textAlign: 'center' }}>
                    <p style={{ color: 'gray', margin: 0 }}>Total Trades</p>
                    <h3 style={{ margin: '4px 0' }}>{trades.length}</h3>
                </div>
                <div style={{ padding: 16, border: '1px solid #ccc', borderRadius: 8, textAlign: 'center' }}>
                    <p style={{ color: 'gray', margin: 0 }}>Win Rate</p>
                    <h3 style={{ margin: '4px 0' }}>{winRate}%</h3>
                </div>
                <div style={{ padding: 16, border: '1px solid #ccc', borderRadius: 8, textAlign: 'center' }}>
                    <p style={{ color: 'gray', margin: 0 }}>Total Pips</p>
                    <h3 style={{ margin: '4px 0' }}>{totalPips}</h3>
                </div>
            </div>

            {/* Add Trade Form */}
            {showForm && (
                <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 24, marginBottom: 24 }}>
                    <h3 style={{ marginTop: 0 }}>Log New Trade</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                            <div>
                                <label>Pair</label>
                                <input
                                    placeholder="e.g. EURUSD"
                                    value={form.pair}
                                    onChange={e => setForm({ ...form, pair: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: 8, marginTop: 4 }}
                                />
                            </div>
                            <div>
                                <label>Direction</label>
                                <select
                                    value={form.direction}
                                    onChange={e => setForm({ ...form, direction: e.target.value })}
                                    style={{ width: '100%', padding: 8, marginTop: 4 }}
                                >
                                    <option value="buy">Buy</option>
                                    <option value="sell">Sell</option>
                                </select>
                            </div>
                            <div>
                                <label>Result</label>
                                <select
                                    value={form.result}
                                    onChange={e => setForm({ ...form, result: e.target.value })}
                                    style={{ width: '100%', padding: 8, marginTop: 4 }}
                                >
                                    <option value="win">Win</option>
                                    <option value="loss">Loss</option>
                                    <option value="breakeven">Breakeven</option>
                                </select>
                            </div>
                            <div>
                                <label>Pips</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 20"
                                    value={form.pips}
                                    onChange={e => setForm({ ...form, pips: e.target.value })}
                                    style={{ width: '100%', padding: 8, marginTop: 4 }}
                                />
                            </div>
                            <div>
                                <label>Risk:Reward</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    placeholder="e.g. 2.5"
                                    value={form.riskReward}
                                    onChange={e => setForm({ ...form, riskReward: e.target.value })}
                                    style={{ width: '100%', padding: 8, marginTop: 4 }}
                                />
                            </div>
                            <div>
                                <label>Tags (comma separated)</label>
                                <input
                                    placeholder="e.g. london session, trend"
                                    value={form.tags}
                                    onChange={e => setForm({ ...form, tags: e.target.value })}
                                    style={{ width: '100%', padding: 8, marginTop: 4 }}
                                />
                            </div>
                        </div>
                        <div style={{ marginTop: 12 }}>
                            <label>Lesson Learned</label>
                            <textarea
                                placeholder="What did you learn from this trade?"
                                value={form.lesson}
                                onChange={e => setForm({ ...form, lesson: e.target.value })}
                                style={{ width: '100%', padding: 8, marginTop: 4, minHeight: 80 }}
                            />
                        </div>
                        <button
                            type="submit"
                            style={{ marginTop: 16, padding: '10px 24px', background: '#22c55e', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                        >
                            Save Trade
                        </button>
                    </form>
                </div>
            )}

            {/* Trade List */}
            {trades.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 48, color: 'gray' }}>
                    <p>No trades logged yet. Click "+ Log Trade" to start.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {trades.map(trade => (
                        <div key={trade.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                                    <strong>{trade.pair}</strong>
                                    <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 12, background: trade.direction === 'buy' ? '#22c55e22' : '#ef444422', color: trade.direction === 'buy' ? '#22c55e' : '#ef4444' }}>
                                        {trade.direction.toUpperCase()}
                                    </span>
                                    <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 12, background: trade.result === 'win' ? '#22c55e22' : trade.result === 'loss' ? '#ef444422' : '#f59e0b22', color: trade.result === 'win' ? '#22c55e' : trade.result === 'loss' ? '#ef4444' : '#f59e0b' }}>
                                        {trade.result.toUpperCase()}
                                    </span>
                                </div>
                                <p style={{ margin: 0, color: 'gray', fontSize: 14 }}>
                                    {trade.pips} pips · R:R {trade.riskReward} · {new Date(trade.createdAt).toLocaleDateString()}
                                </p>
                                {trade.lesson && <p style={{ margin: '4px 0 0', fontSize: 13, color: 'gray' }}>💡 {trade.lesson}</p>}
                                {trade.tags.length > 0 && (
                                    <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                                        {trade.tags.map(tag => (
                                            <span key={tag} style={{ fontSize: 11, padding: '2px 6px', background: '#33333322', borderRadius: 4 }}>#{tag}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => deleteTrade(trade.id)}
                                style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}
                            >
                                🗑
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Journal