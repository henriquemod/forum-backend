import type { TokenModel } from '@/domain/models'
import mongoose, { Schema } from 'mongoose'

export const accessTokenSchema = new mongoose.Schema<TokenModel>({
  accessToken: { type: String, required: true },
  refreshAccessToken: { type: String, required: true },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

export const AccessTokenSchema = mongoose.model<TokenModel>(
  'AccessToken',
  accessTokenSchema
)
