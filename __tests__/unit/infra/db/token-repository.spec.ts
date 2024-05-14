import { TokenMongoRepository } from '@/infra/db/mongodb/repos/token-repository'
import { AccessTokenSchema } from '@/infra/db/mongodb/schemas'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

const MOCK_USER_ID = '123456789012345678901234'

interface SutTypes {
  sut: TokenMongoRepository
}

const makeSut = (): SutTypes => {
  const sut = new TokenMongoRepository()
  return {
    sut
  }
}

describe('TokenMongoRepository', () => {
  let mongoServer: MongoMemoryServer

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
  })

  afterAll(async () => {
    await mongoose.disconnect()
    mongoServer.stop()
  })

  beforeEach(async () => {
    await AccessTokenSchema.deleteMany({})
  })

  describe('add', () => {
    it('should add a new token', async () => {
      const { sut } = makeSut()

      const tokenData = {
        accessToken: 'access_token',
        refreshAccessToken: 'refresh_token',
        userId: MOCK_USER_ID
      }

      await sut.add(tokenData)

      const token = await AccessTokenSchema.findOne({
        accessToken: tokenData.accessToken
      })

      expect(token).toBeTruthy()
      expect(token?.accessToken).toBe(tokenData.accessToken)
      expect(token?.refreshAccessToken).toBe(tokenData.refreshAccessToken)
      expect(token?.user.toString()).toBe(tokenData.userId)
    })
  })

  describe('findByToken', () => {
    it('should return the token if found with the given access token', async () => {
      const { sut } = makeSut()
      const tokenData = {
        accessToken: 'access_token',
        refreshAccessToken: 'refresh_token',
        userId: MOCK_USER_ID
      }

      const token = await AccessTokenSchema.create(tokenData)
      const result = await sut.findByToken(token.accessToken)

      expect(result?.accessToken).toEqual(tokenData.accessToken)
    })

    it('should return null if no token is found with the given access token', async () => {
      const { sut } = makeSut()

      const result = await sut.findByToken('nonexistent_token')

      expect(result).toBeNull()
    })
  })

  describe('findByRefreshToken', () => {
    it('should return the token if found with the given refresh access token', async () => {
      const { sut } = makeSut()

      const tokenData = {
        accessToken: 'access_token',
        refreshAccessToken: 'refresh_token',
        userId: 'user_id'
      }

      await AccessTokenSchema.create(tokenData)

      const result = await sut.findByRefreshToken(tokenData.refreshAccessToken)

      expect(result?.accessToken).toEqual(tokenData.accessToken)
    })

    it('should return null if no token is found with the given refresh access token', async () => {
      const { sut } = makeSut()

      const result = await sut.findByRefreshToken('nonexistent_token')

      expect(result).toBeNull()
    })
  })

  describe('findByUserId', () => {
    it('should return the token if found with the given user id', async () => {
      const { sut } = makeSut()

      const tokenData = {
        accessToken: 'access_token',
        refreshAccessToken: 'refresh_token',
        user: MOCK_USER_ID
      }

      await AccessTokenSchema.create(tokenData)

      const result = await sut.findByUserId(tokenData.user)

      expect(result?.accessToken).toEqual(tokenData.accessToken)
    })

    it('should return null if no token is found with the given user id', async () => {
      const { sut } = makeSut()

      const result = await sut.findByUserId(MOCK_USER_ID)

      expect(result).toBeNull()
    })
  })

  describe('delete', () => {
    it('should delete the token with the given access token', async () => {
      const { sut } = makeSut()

      const tokenData = {
        accessToken: 'access_token',
        refreshAccessToken: 'refresh_token',
        userId: MOCK_USER_ID
      }

      await AccessTokenSchema.create(tokenData)

      await sut.delete(tokenData.accessToken)

      const token = await AccessTokenSchema.findOne({
        accessToken: tokenData.accessToken
      })

      expect(token).toBeNull()
    })
  })
})
