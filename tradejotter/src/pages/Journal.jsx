import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthProvider'

const Journal = () => {
    const { user } = useAuth()
    const storageKey = `trades_${user.id}`
    const [trades, setTrades] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ pair: '', direction: 'buy', result: 'win', pips: '', riskReward: '', lesson: '', tags: '' })

    useEffect(() => {
        const saved = localStorage.getItem(storageKey)
        if (saved) setTrades(JSON.parse(saved))
    }, [storageKey])

    const saveTrades = (updated) => {
        localStorage.setItem(storageKey, JSON.stringify(updated))
        setTrades(updated)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (trades.length >= 20) return alert('Free plan limit: 20 trades. Upgrade to Pro.')
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
        saveTrades([newTrade, ...trades])
        setShowForm(false)
        setForm({ pair: '', direction: 'buy', result: 'win', pips: '', riskReward: '', lesson: '', tags: '' })
    }

    const deleteTrade = (id) => {
        if (window.confirm('Delete this trade?')) saveTrades(trades.filter(t => t.id !== id))
    }

    const wins = trades.filter(t => t.result === 'win').length
    const winRate = trades.length > 0 ? ((wins / trades.length) * 100).toFixed(1) : 0
    const totalPips = trades.reduce((sum, t) => sum + t.pips, 0).toFixed(1)

    const Badge = ({ text, color }) => (
        <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, background: color + '20', color, letterSpacing: '0.05em' }}>
            {text}
        </span>
    )

    return (
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>📓 Trade Journal</h1>
                    <p style={{ color: '#444', margin: '6px 0 0', fontSize: 13 }}>{trades.length}/20 trades on free plan</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{ padding: '10px 20px', background: showForm ? '#1e1e1e' : '#00ff88', color: showForm ? '#fff' : '#000', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
                >
                    {showForm ? '✕ Cancel' : '+ Log Trade'}
                </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
                {[
                    { label: 'TOTAL TRADES', value: trades.length },
                    { label: 'WIN RATE', value: `${winRate}%`, color: parseFloat(winRate) >= 50 ? '#00ff88' : '#ff4466' },
                    { label: 'TOTAL PIPS', value: totalPips, color: parseFloat(totalPips) >= 0 ? '#00ff88' : '#ff4466' },
                ].map(s => (
                    <div key={s.label} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: '18px 20px' }}>
                        <p style={{ color: '#444', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>{s.label}</p>
                        <p style={{ fontSize: 26, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', margin: 0, color: s.color || '#fff' }}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Form */}
            {showForm && (
                <div style={{ background: '#111', border: '1px solid #00ff8830', borderRadius: 12, padding: 24, marginBottom: 32 }}>
                    <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600 }}>Log New Trade</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                            {[
                                { label: 'PAIR', el: <input placeholder="e.g. EURUSD" value={form.pair} onChange={e => setForm({ ...form, pair: e.target.value })} required /> },
                                { label: 'DIRECTION', el: <select value={form.direction} onChange={e => setForm({ ...form, direction: e.target.value })}><option value="buy">Buy</option><option value="sell">Sell</option></select> },
                                { label: 'RESULT', el: <select value={form.result} onChange={e => setForm({ ...form, result: e.target.value })}><option value="win">Win</option><option value="loss">Loss</option><option value="breakeven">Breakeven</option></select> },
                                { label: 'PIPS', el: <input type="number" placeholder="e.g. 20" value={form.pips} onChange={e => setForm({ ...form, pips: e.target.value })} /> },
                                { label: 'RISK:REWARD', el: <input type="number" step="0.1" placeholder="e.g. 2.5" value={form.riskReward} onChange={e => setForm({ ...form, riskReward: e.target.value })} /> },
                                { label: 'TAGS', el: <input placeholder="e.g. london, trend" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} /> },
                            ].map(f => (
                                <div key={f.label}>
                                    <label style={{ display: 'block', color: '#444', fontSize: 11, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{f.label}</label>
                                    {f.el}
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: 16 }}>
                            <label style={{ display: 'block', color: '#444', fontSize: 11, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>LESSON LEARNED</label>
                            <textarea placeholder="What did you learn?" value={form.lesson} onChange={e => setForm({ ...form, lesson: e.target.value })} style={{ minHeight: 80 }} />
                        </div>
                        <button type="submit" style={{ marginTop: 16, padding: '10px 28px', background: '#00ff88', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                            Save Trade
                        </button>
                    </form>
                </div>
            )}

            {/* Trade list */}
            {trades.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, background: '#111', border: '1px solid #1e1e1e', borderRadius: 12 }}>
                    <p style={{ color: '#333', fontSize: 32, margin: '0 0 12px' }}>📭</p>
                    <p style={{ color: '#444', margin: 0 }}>No trades logged yet. Click + Log Trade to start.</p>
                </div>
            ) : (
                <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, overflow: 'hidden' }}>
                    {trades.map((trade, i) => (
                        <div key={trade.id} style={{ padding: '16px 20px', borderBottom: i < trades.length - 1 ? '1px solid #161616' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                                    <span style={{ fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', fontSize: 14 }}>{trade.pair}</span>
                                    <Badge text={trade.direction.toUpperCase()} color={trade.direction === 'buy' ? '#00ff88' : '#ff4466'} />
                                    <Badge text={trade.result.toUpperCase()} color={trade.result === 'win' ? '#00ff88' : trade.result === 'loss' ? '#ff4466' : '#ffbb00'} />
                                    <span style={{ color: '#333', fontSize: 12 }}>{new Date(trade.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#444' }}>
                                    <span>Pips: <span style={{ color: trade.pips >= 0 ? '#00ff88' : '#ff4466', fontFamily: 'JetBrains Mono, monospace' }}>{trade.pips >= 0 ? '+' : ''}{trade.pips}</span></span>
                                    <span>R:R <span style={{ color: '#fff', fontFamily: 'JetBrains Mono, monospace' }}>{trade.riskReward}</span></span>
                                    {trade.tags.length > 0 && trade.tags.map(tag => (
                                        <span key={tag} style={{ color: '#333' }}>#{tag}</span>
                                    ))}
                                </div>
                                {trade.lesson && <p style={{ margin: '6px 0 0', fontSize: 12, color: '#555' }}>💡 {trade.lesson}</p>}
                            </div>
                            <button onClick={() => deleteTrade(trade.id)} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', fontSize: 16, padding: '4px 8px' }}
                                onMouseEnter={e => e.target.style.color = '#ff4466'}
                                onMouseLeave={e => e.target.style.color = '#333'}
                            >🗑</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Journal