import type { ClientSession } from 'mongoose'

import { UpdateReplyController } from '@/application/controllers/reply'
import { ReplyManager } from '@/data/protocols'
import {
  PostMongoRepository,
  ReplyMongoRepository
} from '@/infra/db/mongodb/repos'

import { makeUserRepository } from '../../repositories'
import { mongoSessionFactory } from '../../sessions/mongo-session'

export const makeUpdateReplyController = (
  session?: ClientSession
): UpdateReplyController => {
  const mongoSession = mongoSessionFactory(session)
  const userRepository = makeUserRepository(session)
  const replyRepository = new ReplyMongoRepository(session)
  const postRepository = new PostMongoRepository(session)
  const replyManager = new ReplyManager(
    replyRepository,
    postRepository,
    userRepository
  )

  return new UpdateReplyController(replyManager, mongoSession)
}
