import type { Post } from '@/data/usecases'
import type { PostModel } from '@/domain/models'
import type { DBPost } from '@/domain/usecases/db'

export class PostManager implements Post.CreatePost, Post.FindAll {
  constructor(private readonly postRepository: DBPost.Add & DBPost.FindAll) {}

  async findAll(): Promise<PostModel.Model[]> {
    return await this.postRepository.findAll()
  }

  async createPost(params: Post.CreateParams): Promise<Post.CreateResult> {
    const post = await this.postRepository.add({
      content: params.content,
      title: params.title,
      userId: params.userId
    })

    return {
      id: post.id
    }
  }
}
