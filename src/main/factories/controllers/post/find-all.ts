import { ListPostsController } from '@/application/controllers/post/list'
import { PostManager } from '@/data/protocols'
import { PostMongoRepository } from '@/infra/db/mongodb/repos'

export const makeFindAllPostController = (): ListPostsController => {
  const postRepository = new PostMongoRepository()
  const postManagement = new PostManager(postRepository)

  return new ListPostsController(postManagement)
}
