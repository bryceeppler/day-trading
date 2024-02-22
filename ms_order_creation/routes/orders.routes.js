
const orders = require('../controllers/orders.controller');
const validation = require('./validations/orders.validation')
const { authenticateToken } = require('../shared/middleware/authentication');
const accessToken = process.env.JWT_SECRET;

module.exports = (router) => {
  router.route('/placeStockOrder').post([authenticateToken(accessToken), validation.placeStockOrder], orders.placeStockOrder);
  router.route('/cancelStockTransaction').post([authenticateToken(accessToken), validation.cancelStockTransaction], orders.cancelStockTransaction);
};
