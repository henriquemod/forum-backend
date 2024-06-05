import { UpdateReplyController } from '@/application/controllers/reply'
import { ValidationComposite } from '@/application/validation'
import type { Reply } from '@/data/usecases/'

import { ReplyStub } from '../../helpers'

jest.mock('@/application/validation/composite')

interface SutTypes {
  sut: UpdateReplyController
  replyManager: Reply.Update
}

const makeSut = (): SutTypes => {
  const replyManager = new ReplyStub()

  return {
    sut: new UpdateReplyController(replyManager),
    replyManager
  }
}

describe('Update Reply Controller', () => {
  it('should call update with correct params', async () => {
    const { sut, replyManager } = makeSut()
    const updateSpy = jest.spyOn(replyManager, 'update')

    await sut.handle({
      userId: 'any_user_id',
      replyId: 'any_reply',
      content: 'new_content'
    })

    expect(updateSpy).toHaveBeenCalledWith({
      userId: 'any_user_id',
      replyId: 'any_reply',
      content: 'new_content'
    })
  })

  it('should return 204 on success', async () => {
    const { sut } = makeSut()

    const response = await sut.handle({
      userId: 'any_user_id',
      replyId: 'any_reply',
      content: 'new_content'
    })

    expect(response.statusCode).toBe(204)
  })

  it('should return 500 if update throws', async () => {
    const { sut, replyManager } = makeSut()
    jest.spyOn(replyManager, 'update').mockRejectedValueOnce(new Error())

    const response = await sut.handle({
      userId: 'any_user_id',
      replyId: 'any_reply',
      content: 'new_content'
    })

    expect(response).toEqual({
      statusCode: 500,
      error: 'Internal server error'
    })
  })

  it('should call ValidationComposite with correct values', async () => {
    const { sut } = makeSut()
    const error = new Error('validation_error')
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))
    const spy = jest
      .mocked(ValidationComposite)
      .mockImplementationOnce(ValidationCompositeSpy)

    const httpResponse = await sut.handle({
      userId: 'any_user_id',
      replyId: 'any_reply',
      content: 'new_content'
    })

    expect(httpResponse).toEqual({
      statusCode: 400,
      error: error.message
    })

    expect(spy).toHaveBeenCalledWith([
      { value: 'any_user_id', fieldName: 'userId' },
      { value: 'any_reply', fieldName: 'replyId' },
      { value: 'new_content', fieldName: 'content' }
    ])
  })
})
