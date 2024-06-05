import {
  InternalServerError,
  NotFound,
  Unauthorized
} from '@/application/errors'
import { ReplyManager } from '@/data/protocols'
import { UserModel } from '@/domain/models'

import {
  type DBReplyStub,
  type DBPostStub,
  type DBUserStub,
  MOCK_REPLY,
  MOCK_POST,
  MOCK_USER,
  ReplyRepositoryStub,
  PostRepositoryStub,
  UserRepositoryStub
} from '../helpers'

interface SutTypes {
  sut: ReplyManager
  replyRepositoryStub: DBReplyStub
  postRepositoryStub: DBPostStub
  userRepositoryStub: DBUserStub
}

const makeSut = (): SutTypes => {
  const replyRepositoryStub = new ReplyRepositoryStub()
  const postRepositoryStub = new PostRepositoryStub()
  const userRepositoryStub = new UserRepositoryStub()
  const sut = new ReplyManager(
    replyRepositoryStub,
    postRepositoryStub,
    userRepositoryStub
  )

  return {
    sut,
    replyRepositoryStub,
    postRepositoryStub,
    userRepositoryStub
  }
}

describe('ReplyManager', () => {
  describe('reply', () => {
    const replyParams = {
      authorId: MOCK_USER.id,
      content: MOCK_REPLY.content,
      postId: MOCK_POST.id
    }

    it('should create reply on success', async () => {
      const { sut, replyRepositoryStub } = makeSut()

      const spy = jest.spyOn(replyRepositoryStub, 'create')

      await sut.reply(replyParams)

      expect(spy).toHaveBeenCalledWith({
        content: replyParams.content,
        post: expect.objectContaining(MOCK_POST),
        parentReply: null,
        user: expect.objectContaining(MOCK_USER)
      })
    })

    it('should create reply from reply on success', async () => {
      const { sut, replyRepositoryStub } = makeSut()

      const spy = jest.spyOn(replyRepositoryStub, 'create')

      await sut.reply({ ...replyParams, replyContentId: MOCK_REPLY.id })

      expect(spy).toHaveBeenCalledWith({
        content: replyParams.content,
        post: expect.objectContaining(MOCK_POST),
        parentReply: expect.objectContaining(MOCK_REPLY),
        user: expect.objectContaining(MOCK_USER)
      })
    })

    it('should throw NotFound if user not found', async () => {
      const { sut, userRepositoryStub } = makeSut()
      jest.spyOn(userRepositoryStub, 'findByUserId').mockResolvedValueOnce(null)

      const res = sut.reply(replyParams)

      await expect(res).rejects.toThrow(new NotFound('User or post not found'))
    })

    it('should throw NotFound if post not found', async () => {
      const { sut, postRepositoryStub } = makeSut()
      jest.spyOn(postRepositoryStub, 'findById').mockResolvedValueOnce(null)

      const res = sut.reply(replyParams)

      await expect(res).rejects.toThrow(new NotFound('User or post not found'))
    })

    it('should throw if create reply throws', async () => {
      const { sut, replyRepositoryStub } = makeSut()
      jest
        .spyOn(replyRepositoryStub, 'create')
        .mockRejectedValueOnce(new Error())

      const res = sut.reply(replyParams)

      await expect(res).rejects.toThrow()
    })
    it('should throw if does not find parent reply', () => {
      const { sut, replyRepositoryStub } = makeSut()
      jest.spyOn(replyRepositoryStub, 'findById').mockResolvedValueOnce(null)

      const res = sut.reply({
        authorId: MOCK_USER.id,
        content: MOCK_REPLY.content,
        postId: MOCK_POST.id,
        replyContentId: MOCK_REPLY.id
      })

      expect(res).rejects.toThrow(new NotFound('Parent reply not found'))
    })
  })

  describe('findById', () => {
    it('should return reply on success', async () => {
      const { sut } = makeSut()

      const res = await sut.findById({ replyId: MOCK_REPLY.id })

      expect(res).toEqual(MOCK_REPLY)
    })

    it('should throw NotFound if reply not found', () => {
      const { sut, replyRepositoryStub } = makeSut()
      jest.spyOn(replyRepositoryStub, 'findById').mockResolvedValueOnce(null)

      const res = sut.findById({ replyId: MOCK_REPLY.id })

      expect(res).rejects.toThrow(new NotFound('Reply not found'))
    })

    it('should throw if findById throws', async () => {
      const { sut, replyRepositoryStub } = makeSut()
      jest
        .spyOn(replyRepositoryStub, 'findById')
        .mockRejectedValueOnce(new InternalServerError())

      const res = sut.findById({ replyId: MOCK_REPLY.id })

      await expect(res).rejects.toThrow(InternalServerError)
    })
  })

  describe('delete', () => {
    it('should call delete with correct values', async () => {
      const { sut, replyRepositoryStub } = makeSut()

      const spy = jest.spyOn(replyRepositoryStub, 'delete')

      await sut.delete({ replyId: MOCK_REPLY.id, userId: MOCK_USER.id })

      expect(spy).toHaveBeenCalledWith(MOCK_REPLY.id)
    })

    it('should throw NotFound if reply not found', () => {
      const { sut, replyRepositoryStub } = makeSut()
      jest.spyOn(replyRepositoryStub, 'findById').mockResolvedValueOnce(null)

      const res = sut.delete({ replyId: MOCK_REPLY.id, userId: MOCK_USER.id })

      expect(res).rejects.toThrow(new NotFound('Reply or user not found'))
    })

    it('should throw NotFound if user not found', () => {
      const { sut, userRepositoryStub } = makeSut()
      jest.spyOn(userRepositoryStub, 'findByUserId').mockResolvedValueOnce(null)

      const res = sut.delete({ replyId: MOCK_REPLY.id, userId: MOCK_USER.id })

      expect(res).rejects.toThrow(new NotFound('Reply or user not found'))
    })

    it('should throw Unauthorized if user is not the author', () => {
      const { sut, replyRepositoryStub } = makeSut()

      jest.spyOn(replyRepositoryStub, 'findById').mockResolvedValueOnce({
        ...MOCK_REPLY,
        user: { ...MOCK_REPLY.user, id: 'other_id' }
      })

      const res = sut.delete({ replyId: MOCK_REPLY.id, userId: MOCK_USER.id })

      expect(res).rejects.toThrow(
        new Unauthorized('You are not allowed to delete this reply')
      )
    })

    it('should throw if delete throws', async () => {
      const { sut, replyRepositoryStub } = makeSut()
      jest
        .spyOn(replyRepositoryStub, 'delete')
        .mockRejectedValueOnce(new InternalServerError())

      const res = sut.delete({ replyId: MOCK_REPLY.id, userId: MOCK_USER.id })

      await expect(res).rejects.toThrow(InternalServerError)
    })

    it('should allow admin to delete reply', async () => {
      const { sut, replyRepositoryStub, userRepositoryStub } = makeSut()

      jest.spyOn(userRepositoryStub, 'findByUserId').mockResolvedValueOnce({
        ...MOCK_USER,
        id: 'admin_id',
        level: UserModel.Level.ADMIN
      })

      const spy = jest.spyOn(replyRepositoryStub, 'delete')

      await sut.delete({ replyId: MOCK_REPLY.id, userId: MOCK_USER.id })

      expect(spy).toHaveBeenCalledWith(MOCK_REPLY.id)
    })

    it('should allow master user to delete reply', async () => {
      const { sut, replyRepositoryStub, userRepositoryStub } = makeSut()

      jest.spyOn(userRepositoryStub, 'findByUserId').mockResolvedValueOnce({
        ...MOCK_USER,
        id: 'master_id',
        level: UserModel.Level.MASTER
      })

      const spy = jest.spyOn(replyRepositoryStub, 'delete')

      await sut.delete({ replyId: MOCK_REPLY.id, userId: MOCK_USER.id })

      expect(spy).toHaveBeenCalledWith(MOCK_REPLY.id)
    })
  })

  describe('update', () => {
    it('should call update with correct values', async () => {
      const { sut, replyRepositoryStub, userRepositoryStub } = makeSut()

      jest
        .spyOn(userRepositoryStub, 'findByUserId')
        .mockResolvedValueOnce(MOCK_USER)

      const spy = jest.spyOn(replyRepositoryStub, 'update')

      await sut.update({
        content: MOCK_REPLY.content,
        replyId: MOCK_REPLY.id,
        userId: MOCK_USER.id
      })

      expect(spy).toHaveBeenCalledWith(MOCK_REPLY.id, MOCK_REPLY.content)
    })

    it('should throw NotFound if reply not found', () => {
      const { sut, replyRepositoryStub } = makeSut()
      jest.spyOn(replyRepositoryStub, 'findById').mockResolvedValueOnce(null)

      const res = sut.update({
        content: MOCK_REPLY.content,
        replyId: MOCK_REPLY.id,
        userId: MOCK_USER.id
      })

      expect(res).rejects.toThrow(new NotFound('Reply or user not found'))
    })

    it('should throw NotFound if user not found', () => {
      const { sut, userRepositoryStub } = makeSut()
      jest.spyOn(userRepositoryStub, 'findByUserId').mockResolvedValueOnce(null)

      const res = sut.update({
        content: MOCK_REPLY.content,
        replyId: MOCK_REPLY.id,
        userId: MOCK_USER.id
      })

      expect(res).rejects.toThrow(new NotFound('Reply or user not found'))
    })

    it('should throw Unauthorized if user is not the author', () => {
      const { sut, replyRepositoryStub } = makeSut()

      jest.spyOn(replyRepositoryStub, 'findById').mockResolvedValueOnce({
        ...MOCK_REPLY,
        user: { ...MOCK_REPLY.user, id: 'other_id' }
      })

      const res = sut.update({
        content: MOCK_REPLY.content,
        replyId: MOCK_REPLY.id,
        userId: MOCK_USER.id
      })

      expect(res).rejects.toThrow(
        new Unauthorized('You are not allowed to update this reply')
      )
    })

    it('should throw if update throws', async () => {
      const { sut, replyRepositoryStub } = makeSut()
      jest
        .spyOn(replyRepositoryStub, 'update')
        .mockRejectedValueOnce(new InternalServerError())

      const res = sut.update({
        content: MOCK_REPLY.content,
        replyId: MOCK_REPLY.id,
        userId: MOCK_USER.id
      })

      await expect(res).rejects.toThrow(InternalServerError)
    })
  })
})
