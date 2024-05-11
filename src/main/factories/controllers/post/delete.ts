import { DeletePostController } from '@/application/controllers/post'
import { PostManager, UserManager } from '@/data/protocols'
import {
  PostMongoRepository,
  UserMongoRepository
} from '@/infra/db/mongodb/repos'
import { BCryptHash } from '@/infra/encryption'

export const makeDeletePostController = (): DeletePostController => {
  const postRepository = new PostMongoRepository()
  const userRepository = new UserMongoRepository(new BCryptHash())
  const postManagement = new PostManager(postRepository)
  const userManager = new UserManager(userRepository)

  return new DeletePostController(postManagement, userManager)
}
