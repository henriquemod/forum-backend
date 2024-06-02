import { Forbidden, NotFound } from '@/application/errors'
import { Controller, noContent } from '@/application/protocols'
import type { AuthenticatedRequest } from '@/application/protocols/http/authenticated-request'
import type { HttpResponse } from '@/application/protocols/http/responses'
import type { Session } from '@/application/protocols/session'
import type { Post, User } from '@/data/usecases'
import { type PostModel, UserModel } from '@/domain/models'
import { ValidationBuilder as builder, type Validator } from '../../validation'

type PostManager = Post.UpdatePost & Post.FindPost
type UserManager = User.Get
type PerformParams = AuthenticatedRequest<Post.UpdateParams>

export class UpdatePostController extends Controller {
  constructor(
    private readonly postManager: PostManager,
    private readonly userManager: UserManager,
    protected readonly session?: Session
  ) {
    super({ session })
  }

  async perform({
    userId,
    ...params
  }: PerformParams): Promise<HttpResponse<PostModel.Model>> {
    const post = await this.postManager.findPost({
      id: params.id
    })

    if (!post) {
      throw new NotFound('Post not found')
    }

    const user = await this.userManager.getUser({
      value: userId,
      origin: 'id',
      safe: true
    })
    const isUserAllowedToUpdatePost = post.user.id === user.id
    const isUserAdmin = user.level === UserModel.Level.ADMIN

    if (isUserAdmin || isUserAllowedToUpdatePost) {
      await this.postManager.updatePost(params)

      return noContent()
    }

    throw new Forbidden('You are not allowed to edit this post')
  }

  override buildValidators({ id, userId }: PerformParams): Validator[] {
    return [
      ...builder
        .of({
          value: id,
          fieldName: 'id'
        })
        .required()
        .build(),
      ...builder
        .of({
          value: userId,
          fieldName: 'userId'
        })
        .required()
        .build()
    ]
  }
}
