import type { User } from '@/data/protocols/db'
import type { User as UserModel } from '@/domain/models'
import type {
  FindUserByEmail,
  FindUserByUsername
} from '@/domain/usecases/db/user'

export class DBUserFindByEmail implements FindUserByEmail {
  constructor(private readonly repository: User.Find) {}

  async findByEmail(email: string): Promise<UserModel> {
    return await this.repository.findByEmail(email)
  }
}

export class DBUserFindByUsername implements FindUserByUsername {
  constructor(private readonly repository: User.Find) {}

  async findByUsername(username: string): Promise<UserModel> {
    return await this.repository.findByUsername(username)
  }
}
