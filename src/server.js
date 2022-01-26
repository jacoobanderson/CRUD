import express from 'express'
import { connectDB } from './config/mongoose.js'
import helmet from 'helmet'
import logger from 'morgan'

try {
  await connectDB()
  const app = express()

  app.use(helmet())
  app.use(logger('dev'))

  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
  })
} catch (error) {
  console.error(error)
  process.exitCode = 1
}
