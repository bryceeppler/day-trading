const config = require('./config/config');
const routes = require('./routes');
const cors = require('cors');

const startApp = (app) => {
  app.get('/', (req, res) => {
    res.send('Order Creatiion - Connection Successful');
  });

  app.use(cors());
  app.use(config.apiRootPath, routes.router);
  return app.listen(config.port, () => {
    console.log(`Server is up on port ${config.port}`);
  });
};

module.exports = startApp;
