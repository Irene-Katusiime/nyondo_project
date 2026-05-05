const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');

router.get('/stockreg', (req, res)=>{
    res.render('stockmanagement')
})

router.post('/stockreg', async(req ,res)=>{
  try {
    const {itemName,category,quantity,unitprice,sellingprice,suppliername,transportationcost} =req.body
    const total = parseInt(quantity)*parseFloat(unitprice);
    let newItem = new Stock({
      itemName,
      category,
      quantity,
      unitprice,
      sellingprice,
      suppliername,
      transportationcost,
      total
    })
    await newItem.save();
    res.redirect('/')
  } catch (error) {
    res.render('stockmanagement',{error:error.message}) 
  }
});


module.exports = router;