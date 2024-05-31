import { NotFound, Unauthorized } from '@/application/errors'
import type { Reply } from '@/data/usecases'
import type { ReplyModel } from '@/domain/models'
import type { DBPost, DBReply, DBUser } from '@/domain/usecases/db'

export class ReplyManager
  implements Reply.ReplyPost, Reply.Delete, Reply.FindById
{
  constructor(
    private readonly replyRepository: DBReply.Create &
      DBReply.FindById &
      DBReply.Delete,
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
    const user = await this.userRepository.findByUserId(authorId)

    if (!user) {
      throw new NotFound('User not found')
    }

    const post = await this.postRepository.findById(postId)

    if (!post) {
      throw new NotFound('Post not found')
    }

    let parentReply: ReplyModel.Model | null = null

    if (replyContentId) {
      parentReply = await this.replyRepository.findById(replyContentId)

      if (!parentReply) {
        throw new NotFound('Reply not found')
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
    const reply = await this.replyRepository.findById(replyId)

    if (!reply) {
      throw new NotFound('Reply not found')
    }

    if (reply.user.id !== userId) {
      throw new Unauthorized('You are not allowed to delete this reply')
    }

    await this.replyRepository.delete(replyId)
  }
}
