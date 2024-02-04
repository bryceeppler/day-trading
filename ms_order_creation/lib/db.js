

exports.COLLECTIONS = {
	BUY_ORDERS: 'buy_orders',
	SELL_ORDERS: 'sell_orders'
}



exports.BUY_ORDER_SCHEMA = {
	price: Number,
	quantity: Number,
	date: String,
	stock_id: Number,
	is_buy: Boolean,
	order_type: String,
	account_id: Number
}

exports.BUY_ORDER_FIND_SCHEMA = {
	price: Number,
	quantity: Number,
	date: String,
	stock_id: Number,
	is_buy: Boolean,
	order_type: String,
	account_id: Number
}