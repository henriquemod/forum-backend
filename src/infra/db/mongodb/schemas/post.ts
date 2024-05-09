import type { PostModel } from '@/domain/models'
import mongoose, { Schema } from 'mongoose'

export const postSchema = new mongoose.Schema<PostModel.Model>({
  id: {
    type: String,
    required: true
  },
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
    ref: 'User'
  }
})

export const PostSchema = mongoose.model<PostModel.Model>('Post', postSchema)
