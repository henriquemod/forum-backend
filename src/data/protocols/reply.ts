import { NotFound } from '@/application/errors'
import type { Reply } from '@/data/usecases'
import type { ReplyModel } from '@/domain/models'
import type { DBPost, DBReply, DBUser } from '@/domain/usecases/db'

export class ReplyManager implements Reply.ReplyPost {
  constructor(
    private readonly replyRepository: DBReply.Create & DBReply.FindById,
    private readonly postRepository: DBPost.FindById,
    private readonly userRepository: DBUser.FindUserByUserId
  ) {}

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
}
