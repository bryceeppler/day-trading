const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const fs = require('fs');
const routes = require('./routes/stockRoutes');
var app = express();

// local instance of environment variables
const mongoUri = process.env.MONGO_URI;
const port = process.env.PORT || 3000;

// Force swagger UI to output file
// const outputPath = './swagger.json';
// fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/', routes);

async function startup()
{
  await mongoose.connect(mongoUri, {
    authSource: 'admin'
  })
    .then(console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

  app.listen(port, () =>
  {
    console.log(`Market data microservice on port ${port}...`);
  });
}

startup();
