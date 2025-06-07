import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import { db } from './db.js'
import { v4 } from 'uuid'
import { html } from './util/template.js'

config()

const app = express()
app.use(express.json({ limit: '1gb' }))
app.use(cors())

function checkToken(req, res, next) {
  if (req.query.tk === process.env.TOKEN) {
    next()
    return
  }
  res.sendStatus(403)
}

app.get('/', checkToken, (req, res) => {
  res.send(html('./pages/index'))
})

app.post('/api/sections', checkToken, (req, res) => {
  db.set('sections', [{ id: v4(), ...req.body }, ...(db.get('sections') || [])])
  res.sendStatus(201)
})

app.get('/api/sections', (req, res) => {
  const data = db.get('sections')
  res.status(200).json(data)
})

app.put('/api/sections/:id', checkToken, (req, res) => {
  const id = req.params.id
  const data = db.get('sections')
  const idx = data.findIndex((item) => item.id === id)
  if (idx === -1) return res.sendStatus(404)

  const updated = { ...data[idx], ...req.body }
  data[idx] = updated
  db.set('sections', data)
  res.json(updated)
})

app.get('/api/dump', checkToken, (req, res) => {
  res.status(200).json(db.all())
})

app.listen(3000, () => {
  console.log('Running...')
})
