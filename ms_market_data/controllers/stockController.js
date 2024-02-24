const Stock = require("../models/stock.model");
const {
  handleError,
  successReturn,
  errorReturn,
} = require("../shared/lib/apiHandling");
const { STATUS_CODE } = require("../shared/lib/enums");

exports.createStock = async (req, res, next) =>
{
  try
  {
    const { stock_name } = req.body;
    // check if the stock name already exists in db
    const existingStock = await Stock.fetchStockByName(stock_name);

    if (existingStock) return errorReturn(res, "stock already exists");

    const newStock = await Stock.createStock({stock_name});

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
    const stocks = (await Stock.fetchAllStocks()) || {};

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
    const stocks = await Stock.fetchAllStocks() || {};
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
    const existingStock = await Stock.findStockById(stockId);

    if (!existingStock) return errorReturn(res, "Stock not found");

    stockModel.updateStockPrice(stockId, new_price);

    return successReturn(res, existingStock);
  } catch (error)
  {
    return handleError(error, res, next);
  }
};
