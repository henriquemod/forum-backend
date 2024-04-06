import mongoose from 'mongoose'

const accessTokenSchema = new mongoose.Schema({
  accessToken: { type: String, required: true },
  refreshAccessToken: { type: String, required: true },
  invalid: { type: Boolean, required: true },
  userId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

export const AccessTokenSchema = mongoose.model(
  'AccessToken',
  accessTokenSchema
)
