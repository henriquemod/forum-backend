import type {
  AddUserRepository,
  FindUserByEmailRepository,
  FindUserByUsernameRepository
} from '@/data/protocols/db/user'
import type { User } from '@/domain/models'
import { UserSchema } from '@/infra/db/mongodb/schemas'

export class UserMongoRepository
  implements
    AddUserRepository,
    FindUserByEmailRepository,
    FindUserByUsernameRepository
{
  async add(data: AddUserRepository.Params): Promise<AddUserRepository.Result> {
    const accessToken = new UserSchema({
      username: data.username,
      email: data.email,
      password: data.password
    })
    const newUser = await accessToken.save()

    return {
      id: newUser.id
    }
  }

  async findByEmail(
    data: FindUserByEmailRepository.Params
  ): Promise<FindUserByEmailRepository.Result> {
    const user = await UserSchema.findOne({
      email: data.email
    })

    if (!user) {
      throw new Error('User not found')
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      password: user.password
    }
  }

  async findByUsername(
    data: FindUserByUsernameRepository.Params
  ): Promise<User> {
    const user = await UserSchema.findOne({
      username: data.username
    })

    if (!user) {
      throw new Error('User not found')
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      password: user.password
    }
  }
}
