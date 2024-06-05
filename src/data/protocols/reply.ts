import { NotFound, Unauthorized } from '@/application/errors'
import type { Reply } from '@/data/usecases'
import { UserModel, type ReplyModel } from '@/domain/models'
import type { DBPost, DBReply, DBUser } from '@/domain/usecases/db'

export class ReplyManager
  implements Reply.ReplyPost, Reply.Delete, Reply.FindById, Reply.Update
{
  constructor(
    private readonly replyRepository: DBReply.Create &
      DBReply.FindById &
      DBReply.Delete &
      DBReply.Update,
    private readonly postRepository: DBPost.FindById,
    private readonly userRepository: DBUser.FindUserByUserId
  ) {}

  async findById(params: Reply.FindByIdParams): Promise<ReplyModel.Model> {
    const reply = await this.replyRepository.findById(params.replyId)

    if (!reply) {
      throw new NotFound('Reply not found')
    }

    return reply
  }

  async reply({
    authorId,
    content,
    replyContentId,
    postId
  }: Reply.ReplyPostParams): Promise<void> {
    const [user, post] = await Promise.all([
      this.userRepository.findByUserId(authorId),
      this.postRepository.findById(postId)
    ])

    if (!user || !post) {
      throw new NotFound('User or post not found')
    }

    let parentReply: ReplyModel.Model | null = null

    if (replyContentId) {
      parentReply = await this.replyRepository.findById(replyContentId)

      if (!parentReply) {
        throw new NotFound('Parent reply not found')
      }
    }

    await this.replyRepository.create({
      content,
      post,
      parentReply,
      user
    })
  }

  async delete({ replyId, userId }: Reply.DeleteParams): Promise<void> {
    const [reply, user] = await Promise.all([
      this.replyRepository.findById(replyId),
      this.userRepository.findByUserId(userId)
    ])

    if (!reply || !user) {
      throw new NotFound('Reply or user not found')
    }

    if (
      user.level === UserModel.Level.ADMIN ||
      user.level === UserModel.Level.MASTER
    ) {
      await this.replyRepository.delete(replyId)

      return
    }

    if (reply.user.id !== user.id) {
      throw new Unauthorized('You are not allowed to delete this reply')
    }

    await this.replyRepository.delete(replyId)
  }

  async update({
    content,
    replyId,
    userId
  }: Reply.UpdateParams): Promise<void> {
    const [reply, user] = await Promise.all([
      this.replyRepository.findById(replyId),
      this.userRepository.findByUserId(userId)
    ])

    if (!reply || !user) {
      throw new NotFound('Reply or user not found')
    }

    if (reply.user.id !== user.id) {
      throw new Unauthorized('You are not allowed to update this reply')
    }

    await this.replyRepository.update(replyId, content)
  }
}
