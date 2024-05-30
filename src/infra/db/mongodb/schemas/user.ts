import { UserModel } from '@/domain/models'
import mongoose from 'mongoose'

export const userSchema = new mongoose.Schema<UserModel.Model>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  level: {
    required: true,
    type: String,
    default: UserModel.Level.USER,
    enum: Object.values(UserModel.Level)
  },
  verifiedEmail: { type: Boolean, default: false, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true }
})

export const UserSchema = mongoose.model<UserModel.Model>('User', userSchema)
