import { FindReplyController } from '@/application/controllers/reply'
import { ReplyManager } from '@/data/protocols'
import {
  PostMongoRepository,
  ReplyMongoRepository,
  UserMongoRepository
} from '@/infra/db/mongodb/repos'
import { BCryptHash } from '@/infra/encryption'

export const makeFindReplyController = (): FindReplyController => {
  const userRepository = new UserMongoRepository(new BCryptHash())
  const replyRepository = new ReplyMongoRepository()
  const postRepository = new PostMongoRepository()
  const replyManager = new ReplyManager(
    replyRepository,
    postRepository,
    userRepository
  )

  return new FindReplyController(replyManager)
}
