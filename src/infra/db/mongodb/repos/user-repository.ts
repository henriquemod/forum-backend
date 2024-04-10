import type { User } from '@/data/protocols/db'
import type { User as UserModel } from '@/domain/models'
import { UserSchema } from '@/infra/db/mongodb/schemas'

export class UserMongoRepository implements User.Add, User.Find {
  async add({
    username,
    email,
    password
  }: Omit<UserModel, 'id'>): Promise<User.AddResult> {
    const accessToken = new UserSchema({
      username,
      email,
      password
    })
    const newUser = await accessToken.save()

    return {
      id: newUser.id
    }
  }

  async findByEmail(email: string): Promise<UserModel> {
    const user = await UserSchema.findOne({
      email
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

  async findByUsername(username: string): Promise<UserModel> {
    const user = await UserSchema.findOne({
      username
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
