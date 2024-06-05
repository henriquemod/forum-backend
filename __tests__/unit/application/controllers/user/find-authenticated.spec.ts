import { FindAuthenticatedUserController } from '@/application/controllers/user'

import { MOCK_USER, UserStub } from '../../helpers'

interface SutTypes {
  sut: FindAuthenticatedUserController
  userManager: UserStub
}

const makeSut = (): SutTypes => {
  const userManager = new UserStub()
  const sut = new FindAuthenticatedUserController(userManager)

  return {
    sut,
    userManager
  }
}

describe('Find Authenticated User Controller', () => {
  it('should return statusCode 200 on success', async () => {
    const { sut } = makeSut()
    const res = await sut.handle({ userId: MOCK_USER.id })

    expect(res).toMatchObject({
      statusCode: 200,
      data: MOCK_USER
    })
  })

  it('should return statusCode 500 if findAuthenticatedUser throws', async () => {
    const { sut, userManager } = makeSut()

    jest.spyOn(userManager, 'getUser').mockRejectedValueOnce(new Error())

    const res = await sut.handle({ userId: MOCK_USER.id })

    expect(res.statusCode).toBe(500)
  })
})
