import type { PostModel } from '@/domain/models'
import type { DBPost } from '@/domain/usecases/db'
import { PostSchema } from '@/infra/db/mongodb/schemas'
import mongoose from 'mongoose'

type PostDBUsecases = DBPost.Create &
  DBPost.FindAll &
  DBPost.FindById &
  DBPost.Delete &
  DBPost.Update

export class PostMongoRepository implements PostDBUsecases {
  async update({ id, updateContent }: DBPost.UpdateParams): Promise<void> {
    await PostSchema.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      updateContent
    )
  }

  async delete(id: string): Promise<void> {
    await PostSchema.findByIdAndDelete(id)
  }

  async findById(id: string): Promise<PostModel.Model | null> {
    const post = await PostSchema.findById(id).populate('user')

    if (post) {
      return {
        id: post._id.toString(),
        title: post.title,
        content: post.content,
        user: post.user
      }
    }

    return null
  }

  async findAll(): Promise<PostModel.Model[]> {
    const posts = await PostSchema.find().populate('user')

    return posts.map((post) => ({
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      user: post.user
    }))
  }

  async create({
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
