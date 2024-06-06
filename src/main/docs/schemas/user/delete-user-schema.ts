export const deleteUserSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      description: 'The ID of the user to be deleted'
    }
  },
  required: ['id']
}
