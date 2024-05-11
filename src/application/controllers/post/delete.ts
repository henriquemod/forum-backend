import { Forbidden, NotFound } from '@/application/errors'
import { Controller, noContent } from '@/application/protocols'
import type { AuthenticatedRequest } from '@/application/protocols/http/authenticated-request'
import type { HttpResponse } from '@/application/protocols/http/responses'
import {
  ValidationBuilder as builder,
  type Validator
} from '@/application/validation'
import type { Post, User } from '@/data/usecases'
import { UserModel } from '@/domain/models'

type PostManager = Post.DeletePost & Post.FindPost
type UserManager = User.FindUserByIdOrFail
type PerformParams = AuthenticatedRequest<Post.DeleteParams>

export class DeletePostController extends Controller {
  constructor(
    private readonly postManager: PostManager,
    private readonly userManager: UserManager
  ) {
    super()
  }

  async perform({
    userId,
    id
  }: PerformParams): Promise<HttpResponse<Post.CreateResult>> {
    const post = await this.postManager.findPost({
      id
    })

    if (!post) {
      throw new NotFound('Post not found')
    }

    const user = await this.userManager.findUserByIdOrFail(userId)
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
