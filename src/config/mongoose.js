import mongoose from 'mongoose'

/**
 * Connects the database.
 *
 * @returns {Promise} Returns resolved promise if connected.
 */
export const connectDB = async () => {
  const { connection } = mongoose

  connection.on('connected', () => console.log('MongoDB is connected.'))
  connection.on('error', err => console.error(`MongoDB connection error occurred: ${err}`))
  connection.on('disconnected', () => console.log('MongoDB is disconnected.'))

  process.on('SIGINT', () => {
    connection.close(() => {
      console.log('MongoDB disconnected due to application termination.')
      process.exit(0)
    })
  })

  return mongoose.connect(process.env.DB_CONNECTION_STRING)
}
