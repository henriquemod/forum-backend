import { ActivateUserController } from '@/application/controllers/auth'
import { NotFound } from '@/application/errors'
import { ValidationComposite } from '@/application/validation'
import type { Activation, User } from '@/data/usecases/'
import { ActivationStub, UserStub } from '../../helpers'

jest.mock('@/application/validation/composite')

interface SutTypes {
  sut: ActivateUserController
  userManager: User.ActivateUser
  activationManager: Activation.GetUserByActivationCode
}

const makeSut = (): SutTypes => {
  const userManager = new UserStub()
  const activationManager = new ActivationStub()

  return {
    sut: new ActivateUserController(userManager, activationManager),
    userManager,
    activationManager
  }
}

describe('Activate User Controller', () => {
  it('should return statusCode 204 on success', async () => {
    const { sut } = makeSut()
    const res = await sut.handle({ code: 'any_code' })

    expect(res.statusCode).toBe(204)
  })

  it('should throw if getUser throws', () => {
    const { sut, activationManager } = makeSut()

    jest
      .spyOn(activationManager, 'getUser')
      .mockRejectedValueOnce(new NotFound('Activation code not found'))

    const res = sut.handle({ code: 'any_code' })

    expect(res).resolves.toEqual({
      statusCode: 404,
      error: 'Activation code not found'
    })
  })

  it('should throw if activate throws', () => {
    const { sut, userManager } = makeSut()

    jest.spyOn(userManager, 'activate').mockRejectedValueOnce(new Error())

    const res = sut.handle({ code: 'any_code' })

    expect(res).resolves.toEqual({
      statusCode: 500,
      error: 'Internal server error'
    })
  })

  it('should return 400 if no code is provided', async () => {
    const { sut } = makeSut()
    const error = new Error('validation_error')
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))
    jest
      .mocked(ValidationComposite)
      .mockImplementationOnce(ValidationCompositeSpy)

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual({
      statusCode: 400,
      error: error.message
    })
  })
})
