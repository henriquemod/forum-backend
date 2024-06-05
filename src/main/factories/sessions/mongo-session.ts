import type { ClientSession } from 'mongoose'

import type { Session } from '@/application/protocols/session'

export const mongoSessionFactory = (nativeSession?: ClientSession): Session => {
  return {
    startTransaction: () => {
      nativeSession?.startTransaction()
    },
    commitTransaction: async () => {
      await nativeSession?.commitTransaction()
    },
    abortTransaction: async () => {
      await nativeSession?.abortTransaction()
    }
  }
}
