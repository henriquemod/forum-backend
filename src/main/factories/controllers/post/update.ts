import type { ClientSession } from 'mongoose'

import { UpdatePostController } from '@/application/controllers/post'
import { PostManager, UserManager } from '@/data/protocols'
import { PostMongoRepository } from '@/infra/db/mongodb/repos'

import { makeUserRepository } from '../../repositories'
import { mongoSessionFactory } from '../../sessions/mongo-session'

export const makeUpdatePostController = (
  session?: ClientSession
): UpdatePostController => {
  const mongoSession = mongoSessionFactory(session)
  const postRepository = new PostMongoRepository(session)
  const userRepository = makeUserRepository(session)
  const userManager = new UserManager(userRepository)
  const postManager = new PostManager(postRepository)

  return new UpdatePostController(postManager, userManager, mongoSession)
}
