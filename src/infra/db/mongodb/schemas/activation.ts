import mongoose, { Schema } from 'mongoose'

import type { ActivationModel } from '@/domain/models'

export const activationSchema = new mongoose.Schema<ActivationModel>({
  code: {
    unique: true,
    type: String,
    required: true
  },
  user: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true }
})

export const ActivationSchema = mongoose.model<ActivationModel>(
  'Activation',
  activationSchema
)
