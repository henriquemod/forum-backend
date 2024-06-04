import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { pick } from 'ramda'

import type { PostModel, UserModel } from '@/domain/models'
import {
  PostMongoRepository,
  ReplyMongoRepository,
  UserMongoRepository
} from '@/infra/db/mongodb/repos'
import { PostSchema, ReplySchema, UserSchema } from '@/infra/db/mongodb/schemas'

import { MOCK_POST, MOCK_USER } from '../../data/helpers'

interface SutTypes {
  sut: ReplyMongoRepository
}

const makeSut = (): SutTypes => {
  const sut = new ReplyMongoRepository()

  return {
    sut
  }
}

describe('ReplyMongoRepository', () => {
  let mongoServer: MongoMemoryServer
  let user: UserModel.SafeModel
  let post: PostModel.Model

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())

    const newUser = new UserSchema(MOCK_USER)
    await newUser.save()
    user = UserMongoRepository.makeDTO(newUser, true)

    const newPost = new PostSchema({
      ...pick(['title', 'content'], MOCK_POST),
      user: new mongoose.Types.ObjectId(user.id)
    })
    await newPost.save()
    post = PostMongoRepository.makeDTO(newPost)
  })

  afterEach(async () => {
    await ReplySchema.deleteMany({})
    await PostSchema.deleteMany({})
    await UserSchema.deleteMany({})
    await mongoose.disconnect()
    mongoServer.stop()
    jest.restoreAllMocks()
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    const replyParams = {
      user,
      content: 'any_content',
      post,
      parentReply: null
    }

    it('should create a new reply and return the reply model', async () => {
      const { sut } = makeSut()

      const result = await sut.create({
        user,
        content: 'any_content',
        post,
        parentReply: null
      })

      expect(result).toBeTruthy()
      expect(result.content).toBe(replyParams.content)
      expect(result.user).toMatchObject(user)
      expect(result.post).toMatchObject(post)
    })

    it('should create a new reply to reply and return the reply model', async () => {
      const { sut } = makeSut()

      const resultOne = await sut.create({
        user,
        content: 'any_content',
        post,
        parentReply: null
      })

      const resultTwo = await sut.create({
        user,
        content: 'any_content',
        post,
        parentReply: resultOne
      })

      expect(resultTwo).toBeTruthy()
      expect(resultTwo.content).toBe(replyParams.content)
      expect(resultTwo.user.id).toBe(user.id)
      expect(resultTwo.post.id).toBe(post.id)
      expect(resultTwo.parentReply?.toString()).toBe(resultOne.id)
    })

    it('should add the reply to the post replies array', async () => {
      const { sut } = makeSut()

      const reply = await sut.create({
        user,
        content: 'any_content',
        post,
        parentReply: null
      })

      const postRepo = new PostMongoRepository()

      const findPost = await postRepo.findById(post.id)
      expect(findPost?.replies).toHaveLength(1)
      expect(findPost?.replies?.[0].content).toBe(reply.content)
    })

    it('should throw if findByIdAndUpdate throws', () => {
      const { sut } = makeSut()

      jest.spyOn(PostSchema, 'findByIdAndUpdate').mockImplementationOnce(() => {
        throw new Error()
      })

      const promise = sut.create(replyParams)

      expect(promise).rejects.toThrow()
    })

    it('should throw if save throws', () => {
      const { sut } = makeSut()

      jest.spyOn(ReplySchema.prototype, 'save').mockImplementationOnce(() => {
        throw new Error()
      })

      const promise = sut.create(replyParams)

      expect(promise).rejects.toThrow()
    })

    it('should call PostSchema.findByIdAndUpdate with correct params', async () => {
      const { sut } = makeSut()

      const psy = jest.spyOn(PostSchema, 'findByIdAndUpdate')

      const res = await sut.create({
        user,
        content: 'any_content',
        post,
        parentReply: null
      })

      expect(psy).toHaveBeenCalledWith(
        new mongoose.Types.ObjectId(post.id),
        { $push: { replies: new mongoose.Types.ObjectId(res.id) } },
        { session: undefined }
      )
    })

    it('should throw if PostSchema.findByIdAndUpdate throws', () => {
      const { sut } = makeSut()

      jest.spyOn(PostSchema, 'findByIdAndUpdate').mockImplementationOnce(() => {
        throw new Error()
      })

      const promise = sut.create(replyParams)

      expect(promise).rejects.toThrow()
    })

    it('should call ReplySchema.findByIdAndUpdate with correct params', async () => {
      const { sut } = makeSut()

      const psy = jest.spyOn(ReplySchema, 'findByIdAndUpdate')

      const resOne = await sut.create({
        user,
        content: 'any_content',
        post,
        parentReply: null
      })

      const resTwo = await sut.create({
        user,
        content: 'any_content',
        post,
        parentReply: resOne
      })

      expect(psy).toHaveBeenCalledWith(
        new mongoose.Types.ObjectId(resOne.id),
        { $push: { replies: new mongoose.Types.ObjectId(resTwo.id) } },
        { session: undefined }
      )
    })

    it('should throw if ReplySchema.findByIdAndUpdate throws', async () => {
      const { sut } = makeSut()

      jest
        .spyOn(ReplySchema, 'findByIdAndUpdate')
        .mockImplementationOnce(() => {
          throw new Error()
        })

      const reply = await sut.create({
        user,
        content: 'any_content',
        post,
        parentReply: null
      })

      const promise = sut.create({
        user,
        content: 'any_content',
        post,
        parentReply: reply
      })

      expect(promise).rejects.toThrow()
    })
  })
  describe('findById', () => {
    it('should return a reply by id', async () => {
      const { sut } = makeSut()

      const reply = await sut.create({
        user,
        content: 'any_content',
        post,
        parentReply: null
      })

      const result = await sut.findById(reply.id)

      expect(result).toBeTruthy()
      expect(result?.id).toBe(reply.id)
      expect(result?.content).toBe(reply.content)
      expect(result?.user.id).toBe(user.id)
      expect(result?.post.id).toBe(post.id)
    })

    it('should return null if invalid object id is provided', async () => {
      const { sut } = makeSut()

      const result = await sut.findById('invalid_id')

      expect(result).toBeNull()
    })

    it('should return null if reply is not found', async () => {
      const { sut } = makeSut()

      const result = await sut.findById(
        new mongoose.Types.ObjectId().toHexString()
      )

      expect(result).toBeNull()
    })
  })

  describe('delete', () => {
    it('should delete a reply by id', async () => {
      const { sut } = makeSut()

      const reply = await sut.create({
        user,
        content: 'any_content',
        post,
        parentReply: null
      })

      await sut.delete(reply.id)

      const result = await sut.findById(reply.id)

      expect(result).toBeNull()
    })

    it('should throw if findByIdAndDelete throws', () => {
      const { sut } = makeSut()

      jest
        .spyOn(ReplySchema, 'findByIdAndDelete')
        .mockImplementationOnce(() => {
          throw new Error()
        })

      const promise = sut.delete('any_id')

      expect(promise).rejects.toThrow()
    })

    it('should call ReplySchema.findByIdAndDelete with correct params', async () => {
      const { sut } = makeSut()

      const psy = jest.spyOn(ReplySchema, 'findByIdAndDelete')

      const reply = await sut.create({
        user,
        content: 'any_content',
        post,
        parentReply: null
      })

      await sut.delete(reply.id)

      expect(psy).toHaveBeenCalledWith(reply.id, { session: undefined })
    })
  })

  describe('update', () => {
    it('should update a reply by id', async () => {
      const { sut } = makeSut()

      const reply = await sut.create({
        user,
        content: 'any_content',
        post,
        parentReply: null
      })

      await sut.update(reply.id, 'new_content')

      const result = await sut.findById(reply.id)

      expect(result).toBeTruthy()
      expect(result?.content).toBe('new_content')
    })

    it('should throw if findByIdAndUpdate throws', () => {
      const { sut } = makeSut()

      jest
        .spyOn(ReplySchema, 'findByIdAndUpdate')
        .mockImplementationOnce(() => {
          throw new Error()
        })

      const promise = sut.update('any_id', 'new_content')

      expect(promise).rejects.toThrow()
    })

    it('should call ReplySchema.findByIdAndUpdate with correct params', async () => {
      const { sut } = makeSut()

      const psy = jest.spyOn(ReplySchema, 'findByIdAndUpdate')

      const reply = await sut.create({
        user,
        content: 'any_content',
        post,
        parentReply: null
      })

      await sut.update(reply.id, 'new_content')

      expect(psy).toHaveBeenCalledWith(
        reply.id,
        { content: 'new_content', updatedAt: expect.any(Date) },
        { session: undefined }
      )
    })
  })
})
