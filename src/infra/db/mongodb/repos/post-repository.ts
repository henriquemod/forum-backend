import type { PostModel } from '@/domain/models'
import type { DBPost } from '@/domain/usecases/db'
import { PostSchema } from '@/infra/db/mongodb/schemas'
import type { ClientSession } from 'mongoose'
import mongoose from 'mongoose'

type PostDBUsecases = DBPost.Create &
  DBPost.FindAll &
  DBPost.FindById &
  DBPost.Delete &
  DBPost.Update

export class PostMongoRepository implements PostDBUsecases {
  constructor(private readonly session?: ClientSession) {}

  async create({
    userId,
    content,
    title
  }: DBPost.AddParams): Promise<DBPost.AddResult> {
    const post = new PostSchema(
      {
        user: new mongoose.Types.ObjectId(userId),
        content,
        title
      },
      { session: this.session }
    )

    const { id } = await post.save({ session: this.session })

    return {
      id
    }
  }

  async update({ id, updateContent }: DBPost.UpdateParams): Promise<void> {
    await PostSchema.updateOne(
      {
        _id: id
      },
      {
        $set: { ...updateContent, updatedAt: new Date() }
      },
      { session: this.session }
    )
  }

  async delete(id: string): Promise<void> {
    await PostSchema.findByIdAndDelete(id, { session: this.session })
  }

  async findById(id: string): Promise<PostModel.Model | null> {
    return await PostSchema.findById(id).populate('user')
  }

  async findAll(): Promise<PostModel.Model[]> {
    return await PostSchema.find().populate('user')
  }
}
