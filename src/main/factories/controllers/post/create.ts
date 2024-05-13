import { CreatePostController } from '@/application/controllers/post'
import { PostManager } from '@/data/protocols'
import { PostMongoRepository } from '@/infra/db/mongodb/repos'

export const makeCreatePostController = (): CreatePostController => {
  const postRepository = new PostMongoRepository()
  const postManagement = new PostManager(postRepository)

  return new CreatePostController(postManagement)
}
