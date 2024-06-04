import type { ClientSession } from 'mongoose'
import mongoose from 'mongoose'

import type { PostModel, ReplyModel, UserModel } from '@/domain/models'
import type { DBReply } from '@/domain/usecases/db'
import { PostSchema, ReplySchema } from '@/infra/db/mongodb/schemas'

import { PostMongoRepository } from './post-repository'
import { UserMongoRepository } from './user-repository'

type ReplyDBUsecases = DBReply.Create &
  DBReply.FindById &
  DBReply.Delete &
  DBReply.Update

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
    if (!mongoose.Types.ObjectId.isValid(replyId)) {
      return null
    }

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
        user: new mongoose.Types.ObjectId(user.id),
        post: new mongoose.Types.ObjectId(post.id),
        parentReply: parentReply
          ? new mongoose.Types.ObjectId(parentReply.id)
          : null,
        content
      },
      { session: this.session }
    )

    await reply.save({ session: this.session })

    await reply.populate('user')
    await reply.populate({
      path: 'post',
      populate: {
        path: 'user'
      }
    })

    await PostSchema.findByIdAndUpdate(
      new mongoose.Types.ObjectId(post.id),
      { $push: { replies: reply._id } },
      { session: this.session }
    )

    if (parentReply) {
      await ReplySchema.findByIdAndUpdate(
        new mongoose.Types.ObjectId(parentReply.id),
        { $push: { replies: reply._id } },
        { session: this.session }
      )
    }

    return ReplyMongoRepository.makeDTO(reply)
  }

  async delete(id: string): Promise<void> {
    await ReplySchema.findByIdAndDelete(id, { session: this.session })
  }

  async update(id: string, content: string): Promise<void> {
    await ReplySchema.findByIdAndUpdate(
      id,
      { content, updatedAt: new Date() },
      { session: this.session }
    )
  }
}
