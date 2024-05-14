import { FindPostController } from '@/application/controllers/post'
import { ValidationComposite } from '@/application/validation'
import type { Post } from '@/data/usecases/'
import { MOCK_USER, PostStub } from '../../helpers'

jest.mock('@/application/validation/composite')

interface SutTypes {
  sut: FindPostController
  postManager: Post.FindPost
}

const makeSut = (): SutTypes => {
  const postManager = new PostStub()

  return {
    sut: new FindPostController(postManager),
    postManager
  }
}

const MOCK_BODY = {
  id: 'any_id'
}

describe('Find Post Controller', () => {
  it('should return statusCode 200 on success', async () => {
    const { sut } = makeSut()
    const res = await sut.handle(MOCK_BODY)

    expect(res).toMatchObject({
      statusCode: 200,
      data: {
        id: 'any_id',
        user: MOCK_USER,
        title: 'any_title',
        content: 'any_content'
      }
    })
  })

  it('should return statusCode 500 if createPost throws', async () => {
    const { sut, postManager } = makeSut()

    jest.spyOn(postManager, 'findPost').mockRejectedValueOnce(new Error())

    const res = await sut.handle(MOCK_BODY)

    expect(res.statusCode).toBe(500)
  })

  it('should return 400 if no title is provided', async () => {
    const { sut } = makeSut()
    const error = new Error('validation_error')
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))
    const spy = jest
      .mocked(ValidationComposite)
      .mockImplementationOnce(ValidationCompositeSpy)

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual({
      statusCode: 400,
      error: error.message
    })
    expect(spy).toHaveBeenCalledWith([{ value: undefined, fieldName: 'id' }])
  })
})
