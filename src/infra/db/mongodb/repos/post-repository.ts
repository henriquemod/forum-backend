import type { PostModel } from '@/domain/models'
import type { DBPost } from '@/domain/usecases/db'
import { PostSchema } from '@/infra/db/mongodb/schemas'
import mongoose from 'mongoose'

type PostDBUsecases = DBPost.Add & DBPost.FindAll

export class PostMongoRepository implements PostDBUsecases {
  async findAll(): Promise<PostModel.Model[]> {
    const posts = await PostSchema.find().populate('user')

    return posts.map((post) => ({
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      user: post.user
    }))
  }

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
