import type { Post } from '@/data/usecases/'
import { MOCK_USER } from './user-stub'

export class PostStub implements Post.CreatePost, Post.FindPost {
  async createPost(params: Post.CreateParams): Promise<Post.CreateResult> {
    return { id: 'any_id' }
  }

  async findPost(params: Post.FindParams): Promise<Post.FindResult> {
    return {
      id: 'any_id',
      user: MOCK_USER,
      title: 'any_title',
      content: 'any_content'
    }
  }
}
