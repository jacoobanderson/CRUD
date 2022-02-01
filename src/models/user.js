import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import validator from 'validator'

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username.'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    unique: true,
    validate: [validator.isEmail, 'Not a valid email.']
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'The password must contain at least 6 characters.']
  }
}, {
  timestamps: true
})

// Salt and hash password
schema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 8)
})

/**
 * Authenticates a user.
 *
 * @param {string} username - A string of the username.
 * @param {string} password - A string of the password.
 * @returns {Promise} Returns a promise that resolves into an object of a user.
 */
schema.statics.authenticate = async function (username, password) {
  const user = await this.findOne({ username })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Wrong username or password.')
  }
  return user
}

export const User = mongoose.model('User', schema)
