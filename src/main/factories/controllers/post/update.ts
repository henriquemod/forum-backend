import { UpdatePostController } from '@/application/controllers/post'
import { PostManager } from '@/data/protocols'
import {
  PostMongoRepository,
  UserMongoRepository
} from '@/infra/db/mongodb/repos'
import { BCryptHash } from '@/infra/encryption'

export const makeUpdatePostController = (): UpdatePostController => {
  const postRepository = new PostMongoRepository()
  const userRepository = new UserMongoRepository(new BCryptHash())
  const postManagement = new PostManager(postRepository)

  return new UpdatePostController(postManagement, userRepository)
}
