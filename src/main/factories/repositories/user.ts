import type { ClientSession } from 'mongoose'

import type { DBUser } from '@/domain/usecases/db'
import { UserMongoRepository } from '@/infra/db/mongodb/repos'
import { BCryptHash } from '@/infra/encryption'

type UserFactory = DBUser.FindUserByEmail &
  DBUser.FindUserByUsername &
  DBUser.FindUserByUserId &
  DBUser.Add &
  DBUser.UpdateUser &
  DBUser.Delete

export const makeUserRepository = (session?: ClientSession): UserFactory => {
  return new UserMongoRepository(new BCryptHash(), session)
}
