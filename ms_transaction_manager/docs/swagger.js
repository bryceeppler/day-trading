const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Transaction Manager Service API',
            version: '1.0.0',
            description: 'Transaction manager service API for day trading application',
        },
        servers: [
            {
                url: 'http://localhost:8006', // Your server URL
            },
        ],
    },
    apis: ['./routes/*.js'], // Path to your route files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
