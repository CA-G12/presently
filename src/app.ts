import express from 'express'
import compression from 'compression'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { join } from 'path'
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

if (environment.nodeEnv === 'production') {
  app.use(express.static(join(__dirname, '..', 'client', 'build')))
  app.use('*', (req, res) => {
    res.sendFile(join(__dirname, '..', 'client', 'build', 'index.html'))
  })
}

app.use('/api/v1', router)

export default app
