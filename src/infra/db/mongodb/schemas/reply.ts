import type { ReplyModel } from '@/domain/models'
import mongoose, { Schema } from 'mongoose'

export const replySchema = new mongoose.Schema<ReplyModel.Model>({
  content: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  parentReply: {
    type: Schema.Types.ObjectId,
    ref: 'Reply',
    default: null
  },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true }
})

export const ReplySchema = mongoose.model<ReplyModel.Model>(
  'Reply',
  replySchema
)
