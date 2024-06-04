import bcrypt from 'bcrypt'

import { InternalServerError } from '@/application/errors'
import { BCryptHash } from '@/infra/encryption'
import '@/main/config/env'

jest.mock('bcrypt')
jest.mock('@/main/config/env', () => ({
  env: {
    bcryptSalt: 12
  }
}))

const makeSut = () => {
  const sut = new BCryptHash()

  return { sut }
}

describe('BCryptHash', () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  describe('generate', () => {
    it('should return hashed password on success', async () => {
      const { sut } = makeSut()
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce((value, salt, cb) => {
        cb(undefined, 'hashed_value')
      })

      const value = 'any_value'

      const res = await sut.generate(value)

      expect(res).toBe('hashed_value')
    })

    it('should throws InternalServerError if hash generation returns error', async () => {
      const { sut } = makeSut()
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce((value, salt, cb) => {
        cb(new Error(), '')
      })

      const promise = sut.generate('any_value')

      await expect(promise).rejects.toThrow(InternalServerError)
    })
    it('should generate hash from password', () => {
      const { sut } = makeSut()

      const value = 'any_value'

      sut.generate(value)

      expect(bcrypt.hash).toHaveBeenCalledWith(value, 12, expect.any(Function))
    })

    it('should throw if generate throws', async () => {
      const { sut } = makeSut()

      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
        throw new Error()
      })

      const promise = sut.generate('any_value')

      await expect(promise).rejects.toThrow()
    })
  })

  describe('compare', () => {
    it('should compare values', () => {
      const { sut } = makeSut()

      const value = 'any_value'
      const hash = 'any_hash'

      sut.compare(value, hash)

      expect(bcrypt.compare).toHaveBeenCalledWith(
        value,
        hash,
        expect.any(Function)
      )
    })

    it('should throw if compare throws', async () => {
      const { sut } = makeSut()

      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
        throw new Error()
      })

      const promise = sut.compare('any_value', 'any_hash')

      await expect(promise).rejects.toThrow()
    })

    it('should throw InternalServerError if compare returns error', async () => {
      const { sut } = makeSut()
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementationOnce((value, hash, cb) => {
          cb(new Error(), false)
        })

      const promise = sut.compare('any_value', 'any_hash')

      await expect(promise).rejects.toThrow(InternalServerError)
    })

    it('should return true if compare succeeds', async () => {
      const { sut } = makeSut()
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementationOnce((value, hash, cb) => {
          cb(undefined, true)
        })

      const res = await sut.compare('any_value', 'any_hash')

      expect(res).toBe(true)
    })
  })
})
