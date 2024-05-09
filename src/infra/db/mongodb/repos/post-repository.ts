import type { DBPost } from '@/domain/usecases/db'
import { PostSchema } from '@/infra/db/mongodb/schemas'
import mongoose from 'mongoose'

type PostDBUsecases = DBPost.Add

export class PostMongoRepository implements PostDBUsecases {
  async add({
    userId,
    content,
    title
  }: DBPost.AddParams): Promise<DBPost.AddResult> {
    const accessToken = new PostSchema({
      user: new mongoose.Types.ObjectId(userId),
      content,
      title
    })

    const { id } = await accessToken.save()

    return {
      id
    }
  }
}
