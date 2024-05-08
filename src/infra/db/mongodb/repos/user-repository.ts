import type { User } from '@/data/usecases'
import type { Hash } from '@/data/usecases/encryption'
import type { UserModel } from '@/domain/models'
import type { DBUser } from '@/domain/usecases/db'
import { UserSchema } from '@/infra/db/mongodb/schemas'

type UserDBUsecases = DBUser.FindUserByEmail &
  DBUser.FindUserByUsername &
  DBUser.FindUserByUserId &
  DBUser.Add

type EncryptionDataUsecases = Hash.Generate

export class UserMongoRepository implements UserDBUsecases {
  constructor(private readonly hash: EncryptionDataUsecases) {}

  async add({
    username,
    email,
    password
  }: User.RegisterParams): Promise<DBUser.AddResult> {
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

  async findByEmail(email: string): Promise<UserModel.Model | null> {
    return await UserSchema.findOne({
      email
    })
  }

  async findByUsername(username: string): Promise<UserModel.Model | null> {
    return await UserSchema.findOne({
      username
    })
  }

  async findByUserId(id: string): Promise<UserModel.Model | null> {
    return await UserSchema.findOne({
      _id: id
    })
  }
}
