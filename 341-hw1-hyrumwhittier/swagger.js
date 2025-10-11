// swagger.js
export const openapiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Contacts API',
    version: '1.0.0',
    description: 'CSE 341 Contacts API (GET, POST, PUT, DELETE)',
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Local' },
    { url: 'https://three41-project-1r8q.onrender.com', description: 'Render' },
  ],
  paths: {
    '/contacts': {
      get: {
        summary: 'Get all contacts',
        tags: ['Contacts'],
        responses: {
          200: {
            description: 'Array of contacts',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Contact' } }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create a new contact',
        tags: ['Contacts'],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateContactInput' } } }
        },
        responses: {
          201: {
            description: 'Created',
            content: { 'application/json': { schema: { type: 'object', properties: { id: { type: 'string' } } } } }
          },
          400: { description: 'Bad request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
        }
      }
    },
    '/contacts/{id}': {
      get: {
        summary: 'Get a contact by id',
        tags: ['Contacts'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Contact' } } } },
          400: { description: 'Invalid id', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
        }
      },
      put: {
        summary: 'Update a contact by id',
        tags: ['Contacts'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateContactInput' } } }
        },
        responses: {
          204: { description: 'Updated (no content)' },
          400: { description: 'Invalid input', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
        }
      },
      delete: {
        summary: 'Delete a contact by id',
        tags: ['Contacts'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Deleted', content: { 'application/json': { schema: { type: 'object', properties: { deleted: { type: 'boolean' } } } } } },
          404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
        }
      }
    },
    '/contacts/by/query': {
      get: {
        summary: 'Get a contact by id (query)',
        tags: ['Contacts'],
        parameters: [{ name: 'id', in: 'query', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Contact' } } } },
          400: { description: 'Invalid input', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
        }
      }
    }
  },
  components: {
    schemas: {
      Contact: {
        type: 'object',
        required: ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'],
        properties: {
          _id: { type: 'string', example: '671fcb12b4d1e7cf4e9f98e2' },
          firstName: { type: 'string', example: 'Hyrum' },
          lastName: { type: 'string', example: 'Whittier' },
          email: { type: 'string', format: 'email', example: 'whittierht@gmail.com' },
          favoriteColor: { type: 'string', example: 'Blue' },
          birthday: { type: 'string', description: 'YYYY-MM-DD', example: '2000-09-10' }
        }
      },
      CreateContactInput: {
        type: 'object',
        required: ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'],
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          favoriteColor: { type: 'string' },
          birthday: { type: 'string', description: 'YYYY-MM-DD' }
        }
      },
      UpdateContactInput: {
        type: 'object',
        required: ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'],
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          favoriteColor: { type: 'string' },
          birthday: { type: 'string', description: 'YYYY-MM-DD' }
        }
      },
      Error: { type: 'object', properties: { error: { type: 'string' } } }
    }
  }
};
