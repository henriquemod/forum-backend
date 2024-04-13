import type { Token } from '@/domain/models'
import mongoose, { Schema } from 'mongoose'

export const accessTokenSchema = new mongoose.Schema<Token>({
  accessToken: { type: String, required: true },
  refreshAccessToken: { type: String, required: true },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

export const AccessTokenSchema = mongoose.model<Token>(
  'AccessToken',
  accessTokenSchema
)
