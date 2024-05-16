import { UserModel } from '@/domain/models'
import mongoose from 'mongoose'
import { ActivationSchema } from './activation'

const userSchema = new mongoose.Schema<UserModel.Model>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  level: {
    type: String,
    default: UserModel.Level.USER,
    enum: Object.values(UserModel.Level)
  },
  verifiedEmail: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

userSchema.pre('deleteOne', async function (next) {
  try {
    await ActivationSchema.deleteMany({ user: this.getQuery() })
    next()
  } catch (error) {
    next(error as Error)
  }
})

export const UserSchema = mongoose.model<UserModel.Model>('User', userSchema)
