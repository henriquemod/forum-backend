import components from './components'
import paths from './paths'
import schemas from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Forum API - An backend enhanced with AI',
    description: 'T',
    version: '1.0.0',
    contact: {
      name: 'Henrique Souza',
      email: 'henrique.asouza@yahoo.com',
      url: 'https://www.linkedin.com/in/henriquemod'
    },
    license: {
      name: 'GPL-3.0-or-later',
      url: 'https://spdx.org/licenses/GPL-3.0-or-later.html'
    }
  },
  servers: [
    {
      url: '/api',
      description: 'Servidor Principal'
    }
  ],
  tags: [
    {
      name: 'Login',
      description: 'APIs relacionadas a Login'
    },
    {
      name: 'Post',
      description: 'APIs relacionadas a Postagem'
    }
  ],
  paths,
  schemas,
  components
}
