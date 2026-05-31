import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const RiskCalculator = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        accountBalance: '',
        riskPercent: '',
        entryPrice: '',
        stopLoss: '',
        takeProfit: '',
        pipValue: 10
    })
    const [results, setResults] = useState(null)

    const calculate = (e) => {
        e.preventDefault()

        const balance = parseFloat(form.accountBalance)
        const riskPct = parseFloat(form.riskPercent)
        const entry = parseFloat(form.entryPrice)
        const sl = parseFloat(form.stopLoss)
        const tp = parseFloat(form.takeProfit)
        const pipVal = parseFloat(form.pipValue)

        // Core calculations
        const riskAmount = (balance * riskPct) / 100
        const slPips = Math.abs(entry - sl) * 10000
        const tpPips = Math.abs(tp - entry) * 10000
        const lotSize = (riskAmount / (slPips * pipVal)).toFixed(2)
        const rr = (tpPips / slPips).toFixed(2)
        const breakEvenWR = ((1 / (1 + parseFloat(rr))) * 100).toFixed(1)
        const potentialProfit = (tpPips * pipVal * lotSize).toFixed(2)

        setResults({
            riskAmount: riskAmount.toFixed(2),
            slPips: slPips.toFixed(1),
            tpPips: tpPips.toFixed(1),
            lotSize,
            rr,
            breakEvenWR,
            potentialProfit
        })
    }

    const reset = () => {
        setForm({ accountBalance: '', riskPercent: '', entryPrice: '', stopLoss: '', takeProfit: '', pipValue: 10 })
        setResults(null)
    }

    return (
        <div style={{ maxWidth: 700, margin: '40px auto', padding: 24 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1>⚖️ Risk Calculator</h1>
                    <p style={{ color: 'gray', margin: 0 }}>Calculate lot size, R:R and risk before entering a trade</p>
                </div>
                <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 16px' }}>
                    ← Dashboard
                </button>
            </div>

            {/* Form */}
            <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 24, marginBottom: 24 }}>
                <form onSubmit={calculate}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                        <div>
                            <label>Account Balance ($)</label>
                            <input
                                type="number"
                                placeholder="e.g. 10000"
                                value={form.accountBalance}
                                onChange={e => setForm({ ...form, accountBalance: e.target.value })}
                                required
                                style={{ width: '100%', padding: 8, marginTop: 4 }}
                            />
                        </div>
                        <div>
                            <label>Risk % per trade</label>
                            <input
                                type="number"
                                step="0.1"
                                placeholder="e.g. 1"
                                value={form.riskPercent}
                                onChange={e => setForm({ ...form, riskPercent: e.target.value })}
                                required
                                style={{ width: '100%', padding: 8, marginTop: 4 }}
                            />
                        </div>
                        <div>
                            <label>Entry Price</label>
                            <input
                                type="number"
                                step="0.00001"
                                placeholder="e.g. 1.08500"
                                value={form.entryPrice}
                                onChange={e => setForm({ ...form, entryPrice: e.target.value })}
                                required
                                style={{ width: '100%', padding: 8, marginTop: 4 }}
                            />
                        </div>
                        <div>
                            <label>Stop Loss</label>
                            <input
                                type="number"
                                step="0.00001"
                                placeholder="e.g. 1.08200"
                                value={form.stopLoss}
                                onChange={e => setForm({ ...form, stopLoss: e.target.value })}
                                required
                                style={{ width: '100%', padding: 8, marginTop: 4 }}
                            />
                        </div>
                        <div>
                            <label>Take Profit</label>
                            <input
                                type="number"
                                step="0.00001"
                                placeholder="e.g. 1.09100"
                                value={form.takeProfit}
                                onChange={e => setForm({ ...form, takeProfit: e.target.value })}
                                required
                                style={{ width: '100%', padding: 8, marginTop: 4 }}
                            />
                        </div>
                        <div>
                            <label>Pip Value ($)</label>
                            <select
                                value={form.pipValue}
                                onChange={e => setForm({ ...form, pipValue: e.target.value })}
                                style={{ width: '100%', padding: 8, marginTop: 4 }}
                            >
                                <option value={10}>$10 (Standard lot)</option>
                                <option value={1}>$1 (Mini lot)</option>
                                <option value={0.1}>$0.10 (Micro lot)</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                        <button
                            type="submit"
                            style={{ padding: '10px 24px', background: '#22c55e', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', flex: 1 }}
                        >
                            Calculate
                        </button>
                        <button
                            type="button"
                            onClick={reset}
                            style={{ padding: '10px 24px', borderRadius: 6, cursor: 'pointer' }}
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>

            {/* Results */}
            {results && (
                <div style={{ border: '1px solid #22c55e', borderRadius: 8, padding: 24 }}>
                    <h3 style={{ marginTop: 0, color: '#22c55e' }}>📊 Results</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 20 }}>
                        <div style={{ padding: 16, background: '#22c55e11', borderRadius: 8 }}>
                            <p style={{ margin: 0, color: 'gray', fontSize: 13 }}>Lot Size</p>
                            <h2 style={{ margin: '4px 0', color: '#22c55e' }}>{results.lotSize}</h2>
                        </div>
                        <div style={{ padding: 16, background: '#ef444411', borderRadius: 8 }}>
                            <p style={{ margin: 0, color: 'gray', fontSize: 13 }}>Risk Amount</p>
                            <h2 style={{ margin: '4px 0', color: '#ef4444' }}>${results.riskAmount}</h2>
                        </div>
                        <div style={{ padding: 16, border: '1px solid #ccc', borderRadius: 8 }}>
                            <p style={{ margin: 0, color: 'gray', fontSize: 13 }}>Risk:Reward</p>
                            <h2 style={{ margin: '4px 0' }}>1 : {results.rr}</h2>
                        </div>
                        <div style={{ padding: 16, border: '1px solid #ccc', borderRadius: 8 }}>
                            <p style={{ margin: 0, color: 'gray', fontSize: 13 }}>Potential Profit</p>
                            <h2 style={{ margin: '4px 0', color: '#22c55e' }}>${results.potentialProfit}</h2>
                        </div>
                        <div style={{ padding: 16, border: '1px solid #ccc', borderRadius: 8 }}>
                            <p style={{ margin: 0, color: 'gray', fontSize: 13 }}>SL Distance</p>
                            <h2 style={{ margin: '4px 0' }}>{results.slPips} pips</h2>
                        </div>
                        <div style={{ padding: 16, border: '1px solid #ccc', borderRadius: 8 }}>
                            <p style={{ margin: 0, color: 'gray', fontSize: 13 }}>TP Distance</p>
                            <h2 style={{ margin: '4px 0' }}>{results.tpPips} pips</h2>
                        </div>
                    </div>

                    {/* R:R Visual Bar */}
                    <div style={{ marginBottom: 16 }}>
                        <p style={{ margin: '0 0 8px', fontSize: 13, color: 'gray' }}>Risk vs Reward</p>
                        <div style={{ display: 'flex', height: 24, borderRadius: 6, overflow: 'hidden' }}>
                            <div style={{ width: `${(1 / (1 + parseFloat(results.rr))) * 100}%`, background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12 }}>
                                Risk
                            </div>
                            <div style={{ flex: 1, background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12 }}>
                                Reward
                            </div>
                        </div>
                    </div>

                    {/* Break Even Win Rate */}
                    <div style={{ padding: 12, background: '#f59e0b11', borderRadius: 8, border: '1px solid #f59e0b33' }}>
                        <p style={{ margin: 0, fontSize: 14 }}>
                            💡 You need to win at least <strong>{results.breakEvenWR}%</strong> of your trades to break even with this R:R ratio.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RiskCalculator