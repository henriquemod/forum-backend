import type { Post } from '@/data/usecases/'
import type { PostModel } from '@/domain/models'

import { MOCK_USER } from './user-stub'

export const MOCK_POST: PostModel.Model = {
  id: 'any_id',
  user: MOCK_USER,
  title: 'any_title',
  content: 'any_content',
  createdAt: new Date(),
  updatedAt: new Date()
}

export class PostStub
  implements
    Post.CreatePost,
    Post.FindPost,
    Post.FindAllPosts,
    Post.UpdatePost,
    Post.DeletePost
{
  async createPost(_params: Post.CreateParams): Promise<PostModel.Model> {
    return MOCK_POST
  }

  async findPost(_params: Post.FindParams): Promise<Post.FindResult> {
    return MOCK_POST
  }

  async findAllPosts(): Promise<Post.FindAllResult> {
    return [MOCK_POST]
  }

  async updatePost(_params: Post.UpdateParams): Promise<void> {}

  async deletePost(_params: Post.DeleteParams): Promise<void> {}
}
