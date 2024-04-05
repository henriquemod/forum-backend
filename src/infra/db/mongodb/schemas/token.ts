import mongoose from 'mongoose'

const accessTokenSchema = new mongoose.Schema({
  token: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

export const AccessTokenSchema = mongoose.model(
  'AccessToken',
  accessTokenSchema
)
