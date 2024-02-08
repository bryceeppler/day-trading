const express = require('express');
const router = express.Router();
const orderController = require('../controllers/matchingController');

router.get('/', (req, res) => {
  res.send('This is the matching engine microservice');
});
router.get('/healthcheck', orderController.healthCheck);
router.post('/limitOrderTrigger', orderController.limitOrderTrigger);
router.post('/marketOrderTrigger', orderController.marketOrderTrigger);

module.exports = router;
