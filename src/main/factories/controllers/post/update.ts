import { UpdatePostController } from '@/application/controllers/post'
import { PostManager } from '@/data/protocols'
import { PostMongoRepository } from '@/infra/db/mongodb/repos'

export const makeUpdatePostController = (): UpdatePostController => {
  const postRepository = new PostMongoRepository()
  const postManagement = new PostManager(postRepository)

  return new UpdatePostController(postManagement)
}
