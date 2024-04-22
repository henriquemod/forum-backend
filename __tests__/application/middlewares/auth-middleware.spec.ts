import { BadRequest, Forbidden } from '@/application/errors'
import { AuthMiddleware } from '@/application/middlewares/auth-middleware'
import { badRequest, noContent, unauthorized } from '@/application/protocols'
import { ApiError } from '@/application/protocols/api-error'
import type { Token } from '@/data/usecases'
import { TokenStub } from '../helpers'

interface SutTypes {
  sut: AuthMiddleware
  tokenValidator: Token.Validate
}

const makeSut = (): SutTypes => {
  const tokenValidator = new TokenStub()

  return {
    sut: new AuthMiddleware(tokenValidator),
    tokenValidator
  }
}

describe('AuthMiddleware', () => {
  it('should return 401 if no authorization header is provided', async () => {
    const { sut } = makeSut()

    const res = await sut.handle({})

    expect(res).toEqual(unauthorized(new Forbidden()))
  })

  it('should return 400 if authorization header is malformed', async () => {
    const { sut } = makeSut()

    const res = await sut.handle({
      authorization: 'Bearer'
    })

    expect(res).toEqual(badRequest(new BadRequest('Malformed token')))
  })

  it('should return 401 if token is not valid', async () => {
    const { sut, tokenValidator } = makeSut()

    jest.spyOn(tokenValidator, 'validate').mockResolvedValueOnce(false)

    const res = await sut.handle({
      authorization: 'Bearer invalid_token'
    })

    expect(res).toEqual(unauthorized(new Forbidden()))
  })

  it('should return 204 if token is valid', async () => {
    const { sut } = makeSut()

    const res = await sut.handle({
      authorization: 'Bearer valid_token'
    })

    expect(res).toEqual(noContent())
  })

  it('should return 500 if an error occurs', async () => {
    const { sut, tokenValidator } = makeSut()

    jest.spyOn(tokenValidator, 'validate').mockRejectedValueOnce(new Error())

    const res = await sut.handle({
      authorization: 'Bearer valid_token'
    })

    expect(res).toEqual(ApiError.errorHandler(new Error()))
  })
})
