const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

const StockTransaction = require('../ms_shared/models/stockTransactionModel');
const WalletTransaction = require('../ms_shared/models/walletTransactionModel');
const Portfolio = require('../ms_shared/models/portfolioModel');
const User = require('../ms_shared/models/userModel');

const app = express();

app.use(bodyParser.json());

const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected successfully');
});

app.get("/", (req, res) => {
  res.send("This is the order execution microservice.");
});

app.post("/executeOrder", async (req, res) => {

    const stockTxId = req.body.stock_tx_id;
    const Action = req.body.action;
    
    console.log("This is the request:");
    console.log(req.body);

    try {
        
        console.log("checking existingStockTx");
        const existingStockTx = await StockTransaction.findOne({stock_tx_id: stockTxId});
        
        if (!existingStockTx){

            return res.status(404).json({ message: 'Stock Transaction not found' });
        
        }else{
            console.log("StockTx EXISTS!");
            
            const existingPortfolioDocumentAndStockId = await Portfolio.findOne({portfolio_id: existingStockTx.portfolio_id, stock_id: existingStockTx.stock_id});

            //if stock transaction is complete AND a BUY order
            if(Action === "COMPLETED" && existingStockTx.is_buy === true)
            {
                console.log("Checking if Portfolio Document Exists");
                
                existingStockTx.order_status = 'COMPLETED';
                
                if(existingPortfolioDocumentAndStockId){

                    console.log("Portfolio Document Exists");

                    try
                    {

                        console.log("Updating Quantity");
                        let newQuantity = existingPortfolioDocumentAndStockId.quantity_owned + existingStockTx.quantity;

                        console.log("Old quantity", existingPortfolioDocumentAndStockId.quantity_owned)
                        console.log("Quantity to add:", existingStockTx.quantity)
                        console.log("New Quantity:", newQuantity);

                        existingPortfolioDocumentAndStockId.quantity_owned = newQuantity;

                        await existingPortfolioDocumentAndStockId.save();
                        await existingStockTx.save();

                        return res.status(200).json({
                            existingPortfolioDocumentAndStockId: existingPortfolioDocumentAndStockId,
                            existingStockTx: existingStockTx
                          });                    
                    }
                    catch(error){
                        console.error('Error updating portfolio document:', error);
                        return res.status(500).json({ message: `Internal Server Error: ${error}` });
                    }
                }else{
                    try{
                        
                        console.log("Portfolio or stockID does not exist")
                        const existingWalletTx = await WalletTransaction.findOne({stock_tx_id: stockTxId});

                        console.log(existingWalletTx);

                        const newPortfolioDocument = new Portfolio({
                            user_id: existingWalletTx.user_id, 
                            stock_id: existingStockTx.stock_id, 
                            portfolio_id: existingStockTx.portfolio_id, 
                            quantity_owned: existingStockTx.quantity
                        });
                        
                        await newPortfolioDocument.save();
                        await existingStockTx.save();

                        console.log("New Portfolio added.")
                        return res.status(200).json({
                            newPortfolioDocument: newPortfolioDocument,
                            existingStockTx: existingStockTx
                        }); 
                      
                    }catch (error)
                    {
                    console.error('Error creating portfolio document:', error);
                    return res.status(500).json({ message: `Internal Server Error: ${error}` });
                    }
                }
            }

            // if stock transaction is cancelled OR it expires AND is a BUY order
            if((Action === "CANCELED" || Action === "EXPIRED") && existingStockTx.is_buy === true)
            {
                try
                {
                    if(Action === "CANCELED"){existingStockTx.order_status = 'CANCELED';}
                    if(Action === "EXPIRED"){existingStockTx.order_status = 'EXPIRED';}

                    const existingWalletTx = await WalletTransaction.findOne({stock_tx_id: stockTxId});

                    const user = await User.findOne({user_id: existingWalletTx.user_id});
                    let newBalance = existingWalletTx.amount + user.balance;

                    console.log("OLD user.balance:", user.balance)
                    console.log("existingWalletTx.amount:", existingWalletTx.amount)
                    console.log("NEW user.balance:", newBalance)

                    user.balance = newBalance;

                    existingStockTx.is_deleted = true;
                    existingWalletTx.is_deleted = true;

                    await existingStockTx.save();
                    await existingWalletTx.save();
                    await user.save();

                    return res.status(200).json({
                        existingStockTx: existingStockTx,
                        existingWalletTx: existingWalletTx,
                        user: user
                    }); 
                  
                    

                }catch(error){
                    console.error('Error returning amount spent to user balance:', error);
                    return res.status(500).json({ message: `Internal Server Error: ${error}` });
                }

            }

            //if stock transaction is complete AND a SELL order
            if(Action === "COMPLETED" && existingStockTx.is_buy === false){
                try{

                    //change order status to complete
                    existingStockTx.order_status = 'COMPLETED';

                    //add money to user's wallet
                    const user = await User.findOne({user_id: existingPortfolioDocumentAndStockId.user_id});

                    let profit = existingStockTx.quantity * existingStockTx.stock_price;
                    let newBalance = profit + user.balance;

                    console.log("OLD user.balance:", user.balance);
                    console.log("Profit", profit);
                    console.log("NEW user.balance:", newBalance);

                    user.balance = newBalance;
                    console.log("User balance updated.");

                    //create new wallet transaction
                    const newWalletTransaction = new WalletTransaction({
                        user_id: user.user_id,
                        stock_tx_id: existingStockTx.stock_tx_id,
                        is_debit: true,
                        amount: profit,
                        is_deleted:false
                    });
                    await newWalletTransaction.save();

                    existingStockTx.wallet_tx_id = newWalletTransaction.wallet_tx_id;

                    await existingStockTx.save();
                    await user.save();
                    console.log("New Wallet Transaction added.")
                    
                    return res.status(200).json({
                        existingStockTx: existingStockTx,
                        newWalletTransaction: newWalletTransaction,
                        user: user
                    }); 

                }catch(error){
                    console.error('Error making changes:', error);
                    return res.status(500).json({ message: `Internal Server Error: ${error}` });
                }
            }

            // if stock transaction is cancelled OR it expires AND is a SELL order
            if((Action === "CANCELED" || Action === "EXPIRED") && existingStockTx.is_buy === false){
                try{
                    if(Action === "CANCELED"){existingStockTx.order_status = 'CANCELED';}
                    if(Action === "EXPIRED"){existingStockTx.order_status = 'EXPIRED';}

                    let newQuantity = existingStockTx.quantity + existingPortfolioDocumentAndStockId.quantity_owned;

                    console.log("OLD qunatity owned", existingPortfolioDocumentAndStockId.quantity_owned);
                    console.log("Quantity received back", existingStockTx.quantity);
                    console.log("NEW qunatity owned", newQuantity);

                    existingPortfolioDocumentAndStockId.quantity_owned = newQuantity;
                    existingStockTx.is_deleted = true;

                    await existingPortfolioDocumentAndStockId.save();
                    await existingStockTx.save();

                    return res.status(200).json({
                        existingStockTx: existingStockTx,
                        existingPortfolioDocumentAndStockId: existingPortfolioDocumentAndStockId,
                    }); 

                }catch(error){
                    console.error('Error making changes to Portfolio:', error);
                    return res.status(500).json({ message: `Internal Server Error: ${error}` });
                }
            }
            return res.status(200).json(existingStockTx);
        }
    }catch (error)
    {
        console.error('Error fetching stock transaction', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
});


// Start the server
app.listen(port, () => {
    console.log() 
    console.log(`Order Execution Service running on port ${port}`);
});
