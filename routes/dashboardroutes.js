const express = require('express');
const router = express.Router();
const Deposit = require('../models/Deposit'); //Importing the deposit model
const Stock = require('../models/Stock');
const Sales = require('../models/Sale');

router.get('/admindashboard', async(req, res)=>{

    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);

    const endOfDay = new Date();
    endOfDay.setHours(23,59,59,999);

    const sales = await Sales.find();
        // date: {$gte: startOfDay, $lte: endOfDay}

    let totalSales = 0;
    sales.forEach(sale => {
        totalSales += Number(sale.total || 0);
    });

    const stocks = await Stock.find();
    let stockValue = 0;

    stocks.forEach(item => {
        stockValue += item.unitprice * item.quantity;
    });

    try {
        //Fetch the 5 most recent deposits
        const deposits = await Deposit.find()
            .sort({ date: -1})
            .limit(5);

            //Calculate total deposits
            let totalDeposits = 0;

            deposits.forEach(deposit => {
                totalDeposits += Number(deposit.amountdeposited || 0);
            });

            //Calculating low stock items
            const lowStockItems = await Stock.find({
                quantity: { $lte: 10 }
            });

            const lowStockCount = lowStockItems.length;

        // Send deposits to the admin view
        res.render('admin', { deposits, stockValue, totalSales, totalDeposits, lowStockCount });
    } catch (error) {
        console.error('Error fetching deposits:', error);
        res.status(500).send('Server Error')
    }
    // res.render('admin', { deposits: []});
});
// router.get('/attendantdashboard', (req, res)=>{
//     res.render('salesdashboard')
// });
router.get('/storemanagerdashboard', (req, res)=>{
    // res.render('managerdashboard')
    res.redirect('/stocklist')
});

module.exports = router;

