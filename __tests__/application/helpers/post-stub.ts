import type { Post } from '@/data/usecases/'
import { pick } from 'ramda'
import { MOCK_USER } from './user-stub'

export const MOCK_POST = {
  id: 'any_id',
  user: MOCK_USER,
  title: 'any_title',
  content: 'any_content'
}

export class PostStub
  implements Post.CreatePost, Post.FindPost, Post.FindAllPosts
{
  async createPost(params: Post.CreateParams): Promise<Post.CreateResult> {
    return pick(['id'], MOCK_POST)
  }

  async findPost(params: Post.FindParams): Promise<Post.FindResult> {
    return MOCK_POST
  }

  async findAllPosts(): Promise<Post.FindAllResult> {
    return [MOCK_POST]
  }
}
