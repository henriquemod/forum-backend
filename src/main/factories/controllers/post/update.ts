import { UpdatePostController } from '@/application/controllers/post'
import { PostManager, UserManager } from '@/data/protocols'
import {
  PostMongoRepository,
  UserMongoRepository
} from '@/infra/db/mongodb/repos'
import { BCryptHash } from '@/infra/encryption'

export const makeUpdatePostController = (): UpdatePostController => {
  const postRepository = new PostMongoRepository()
  const userRepository = new UserMongoRepository(new BCryptHash())
  const userManager = new UserManager(userRepository)
  const postManager = new PostManager(postRepository)

  return new UpdatePostController(postManager, userManager)
}
