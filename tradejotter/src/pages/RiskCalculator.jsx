import { useState } from 'react'

const RiskCalculator = () => {
    const [form, setForm] = useState({ accountBalance: '', riskPercent: '', entryPrice: '', stopLoss: '', takeProfit: '', pipValue: 10 })
    const [results, setResults] = useState(null)

    const calculate = (e) => {
        e.preventDefault()
        const balance = parseFloat(form.accountBalance)
        const riskPct = parseFloat(form.riskPercent)
        const entry = parseFloat(form.entryPrice)
        const sl = parseFloat(form.stopLoss)
        const tp = parseFloat(form.takeProfit)
        const pipVal = parseFloat(form.pipValue)
        const riskAmount = (balance * riskPct) / 100
        const slPips = Math.abs(entry - sl) * 10000
        const tpPips = Math.abs(tp - entry) * 10000
        const lotSize = (riskAmount / (slPips * pipVal)).toFixed(2)
        const rr = (tpPips / slPips).toFixed(2)
        const breakEvenWR = ((1 / (1 + parseFloat(rr))) * 100).toFixed(1)
        const potentialProfit = (tpPips * pipVal * lotSize).toFixed(2)
        setResults({ riskAmount: riskAmount.toFixed(2), slPips: slPips.toFixed(1), tpPips: tpPips.toFixed(1), lotSize, rr, breakEvenWR, potentialProfit })
    }

    const Label = ({ text }) => (
        <label style={{ display: 'block', color: '#444', fontSize: 11, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{text}</label>
    )

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>⚖️ Risk Calculator</h1>
                <p style={{ color: '#444', margin: '6px 0 0', fontSize: 13 }}>Calculate your lot size and risk before entering a trade</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: results ? '1fr 1fr' : '1fr', gap: 24 }}>
                {/* Form */}
                <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 24 }}>
                    <form onSubmit={calculate}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div><Label text="Account Balance ($)" /><input type="number" placeholder="10000" value={form.accountBalance} onChange={e => setForm({ ...form, accountBalance: e.target.value })} required /></div>
                            <div><Label text="Risk %" /><input type="number" step="0.1" placeholder="1" value={form.riskPercent} onChange={e => setForm({ ...form, riskPercent: e.target.value })} required /></div>
                            <div><Label text="Entry Price" /><input type="number" step="0.00001" placeholder="1.08500" value={form.entryPrice} onChange={e => setForm({ ...form, entryPrice: e.target.value })} required /></div>
                            <div><Label text="Stop Loss" /><input type="number" step="0.00001" placeholder="1.08200" value={form.stopLoss} onChange={e => setForm({ ...form, stopLoss: e.target.value })} required /></div>
                            <div><Label text="Take Profit" /><input type="number" step="0.00001" placeholder="1.09100" value={form.takeProfit} onChange={e => setForm({ ...form, takeProfit: e.target.value })} required /></div>
                            <div>
                                <Label text="Pip Value" />
                                <select value={form.pipValue} onChange={e => setForm({ ...form, pipValue: e.target.value })}>
                                    <option value={10}>$10 — Standard</option>
                                    <option value={1}>$1 — Mini</option>
                                    <option value={0.1}>$0.10 — Micro</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                            <button type="submit" style={{ flex: 1, padding: '12px', background: '#00ff88', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                                Calculate →
                            </button>
                            <button type="button" onClick={() => { setForm({ accountBalance: '', riskPercent: '', entryPrice: '', stopLoss: '', takeProfit: '', pipValue: 10 }); setResults(null) }} style={{ padding: '12px 20px', borderRadius: 8, cursor: 'pointer' }}>
                                Reset
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results */}
                {results && (
                    <div style={{ background: '#111', border: '1px solid #00ff8830', borderRadius: 12, padding: 24 }}>
                        <h3 style={{ margin: '0 0 20px', color: '#00ff88', fontSize: 16 }}>Results</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                            {[
                                { label: 'LOT SIZE', value: results.lotSize, color: '#00ff88', big: true },
                                { label: 'RISK AMOUNT', value: `$${results.riskAmount}`, color: '#ff4466', big: true },
                                { label: 'RISK:REWARD', value: `1 : ${results.rr}`, color: '#fff' },
                                { label: 'POTENTIAL PROFIT', value: `$${results.potentialProfit}`, color: '#00ff88' },
                                { label: 'SL DISTANCE', value: `${results.slPips} pips`, color: '#fff' },
                                { label: 'TP DISTANCE', value: `${results.tpPips} pips`, color: '#fff' },
                            ].map(s => (
                                <div key={s.label} style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 8, padding: '12px 14px' }}>
                                    <p style={{ color: '#444', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>{s.label}</p>
                                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: s.big ? 22 : 16, fontWeight: 700, margin: 0, color: s.color }}>{s.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* R:R Bar */}
                        <div style={{ marginBottom: 16 }}>
                            <p style={{ color: '#444', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Risk vs Reward</p>
                            <div style={{ display: 'flex', height: 28, borderRadius: 6, overflow: 'hidden' }}>
                                <div style={{ width: `${(1 / (1 + parseFloat(results.rr))) * 100}%`, background: '#ff4466', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700 }}>Risk</div>
                                <div style={{ flex: 1, background: '#00ff88', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: 11, fontWeight: 700 }}>Reward</div>
                            </div>
                        </div>

                        <div style={{ background: '#ffbb0010', border: '1px solid #ffbb0025', borderRadius: 8, padding: '12px 14px' }}>
                            <p style={{ margin: 0, fontSize: 13, color: '#ffbb00' }}>
                                💡 You need <strong>{results.breakEvenWR}%</strong> win rate to break even with this R:R
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RiskCalculator