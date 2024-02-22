import React, { ReactElement, useEffect, useState } from 'react';
import styles from './SellStockModal.module.scss';
import TextField from 'components/TextField';
import Button from 'components/Button';
import useUsers from 'hooks/useUsers.hook';
import { BUTTON_TYPE } from 'components/Button/Button';
import { PlaceStockOrderParams, Stock, StockPortfolio } from 'types/users.types';
import SlidingToggle from 'components/SlidingToggle';
import Dropdown from 'components/Dropdown';
import { formatPrice } from 'lib/formatting';

interface SellStockModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

enum ORDER_TYPES {
  LIMIT = 'LIMIT',
  MARKET = 'MARKET',
}
function SellStockModal({ open, onClose, onSave }: SellStockModalProps): ReactElement {
  const [price, setPrice] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>();
  const [orderType, setOrderType] = useState<ORDER_TYPES>(ORDER_TYPES.MARKET);
  const [stock, setStock] = useState<StockPortfolio>();
  const [verify, setVerify] = useState<boolean>(false);

  const { placeStockOrder, fetchStockPortfolios, stockPortfolios } = useUsers();
  const verified = () => {
    setVerify(true);
    if (!quantity || quantity < 0) return false;
    if (orderType === ORDER_TYPES.LIMIT && (!price || price < 0)) return false;
    if (!stock) return false;

    return true;
  };

  const onLocalSave = async () => {
		console.log("Here -0---")
		console.log(verified())
    if (!verified()) return;

    const data: PlaceStockOrderParams = {
      is_buy: false,
      stock_id: stock!.stock_id,
      order_type: orderType,
      quantity: quantity!,
      price: price!,
    };

    const success = await placeStockOrder(data);
    if (success) {
      onSave();
    }
  };

  useEffect(() => {
    if (!open) {
      setQuantity(undefined);
      setPrice(null);
      setOrderType(ORDER_TYPES.MARKET);
      setStock(undefined);
      setVerify(false);
    }
    fetchStockPortfolios();
  }, [open]);

  useEffect(() => {
    if (!verify) return;
    verified();
  }, [price, quantity, stock]);

  useEffect(() => {
    if (ORDER_TYPES.MARKET === orderType) {
      setPrice(null);
    }
  }, [orderType]);

  return (
    <>
      {open && (
        <div className={styles.background}>
          <div className={styles.container}>
            <div className={styles.title}>Place Order</div>
            <SlidingToggle
              setToggle={(checked) => setOrderType(checked ? ORDER_TYPES.MARKET : ORDER_TYPES.LIMIT)}
              toggled={orderType === ORDER_TYPES.MARKET}
              leftLabel="Limit"
              rightLabel="Market"
            />

            <Dropdown
              className={styles.field}
              items={stockPortfolios?.map((stock, index) => ({
                id: index,
                value: `${stock.stock_name} - ${formatPrice(stock.quantity_owned, true)}`,
                onSelect: () => setStock(stock),
              }))}
              label="Select Stock"
              value={stock ? `${stock.stock_name} - ${formatPrice(stock.quantity_owned, true)}` : ''}
              verify={verify}
            />

            <TextField
              className={styles.text}
              setValue={(value: string) => setQuantity(+value)}
              value={`${quantity}`}
              type="number"
              label={'Quantity'}
              extraVerify={!!(quantity && quantity > 0)}
              verify={verify}
            />

            {orderType === ORDER_TYPES.LIMIT && (
              <TextField
                className={styles.text}
                setValue={(value: string) => setPrice(+value)}
                value={`${price}`}
                type="number"
                label={'Price'}
                extraVerify={!!(price && price > 0)}
                verify={verify}
              />
            )}

            <div className={styles.buttons}>
              <Button className={styles.submitButton} label={'Cancel'} onClick={onClose} style={BUTTON_TYPE.OUTLINED} />
              <Button className={styles.submitButton} label={'Sell'} onClick={onLocalSave} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SellStockModal;
