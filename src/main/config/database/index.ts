import type { ClientSession } from 'mongoose'

import { mongoDbInit } from './mongodb'

export const databaseInit = async (): Promise<ClientSession> => {
  return await mongoDbInit()
}
