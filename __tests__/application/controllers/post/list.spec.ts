import { ListPostsController } from '@/application/controllers/post'
import { ValidationComposite } from '@/application/validation'
import type { Post } from '@/data/usecases/'
import { MOCK_POST, PostStub } from '../../helpers'

jest.mock('@/application/validation/composite')

interface SutTypes {
  sut: ListPostsController
  postManager: Post.FindAllPosts
}

const makeSut = (): SutTypes => {
  const postManager = new PostStub()

  return {
    sut: new ListPostsController(postManager),
    postManager
  }
}

const MOCK_BODY = {
  id: 'any_id'
}

describe('List Posts Controller', () => {
  it('should return statusCode 200 on success', async () => {
    const { sut } = makeSut()
    const res = await sut.handle({})

    expect(res).toMatchObject({
      statusCode: 200,
      data: [MOCK_POST]
    })
  })

  it('should return statusCode 500 if createPost throws', async () => {
    const { sut, postManager } = makeSut()

    jest.spyOn(postManager, 'findAllPosts').mockRejectedValueOnce(new Error())

    const res = await sut.handle(MOCK_BODY)

    expect(res.statusCode).toBe(500)
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

    await sut.handle({})

    expect(spy).toHaveBeenCalledWith([])
  })
})
