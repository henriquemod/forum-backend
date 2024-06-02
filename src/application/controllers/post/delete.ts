import { Forbidden, NotFound } from '@/application/errors'
import { Controller, noContent } from '@/application/protocols'
import type { AuthenticatedRequest } from '@/application/protocols/http/authenticated-request'
import type { HttpResponse } from '@/application/protocols/http/responses'
import type { Session } from '@/application/protocols/session'
import {
  ValidationBuilder as builder,
  type Validator
} from '@/application/validation'
import type { Post, User } from '@/data/usecases'
import { type PostModel, UserModel } from '@/domain/models'

type PostManager = Post.DeletePost & Post.FindPost
type UserManager = User.Get
type PerformParams = AuthenticatedRequest<Post.DeleteParams>

export class DeletePostController extends Controller {
  constructor(
    private readonly postManager: PostManager,
    private readonly userManager: UserManager,
    protected readonly session?: Session
  ) {
    super({ session })
  }

  async perform({
    userId,
    id
  }: PerformParams): Promise<HttpResponse<PostModel.Model>> {
    const post = await this.postManager.findPost({
      id
    })

    if (!post) {
      throw new NotFound('Post not found')
    }

    const user = await this.userManager.getUser({
      value: userId,
      origin: 'id',
      safe: true
    })
    const isUserAllowedToDeletePost = post.user.id === user.id
    const isUserAdmin = user.level === UserModel.Level.ADMIN

    if (isUserAdmin || isUserAllowedToDeletePost) {
      await this.postManager.deletePost({
        id
      })

      return noContent()
    }

    throw new Forbidden('You are not allowed to delete this post')
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
