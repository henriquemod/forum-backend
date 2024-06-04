import mongoose, { type ClientSession } from 'mongoose'

import { env } from '../env'

export const mongoDbInit = async (): Promise<ClientSession> => {
  const db = await mongoose.connect(env.mongoUrl)
  return await db.startSession()
}
