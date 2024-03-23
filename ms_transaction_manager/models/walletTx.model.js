
const base = require('../shared/models/modelOperations')
const { COLLECTIONS } = require('../shared/models/baseModel');


exports.createTransaction = (data) => {
	return base.createOne(COLLECTIONS.WALLET_TRANSACTION, [data])
}

exports.fetchAllTransactions = (data, sortBy) => {
	return base.findAll(COLLECTIONS.WALLET_TRANSACTION, data, sortBy)
}

exports.fetchTransaction = (id) => {
	return base.findById(COLLECTIONS.WALLET_TRANSACTION, id)
}

exports.softDeleteTransaction = (id) => 
{
    return base.updateOneById(COLLECTIONS.WALLET_TRANSACTION, id, { is_deleted: true});
}

exports.updateStockTxId = (id, stockTxId) =>
{
    return  base.updateOneById(COLLECTIONS.WALLET_TRANSACTION, id, { stock_tx_id: stockTxId } );
}
