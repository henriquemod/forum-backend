export const findUserUserSchema = {
  type: 'object',
  properties: {
    username: {
      type: 'string'
    },
    createdAt: {
      type: 'string'
    }
  },
  required: ['username', 'createdAt']
}
