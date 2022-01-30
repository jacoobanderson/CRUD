import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true,
    minlength: [1, 'The message cannot contain less than one character']
  }
}, {
  timestamps: true
})

export const Snippet = mongoose.model('Snippet', schema)
