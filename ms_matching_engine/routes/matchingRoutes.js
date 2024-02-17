const express = require('express');

module.exports = (orderBook) => {
  const router = express.Router();
  const orderController = require('../controllers/matchingController')(orderBook);

  router.get('/', (req, res) => {
    res.send('This is the matching engine microservice');
  });
  router.get('/healthcheck', orderController.healthCheck);
  router.post('/receiveOrder', orderController.receiveOrder);

  return router;
};
