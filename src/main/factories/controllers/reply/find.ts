import { FindReplyController } from '@/application/controllers/reply'
import { ReplyManager } from '@/data/protocols'
import {
  PostMongoRepository,
  ReplyMongoRepository
} from '@/infra/db/mongodb/repos'

import { makeUserRepository } from '../../repositories'

export const makeFindReplyController = (): FindReplyController => {
  const userRepository = makeUserRepository()
  const replyRepository = new ReplyMongoRepository()
  const postRepository = new PostMongoRepository()
  const replyManager = new ReplyManager(
    replyRepository,
    postRepository,
    userRepository
  )

  return new FindReplyController(replyManager)
}
