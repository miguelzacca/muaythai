import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'

config()

const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.sendStatus(200)
})

app.listen(3000, () => {
  console.log('Running...')
})
