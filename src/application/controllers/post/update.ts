import { Controller, noContent } from '@/application/protocols'
import type { HttpResponse } from '@/application/protocols/http/responses'
import type { Post } from '@/data/usecases'
import { ValidationBuilder as builder, type Validator } from '../../validation'

type PostManager = Post.UpdatePost

export class UpdatePostController extends Controller {
  constructor(private readonly postManager: PostManager) {
    super()
  }

  async perform(
    params: Post.UpdateParams
  ): Promise<HttpResponse<Post.CreateResult>> {
    await this.postManager.updatePost(params)

    return noContent()
  }

  override buildValidators({ id }: Post.UpdateParams): Validator[] {
    return [
      ...builder
        .of({
          value: id,
          fieldName: 'id'
        })
        .required()
        .build()
    ]
  }
}
