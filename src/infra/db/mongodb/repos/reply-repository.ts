import type { ReplyModel } from '@/domain/models'
import type { DBReply } from '@/domain/usecases/db'
import { PostSchema, ReplySchema } from '@/infra/db/mongodb/schemas'
import type { ClientSession } from 'mongoose'
import mongoose from 'mongoose'

type ReplyDBUsecases = DBReply.Create

export class ReplyMongoRepository implements ReplyDBUsecases {
  constructor(private readonly session?: ClientSession) {}

  async create({
    user,
    content,
    post
  }: DBReply.CreateParams): Promise<ReplyModel.Model> {
    const reply = new ReplySchema(
      {
        _id: new mongoose.Types.ObjectId(),
        user,
        post,
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

    return replyModel
  }
}
