import { DeleteUserController } from '@/application/controllers/user'
import { UserStub } from '../../helpers'

interface SutTypes {
  sut: DeleteUserController
  userManager: UserStub
}

const makeSut = (): SutTypes => {
  const userManager = new UserStub()
  const sut = new DeleteUserController(userManager)

  return {
    sut,
    userManager
  }
}

describe('Delete User Controller', () => {
  it('should return statusCode 204 on success', async () => {
    const { sut } = makeSut()
    const res = await sut.handle({ id: 'valid_id', userId: 'valid_user_id' })

    expect(res).toMatchObject({
      statusCode: 204
    })
  })

  it('should call delete with correct values', async () => {
    const { sut, userManager } = makeSut()

    const deleteSpy = jest.spyOn(userManager, 'delete')

    await sut.handle({ id: 'valid_id', userId: 'valid_user_id' })

    expect(deleteSpy).toHaveBeenCalledWith('valid_user_id', 'valid_id')
  })

  it('should return statusCode 400 if no id is provided', async () => {
    const { sut } = makeSut()
    const res = await sut.handle({ userId: 'valid_user_id' })

    expect(res).toMatchObject({
      statusCode: 400
    })
  })

  it('should return statusCode 500 if delete throws', async () => {
    const { sut, userManager } = makeSut()

    jest.spyOn(userManager, 'delete').mockRejectedValueOnce(new Error())

    const res = await sut.handle({ id: 'valid_id', userId: 'valid_user_id' })

    expect(res.statusCode).toBe(500)
  })
})
