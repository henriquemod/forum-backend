import { adaptMiddleware } from '@/main/adapters'
import { makeAuthMiddleware } from '../factories/middlewares'

export const auth = adaptMiddleware(makeAuthMiddleware())
