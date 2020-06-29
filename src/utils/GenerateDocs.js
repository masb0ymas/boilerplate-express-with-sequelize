import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'

const baseRoutes = './docs/swagger/routes'
const getPath = path => `${baseRoutes}${path}`
const docsSources = [
  getPath('/auth.js'),
  getPath('/user.js'),
  getPath('/role.js'),
  getPath('/master-tipe-identitas.js'),
]

export default function generateDocs(app) {
  const swaggerOptions = {
    definition: {
      // openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
      securityDefinitions: {
        jwt: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
        },
      },
      components: {
        parameters: {
          page: {
            in: 'query',
            name: 'page',
            required: false,
            default: 0,
          },
          pageSize: {
            in: 'query',
            name: 'pageSize',
            required: false,
            default: 10,
          },
          filtered: {
            in: 'query',
            name: 'filtered',
            required: false,
            default: [],
            description: 'Example: [{"id": "nama", "value": "test"}]',
          },
          sorted: {
            in: 'query',
            name: 'sorted',
            required: false,
            default: [],
            description: 'Example: [{"id": "createdAt", "desc": true}]',
          },
        },
      },
      info: {
        title: 'Example Api Documentation',
        version: '1.0.0',
      },
      basePath: '/v1',
    },
    apis: docsSources,
  }

  const swaggerSpec = swaggerJSDoc(swaggerOptions)

  app.get('/v1/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })

  app.use('/v1/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))
}
