import type { Post } from '@/data/usecases/'

export class PostStub implements Post.CreatePost {
  async createPost(params: Post.CreateParams): Promise<Post.CreateResult> {
    return { id: 'any_id' }
  }
}
