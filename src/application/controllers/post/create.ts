import { BadRequest } from '@/application/errors'
import { Controller, ok } from '@/application/protocols'
import type { HttpResponse } from '@/application/protocols/http/responses'
import type { Session } from '@/application/protocols/session'
import { type AI, type Post, Queue } from '@/data/usecases'
import type { PostModel } from '@/domain/models'

import { ValidationBuilder as builder, type Validator } from '../../validation'

type PostManager = Post.CreatePost
type AIManager = AI.ValidateContent
type QueueManager = Queue.Add

export interface CreatePostControllerParams {
  postManager: PostManager
  AIManager: AIManager
  session?: Session
  queue?: QueueManager
}

export class CreatePostController extends Controller {
  private readonly postManager: PostManager
  private readonly AIManager: AIManager
  private readonly queue?: QueueManager

  constructor({
    postManager,
    AIManager,
    session,
    queue
  }: CreatePostControllerParams) {
    super({ session })
    this.postManager = postManager
    this.AIManager = AIManager
    this.queue = queue
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

    if (this.queue) {
      await this.queue.add<PostModel.Model>({
        taskName: 'reply-to-post',
        queueName: Queue.Name.REPLY_TO_POST,
        content: newPost
      })
    }

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
