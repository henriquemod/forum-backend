import { UserManager } from '@/data/protocols'
import { type DBUserStub, MOCK_USER, UserRepositoryStub } from '../helpers'

interface SutTypes {
  sut: UserManager
  userRepositoryStub: DBUserStub
}

const makeSut = (): SutTypes => {
  const userRepositoryStub = new UserRepositoryStub()
  const sut = new UserManager(userRepositoryStub)

  return {
    sut,
    userRepositoryStub
  }
}

describe('UserManager', () => {
  describe('registerUser', () => {
    it('should return user id on success', async () => {
      const { sut, userRepositoryStub } = makeSut()
      jest
        .spyOn(userRepositoryStub, 'findByUsername')
        .mockResolvedValueOnce(null)
      jest.spyOn(userRepositoryStub, 'findByEmail').mockResolvedValueOnce(null)

      const res = await sut.registerUser(MOCK_USER)

      expect(res).toEqual({ id: MOCK_USER.id })
    })

    it('should throw BadRequest if email already exist', () => {
      const { sut, userRepositoryStub } = makeSut()
      jest
        .spyOn(userRepositoryStub, 'findByUsername')
        .mockResolvedValueOnce(null)

      const promise = sut.registerUser(MOCK_USER)

      expect(promise).rejects.toThrow('Username or email already in use')
    })

    it('should throw BadRequest if username already exist', () => {
      const { sut, userRepositoryStub } = makeSut()
      jest.spyOn(userRepositoryStub, 'findByEmail').mockResolvedValueOnce(null)

      const promise = sut.registerUser(MOCK_USER)

      expect(promise).rejects.toThrow('Username or email already in use')
    })

    it('should throw BadRequest if both email and username already exist', () => {
      const { sut } = makeSut()

      const promise = sut.registerUser(MOCK_USER)

      expect(promise).rejects.toThrow('Username or email already in use')
    })
  })

  describe('getUser', () => {
    it('should return user on success from default origin', async () => {
      const { sut } = makeSut()

      const res = await sut.getUser(MOCK_USER.username)

      expect(res).toEqual(MOCK_USER)
    })

    it('should return user on success from email origin', async () => {
      const { sut } = makeSut()

      const res = await sut.getUser(MOCK_USER.email, 'email')

      expect(res).toEqual(MOCK_USER)
    })
    it('should throw NotFound if user not found from email origin', async () => {
      const { sut, userRepositoryStub } = makeSut()
      jest.spyOn(userRepositoryStub, 'findByEmail').mockResolvedValueOnce(null)

      const promise = sut.getUser(MOCK_USER.email, 'email')

      expect(promise).rejects.toThrow('User not found')
    })
    it('should return user on success from username origin', async () => {
      const { sut } = makeSut()

      const res = await sut.getUser(MOCK_USER.username, 'username')

      expect(res).toEqual(MOCK_USER)
    })

    it('should throw NotFound if user not found from username origin', async () => {
      const { sut, userRepositoryStub } = makeSut()
      jest
        .spyOn(userRepositoryStub, 'findByUsername')
        .mockResolvedValueOnce(null)

      const promise = sut.getUser(MOCK_USER.username, 'username')

      expect(promise).rejects.toThrow('User not found')
    })
  })
})
