import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

app.get('/', (req, res) => {
  res.json({ msg: 'Hello World' })
})

app.listen(3001, () => {
  console.log('App is running')
})