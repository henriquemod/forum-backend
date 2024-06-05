import type { ClientSession } from 'mongoose'

import { DeleteReplyController } from '@/application/controllers/reply'
import { ReplyManager } from '@/data/protocols'
import {
  PostMongoRepository,
  ReplyMongoRepository
} from '@/infra/db/mongodb/repos'

import { makeUserRepository } from '../../repositories'
import { mongoSessionFactory } from '../../sessions/mongo-session'

export const makeDeleteReplyController = (
  session?: ClientSession
): DeleteReplyController => {
  const mongoSession = mongoSessionFactory(session)
  const userRepository = makeUserRepository(session)
  const replyRepository = new ReplyMongoRepository(session)
  const postRepository = new PostMongoRepository(session)
  const replyManager = new ReplyManager(
    replyRepository,
    postRepository,
    userRepository
  )

  return new DeleteReplyController(replyManager, mongoSession)
}
