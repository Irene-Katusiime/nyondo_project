const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');

const {isAttendant,isAdmin, isManager} = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/auth');


router.get('/stockreg',authorizeRoles('store manager','admin'), async (req, res)=>{
    res.render('stockmanagement')
})

router.post('/stockreg',authorizeRoles('store manager','admin'), async(req ,res)=>{
  console.log(req.body);
  try {
    const {itemName,category,quantity,unitprice,sellingprice,suppliername,suppliercontact, factoryName, paymentmethod } =req.body;

    const phone = '+256' + suppliercontact;

    const total = parseInt(quantity)*parseFloat(unitprice);
    let newItem = new Stock({
      itemName,
      category,
      quantity,
      unitprice,
      sellingprice,
      suppliername,
      suppliercontact: phone,
      factoryName,
      paymentmethod,
      total
    })

    console.log(newItem)
    await newItem.save();
    res.redirect('/stocklist')
  } catch (error) {
    res.render('stockmanagement',{error:error.message}) 
    console.error(error)
  }
});

//Get stock from the Db
router.get('/stocklist',authorizeRoles('store manager','admin'), async(req, res) =>{
  try {

    //Get all stock items
    const stocks = await Stock.find();

    //Total number of items
    const totalItems = stocks.length;

    //Calculating low stock items
    const lowStockItems = await Stock.find({
      quantity: {$lte: 10}
    });

    const lowStockCount = lowStockItems.length;

    //Total stock value
    const stockValue = stocks.reduce((sum, item) => sum +item.total,0);

    res.render('stock-list',{
      stocks,
      totalItems,
      lowStockCount,
      stockValue,
      user: req.user
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

//Update stock
router.get('/stock/edit/:id',authorizeRoles('store manager','admin'),async(req,res) =>{
  try {
    const item = await Stock.findById(req.params.id)
    if(!item) return res.status(404).send('Stock not found')
      res.render('stock_edit',{item})
  } catch (error) {
    res.status(400).send('Unable to find stock in the Db')
  }
});

router.post('/stock/edit/:id',authorizeRoles('store manager','admin'), async(req,res) => {
  try {
    const {quantity, sellingprice, unitprice, suppliername, paymentmethod } = req.body;
    const total = quantity*unitprice;
    await Stock.findByIdAndUpdate(req.params.id,{
      total,
      quantity, 
      sellingprice, 
      suppliername, 
      unitprice,
      paymentmethod
    })
    res.redirect('/stocklist');
  } catch (error) {
    console.error(error.message)
    const stock = await Stock.findById(req.params.id)
     res.render('stock_edit', { item });
  } 
});

//Delete route
router.post('/stock/delete/:id',authorizeRoles('store manager','admin'), async(req,res) => {
  try {
    await Stock.findByIdAndDelete(req.params.id);
    res.redirect('/stocklist')
  } catch (error) {
    console.error(error)
  }
})


module.exports = router;