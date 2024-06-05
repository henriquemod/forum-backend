import type { Express } from 'express'
import swaggerUi from 'swagger-ui-express'

import swaggerConfig from '@/main/docs'
import { noCache } from '@/main/middlewares'

export function setupSwagger(app: Express) {
  app.use('/api-docs', noCache, swaggerUi.serve, swaggerUi.setup(swaggerConfig))
}
