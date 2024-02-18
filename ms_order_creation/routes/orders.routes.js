
const orders = require('../controllers/orders.controller');
const { authenticateToken } = require('./middleware/authentication');
const validation = require('./validations/orders.validation')

module.exports = (router) => {
  router.route('/placeStockOrder').post([authenticateToken, validation.placeStockOrder], orders.placeStockOrder);
  router.route('/cancelStockTransaction').post([authenticateToken, validation.cancelStockTransaction], orders.cancelStockTransaction);
};
