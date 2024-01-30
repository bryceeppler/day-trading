
const orders = require('../controllers/orders.controller');
const validation = require('./validations/orders.validation')

module.exports = (router) => {
  router.route('/placeStockOrder').post([validation.placeStockOrder], orders.placeStockOrder);
};
