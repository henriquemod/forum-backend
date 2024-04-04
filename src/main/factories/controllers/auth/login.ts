import { LoginController } from '@/application/controllers/auth'
import { LoginService } from '@/data/services'
// import type { DataSource } from 'typeorm'

export const makeLoginController = (): LoginController => {
  const service = new LoginService()
  return new LoginController(service)
}
