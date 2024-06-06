export const createUserSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    username: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    level: {
      type: 'string'
    },
    verifiedEmail: {
      type: 'boolean'
    },
    createdAt: {
      type: 'string'
    },
    updatedAt: {
      type: 'string'
    }
  },
  required: [
    'id',
    'username',
    'email',
    'level',
    'verifiedEmail',
    'createdAt',
    'updatedAt'
  ]
}
