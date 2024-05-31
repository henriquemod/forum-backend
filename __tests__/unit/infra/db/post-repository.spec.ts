import {
  PostMongoRepository,
  UserMongoRepository
} from '@/infra/db/mongodb/repos'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { PostSchema } from '@/infra/db/mongodb/schemas'
import { HashStub } from '../../application/helpers'
import { MOCK_USER } from '../../data/helpers'

const MOCK_POST_ID = '123456789012345678901234'

interface SutTypes {
  sut: PostMongoRepository
}

const makeSut = (): SutTypes => {
  const sut = new PostMongoRepository()

  return {
    sut
  }
}

describe('PostMongoRepository', () => {
  let mongoServer: MongoMemoryServer
  let userId: string

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())

    const userRepository = new UserMongoRepository(new HashStub())
    const user = await userRepository.add(MOCK_USER)
    userId = user.id
  })

  afterEach(async () => {
    await mongoose.disconnect()
    mongoServer.stop()
  })

  describe('create', () => {
    it('should create a new post and return the post id', async () => {
      const { sut } = makeSut()

      const result = await sut.create({
        userId,
        content: 'any_content',
        title: 'any_title'
      })

      expect(result.id).toBeTruthy()
    })

    it('should throw if save throws', () => {
      const { sut } = makeSut()

      jest.spyOn(PostSchema.prototype, 'save').mockImplementationOnce(() => {
        throw new Error()
      })

      const promise = sut.create({
        userId,
        content: 'any_content',
        title: 'any_title'
      })

      expect(promise).rejects.toThrow()
    })
  })

  describe('update', () => {
    it('should update a post', async () => {
      const { sut } = makeSut()

      const post = await sut.create({
        userId,
        content: 'any_content',
        title: 'any_title'
      })

      await sut.update({
        id: post.id,
        updateContent: {
          title: 'any_edited_title',
          content: 'any_edited_content'
        }
      })

      const updatedPost = await sut.findById(post.id)

      expect(updatedPost).toMatchObject({
        id: post.id,
        title: 'any_edited_title',
        content: 'any_edited_content'
      })
    })

    it('should throw if findByIdAndUpdate throws', () => {
      const { sut } = makeSut()

      jest.spyOn(PostSchema, 'findByIdAndUpdate').mockImplementationOnce(() => {
        throw new Error()
      })

      const promise = sut.update({
        id: MOCK_POST_ID,
        updateContent: {
          title: 'any_edited_title',
          content: 'any_edited_content'
        }
      })

      expect(promise).rejects.toThrow()
    })
  })

  describe('delete', () => {
    it('should delete a post', async () => {
      const { sut } = makeSut()

      const post = await sut.create({
        userId,
        content: 'any_content',
        title: 'any_title'
      })

      await sut.delete(post.id)

      const find = await sut.findById(post.id)

      expect(find).toBeNull()
    })

    it('should throw if findByIdAndDelete throws', () => {
      const { sut } = makeSut()

      jest.spyOn(PostSchema, 'findByIdAndDelete').mockImplementationOnce(() => {
        throw new Error()
      })

      const promise = sut.delete(MOCK_POST_ID)

      expect(promise).rejects.toThrow()
    })
  })

  describe('findById', () => {
    it('should find a post by id', async () => {
      const { sut } = makeSut()

      const createRest = await sut.create({
        userId,
        content: 'any_content',
        title: 'any_title'
      })

      const findRes = await sut.findById(createRest.id)

      expect(findRes?.user.toString()).toBe(userId)
    })

    it('should throw if findById throws', () => {
      const { sut } = makeSut()

      jest.spyOn(PostSchema, 'findById').mockImplementationOnce(() => {
        throw new Error()
      })

      const promise = sut.findById(MOCK_POST_ID)

      expect(promise).rejects.toThrow()
    })
  })

  describe('findAll', () => {
    it('should find all posts', async () => {
      const { sut } = makeSut()

      await sut.create({
        userId,
        content: 'any_content',
        title: 'any_title'
      })
      const res = await sut.findAll()

      expect(res).toHaveLength(1)
      expect(res[0].id).toBeDefined()
      expect(res[0].user).toBeDefined()
    })

    it('should throw if find throws', () => {
      const { sut } = makeSut()

      jest.spyOn(PostSchema, 'find').mockImplementationOnce(() => {
        throw new Error()
      })

      const promise = sut.findAll()

      expect(promise).rejects.toThrow()
    })
  })
})
