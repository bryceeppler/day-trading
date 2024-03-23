const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Authentication Service API',
            version: '1.0.0',
            description: 'Authentication service API for day trading application',
        },
        servers: [
            {
                url: 'http://localhost:8006',
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
