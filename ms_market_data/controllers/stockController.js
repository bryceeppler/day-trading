const redis = require("../shared/config/redis");
const StockModel = require('../shared/models/stockModel');
const {
  handleError,
  successReturn,
  errorReturn,
} = require("../shared/lib/apiHandling");
const { STATUS_CODE } = require("../shared/lib/enums");

redis.connect()

exports.createStock = async (req, res, next) =>
{
  try
  {
    const { stock_name } = req.body;
    // check if the stock name already exists in db
    const existingStock = await redis.fetchStockFromParams({stock_name});

    if (existingStock) return errorReturn(res, "stock already exists");
		const newStock = new StockModel({ stock_name })
    await redis.createStock(newStock);

    return successReturn(res, { stock_id: newStock._id }, STATUS_CODE.CREATED);
  } catch (error)
  {
    return handleError(error, res, next);
  }
};

// /getStockPrices
exports.getStockPrices = async (req, res, next) =>
{
  try
  {
    const stocks = await redis.fetchAllStocks();

    // Map the documents and rename _id to stock_id
    const transformedStocks = stocks.map((stock) => ({
      stock_id: stock._id,
      stock_name: stock.stock_name,
      current_price: stock.current_price
    }));
    return successReturn(res, transformedStocks);
  } catch (error)
  {
    return handleError(error, res, next);
  }
};

// /getAllStocks
exports.getAllStocks = async (req, res, next) =>
{
  try
  {
    const stocks = await redis.fetchAllStocks();
    return successReturn(res, stocks);
  } catch (error)
  {
    return handleError(error, res, next);
  }
};

// /updateStockPrice/:stockId
exports.updateStockPrice = async (req, res, next) =>
{
  try
  {
    const stockId = req.params.stock_id;
    const { new_price } = req.body;

    // Check if the stock exists
    const existingStock = await redis.fetchStock(stockId);
		const updatedStock = {...existingStock, starting_price: new_price, current_price: new_price}

    if (!existingStock) return errorReturn(res, "Stock not found");

    redis.updateStock(updatedStock);

    return successReturn(res, updatedStock);
  } catch (error)
  {
    return handleError(error, res, next);
  }
};

// /getStockName
exports.getStockName = async (req, res, next) =>
{
  try
  {
    const stockId = req.body.stock_id;

    // Check if the stock exists
    const existingStock = await redis.fetchStock(stockId);

    if (!existingStock) return errorReturn(res, "Stock not found");

    return successReturn(res, { stock_name: existingStock.stock_name });
  } catch (error)
  {
    return handleError(error, res, next);
  }
};
