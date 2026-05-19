const express = require('express');
const router = express.Router();
const Deposit = require('../models/Deposit'); //Importing the deposit model
const Stock = require('../models/Stock');
const Sale = require('../models/Sale');

router.get('/admindashboard', async(req, res)=>{

    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);

    const endOfDay = new Date();
    endOfDay.setHours(23,59,59,999);

    const sales = await Sale.find();
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

router.get('/report', async (req,res) =>{
    try{

        let stats = {
            salesRevenue: 0,
            costRevenue:0,
            netProfit: 0
        };

        //Sales data 
        const sales = await Sale.find()
            .populate('itemname')
            .populate('attendant');

        //Stock data
        const stocks = await Stock.find();

        const updatedStocks = stocks.map(item => {
            let alertState = 'HEALTHY';
            let alertClass = 'status-ok'

            if (item.quantity <= 0) {
                alertState ='OUT OF STOCK';
                alertClass = 'status-danger';
        }
            else if (item.quantity <= 5) {
                alertState ='CRITICAL LOW';
                alertClass = 'status-danger';
        }
            else if (item.quantity <= 10) {
                alertState ='LOW STOCK';
                alertClass = 'status-warning';

            }
            
            return {
                ...item.toObject(),
                alertState,
                alertClass
            };
        });

        const deposits = await Deposit.find();
            

        const salesAgg = await Sale.aggregate(
            [{$group:{_id:null,grandTotal:{$sum:'$total'}}}]
        );
        stats.salesRevenue = salesAgg.length > 0 ? salesAgg[0].grandTotal:0;

        // Cost of Goods sold
        const costAgg = await Stock.aggregate(
            [{$group:{_id:null,grandTotal:{$sum:'$total'}}}]
        );
        stats.costRevenue = costAgg.length > 0 ? costAgg[0].grandTotal:0;

        stats.netProfit = stats.salesRevenue - stats.costRevenue;

        //Total Deposits
        const depositAgg = await Deposit.aggregate([
            {
            $group: {
                _id: null,
                grandTotal: { $sum: '$amountdeposited'}
            }
            }
        ]);

        const totalDeposits = depositAgg.length > 0 ? depositAgg[0].grandTotal : 0;

        // console.log(updatedStocks[0]);

        res.render('reports', {stats, 
            totalDeposits, 
            sales, 
            // stocks,
            stocks: updatedStocks,
            deposits
        });

    }catch (error) {
      console.log(error.message)
      res.status(400).send('Stats not found')
    }
});




module.exports = router;

