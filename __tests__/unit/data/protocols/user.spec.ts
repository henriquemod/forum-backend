import { BadRequest, InternalServerError } from '@/application/errors'
import { UserManager } from '@/data/protocols'
import { UserModel } from '@/domain/models'
import {
  type DBUserStub,
  MOCK_USER,
  SAFE_USER,
  UserRepositoryStub
} from '../helpers'
import { omit } from 'ramda'

const MOCK_REGULAR_USER = MOCK_USER
const MOCK_ADMIN_USER = {
  ...MOCK_USER,
  id: 'admin_user_id',
  level: UserModel.Level.ADMIN
}
const MOCK_MASTER_USER = {
  ...MOCK_USER,
  id: 'master_user_id',
  level: UserModel.Level.MASTER
}

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
  describe('delete', () => {
    it('should not allow master user to delete himself', () => {
      const { sut, userRepositoryStub } = makeSut()

      jest
        .spyOn(userRepositoryStub, 'findByUserId')
        .mockResolvedValueOnce(MOCK_MASTER_USER)
        .mockResolvedValueOnce(MOCK_MASTER_USER)

      const promise = sut.delete('master_user_id', 'master_user_id')

      expect(promise).rejects.toThrow('You cannot delete yourself')
      expect(promise).rejects.toBeInstanceOf(BadRequest)
    })

    it('should allow master user to delete admin users', async () => {
      const { sut, userRepositoryStub } = makeSut()

      const deleteSpy = jest.spyOn(userRepositoryStub, 'delete')

      jest
        .spyOn(userRepositoryStub, 'findByUserId')
        .mockResolvedValueOnce(MOCK_MASTER_USER)
        .mockResolvedValueOnce(MOCK_ADMIN_USER)

      await sut.delete('master_user_id', 'admin_user_id')

      expect(deleteSpy).toHaveBeenCalledWith('admin_user_id')
    })

    it('should allow master user to delete regular users', async () => {
      const { sut, userRepositoryStub } = makeSut()

      const deleteSpy = jest.spyOn(userRepositoryStub, 'delete')

      jest
        .spyOn(userRepositoryStub, 'findByUserId')
        .mockResolvedValueOnce(MOCK_MASTER_USER)
        .mockResolvedValueOnce(MOCK_REGULAR_USER)

      await sut.delete('master_user_id', 'regular_user_id')

      expect(deleteSpy).toHaveBeenCalledWith('regular_user_id')
    })

    it('should not allow admin user to delete another admin', () => {
      const { sut, userRepositoryStub } = makeSut()

      jest
        .spyOn(userRepositoryStub, 'findByUserId')
        .mockResolvedValueOnce(MOCK_ADMIN_USER)
        .mockResolvedValueOnce({ ...MOCK_ADMIN_USER, id: 'another_admin_id' })

      const promise = sut.delete('admin_user_id', 'another_admin_id')

      expect(promise).rejects.toThrow('You cannot delete an admin user')
      expect(promise).rejects.toBeInstanceOf(BadRequest)
    })

    it('should allow admin user to delete himself', async () => {
      const { sut, userRepositoryStub } = makeSut()

      const deleteSpy = jest.spyOn(userRepositoryStub, 'delete')

      jest
        .spyOn(userRepositoryStub, 'findByUserId')
        .mockResolvedValueOnce(MOCK_ADMIN_USER)
        .mockResolvedValueOnce(MOCK_ADMIN_USER)

      await sut.delete('admin_user_id', 'admin_user_id')

      expect(deleteSpy).toHaveBeenCalledWith('admin_user_id')
    })

    it('should allow regular user to delete himself', async () => {
      const { sut, userRepositoryStub } = makeSut()

      const deleteSpy = jest.spyOn(userRepositoryStub, 'delete')

      jest
        .spyOn(userRepositoryStub, 'findByUserId')
        .mockResolvedValueOnce(MOCK_REGULAR_USER)
        .mockResolvedValueOnce(MOCK_REGULAR_USER)

      await sut.delete('regular_user_id', 'regular_user_id')

      expect(deleteSpy).toHaveBeenCalledWith('regular_user_id')
    })

    it('should not allow regular user to delete another user', async () => {
      const { sut, userRepositoryStub } = makeSut()

      jest
        .spyOn(userRepositoryStub, 'findByUserId')
        .mockResolvedValueOnce(MOCK_REGULAR_USER)
        .mockResolvedValueOnce({
          ...MOCK_REGULAR_USER,
          id: 'another_regular_id'
        })

      const promise = sut.delete('regular_user_id', 'another_regular_id')

      expect(promise).rejects.toThrow(
        'You are not authorized to delete this user'
      )
      expect(promise).rejects.toBeInstanceOf(BadRequest)
    })
  })

  describe('registerUser', () => {
    it('should return user on success', async () => {
      const { sut, userRepositoryStub } = makeSut()
      jest
        .spyOn(userRepositoryStub, 'findByUsername')
        .mockResolvedValueOnce(null)
      jest.spyOn(userRepositoryStub, 'findByEmail').mockResolvedValueOnce(null)

      const res = await sut.registerUser(MOCK_USER)

      expect(res).toEqual(MOCK_USER)
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
      const { sut, userRepositoryStub } = makeSut()

      jest
        .spyOn(userRepositoryStub, 'findByUsername')
        .mockResolvedValueOnce(SAFE_USER)

      const res = await sut.getUser({
        value: MOCK_USER.username
      })

      expect(res).toEqual(SAFE_USER)
    })

    it('should return user on success from email origin', async () => {
      const { sut, userRepositoryStub } = makeSut()

      jest
        .spyOn(userRepositoryStub, 'findByEmail')
        .mockResolvedValueOnce(SAFE_USER)

      const res = await sut.getUser({
        value: MOCK_USER.email,
        origin: 'email'
      })

      expect(res).toEqual(SAFE_USER)
    })
    it('should throw NotFound if user not found from email origin', async () => {
      const { sut, userRepositoryStub } = makeSut()
      jest.spyOn(userRepositoryStub, 'findByEmail').mockResolvedValueOnce(null)

      const promise = sut.getUser({
        value: MOCK_USER.email,
        origin: 'email'
      })

      expect(promise).rejects.toThrow('User not found')
    })
    it('should return user on success from username origin', async () => {
      const { sut, userRepositoryStub } = makeSut()

      jest
        .spyOn(userRepositoryStub, 'findByUsername')
        .mockResolvedValueOnce(SAFE_USER)

      const res = await sut.getUser({
        value: MOCK_USER.username,
        origin: 'username'
      })

      expect(res).toEqual(SAFE_USER)
    })

    it('should throw NotFound if user not found from username origin', async () => {
      const { sut, userRepositoryStub } = makeSut()
      jest
        .spyOn(userRepositoryStub, 'findByUsername')
        .mockResolvedValueOnce(null)

      const promise = sut.getUser({
        value: MOCK_USER.username,
        origin: 'username'
      })

      expect(promise).rejects.toThrow('User not found')
    })
    it('should return user on success from id origin', async () => {
      const { sut, userRepositoryStub } = makeSut()

      jest
        .spyOn(userRepositoryStub, 'findByUserId')
        .mockResolvedValueOnce(SAFE_USER)

      const res = await sut.getUser({
        value: MOCK_USER.id,
        origin: 'id'
      })

      expect(res).toEqual(SAFE_USER)
    })

    it('should throw NotFound if user not found from id origin', async () => {
      const { sut, userRepositoryStub } = makeSut()
      jest.spyOn(userRepositoryStub, 'findByUserId').mockResolvedValueOnce(null)

      const promise = sut.getUser({
        value: MOCK_USER.id,
        origin: 'id'
      })

      expect(promise).rejects.toThrow('User not found')
    })

    it('should throw an error if expected SafeModel but got Model', async () => {
      const { sut, userRepositoryStub } = makeSut()
      const userModel = { ...MOCK_USER, password: 'hashed_password' }

      jest
        .spyOn(userRepositoryStub, 'findByUsername')
        .mockResolvedValueOnce(userModel)

      const promise = sut.getUser({
        value: MOCK_USER.username,
        safe: true
      })

      await expect(promise).rejects.toThrow(InternalServerError)
      await expect(promise).rejects.toThrow('Expected SafeModel but got Model')
    })

    it('should throw an error if expected Model but got SafeModel', async () => {
      const { sut, userRepositoryStub } = makeSut()
      const safeUserModel = { ...omit(['password'], MOCK_USER) }

      jest
        .spyOn(userRepositoryStub, 'findByUsername')
        .mockResolvedValueOnce(safeUserModel)

      const promise = sut.getUser({
        value: MOCK_USER.username,
        safe: false
      })

      await expect(promise).rejects.toThrow(InternalServerError)
      await expect(promise).rejects.toThrow('Expected Model but got SafeModel')
    })
  })

  describe('getPublicUser', () => {
    it('should return user on success from default origin', async () => {
      const { sut } = makeSut()

      const res = await sut.getPublicUser({
        value: MOCK_USER.username
      })

      expect(res).toMatchObject({
        username: MOCK_USER.username,
        createdAt: MOCK_USER.createdAt
      })
    })

    it('should return user on success from email origin', async () => {
      const { sut } = makeSut()

      const res = await sut.getPublicUser({
        value: MOCK_USER.email,
        origin: 'email'
      })

      expect(res).toMatchObject({
        username: MOCK_USER.username,
        createdAt: MOCK_USER.createdAt
      })
    })
    it('should throw NotFound if user not found from email origin', async () => {
      const { sut, userRepositoryStub } = makeSut()
      jest.spyOn(userRepositoryStub, 'findByEmail').mockResolvedValueOnce(null)

      const promise = sut.getPublicUser({
        value: MOCK_USER.email,
        origin: 'email'
      })

      expect(promise).rejects.toThrow('User not found')
    })
    it('should return user on success from username origin', async () => {
      const { sut } = makeSut()

      const res = await sut.getPublicUser({
        value: MOCK_USER.username,
        origin: 'username'
      })

      expect(res).toMatchObject({
        username: MOCK_USER.username,
        createdAt: MOCK_USER.createdAt
      })
    })

    it('should throw NotFound if user not found from username origin', async () => {
      const { sut, userRepositoryStub } = makeSut()
      jest
        .spyOn(userRepositoryStub, 'findByUsername')
        .mockResolvedValueOnce(null)

      const promise = sut.getPublicUser({
        value: MOCK_USER.username,
        origin: 'username'
      })

      expect(promise).rejects.toThrow('User not found')
    })
    it('should return user on success from id origin', async () => {
      const { sut } = makeSut()

      const res = await sut.getPublicUser({
        value: MOCK_USER.id,
        origin: 'username'
      })

      expect(res).toMatchObject({
        username: MOCK_USER.username,
        createdAt: MOCK_USER.createdAt
      })
    })

    it('should throw NotFound if user not found from id origin', async () => {
      const { sut, userRepositoryStub } = makeSut()
      jest.spyOn(userRepositoryStub, 'findByUserId').mockResolvedValueOnce(null)

      const promise = sut.getPublicUser({
        value: MOCK_USER.id,
        origin: 'id'
      })

      expect(promise).rejects.toThrow('User not found')
    })
  })

  describe('activate', () => {
    it('should call update with correct values', () => {
      const { sut, userRepositoryStub } = makeSut()

      const updateSpy = jest.spyOn(userRepositoryStub, 'update')

      sut.activate(MOCK_USER.id)

      expect(updateSpy).toHaveBeenCalledWith({
        userId: MOCK_USER.id,
        userData: { verifiedEmail: true }
      })
    })

    it('should throw if update throws', () => {
      const { sut, userRepositoryStub } = makeSut()

      jest
        .spyOn(userRepositoryStub, 'update')
        .mockRejectedValueOnce(new Error())

      const promise = sut.activate(MOCK_USER.id)

      expect(promise).rejects.toThrow()
    })
  })
})
