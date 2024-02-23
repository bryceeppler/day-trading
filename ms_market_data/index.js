const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const fs = require('fs');
const routes = require('./routes/stockRoutes');
const connectDB = require('./shared/config/database');


// local instance of environment variables
const mongoUri = process.env.MONGO_URI;
const port = process.env.PORT || 3000;

// Force swagger UI to output file
// const outputPath = './swagger.json';
// fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));

var app = express();
app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/', routes);
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

async function startup()
{
  await connectDB(mongoUri);

  app.listen(port, () =>
  {
    console.log(`Market data microservice on port ${port}...`);
  });
}

startup();
