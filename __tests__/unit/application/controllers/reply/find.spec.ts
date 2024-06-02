import { FindReplyController } from '@/application/controllers/reply'
import type { Reply } from '@/data/usecases/'
import { ReplyStub } from '../../helpers'
import { ValidationComposite } from '@/application/validation'
import { MOCK_REPLY } from '../../../data/helpers'

jest.mock('@/application/validation/composite')

interface SutTypes {
  sut: FindReplyController
  replyManager: Reply.FindById
}

const makeSut = (): SutTypes => {
  const replyManager = new ReplyStub()

  return {
    sut: new FindReplyController(replyManager),
    replyManager
  }
}

describe('Find Reply Controller', () => {
  it('should call findById with correct params', async () => {
    const { sut, replyManager } = makeSut()
    const findSpy = jest.spyOn(replyManager, 'findById')

    await sut.handle({
      replyId: 'any_reply'
    })

    expect(findSpy).toHaveBeenCalledWith({
      replyId: 'any_reply'
    })
  })

  it('should return 200 on success', async () => {
    const { sut } = makeSut()

    const response = await sut.handle({
      replyId: 'any_reply'
    })

    expect(response.statusCode).toBe(200)
    expect(response.statusCode === 200 && response.data).toEqual(MOCK_REPLY)
  })

  it('should return 500 if findById throws', async () => {
    const { sut, replyManager } = makeSut()
    jest.spyOn(replyManager, 'findById').mockRejectedValueOnce(new Error())

    const response = await sut.handle({
      replyId: 'any_reply'
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
      replyId: 'any_reply'
    })

    expect(httpResponse).toEqual({
      statusCode: 400,
      error: error.message
    })

    expect(spy).toHaveBeenCalledWith([
      { value: 'any_reply', fieldName: 'replyId' }
    ])
  })
})
