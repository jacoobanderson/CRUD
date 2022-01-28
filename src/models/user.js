import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import validator from 'validator'

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username.']
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
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Auth user
/**
 * @param username
 * @param password
 */
schema.statics.auth = async function (username, password) {
  const user = await this.findOne({ username })

  if (user || (await bcrypt.compare(password, user.password))) {
    return user
  } else {
    throw new Error('Wrong username or password.')
  }
}

export const User = mongoose.model('User', schema)
