import React, { ReactElement, useEffect, useState } from 'react';
import styles from './Setup.module.scss';
import TextField from 'components/TextField';
import Button from 'components/Button';
import Layout from 'Base';
import AvailableStocks from 'components/AvailableStocks';
import useUsers from 'hooks/useUsers.hook';
import { AddToUserParams, CreateStockParams, Stock } from 'types/users.types';
import Dropdown from 'components/Dropdown';
import StockPortfolios from 'components/StockPortfolios';
function Setup(): ReactElement {
  const [stockName, setStockName] = useState<string>('');
  const [quantity, setQuantity] = useState<number>();
  const [stock, setStock] = useState<Stock>();
  const [verify, setVerify] = useState<boolean>(false);
  const [verifyAddToUser, setVerifyAddToUser] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [addToUserErrorMessage, setAddToUserErrorMessage] = useState<string>();
  const { fetchStocks, stocks, createStock, addStockToUser, stockPortfolios, fetchStockPortfolios } = useUsers();
  const verified = () => {
    setVerify(true);
    if (!stockName) return false;

    return true;
  };

  const verifiedAddToUser = () => {
    setVerifyAddToUser(true);
    if (!stock) return false;
    if (!quantity) return false;

    return true;
  };

  const onAssignToUser = async () => {
    setAddToUserErrorMessage('');
    if (!verifiedAddToUser()) return;
    setVerifyAddToUser(false);
    const data: AddToUserParams = {
      stock_id: stock!._id,
      quantity: quantity!,
    };

    const error = await addStockToUser(data);
    console.log(error);
    if (error) {
      setErrorMessage(error);
      return;
    }
    fetchStockPortfolios();
    setQuantity(undefined);
    setStock(undefined);
  };

  const onLocalSave = async () => {
    setErrorMessage('');
    if (!verified()) return;
    setVerify(false);
    const data: CreateStockParams = {
      stock_name: stockName!,
    };

    const error = await createStock(data);
    console.log(error);
    if (error) {
      setErrorMessage(error);
      return;
    }
    fetchStocks();
    setStockName('');
  };

  useEffect(() => {
    if (!verify) return;
    verified();
  }, [stockName]);

  useEffect(() => {
    fetchStocks();
    fetchStockPortfolios();
  }, []);
  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.warning}>This page is for setup of the database only!!</div>

        <div className={styles.content}>
          <AvailableStocks stocks={stocks} />
          <StockPortfolios stockPortfolios={stockPortfolios} />
          <div className={styles.actions}>
            <div className={styles.create}>
              <div className={styles.title}>Create Stock</div>

              <TextField
                className={styles.text}
                setValue={(value: string) => setStockName(value)}
                value={stockName}
                type="text"
                label={'Stock Name'}
                verify={verify}
              />
              <Button className={styles.submitButton} label={'Create'} onClick={onLocalSave} />

              {errorMessage && <div className={styles.error}>{errorMessage}</div>}
            </div>

            <div className={styles.create}>
              <div className={styles.title}>Add to current user</div>

              <Dropdown
                className={styles.dropdown}
                items={stocks?.map((stock, index) => ({
                  id: index,
                  value: `${stock.stock_name}`,
                  onSelect: () => setStock(stock),
                }))}
                label="Select Stock"
                value={stock ? `${stock.stock_name}` : ''}
                verify={verifyAddToUser}
              />
              <TextField
                className={styles.text}
                setValue={(value: string) => setQuantity(+value)}
                value={`${quantity}`}
                type="number"
                label={'Quantity'}
                extraVerify={!!(quantity && quantity > 0)}
                verify={verifyAddToUser}
              />
              <Button className={styles.submitButton} label={'Add To User'} onClick={onAssignToUser} />

              {addToUserErrorMessage && <div className={styles.error}>{addToUserErrorMessage}</div>}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Setup;
