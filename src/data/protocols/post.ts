import type { Post } from '@/data/usecases'
import type { PostModel } from '@/domain/models'
import type { DBPost } from '@/domain/usecases/db'

export class PostManager
  implements
    Post.CreatePost,
    Post.FindAllPosts,
    Post.FindPost,
    Post.DeletePost,
    Post.UpdatePost
{
  constructor(
    private readonly postRepository: DBPost.Create &
      DBPost.FindAll &
      DBPost.FindById &
      DBPost.Delete &
      DBPost.Update
  ) {}

  async updatePost(params: Post.UpdateParams): Promise<void> {
    const { id, ...updateContent } = params
    await this.postRepository.update({
      id,
      updateContent
    })
  }

  async deletePost(params: Post.DeleteParams): Promise<void> {
    await this.postRepository.delete(params.id)
  }

  async findPost({ id }: Post.FindParams): Promise<PostModel.Model | null> {
    return await this.postRepository.findById(id)
  }

  async findAllPosts(): Promise<PostModel.Model[]> {
    return await this.postRepository.findAll()
  }

  async createPost(params: Post.CreateParams): Promise<Post.CreateResult> {
    const post = await this.postRepository.create({
      content: params.content,
      title: params.title,
      userId: params.userId
    })

    return {
      id: post.id
    }
  }
}
