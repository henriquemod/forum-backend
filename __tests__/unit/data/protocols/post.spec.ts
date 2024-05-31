import { PostManager } from '@/data/protocols'
import { omit } from 'ramda'
import {
  type DBPostStub,
  MOCK_POST,
  MOCK_USER,
  PostRepositoryStub
} from '../helpers'

interface SutTypes {
  sut: PostManager
  postRepositoryStub: DBPostStub
}

const MOCK_BODY = {
  ...omit(['user'], MOCK_POST),
  userId: MOCK_USER.id
}

const makeSut = (): SutTypes => {
  const postRepositoryStub = new PostRepositoryStub()
  const sut = new PostManager(postRepositoryStub)

  return {
    sut,
    postRepositoryStub
  }
}

describe('PostManager', () => {
  describe('createPost', () => {
    it('should return id on success', async () => {
      const { sut } = makeSut()

      const res = await sut.createPost(MOCK_BODY)

      expect(res).toEqual(MOCK_POST)
    })

    it('should throw if createPost throws', () => {
      const { sut, postRepositoryStub } = makeSut()
      jest
        .spyOn(postRepositoryStub, 'create')
        .mockRejectedValueOnce(new Error())

      const res = sut.createPost(MOCK_BODY)

      expect(res).rejects.toThrow()
    })
  })

  describe('findPost', () => {
    it('should return post on success', async () => {
      const { sut } = makeSut()

      const res = await sut.findPost({ id: 'any_id' })

      expect(res).toEqual(MOCK_POST)
    })

    it('should return null if post not found', async () => {
      const { sut, postRepositoryStub } = makeSut()
      jest.spyOn(postRepositoryStub, 'findById').mockResolvedValueOnce(null)

      const res = await sut.findPost({ id: 'any_id' })

      expect(res).toBeNull()
    })

    it('should throw if findPost throws', () => {
      const { sut, postRepositoryStub } = makeSut()
      jest
        .spyOn(postRepositoryStub, 'findById')
        .mockRejectedValueOnce(new Error())

      const res = sut.findPost({ id: 'any_id' })

      expect(res).rejects.toThrow()
    })
  })

  describe('findAllPosts', () => {
    it('should return posts on success', async () => {
      const { sut } = makeSut()

      const res = await sut.findAllPosts()

      expect(res).toEqual([MOCK_POST])
    })

    it('should return empty array if no posts found', async () => {
      const { sut, postRepositoryStub } = makeSut()
      jest.spyOn(postRepositoryStub, 'findAll').mockResolvedValueOnce([])

      const res = await sut.findAllPosts()

      expect(res).toEqual([])
    })

    it('should throw if findAllPosts throws', () => {
      const { sut, postRepositoryStub } = makeSut()
      jest
        .spyOn(postRepositoryStub, 'findAll')
        .mockRejectedValueOnce(new Error())

      const res = sut.findAllPosts()

      expect(res).rejects.toThrow()
    })
  })

  describe('updatePost', () => {
    it('should update post on success', async () => {
      const { sut, postRepositoryStub } = makeSut()

      const spy = jest.spyOn(postRepositoryStub, 'update')

      await sut.updatePost({
        id: 'any_id',
        ...omit(['id'], MOCK_BODY)
      })

      expect(spy).toHaveBeenCalledWith({
        id: 'any_id',
        updateContent: expect.objectContaining({
          content: MOCK_BODY.content,
          title: MOCK_BODY.title,
          userId: MOCK_BODY.userId
        })
      })
    })

    it('should throw if updatePost throws', () => {
      const { sut, postRepositoryStub } = makeSut()
      jest
        .spyOn(postRepositoryStub, 'update')
        .mockRejectedValueOnce(new Error())

      const res = sut.updatePost({ id: 'any_id', ...omit(['id'], MOCK_BODY) })

      expect(res).rejects.toThrow()
    })
  })

  describe('deletePost', () => {
    it('should delete post on success', async () => {
      const { sut, postRepositoryStub } = makeSut()

      const spy = jest.spyOn(postRepositoryStub, 'delete')

      await sut.deletePost({ id: 'any_id' })

      expect(spy).toHaveBeenCalledWith('any_id')
    })

    it('should throw if deletePost throws', () => {
      const { sut, postRepositoryStub } = makeSut()
      jest
        .spyOn(postRepositoryStub, 'delete')
        .mockRejectedValueOnce(new Error())

      const res = sut.deletePost({ id: 'any_id' })

      expect(res).rejects.toThrow()
    })
  })
})
