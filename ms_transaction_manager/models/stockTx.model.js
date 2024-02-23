
const base = require('../shared/models/modelOperations')
const { COLLECTIONS } = require('../shared/models/baseModel');


exports.createTransaction = (data) =>
{
    return base.createOne(COLLECTIONS.STOCK_TRANSACTION, [data])
}

exports.fetchAllTransactions = (data, sortBy) =>
{
    return base.findAll(COLLECTIONS.STOCK_TRANSACTION, data, sortBy)
}

exports.fetchTransaction = (id) =>
{
    return base.findById(COLLECTIONS.STOCK_TRANSACTION, id)
}

exports.softDeleteTransaction = (id) => 
{
    return base.updateOneById(COLLECTIONS.STOCK_TRANSACTION, id, { is_deleted: true });
}

exports.updateOrderStatus = (id, orderStatus) =>
{
    return base.updateOneById(COLLECTIONS.STOCK_TRANSACTION, id, { order_status: orderStatus });
}
