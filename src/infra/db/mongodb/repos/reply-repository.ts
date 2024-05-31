import type { PostModel, ReplyModel, UserModel } from '@/domain/models'
import type { DBReply } from '@/domain/usecases/db'
import { PostSchema, ReplySchema } from '@/infra/db/mongodb/schemas'
import type { ClientSession } from 'mongoose'
import mongoose from 'mongoose'
import { PostMongoRepository } from './post-repository'
import { UserMongoRepository } from './user-repository'

type ReplyDBUsecases = DBReply.Create & DBReply.FindById & DBReply.Delete

export class ReplyMongoRepository implements ReplyDBUsecases {
  constructor(private readonly session?: ClientSession) {}

  static makeDTO(
    model: ReplyModel.Model & { _id: mongoose.Types.ObjectId }
  ): ReplyModel.Model {
    const entity = {
      id: model._id.toString(),
      content: model.content,
      user: UserMongoRepository.makeDTO(
        model.user as UserModel.Model & { _id: mongoose.Types.ObjectId },
        true
      ),
      post: PostMongoRepository.makeDTO(
        model.post as PostModel.Model & { _id: mongoose.Types.ObjectId }
      ),
      parentReply: model.parentReply,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt
    }

    return entity
  }

  async findById(replyId: string): Promise<ReplyModel.Model | null> {
    const reply = await ReplySchema.findById(replyId)
      .populate('user')
      .populate({
        path: 'post',
        populate: {
          path: 'user'
        }
      })

    if (!reply) {
      return null
    }

    return ReplyMongoRepository.makeDTO(reply)
  }

  async create({
    user,
    content,
    parentReply,
    post
  }: DBReply.CreateParams): Promise<ReplyModel.Model> {
    const reply = new ReplySchema(
      {
        _id: new mongoose.Types.ObjectId(),
        user,
        post,
        parentReply,
        content
      },
      { session: this.session }
    )

    const replyModel = await reply.save({ session: this.session })

    await PostSchema.findByIdAndUpdate(
      post,
      { $push: { replies: replyModel._id } },
      { session: this.session }
    )

    if (parentReply) {
      await ReplySchema.findByIdAndUpdate(
        parentReply,
        { $push: { replies: replyModel._id } },
        { session: this.session }
      )
    }

    return replyModel
  }

  async delete(id: string): Promise<void> {
    await ReplySchema.findByIdAndDelete(id, { session: this.session })
  }
}
