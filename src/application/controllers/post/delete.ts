import { Controller, noContent } from '@/application/protocols'
import type { HttpResponse } from '@/application/protocols/http/responses'
import type { Post } from '@/data/usecases'
import { ValidationBuilder as builder, type Validator } from '../../validation'

type PostManager = Post.DeletePost

export class DeletePostController extends Controller {
  constructor(private readonly postManager: PostManager) {
    super()
  }

  async perform({
    id
  }: Post.DeleteParams): Promise<HttpResponse<Post.CreateResult>> {
    await this.postManager.deletePost({
      id
    })

    return noContent()
  }

  override buildValidators({ id }: Post.DeleteParams): Validator[] {
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
