import { BadRequest } from '@/application/errors'
import { Controller, ok } from '@/application/protocols'
import type { HttpResponse } from '@/application/protocols/http/responses'
import type { Session } from '@/application/protocols/session'
import type { AI, Post } from '@/data/usecases'
import type { PostModel } from '@/domain/models'
import { ValidationBuilder as builder, type Validator } from '../../validation'

type PostManager = Post.CreatePost
type AIManager = AI.ValidateContent

export class CreatePostController extends Controller {
  constructor(
    private readonly postManager: PostManager,
    private readonly AIManager: AIManager,
    protected readonly session?: Session
  ) {
    super({ session })
  }

  async perform({
    userId,
    title,
    content
  }: Post.CreateParams): Promise<HttpResponse<PostModel.Model>> {
    const isValidContent = await this.AIManager.validateContent(title, content)

    if (!isValidContent) {
      throw new BadRequest(
        'Your post contains inappropriate content. Please review it and try again.'
      )
    }

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
