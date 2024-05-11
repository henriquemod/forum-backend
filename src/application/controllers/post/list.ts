import { Controller, ok } from '@/application/protocols'
import type { HttpResponse } from '@/application/protocols/http/responses'
import type { Post } from '@/data/usecases'
import { type Validator } from '../../validation'

type PostManager = Post.FindAllPosts

export class FindAllPostController extends Controller {
  constructor(private readonly postManager: PostManager) {
    super()
  }

  async perform(): Promise<HttpResponse<Post.FindAllResult>> {
    const posts = await this.postManager.findAllPosts()

    return ok(posts)
  }

  override buildValidators(): Validator[] {
    return []
  }
}
