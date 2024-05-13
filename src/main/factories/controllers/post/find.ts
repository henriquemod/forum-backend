import { FindPostController } from '@/application/controllers/post'
import { PostManager } from '@/data/protocols'
import { PostMongoRepository } from '@/infra/db/mongodb/repos'

export const makeFindPostController = (): FindPostController => {
  const postRepository = new PostMongoRepository()
  const postManagement = new PostManager(postRepository)

  return new FindPostController(postManagement)
}
