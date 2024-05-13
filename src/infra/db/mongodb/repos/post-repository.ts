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
  async create({
    userId,
    content,
    title
  }: DBPost.AddParams): Promise<DBPost.AddResult> {
    const post = new PostSchema({
      user: new mongoose.Types.ObjectId(userId),
      content,
      title
    })

    const { id } = await post.save()

    return {
      id
    }
  }

  async update({ id, updateContent }: DBPost.UpdateParams): Promise<void> {
    await PostSchema.findByIdAndUpdate(new mongoose.Types.ObjectId(id), {
      ...updateContent,
      updatedAt: new Date()
    })
  }

  async delete(id: string): Promise<void> {
    await PostSchema.findByIdAndDelete(id)
  }

  async findById(id: string): Promise<PostModel.Model | null> {
    return await PostSchema.findById(id).populate('user')
  }

  async findAll(): Promise<PostModel.Model[]> {
    return await PostSchema.find().populate('user')
  }
}
