import { CreatePostController } from '@/application/controllers/post'
import { AIManager, PostManager } from '@/data/protocols'
import { OpenAI } from '@/infra/ai'
import { PostMongoRepository } from '@/infra/db/mongodb/repos'
import type { ClientSession } from 'mongoose'
import { mongoSessionFactory } from '../../sessions/mongo-session'

export const makeCreatePostController = (
  session: ClientSession
): CreatePostController => {
  const mongoSession = mongoSessionFactory(session)
  const postRepository = new PostMongoRepository(session)
  const postManagement = new PostManager(postRepository)
  const aiManagement = new AIManager(new OpenAI())

  return new CreatePostController(postManagement, aiManagement, mongoSession)
}
