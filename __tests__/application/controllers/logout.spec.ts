import { LogoutController } from '@/application/controllers/auth'
import type { Token } from '@/data/usecases/'
import { TokenStub } from '../helpers'

interface SutTypes {
  sut: LogoutController
  tokenManager: Token.Invalidate
}

const makeSut = (): SutTypes => {
  const tokenManager = new TokenStub()

  return {
    sut: new LogoutController(tokenManager),
    tokenManager
  }
}

describe('Logout Controller', () => {
  it('should return statusCode 204 on success', async () => {
    const { sut } = makeSut()

    const res = await sut.handle({ accessToken: 'any_access_token' })

    expect(res.statusCode).toBe(204)
  })

  it('should return statusCode 400 if no access token is provided', async () => {
    const { sut } = makeSut()

    const res = await sut.handle({})

    expect(res.statusCode).toBe(400)
  })

  it('should return statusCode 500 if token manager throws', async () => {
    const { sut, tokenManager } = makeSut()

    jest.spyOn(tokenManager, 'invalidate').mockRejectedValueOnce(new Error())

    const res = await sut.handle({ accessToken: 'any_access_token' })

    expect(res.statusCode).toBe(500)
  })
})
