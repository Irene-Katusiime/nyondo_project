const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');

const {isAttendant,isAdmin, isManager} = require('../middleware/auth');


router.get('/stockreg', (req, res)=>{
    res.render('stockmanagement')
})

router.post('/stockreg', async(req ,res)=>{
  console.log(req.body);
  try {
    const {itemName,category,quantity,unitprice,sellingprice,suppliername,suppliercontact} =req.body
    const total = parseInt(quantity)*parseFloat(unitprice);
    let newItem = new Stock({
      itemName,
      category,
      quantity,
      unitprice,
      sellingprice,
      suppliername,
      suppliercontact,
      total
    })

    console.log(newItem)
    await newItem.save();
    res.redirect('/')
  } catch (error) {
    res.render('stockmanagement',{error:error.message}) 
    console.error(error)
  }
});

//Get stock from the Db
router.get('/stocklist', async(req, res) =>{
  try {
    const stock = await Stock.find()
      .populate('itemName category')
      .sort({date:-1})
       res.render('stock-list', { stocks:stock });
  } catch (error) {
    console.error(error)
    res.status(400).send('Unable to pick stock from the db')
  }
});

//Update stock
router.get('/stock/edit/:id',isManager,async(req,res) =>{
  try {
    const item = await Stock.findById(req.params.id)
    if(!item) return res.status(404).send('Stock not found')
      res.render('stock_edit',{item})
  } catch (error) {
    res.status(400).send('Unable to find stock in the Db')
  }
});

router.post('/stock/edit/:id',isManager, async(req,res) => {
  try {
    const {quantity, sellingprice, unitprice, suppliername} = req.body;
    const total = quantity*unitprice;
    await Stock.findByIdAndUpdate(req.params.id,{
      total,
      quantity, 
      sellingprice, 
      suppliername, 
      unitprice
    })
    res.redirect('/stocklist');
  } catch (error) {
    console.error(error.message)
    const stock = await Stock.findById(req.params.id)
     res.render('stock_edit', { item });
  } 
});

//Delete route
router.post('/stock/delete/:id',isManager, async(req,res) => {
  try {
    await Stock.findByIdAndDelete(req.params.id);
    res.redirect('/stocklist')
  } catch (error) {
    console.error(error)
  }
})


module.exports = router;