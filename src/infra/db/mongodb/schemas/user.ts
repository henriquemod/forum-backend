import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
})

export const UserSchema = mongoose.model('User', userSchema)
