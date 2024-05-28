import { adaptExpressRoute } from '@/main/adapters'
import type { Router } from 'express'
import type { ClientSession } from 'mongoose'
import {
  makeCreateUserController,
  makeDeleteUserController,
  makeFindAuthenticatedUserController,
  makeFindUserController
} from '../factories/controllers/user'
import { auth } from '../middlewares'

export default (router: Router, session: ClientSession): void => {
  router.get('/user/:id', adaptExpressRoute(makeFindUserController()))
  router.post('/user', adaptExpressRoute(makeCreateUserController(session)))
  router.post(
    '/auth-user',
    auth,
    adaptExpressRoute(makeFindAuthenticatedUserController())
  )
  router.delete('/user', auth, adaptExpressRoute(makeDeleteUserController()))
}
