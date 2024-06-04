import type { ConnectionOptions } from 'bullmq'
import type { ClientSession } from 'mongoose'

import { CreatePostController } from '@/application/controllers/post'
import { AIValidateContent, PostManager } from '@/data/protocols'
import { OpenAI } from '@/infra/ai'
import { PostMongoRepository } from '@/infra/db/mongodb/repos'
import { BullQMQueue } from '@/infra/queue'

import { mongoSessionFactory } from '../../sessions/mongo-session'

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
  const postManager = new PostManager(postRepository)
  const aiManagement = new AIValidateContent(new OpenAI())

  return new CreatePostController({
    postManager,
    AIManager: aiManagement,
    session: mongoSession,
    queue: bullQueue
  })
}
