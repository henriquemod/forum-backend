import { adaptExpressRoute } from '@/main/adapters'
import type { Router } from 'express'
import { makeFindAuthenticatedUserController } from '../factories/controllers/user'
import { auth } from '../middlewares'

export default (router: Router): void => {
  router.post(
    '/auth-user',
    auth,
    adaptExpressRoute(makeFindAuthenticatedUserController())
  )
}
