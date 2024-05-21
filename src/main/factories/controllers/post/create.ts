import { CreatePostController } from '@/application/controllers/post'
import { PostManager } from '@/data/protocols'
import { PostMongoRepository } from '@/infra/db/mongodb/repos'
import type { ClientSession } from 'mongoose'
import { mongoSessionFactory } from '../../sessions/mongo-session'

export const makeCreatePostController = (
  session: ClientSession
): CreatePostController => {
  const mongoSession = mongoSessionFactory(session)
  const postRepository = new PostMongoRepository(session)
  const postManagement = new PostManager(postRepository)

  return new CreatePostController(postManagement, mongoSession)
}
