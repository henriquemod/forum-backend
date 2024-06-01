import type { PostModel, UserModel } from '@/domain/models'
import type { DBPost } from '@/domain/usecases/db'
import { PostSchema } from '@/infra/db/mongodb/schemas'
import type { ClientSession } from 'mongoose'
import mongoose from 'mongoose'
import { pick } from 'ramda'
import { UserMongoRepository } from './user-repository'

type PostDBUsecases = DBPost.Create &
  DBPost.FindAll &
  DBPost.FindById &
  DBPost.Delete &
  DBPost.Update

export class PostMongoRepository implements PostDBUsecases {
  constructor(private readonly session?: ClientSession) {}

  static makeDTO(
    model: PostModel.Model & { _id: mongoose.Types.ObjectId }
  ): PostModel.Model {
    const entity = {
      ...pick(['title', 'content', 'replies', 'createdAt', 'updatedAt'], model),
      id: model._id.toString(),
      user: UserMongoRepository.makeDTO(
        model.user as UserModel.Model & { _id: mongoose.Types.ObjectId },
        true
      )
    }

    return entity
  }

  async create({
    userId,
    content,
    title
  }: DBPost.AddParams): Promise<PostModel.Model> {
    const post = new PostSchema(
      {
        _id: new mongoose.Types.ObjectId(),
        user: new mongoose.Types.ObjectId(userId),
        content,
        title
      },
      { session: this.session }
    )

    await post.save({ session: this.session })

    await post.populate('user')

    return PostMongoRepository.makeDTO(post)
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
    const post = await PostSchema.findById(id)
      .populate('user')
      .populate({
        path: 'replies',
        select: '_id content user parentReply createdAt updatedAt',
        populate: [
          {
            path: 'user'
          }
        ]
      })
      // .populate({
      //   path: 'replies',
      //   populate: [
      //     {
      //       path: 'user'
      //     },
      //     {
      //       path: 'post',
      //       populate: [
      //         {
      //           path: 'user'
      //         },
      //         {
      //           path: 'replies',
      //           populate: {
      //             path: 'user'
      //           }
      //         }
      //       ]
      //     }
      //   ]
      // })
      .select('_id title content user replies createdAt updatedAt')
      .exec()

    if (!post) return null

    return PostMongoRepository.makeDTO(post)
  }

  async findAll(): Promise<PostModel.Model[]> {
    return await PostSchema.find()
      .populate({
        path: 'user',
        select: '_id',
        transform: (doc) => {
          return doc._id
        }
      })
      .populate({
        path: 'replies',
        select: '_id content user parentReply createdAt updatedAt',
        transform: (reply) => {
          return {
            id: reply._id.toString(),
            ...pick(
              ['content', 'user', 'parentReply', 'createdAt', 'updatedAt'],
              reply
            )
          }
        }
      })
      .select('_id title content user replies createdAt updatedAt')
      .transform((doc) => {
        return doc.map((post) => {
          return {
            id: post._id.toString(),
            ...pick(
              ['title', 'content', 'user', 'replies', 'createdAt', 'updatedAt'],
              post
            )
          }
        })
      })
      .exec()
  }
}
