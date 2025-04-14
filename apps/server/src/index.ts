import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { errorHandler } from './lib/errorHandler'
import artistsRouter from './routes/artist-routes'
import groupsRouter from './routes/group-routes'
import jobsRouter from './routes/job-routes'
import logsRouter from './routes/log-routes'
import releasesRouter from './routes/release-routes'
import usersRouter from './routes/user-routes'

dotenv.config()

const app = express()

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)

app.use(express.json())

app.use('/artists', artistsRouter)
app.use('/groups', groupsRouter)
app.use('/jobs', jobsRouter)
app.use('/releases', releasesRouter)
app.use('/users', usersRouter)
app.use('/logs', logsRouter)
app.use(errorHandler)

app.listen(process.env.PORT, () => {
  console.log(`Server running: ${process.env.SERVER_URL}`)
})
