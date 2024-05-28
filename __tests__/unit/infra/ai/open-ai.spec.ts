/* eslint-disable @typescript-eslint/no-explicit-any */
import { InternalServerError } from '@/application/errors'
import { OpenAI } from '@/infra/ai'

jest.mock('openai', () => {
  return jest
    .fn()
    .mockImplementationOnce(() => ({
      chat: {
        completions: {
          create: jest.fn().mockRejectedValueOnce(new Error())
        }
      }
    }))
    .mockImplementationOnce(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: { content: null } }]
          } as any)
        }
      }
    }))
    .mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: { content: JSON.stringify({ level: 5 }) } }]
          } as any)
        }
      }
    }))
})

interface SutTypes {
  sut: OpenAI
}

const makeSut = (): SutTypes => {
  const sut = new OpenAI()
  return {
    sut
  }
}

describe('OpenAI', () => {
  describe('JSONFromPrompt', () => {
    it('should throw if openAi throws', async () => {
      const { sut } = makeSut()

      await expect(sut.JSONFromPrompt('any_text')).rejects.toThrow()
    })

    it('should throw if openAi return null', async () => {
      const { sut } = makeSut()

      await expect(sut.JSONFromPrompt('any_text')).rejects.toThrow(
        InternalServerError
      )
    })

    it('should call openAi with correct params', async () => {
      const { sut } = makeSut()

      const openAiSpy = jest.spyOn(sut, 'JSONFromPrompt')

      await sut.JSONFromPrompt('any_text')

      expect(openAiSpy).toHaveBeenCalledWith('any_text')
    })

    it('should return correct response', async () => {
      const { sut } = makeSut()

      const res = await sut.JSONFromPrompt('any_text')

      expect(res).toEqual({ level: 5 })
    })
  })
})
