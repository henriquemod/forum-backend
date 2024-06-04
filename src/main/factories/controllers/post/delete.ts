import type { ClientSession } from 'mongoose'

import { DeletePostController } from '@/application/controllers/post'
import { PostManager, UserManager } from '@/data/protocols'
import {
  PostMongoRepository,
  UserMongoRepository
} from '@/infra/db/mongodb/repos'
import { BCryptHash } from '@/infra/encryption'

import { mongoSessionFactory } from '../../sessions/mongo-session'

export const makeDeletePostController = (
  session?: ClientSession
): DeletePostController => {
  const mongoSession = mongoSessionFactory(session)
  const postRepository = new PostMongoRepository()
  const userRepository = new UserMongoRepository(new BCryptHash())
  const postManagement = new PostManager(postRepository)
  const userManager = new UserManager(userRepository)

  return new DeletePostController(postManagement, userManager, mongoSession)
}
