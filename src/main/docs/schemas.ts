import {
  loginParamsSchema,
  errorSchema,
  createUserSchema,
  deleteUserSchema,
  findUserUserSchema
} from './schemas/'

export default {
  loginParams: loginParamsSchema,
  createUser: createUserSchema,
  findUser: findUserUserSchema,
  deleteUser: deleteUserSchema,
  error: errorSchema
}
