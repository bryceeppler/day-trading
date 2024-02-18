import React, { ReactElement, useEffect, useState } from 'react';
import styles from './PlaceOrderModal.module.scss';
import CloseIcon from '@mui/icons-material/Close';
import TextField from 'components/TextField';
import Button from 'components/Button';
import useUsers from 'hooks/useUsers.hook';
import { BUTTON_TYPE } from 'components/Button/Button';
import { PlaceStockOrderParams, Stock } from 'types/users.types';
import SlidingToggle from 'components/SlidingToggle';
import Dropdown from 'components/Dropdown';

interface PlaceOrderModalProps {
  open: boolean;
  onClose: () => void;
	onSave: () => void;
}

enum ORDER_TYPES {
	LIMIT= "LIMIT",
	MARKET = 'MARKET'
}
function PlaceOrderModal({ open, onClose, onSave }: PlaceOrderModalProps): ReactElement {


	const [price, setPrice] = useState<number>();
	const [quantity, setQuantity] = useState<number>()
	const [isBuy, setIsBuy] = useState<boolean>(true)
	const [orderType, setOrderType] = useState<ORDER_TYPES>(ORDER_TYPES.MARKET)
	const [stock, setStock] = useState<Stock>()
	const [verify, setVerify] = useState<boolean>(false);

	const { placeStockOrder, fetchStocks, stocks } = useUsers()

	const verified = () => {
    setVerify(true);
    if (!quantity || quantity < 0) return false;
    if (!price || price < 0) return false;
		if (!stock) return false


    return true;
  };


	const onLocalSave = async () => {
		if (!verified()) return;

		const data: PlaceStockOrderParams = {
			is_buy: isBuy,
			stock_id: stock!.stock_id,
			order_type: orderType,
			quantity: quantity!,
			price: price!
		}

		const success = await placeStockOrder(data)
		if (success) {
			onSave();
		}

	}

	useEffect(() => {
		if (!open) {
			setQuantity(undefined)
			setPrice(undefined)
			setIsBuy(true)
			setOrderType(ORDER_TYPES.MARKET)
			setStock(undefined)
			setVerify(false)
		}
		fetchStocks()
	}, [open])

	useEffect(() => {
		if (!verify) return;
		verified()
	}, [price, quantity, stock])

  return (
    <>
      {open && (
        <div className={styles.background}>
          <div className={styles.container}>
						<div className={styles.title}>Place Order</div>
						<SlidingToggle
							setToggle={setIsBuy}
							toggled={isBuy}
							leftLabel='Sell'
							rightLabel='Buy'
						/>
						<SlidingToggle
							setToggle={(checked => setOrderType(checked ? ORDER_TYPES.MARKET : ORDER_TYPES.LIMIT))}
							toggled={orderType === ORDER_TYPES.MARKET}
							leftLabel='Limit'
							rightLabel='Market'
						/>

						<Dropdown
							className={styles.field}
							items={stocks?.map((stock, index) => ({
								id: index,
								value: `${stock.stock_name} - ${stock.current_price}`,
								onSelect: () => setStock(stock)
							}))}
							label='Select Stock'
							value={stock ? `${stock.stock_name} - ${stock.current_price}` : ''}
							verify={verify}
							/>

						<TextField
							className={styles.text}
							setValue={(value: string) => setPrice(+value)}
							value={`${price}`}
							type='number'
							label={'Price'}
							extraVerify={!!(price && price > 0)}
							verify={verify}
						/>
						<TextField
							className={styles.text}
							setValue={(value: string) => setQuantity(+value)}
							value={`${quantity}`}
							type='number'
							label={'Quantity'}
							extraVerify={!!(quantity && quantity > 0)}
							verify={verify}
						/>
						
						<div className={styles.buttons}>
							<Button className={styles.submitButton} label={'Cancel'} onClick={onClose} style={BUTTON_TYPE.OUTLINED}/>
							<Button className={styles.submitButton} label={'Add'} onClick={onLocalSave} />
						</div>

						
          </div>
        </div>
      )}
    </>
  );
}

export default PlaceOrderModal;
