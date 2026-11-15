
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import donkiRoutes from './routes/donkiRoutes.js'

const app = express()
const PORT = process.env.PORT || 3001

// CORS configuration
const allowedOrigins = [
  'https://astro-guard-theta.vercel.app',
  'https://astro-guard-pwfxo87rr-eric-719d.vercel.app'
]

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

app.disable('x-powered-by')

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

// NASA DONKI routes
app.use('/api/space-weather', donkiRoutes)

// 404 handler
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found.' })
})

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err)

  res.status(err.status || 500).json({
    error: err.status ? err.message : 'Unexpected server error.'
  })
})

app.listen(PORT, () => {
  console.log(`AstroGuard API running on port ${PORT}`)
})

