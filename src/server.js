import express from 'express'
import { connectDB } from './config/mongoose.js'

try {
    await connectDB()
    const app = express()

    app.listen(process.env.PORT, () => {
        console.log(`Server running at http://localhost:${process.env.PORT}`)
      })
} catch (error) {
    console.error(error)
    process.exitCode = 1
}