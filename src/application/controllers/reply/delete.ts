import { Controller, noContent } from '@/application/protocols'
import type { AuthenticatedRequest } from '@/application/protocols/http/authenticated-request'
import type { HttpResponse } from '@/application/protocols/http/responses'
import type { Reply } from '@/data/usecases'
import { ValidationBuilder as builder, type Validator } from '../../validation'
import type { Session } from '@/application/protocols/session'

type PerformParams = AuthenticatedRequest<Reply.DeleteParams>

export class DeleteReplyController extends Controller {
  constructor(
    private readonly replyManager: Reply.Delete,
    protected readonly session?: Session
  ) {
    super(session)
  }

  async perform({
    userId,
    replyId
  }: PerformParams): Promise<HttpResponse<void>> {
    await this.replyManager.delete({
      userId,
      replyId
    })

    return noContent()
  }

  override buildValidators({ replyId, userId }: PerformParams): Validator[] {
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
          value: replyId,
          fieldName: 'replyId'
        })
        .required()
        .build()
    ]
  }
}
