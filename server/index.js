require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { startCronJob } = require('./services/cronService')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Simple request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

// All routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/stack', require('./routes/stack'))
app.use('/api/cve', require('./routes/cve'))
app.use('/api/projects', require('./routes/projects'))
app.use('/api/export', require('./routes/export'))
app.use('/api/settings', require('./routes/settings'))
app.use('/api/team', require('./routes/team'))
app.use('/api/urlscan', require('./routes/urlscan'))
app.use('/api/badge', require('./routes/badge'))

app.get('/api/health', (req, res) => res.json({ status: 'ok', version: '3.0.0' }))
app.use((req, res) => res.status(404).json({ message: 'Route not found' }))
app.use((err, req, res, next) => { console.error(err); res.status(500).json({ message: 'Server error' }) })

app.listen(PORT, () => {
  console.log(`🚀 VulnTracker v3.0 running on http://localhost:${PORT}`)
  startCronJob()
})
