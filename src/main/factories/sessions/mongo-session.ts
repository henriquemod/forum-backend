import type { Session } from '@/application/protocols/session'
import type { ClientSession } from 'mongoose'

export const mongoSessionFactory = (nativeSession: ClientSession): Session => {
  return {
    startTransaction: () => {
      nativeSession.startTransaction()
    },
    commitTransaction: async () => {
      await nativeSession.commitTransaction()
    },
    abortTransaction: async () => {
      await nativeSession.abortTransaction()
    }
  }
}
