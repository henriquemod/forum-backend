import { Controller, ok } from '@/application/protocols'
import type { HttpResponse } from '@/application/protocols/http/responses'
import type { Session } from '@/application/protocols/session'
import type { Post } from '@/data/usecases'
import { ValidationBuilder as builder, type Validator } from '../../validation'

type PostManager = Post.CreatePost

export class CreatePostController extends Controller {
  constructor(
    private readonly postManager: PostManager,
    protected readonly session?: Session
  ) {
    super(session)
  }

  async perform({
    userId,
    title,
    content
  }: Post.CreateParams): Promise<HttpResponse<Post.CreateResult>> {
    const newPost = await this.postManager.createPost({
      content,
      title,
      userId
    })

    return ok(newPost)
  }

  override buildValidators({
    title,
    content,
    userId
  }: Post.CreateParams): Validator[] {
    return [
      ...builder
        .of({
          value: userId,
          fieldName: 'userId'
        })
        .required()
        .build(),
      ...builder
        .of({
          value: title,
          fieldName: 'title'
        })
        .required()
        .build(),
      ...builder
        .of({
          value: content,
          fieldName: 'content'
        })
        .required()
        .build()
    ]
  }
}
