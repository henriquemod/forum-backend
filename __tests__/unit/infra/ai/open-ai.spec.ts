/* eslint-disable @typescript-eslint/no-explicit-any */
import { OpenAI } from '@/infra/ai'
import { env } from '@/main/config/env'

jest.mock('@/main/config/env')

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
  beforeEach(() => {
    env.features.openAiApiKey = 'any_key'
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  describe('JSONFromPrompt', () => {
    it('should throw if openAi throws', async () => {
      const { sut } = makeSut()

      await expect(sut.JSONFromPrompt('any_text')).rejects.toThrow()
    })

    it('should throw if openAi return null', async () => {
      const { sut } = makeSut()

      const res = await sut.JSONFromPrompt('any_text')

      expect(res).toEqual({
        type: 'error',
        message: 'Error on OpenAI response'
      })
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

      expect(res).toEqual({ type: 'success', data: { level: 5 } })
    })

    it('should return disabled if openAi is not defined', async () => {
      env.features.openAiApiKey = undefined
      const { sut } = makeSut()

      const res = await sut.JSONFromPrompt('any_text')

      expect(res).toEqual({ type: 'disabled' })
    })
  })
})
