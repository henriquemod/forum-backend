import type { UserModel } from '@/domain/models'
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema<UserModel>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
})

export const UserSchema = mongoose.model('User', userSchema)
