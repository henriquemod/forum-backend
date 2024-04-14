import { LogoutController } from '@/application/controllers/auth'
import type { Token } from '@/data/usecases/'
import type { AccessToken } from '@/domain/models'

class TokenInvalidateStub implements Token.Invalidate {
  async invalidate(_accessToken: AccessToken): Promise<void> {}
}

interface SutTypes {
  sut: LogoutController
  tokenManager: Token.Invalidate
}

const makeSut = (): SutTypes => {
  const tokenManager = new TokenInvalidateStub()

  return {
    sut: new LogoutController(tokenManager),
    tokenManager
  }
}

describe('Login Controller', () => {
  it('should return statusCode 204 on success', async () => {
    const { sut } = makeSut()

    const res = await sut.handle({ accessToken: 'any_access_token' })

    expect(res.statusCode).toBe(204)
  })

  it('should return statusCode 400 when no access token is provided', async () => {
    const { sut } = makeSut()

    const res = await sut.handle({})

    expect(res.statusCode).toBe(400)
  })

  it('should return statusCode 500 token manager throws', async () => {
    const { sut, tokenManager } = makeSut()

    jest.spyOn(tokenManager, 'invalidate').mockRejectedValueOnce(new Error())

    const res = await sut.handle({ accessToken: 'any_access_token' })

    expect(res.statusCode).toBe(500)
  })
})
