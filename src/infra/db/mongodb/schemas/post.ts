import mongoose, { Schema } from 'mongoose'

import type { PostModel } from '@/domain/models'

export const postSchema = new mongoose.Schema<PostModel.Model>({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  replies: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Reply'
    }
  ],
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true }
})

export const PostSchema = mongoose.model<PostModel.Model>('Post', postSchema)
