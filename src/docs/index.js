const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { resolve } = require('path');

module.exports = (app) => {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Belves-Server API',
        version: '0.1.0',
        description: 'Belves Server API',
        contact: {
          name: 'Omolade Sunday',
          email: 'omoladesunday221@gmail.com',
        },
      },
      components: {
        securitySchemes: {
          jwt: {
            type: 'http',
            scheme: 'bearer',
            in: 'header',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [{ jwt: [] }],
    },
    servers: [
      {
        url: 'http://localhost:2222/',
        description: 'Local Server',
      },
    ],
    apis: [resolve(__dirname, '../routes/*.js')],
  };
  const specs = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
