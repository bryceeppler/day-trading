const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Market Data Service API',
            version: '1.0.0',
            description: 'Market data service API for day trading application',
        },
        servers: [
            {
                url: 'http://localhost:8005', // Your server URL
            },
        ],
    },
    apis: ['./routes/*.js'], // Path to your route files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
