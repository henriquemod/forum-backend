import type { User } from '@/data/protocols/db'
import type { Hash } from '@/data/protocols/encryption'
import type { User as UserModel } from '@/domain/models'
import { UserSchema } from '@/infra/db/mongodb/schemas'

export class UserMongoRepository implements User.Add, User.Find {
  constructor(private readonly hash: Hash.Generate) {}

  async add({
    username,
    email,
    password
  }: Omit<UserModel, 'id'>): Promise<User.AddResult> {
    const hashedPassword = await this.hash.generate(password)

    const accessToken = new UserSchema({
      username,
      email,
      password: hashedPassword
    })

    const { id } = await accessToken.save()

    return {
      id
    }
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    return await UserSchema.findOne({
      email
    })
  }

  async findByUsername(username: string): Promise<UserModel | null> {
    return await UserSchema.findOne({
      username
    })
  }

  async findByUserId(id: string): Promise<UserModel | null> {
    return await UserSchema.findOne({
      _id: id
    })
  }
}
