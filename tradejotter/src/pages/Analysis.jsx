import { useState } from 'react'
import { useAuth } from '../context/AuthProvider'
import { useNavigate } from 'react-router-dom'

const Analysis = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [image, setImage] = useState(null)
    const [imageBase64, setImageBase64] = useState('')
    const [pair, setPair] = useState('')
    const [loading, setLoading] = useState(false)
    const [analysis, setAnalysis] = useState('')
    const [error, setError] = useState('')

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Preview
        setImage(URL.createObjectURL(file))

        // Convert to base64
        const reader = new FileReader()
        reader.onloadend = () => {
            const base64 = reader.result.split(',')[1]
            setImageBase64(base64)
        }
        reader.readAsDataURL(file)
    }

    const handleAnalyze = async () => {
        if (!imageBase64) {
            setError('Please upload a chart image first')
            return
        }

        setLoading(true)
        setError('')
        setAnalysis('')

        try {
            const response = await fetch('http://localhost:3001/api/ai/analyze-chart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageBase64, pair })
            })

            const data = await response.json()

            if (data.error) {
                setError(data.error)
            } else {
                setAnalysis(data.analysis)
            }
        } catch (err) {
            setError('Could not connect to server. Make sure your backend is running.')
        }

        setLoading(false)
    }

    const reset = () => {
        setImage(null)
        setImageBase64('')
        setPair('')
        setAnalysis('')
        setError('')
    }

    return (
        <div style={{ maxWidth: 900, margin: '40px auto', padding: 24 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1>🤖 AI Chart Analysis</h1>
                    <p style={{ color: 'gray', margin: 0 }}>Upload a chart and get instant AI analysis</p>
                </div>
                <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 16px' }}>
                    ← Dashboard
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: analysis ? '1fr 1fr' : '1fr', gap: 24 }}>
                {/* Upload Section */}
                <div>
                    {/* Pair Input */}
                    <div style={{ marginBottom: 16 }}>
                        <label>Currency Pair (optional)</label>
                        <input
                            type="text"
                            placeholder="e.g. EURUSD"
                            value={pair}
                            onChange={e => setPair(e.target.value.toUpperCase())}
                            style={{ width: '100%', padding: 8, marginTop: 4 }}
                        />
                    </div>

                    {/* Image Upload */}
                    <div
                        onClick={() => document.getElementById('chartUpload').click()}
                        style={{
                            border: '2px dashed #ccc',
                            borderRadius: 8,
                            padding: 40,
                            textAlign: 'center',
                            cursor: 'pointer',
                            marginBottom: 16,
                            minHeight: 200,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {image ? (
                            <img
                                src={image}
                                alt="Chart"
                                style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 4 }}
                            />
                        ) : (
                            <>
                                <p style={{ fontSize: 32, margin: 0 }}>📈</p>
                                <p style={{ color: 'gray', margin: '8px 0 0' }}>Click to upload chart image</p>
                                <p style={{ color: 'gray', fontSize: 12, margin: '4px 0 0' }}>PNG, JPG supported</p>
                            </>
                        )}
                    </div>
                    <input
                        id="chartUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                    />

                    {/* Error */}
                    {error && (
                        <p style={{ color: '#ef4444', marginBottom: 16 }}>⚠️ {error}</p>
                    )}

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button
                            onClick={handleAnalyze}
                            disabled={loading || !imageBase64}
                            style={{
                                flex: 1,
                                padding: '12px 24px',
                                background: loading || !imageBase64 ? '#555' : '#22c55e',
                                color: 'white',
                                border: 'none',
                                borderRadius: 6,
                                cursor: loading || !imageBase64 ? 'not-allowed' : 'pointer',
                                fontSize: 15
                            }}
                        >
                            {loading ? '🤖 Analyzing...' : '🤖 Analyze Chart'}
                        </button>
                        {(image || analysis) && (
                            <button
                                onClick={reset}
                                style={{ padding: '12px 16px', borderRadius: 6, cursor: 'pointer' }}
                            >
                                Reset
                            </button>
                        )}
                    </div>

                    {/* Loading indicator */}
                    {loading && (
                        <div style={{ marginTop: 16, padding: 16, background: '#22c55e11', borderRadius: 8, textAlign: 'center' }}>
                            <p style={{ margin: 0, color: '#22c55e' }}>🤖 AI is reading your chart...</p>
                        </div>
                    )}
                </div>

                {/* Analysis Results */}
                {analysis && (
                    <div style={{ border: '1px solid #22c55e', borderRadius: 8, padding: 24 }}>
                        <h3 style={{ marginTop: 0, color: '#22c55e' }}>📊 Analysis Results</h3>
                        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, fontSize: 14 }}>
                            {analysis.split('\n').map((line, i) => {
                                // Bold headings
                                if (line.match(/^\d+\.|^#+/)) {
                                    return (
                                        <p key={i} style={{ fontWeight: 'bold', margin: '12px 0 4px', color: '#22c55e' }}>
                                            {line.replace(/^#+\s*/, '').replace(/\*\*/g, '')}
                                        </p>
                                    )
                                }
                                return <p key={i} style={{ margin: '2px 0' }}>{line.replace(/\*\*/g, '')}</p>
                            })}
                        </div>

                        {/* Save to Journal button */}
                        <button
                            onClick={() => navigate('/journal')}
                            style={{
                                marginTop: 16,
                                width: '100%',
                                padding: 10,
                                background: 'none',
                                border: '1px solid #22c55e',
                                color: '#22c55e',
                                borderRadius: 6,
                                cursor: 'pointer'
                            }}
                        >
                            📓 Log this trade in Journal →
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Analysis