import { BadRequest } from '@/application/errors'
import { Controller, ok } from '@/application/protocols'
import type { HttpResponse } from '@/application/protocols/http/responses'
import type { Session } from '@/application/protocols/session'
import type { AI, Post, Queue, Reply } from '@/data/usecases'
import type { PostModel } from '@/domain/models'
import { ValidationBuilder as builder, type Validator } from '../../validation'

type PostManager = Post.CreatePost
type ReplyManager = Reply.ReplyPost
type AIManager = AI.ValidateContent & AI.PromptReplyToPost

export interface CreatePostControllerParams {
  postManager: PostManager
  AIManager: AIManager
  replyManager: ReplyManager
  session?: Session
  queue?: Queue.Add
}

export class CreatePostController extends Controller {
  private readonly postManager: PostManager
  private readonly replyManager: ReplyManager
  private readonly AIManager: AIManager
  private readonly queue?: Queue.Add

  constructor({
    postManager,
    AIManager,
    replyManager,
    session,
    queue
  }: CreatePostControllerParams) {
    super({ session })
    this.postManager = postManager
    this.AIManager = AIManager
    this.replyManager = replyManager
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
      await this.queue.add({
        callback: async () => {
          const aiGeneratedReply = await this.AIManager.promptReply(
            newPost.title,
            newPost.content
          )

          if (aiGeneratedReply) {
            await this.replyManager.reply({
              authorId: newPost.user.id,
              content: aiGeneratedReply,
              postId: newPost.id
            })
          }
        }
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
