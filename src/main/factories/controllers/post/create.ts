import { CreatePostController } from '@/application/controllers/post'
import { AIValidateContent, PostManager, ReplyManager } from '@/data/protocols'
import { OpenAI } from '@/infra/ai'
import {
  PostMongoRepository,
  ReplyMongoRepository,
  UserMongoRepository
} from '@/infra/db/mongodb/repos'
import type { ClientSession } from 'mongoose'
import { mongoSessionFactory } from '../../sessions/mongo-session'
import { BullQMQueue } from '@/infra/queue/bullqm'
import type { ConnectionOptions } from 'bullmq'
import { BCryptHash } from '@/infra/encryption'

interface FactoryParams {
  session?: ClientSession
  queueConnection?: ConnectionOptions
}

export const makeCreatePostController = ({
  session,
  queueConnection
}: FactoryParams): CreatePostController => {
  const bullQueue = new BullQMQueue(queueConnection)
  const mongoSession = mongoSessionFactory(session)
  const postRepository = new PostMongoRepository(session)
  const replyRepository = new ReplyMongoRepository(session)
  const userRepository = new UserMongoRepository(new BCryptHash(), session)
  const postManager = new PostManager(postRepository)
  const replyManager = new ReplyManager(
    replyRepository,
    postRepository,
    userRepository
  )
  const aiManagement = new AIValidateContent(new OpenAI())

  return new CreatePostController({
    postManager,
    replyManager,
    AIManager: aiManagement,
    session: mongoSession,
    queue: bullQueue
  })
}
