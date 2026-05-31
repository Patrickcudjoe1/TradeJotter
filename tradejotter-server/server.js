import express from 'express'
import cors from 'cors'
import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

// Allow all localhost origins
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Check API key on startup
if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY is missing from .env file')
    process.exit(1)
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'TradeJotter API running ✅' })
})

// AI Chart Analysis
app.post('/api/ai/analyze-chart', async (req, res) => {
    const { imageBase64, pair } = req.body

    if (!imageBase64) {
        return res.status(400).json({ error: 'No image provided' })
    }

    try {
        console.log('📊 Analyzing chart...')
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' })

        const result = await model.generateContent([
            {
                inlineData: {
                    data: imageBase64,
                    mimeType: 'image/png'
                }
            },
            `You are an expert forex and trading technical analyst. Analyze this chart${pair ? ` for ${pair}` : ''} and provide:

1. Chart Pattern: What pattern do you see?
2. Bias: Bullish or Bearish?
3. Key Levels: Support and resistance levels
4. Entry Zone: Where would you enter?
5. Risk Advice: Stop loss and take profit suggestions
6. Summary: One sentence summary

Be concise and practical. Format with clear headings.`
        ])

        const response = await result.response
        const text = response.text()
        console.log('✅ Chart analysis complete')
        res.json({ analysis: text })

    } catch (error) {
        console.error('❌ Gemini chart error:', error.message)
        res.status(500).json({ error: error.message })
    }
})

// AI Strategy Builder
app.post('/api/ai/generate-strategy', async (req, res) => {
    const { description } = req.body

    if (!description) {
        return res.status(400).json({ error: 'No strategy description provided' })
    }

    try {
        console.log('🧠 Generating strategy...')
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

        const result = await model.generateContent(
            `You are an expert trading strategy developer. Build a complete trading strategy based on this idea: "${description}"

Return a full strategy with these sections:
1. Strategy Name
2. Timeframe
3. Entry Rules (step by step)
4. Stop Loss Rules
5. Take Profit Rules
6. Filters (what to avoid)
7. Risk Management
8. Best Pairs/Markets

Be specific and actionable. Format with clear headings.`
        )

        const response = await result.response
        const text = response.text()
        console.log('✅ Strategy generation complete')
        res.json({ strategy: text })

    } catch (error) {
        console.error('❌ Gemini strategy error:', error.message)
        res.status(500).json({ error: error.message })
    }
})

// Handle port conflicts automatically
const PORT = process.env.PORT || 3001

const server = app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`)
    console.log(`🔑 Gemini API key: ${process.env.GEMINI_API_KEY ? 'Found ✅' : 'Missing ❌'}`)
})

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`⚠️ Port ${PORT} busy. Trying ${PORT + 1}...`)
        server.listen(PORT + 1)
    }
})