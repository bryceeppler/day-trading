
const base = require('../shared/models/modelOperations')
const { COLLECTIONS } = require('../shared/models/baseModel');


exports.createTransaction = async (data) => {
	return await base.createOne(COLLECTIONS.WALLET_TRANSACTION, [data])
}

exports.fetchAllTransaction = async (data) => {
	return await base.find(COLLECTIONS.WALLET_TRANSACTION, [data])
}

exports.fetchTransactionById = async (data) => {
	return await base.findById(COLLECTIONS.WALLET_TRANSACTION, [data])
}

exports.fetchTransaction = async (id) => {
	return await base.findOne(COLLECTIONS.WALLET_TRANSACTION, id)
}

exports.softDeleteTransaction = async (id) => 
{
    return await base.updateOneById(COLLECTIONS.WALLET_TRANSACTION, id, { is_deleted: true});
}

exports.updateStockTxId = async (id, stockTxId) =>
{
    return await base.updateOneById(COLLECTIONS.WALLET_TRANSACTION, id, { stock_tx_id: stockTxId } );

}
