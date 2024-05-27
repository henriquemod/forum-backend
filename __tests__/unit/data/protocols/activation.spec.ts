import { ActivationManager } from '@/data/protocols'
import {
  type DBActivationStub,
  type DBUserStub,
  MOCK_USER,
  MOCK_ACTIVATION,
  ActivationRepositoryStub,
  UserRepositoryStub
} from '../helpers'

interface SutTypes {
  sut: ActivationManager
  activationRepositoryStub: DBActivationStub
  userRepositoryStub: DBUserStub
}

const makeSut = (): SutTypes => {
  const activationRepositoryStub = new ActivationRepositoryStub()
  const userRepositoryStub = new UserRepositoryStub()
  const sut = new ActivationManager(activationRepositoryStub)

  return {
    sut,
    activationRepositoryStub,
    userRepositoryStub
  }
}

describe('ActivationManager', () => {
  describe('getUser', () => {
    it('should return user on success', async () => {
      const { sut } = makeSut()

      const res = await sut.getUser(MOCK_ACTIVATION.code)

      expect(res).toEqual(MOCK_USER)
    })

    it('should throw NotFound if activation code not found', () => {
      const { sut, activationRepositoryStub } = makeSut()
      jest
        .spyOn(activationRepositoryStub, 'findByCode')
        .mockResolvedValueOnce(null)

      const promise = sut.getUser(MOCK_ACTIVATION.code)

      expect(promise).rejects.toThrow('Activation code not found')
    })
  })

  describe('createActivationCode', () => {
    it('should return activation model on success', async () => {
      const { sut, userRepositoryStub, activationRepositoryStub } = makeSut()
      jest
        .spyOn(userRepositoryStub, 'findByUserId')
        .mockResolvedValueOnce(MOCK_USER)
      jest
        .spyOn(activationRepositoryStub, 'create')
        .mockResolvedValueOnce(MOCK_ACTIVATION)

      const res = await sut.createActivationCode(MOCK_USER)

      expect(res).toEqual(MOCK_ACTIVATION)
    })

    // it('should throw NotFound if user not found', () => {
    //   const { sut, userRepositoryStub } = makeSut()
    //   jest.spyOn(userRepositoryStub, 'findByUserId').mockResolvedValueOnce(null)

    //   const promise = sut.createActivationCode(MOCK_USER)

    //   expect(promise).rejects.toThrow('User not found')
    // })
  })
})
