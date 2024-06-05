import type { Router } from 'express'

import { adaptExpressRoute } from '@/main/adapters'

import type { ExtraParams } from '../config/routes'
import {
  makeCreateUserController,
  makeDeleteUserController,
  makeFindAuthenticatedUserController,
  makeFindUserController
} from '../factories/controllers/user'
import { auth } from '../middlewares'

export default (router: Router, { session }: ExtraParams): void => {
  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Retrieve a list of users
   *     responses:
   *       200:
   *         description: A list of users
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                     description: The user ID.
   *                     example: d5fE_asz
   *                   name:
   *                     type: string
   *                     description: The user's name.
   *                     example: John Doe
   */
  router.get('/user/:id', adaptExpressRoute(makeFindUserController()))
  router.post('/user', adaptExpressRoute(makeCreateUserController(session)))
  router.post(
    '/auth-user',
    auth,
    adaptExpressRoute(makeFindAuthenticatedUserController())
  )
  router.delete('/user', auth, adaptExpressRoute(makeDeleteUserController()))
}
