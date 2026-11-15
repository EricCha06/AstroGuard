
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import donkiRoutes from './routes/donkiRoutes.js'

const app = express()
const PORT = process.env.PORT || 3001

// Allow requests from your deployed Vercel frontend
app.use(cors({
  origin: [
    'https://astro-guard-theta.vercel.app'
  ]
}))

app.disable('x-powered-by')

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.use('/api/space-weather', donkiRoutes)

app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }))

app.use((err, _req, res, _next) => {
  res.status(err.status || 500).json({
    error: err.status ? err.message : 'Unexpected server error.'
  })
})

app.listen(PORT, () => {
  console.log(`AstroGuard API running on port ${PORT}`)
})
