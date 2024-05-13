import { UserModel } from '@/domain/models'
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema<UserModel.Model>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  level: {
    type: String,
    default: UserModel.Level.USER,
    enum: Object.values(UserModel.Level)
  }
})

export const UserSchema = mongoose.model<UserModel.Model>('User', userSchema)
