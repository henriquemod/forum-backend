import { Controller, ok } from '@/application/protocols'
import type { HttpResponse } from '@/application/protocols/http/responses'
import type { Authentication, Post } from '@/data/usecases'
import { ValidationBuilder as builder, type Validator } from '../../validation'

type PostManager = Post.CreatePost

export class CreatePostController extends Controller {
  constructor(private readonly postManager: PostManager) {
    super()
  }

  async perform({
    user,
    title,
    content
  }: Post.CreateParams): Promise<HttpResponse<Post.CreateResult>> {
    const newPost = await this.postManager.createPost({
      content,
      title,
      user
    })

    return ok(newPost)
  }

  override buildValidators({
    password,
    username
  }: Authentication.LoginParams): Validator[] {
    return [
      ...builder
        .of({
          value: password,
          fieldName: 'title'
        })
        .required()
        .build(),
      ...builder
        .of({
          value: username,
          fieldName: 'content'
        })
        .required()
        .build()
    ]
  }
}
