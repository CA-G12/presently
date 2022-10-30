import express from 'express'
import compression from 'compression'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import fs from 'fs'
import MarkdownIt from 'markdown-it'

import environment from './config/environment'
import router from './routes'

const app = express()

app.use([
  compression(),
  cookieParser(),
  express.json(),
  express.urlencoded({ extended: false }),
  cors({
    origin: environment.client.origin,
    credentials: true // access-control-allow-credentials:true
  })
])

// TODO: test, remove it later. lines: 24-41
const md = new MarkdownIt({
  html: false,
  xhtmlOut: false,
  breaks: false,
  langPrefix: 'language-',
  linkify: true,
  typographer: false,
  quotes: '“”‘’'
})

const data = fs.readFileSync('./src/test.md', { encoding: 'utf8', flag: 'r' })
console.log(data)

const result = md.render(data)
app.get('/api/v1/test', (req, res) => {
  res.send(result)
})

app.use('/api/v1', router)

export default app
