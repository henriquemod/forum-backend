import type { UserModel } from '@/domain/models'
import {
  PostMongoRepository,
  ReplyMongoRepository,
  UserMongoRepository
} from '@/infra/db/mongodb/repos'
import { PostSchema } from '@/infra/db/mongodb/schemas'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { HashStub } from '../../application/helpers'
import { MOCK_USER } from '../../data/helpers'

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
  let user: UserModel.SafeModel

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())

    const userRepository = new UserMongoRepository(new HashStub())
    user = await userRepository.add(MOCK_USER)
  })

  afterEach(async () => {
    await mongoose.disconnect()
    mongoServer.stop()
    jest.restoreAllMocks()
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create a new post and return the post id', async () => {
      const { sut } = makeSut()

      const result = await sut.create({
        userId: user.id,
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
        userId: user.id,
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
        userId: user.id,
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
        id: 'any_id',
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
        userId: user.id,
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

      const promise = sut.delete('any_id')

      expect(promise).rejects.toThrow()
    })
  })

  describe('findById', () => {
    it('should find a post by id', async () => {
      const { sut } = makeSut()

      const createRest = await sut.create({
        userId: user.id,
        content: 'any_content',
        title: 'any_title'
      })

      const findRes = await sut.findById(createRest.id)

      expect(findRes?.user.id).toBe(user.id)
    })

    it('should throw if findById throws', () => {
      const { sut } = makeSut()

      jest.spyOn(PostSchema, 'findById').mockImplementationOnce(() => {
        throw new Error()
      })

      const promise = sut.findById('any_id')

      expect(promise).rejects.toThrow()
    })
  })

  describe('findAll', () => {
    it('should find all posts', async () => {
      const { sut } = makeSut()

      await sut.create({
        userId: user.id,
        content: 'any_content',
        title: 'any_title'
      })
      const res = await sut.findAll()

      expect(res).toHaveLength(1)
      expect(res[0].id).toBeDefined()
      expect(res[0].user).toBeDefined()
    })

    it('should find all posts with replies', async () => {
      const { sut } = makeSut()

      const post = await sut.create({
        userId: user.id,
        content: 'any_content',
        title: 'any_title'
      })

      const replyRepo = new ReplyMongoRepository()
      const reply = await replyRepo.create({
        user,
        content: 'any_content',
        post,
        parentReply: null
      })

      const res = await sut.findAll()

      expect(res).toHaveLength(1)
      expect(res[0].id).toBeDefined()
      expect(res[0].user).toBeDefined()
      expect(res[0].replies).toHaveLength(1)
      expect(res[0].replies?.[0].id).toBe(reply.id)
      expect(res[0].replies?.[0].user.toString()).toBe(user.id)
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
